import { TGroupSizeSettings } from '../../shared/shared.types'
import {
  TSuperTileData,
  SUPER_TILE_TYPES,
  TTileData,
  TileColor,
  TRegularTileData,
  TileType,
  TCellPosition,
} from '../board.types'
import { getRandomArrayElement, shuffleArray, floodFill, randomInt, getKey } from '../board.utils'
import { BoardModel } from '../models/BoardModel'

export class SpawnController {
  createSuperTile(x: number, y: number): TSuperTileData {
    return {
      id: crypto.randomUUID(),
      x,
      y,
      type: getRandomArrayElement(SUPER_TILE_TYPES),
    }
  }
  createAdditionalRegularCells(board: BoardModel<TTileData>, settings: TGroupSizeSettings): TTileData[] {
    const spawned: TTileData[] = []

    for (let y = 0; y < board.grid.length; y++) {
      const row = board.grid[y]

      for (let x = 0; x < row.length; x++) {
        if (row[x]) continue

        const color = this.pickColorForCell(board, x, y, settings.maxGroupSize)

        const tile = this.createRegularTile(x, y, color)

        row[x] = tile
        spawned.push(tile)
      }
    }

    return spawned
  }

  createInitialCells(board: BoardModel<TTileData>, groupSizeOptions: TGroupSizeSettings, connectivityRatio: number) {
    const colors = shuffleArray(Object.values(TileColor)) as TileColor[]
    if (colors.length < 3) {
      throw new Error('SpawnController requires at least 3 colors')
    }

    this.fillBaseNoMatches(board, colors)
    this.injectGroups(board, groupSizeOptions, connectivityRatio, colors)
  }
  private createRegularTile(x: number, y: number, color: TileColor): TRegularTileData {
    return {
      id: crypto.randomUUID(),
      x,
      y,
      color,
      type: TileType.Regular,
    }
  }
  private pickColorForCell(board: BoardModel<TTileData>, x: number, y: number, maxGroupSize: number): TileColor {
    const shuffledColors = shuffleArray(Object.values(TileColor)) as TileColor[]

    for (const color of shuffledColors) {
      const tile = this.createRegularTile(x, y, color)

      board.grid[y][x] = tile

      const group = floodFill(board, tile)

      board.grid[y][x] = null

      if (group.length <= maxGroupSize) {
        return color
      }
    }

    return shuffledColors[0]
  }
  private fillBaseNoMatches(board: BoardModel<TTileData>, colors: TileColor[]) {
    for (let y = 0; y < board.grid.length; y++) {
      for (let x = 0; x < board.grid[y].length; x++) {
        const color = colors[(x + y) % colors.length]

        board.grid[y][x] = this.createRegularTile(x, y, color)
      }
    }
  }

  private injectGroups(
    board: BoardModel<TTileData>,
    options: TGroupSizeSettings,
    connectivityRatio: number,
    colors: TileColor[],
  ) {
    const totalCells = board.widthTiles * board.heightTiles
    const targetConnectedCells = Math.floor(totalCells * connectivityRatio)

    const lockedCells = new Set<string>()

    let placedConnectedCells = 0
    let attempts = 0

    const maxAttempts = totalCells * 20

    while (placedConnectedCells < targetConnectedCells && attempts < maxAttempts) {
      attempts++

      const groupSize = randomInt(options.minGroupSize, options.maxGroupSize)

      const area = this.buildRandomArea(board, groupSize, lockedCells)

      if (area.length < options.minGroupSize) {
        continue
      }

      const previousTiles = this.snapshotArea(board, area)

      const shuffledColors = shuffleArray(colors)
      let placed = false

      for (let i = 0; i < shuffledColors.length; i++) {
        const color = shuffledColors[i]

        this.paintArea(board, area, color)

        if (this.validateMaxGroupSize(board, options.maxGroupSize)) {
          placed = true
          break
        }

        this.restoreArea(board, previousTiles)
      }

      if (!placed) {
        this.restoreArea(board, previousTiles)
        continue
      }

      for (let i = 0; i < area.length; i++) {
        lockedCells.add(getKey(area[i].x, area[i].y))
      }

      placedConnectedCells += area.length
    }
  }

