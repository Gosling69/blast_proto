import { TBaseTileData, Cell, TShuffleMove } from '../board.types'
import { createGrid } from '../board.utils'

export class BoardModel<T extends TBaseTileData = TBaseTileData> {
  grid: Cell<T>[][] = []

  constructor(
    readonly widthTiles: number,
    readonly heightTiles: number,
  ) {
    this.grid = createGrid(widthTiles, heightTiles, null)
  }

  remove(group: Array<TBaseTileData>) {
    const grid = this.grid
    group.forEach((toRemove) => {
      grid[toRemove.y][toRemove.x] = null
    })
  }
  hasCell(x: number, y: number) {
    return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length
  }
  get(x: number, y: number) {
    return this.grid[y][x]
  }
  groupByRows() {
    const tiles = this.flat()
    const result = new Map<number, T[]>()

    for (const tile of tiles) {
      const row = result.get(tile.y) ?? []
      row.push(tile)
      result.set(tile.y, row)
    }
    const sortedRows = Array.from(result.entries())
      .sort(([keyA], [keyB]) => keyA - keyB)
      .map(([_, val]) => val)
    return sortedRows
  }

  shuffle(): Array<TShuffleMove<T>> {
    const flatGrid = this.flat().filter(Boolean) as T[]

    const moves: Array<TShuffleMove<T>> = []

    for (let i = flatGrid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      if (i === j) continue

      const first = flatGrid[i]
      const second = flatGrid[j]

      moves.push({
        tileFrom: first,
        tileTo: second,
      })

      const temp = flatGrid[i]

      flatGrid[i] = flatGrid[j]
      flatGrid[j] = temp
    }

    let index = 0

    for (let y = 0; y < this.heightTiles; y++) {
      for (let x = 0; x < this.widthTiles; x++) {
        const tile = flatGrid[index++]

        this.grid[y][x] = tile

        tile.x = x
        tile.y = y
      }
    }

    return moves
  }
  swap(firstX: number, firstY: number, secondX: number, secondY: number) {
    const first = this.grid[firstY][firstX]
    const second = this.grid[secondY][secondX]

    this.grid[firstY][firstX] = second
    this.grid[secondY][secondX] = first

    if (first) {
      first.x = secondX
      first.y = secondY
    }

    if (second) {
      second.x = firstX
      second.y = firstY
    }
  }
  flat() {
    return this.grid.reduce((prev, curr) => prev.concat(...curr), [])
  }
}
