import { BoardModel } from '../models/BoardModel'
import { TileData, RegularTileData, TileType, TileColor } from '../models/TileData'

export const floodFill = (board: BoardModel<TileData>, startTile: RegularTileData): RegularTileData[] => {
  const { grid } = board

  const startX = startTile.x
  const startY = startTile.y

  if (!board.hasCell(startX, startY)) {
    return []
  }

  const tileAtStart = grid[startY][startX]

  if (!tileAtStart || tileAtStart.type !== TileType.Regular) {
    return []
  }

  const targetColor = tileAtStart.color

  const visited = new Set<string>()
  const result: RegularTileData[] = []

  const stack: Array<[number, number]> = [[startX, startY]]

  const directions: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  while (stack.length > 0) {
    const [x, y] = stack.pop()!

    if (!board.hasCell(x, y)) continue

    const key = getKey(x, y)

    if (visited.has(key)) continue
    visited.add(key)

    const currentTile = grid[y][x]

    if (!isTileFitForFloodFill(currentTile, targetColor)) continue

    result.push(currentTile as RegularTileData)

    for (const [dx, dy] of directions) {
      const nextX = x + dx
      const nextY = y + dy

      if (!board.hasCell(nextX, nextY)) continue

      const nextTile = grid[nextY][nextX]
      if (!isTileFitForFloodFill(nextTile, targetColor)) continue

      stack.push([nextX, nextY])
    }
  }
  return result
}
const isTileFitForFloodFill = (tile: TileData, targetColor: TileColor) => {
  return tile && tile.type === TileType.Regular && tile.color === targetColor
}
export const hasAvailableMoves = (board: BoardModel<TileData>): boolean => {
  const { grid } = board

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const current = grid[y][x]

      if (!current) continue

      if (current.type !== TileType.Regular) {
        return true
      }

      const right = grid[y][x + 1]

      if (right && right.type === TileType.Regular && right.color === current.color) {
        return true
      }

      const bottom = grid[y + 1]?.[x]

      if (bottom && bottom.type === TileType.Regular && bottom.color === current.color) {
        return true
      }
    }
  }

  return false
}
export const createGrid = <T>(width: number, height: number, value: T) => {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => value))
}
export const getRandomArrayElement = <T>(arr: readonly T[]) => {
  if (arr.length === 0) {
    throw new Error('Array is empty')
  }
  return arr[Math.floor(Math.random() * arr.length)]
}
export const getRandomEnumValue = <T extends Record<string, string>>(enumeration: T): T[keyof T] => {
  const values = Object.values(enumeration) as Array<T[keyof T]>

  return values[Math.floor(Math.random() * values.length)]
}
export const shuffleArray = <T>(items: T[]): T[] => {
  const result = items.slice()

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    const temp = result[i]

    result[i] = result[j]
    result[j] = temp
  }

  return result
}
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const getKey = (x: number, y: number): string => {
  return `${x}:${y}`
}