  private buildRandomArea(board: BoardModel<TTileData>, targetSize: number, lockedCells: Set<string>): TCellPosition[] {
    const start = this.getRandomUnlockedCell(board, lockedCells)

    if (!start) return []

    const result: TCellPosition[] = [start]
    const used = new Set<string>([getKey(start.x, start.y)])

    while (result.length < targetSize) {
      const candidates: TCellPosition[] = []

      for (let i = 0; i < result.length; i++) {
        const cell = result[i]
        const neighbors = this.getNeighbors(board, cell.x, cell.y)

        for (let j = 0; j < neighbors.length; j++) {
          const neighbor = neighbors[j]
          const key = getKey(neighbor.x, neighbor.y)

          if (used.has(key)) continue
          if (lockedCells.has(key)) continue

          candidates.push(neighbor)
        }
      }

      if (candidates.length === 0) {
        break
      }

      const next = candidates[randomInt(0, candidates.length - 1)]

      used.add(getKey(next.x, next.y))
      result.push(next)
    }

    return result
  }

  private getRandomUnlockedCell(board: BoardModel<TTileData>, lockedCells: Set<string>): TCellPosition | null {
    const cells: TCellPosition[] = []

    for (let y = 0; y < board.grid.length; y++) {
      for (let x = 0; x < board.grid[y].length; x++) {
        if (!lockedCells.has(getKey(x, y))) {
          cells.push({ x, y })
        }
      }
    }

    if (cells.length === 0) {
      return null
    }

    return cells[randomInt(0, cells.length - 1)]
  }

  private snapshotArea(board: BoardModel<TTileData>, area: TCellPosition[]): TTileData[] {
    const result: TTileData[] = []

    for (let i = 0; i < area.length; i++) {
      const cell = area[i]
      const tile = board.grid[cell.y][cell.x]

      if (tile) {
        result.push({ ...tile })
      }
    }

    return result
  }

  private restoreArea(board: BoardModel<TTileData>, tiles: TTileData[]) {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]
      board.grid[tile.y][tile.x] = tile
    }
  }

  private paintArea(board: BoardModel<TTileData>, area: TCellPosition[], color: TileColor) {
    for (let i = 0; i < area.length; i++) {
      const cell = area[i]

      board.grid[cell.y][cell.x] = this.createRegularTile(cell.x, cell.y, color)
    }
  }

  private validateMaxGroupSize(board: BoardModel<TTileData>, maxGroupSize: number): boolean {
    const visited = new Set<string>()

    for (let y = 0; y < board.grid.length; y++) {
      for (let x = 0; x < board.grid[y].length; x++) {
        const tile = board.grid[y][x]

        if (!tile || tile.type !== TileType.Regular) continue

        const key = getKey(x, y)

        if (visited.has(key)) continue

        const groupSize = this.collectGroupSize(board, x, y, visited)

        if (groupSize > maxGroupSize) {
          return false
        }
      }
    }

    return true
  }

  private collectGroupSize(board: BoardModel<TTileData>, startX: number, startY: number, visited: Set<string>): number {
    const startTile = board.grid[startY][startX]

    if (!startTile || startTile.type !== TileType.Regular) {
      return 0
    }

    const targetColor = startTile.color
    const stack: TCellPosition[] = [{ x: startX, y: startY }]

    let size = 0

    while (stack.length > 0) {
      const current = stack.pop()!

      if (!board.hasCell(current.x, current.y)) continue

      const key = getKey(current.x, current.y)

      if (visited.has(key)) continue

      const tile = board.grid[current.y][current.x]

      if (!tile || tile.type !== TileType.Regular) continue
      if (tile.color !== targetColor) continue

      visited.add(key)
      size++

      const neighbors = this.getNeighbors(board, current.x, current.y)

      for (let i = 0; i < neighbors.length; i++) {
        stack.push(neighbors[i])
      }
    }

    return size
  }

  private getNeighbors(board: BoardModel<TTileData>, x: number, y: number): TCellPosition[] {
    const result: TCellPosition[] = []

    const directions: TCellPosition[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]

    for (let i = 0; i < directions.length; i++) {
      const nextX = x + directions[i].x
      const nextY = y + directions[i].y

      if (board.hasCell(nextX, nextY)) {
        result.push({ x: nextX, y: nextY })
      }
    }

    return result
  }
}
