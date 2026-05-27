import { BoardModel } from '../../board/models/BoardModel'
import { TileData } from '../../board/models/TileData'

export class BoosterController {
  constructor() {}

  getBombTargets(board: BoardModel<TileData>, center: TileData, radius: number): TileData[] {
    const { grid } = board
    const result: TileData[] = []

    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        if (!board.hasCell(x, y)) continue

        const tile = grid[y][x]
        if (tile) result.push(tile)
      }
    }

    return result
  }

  swapTiles(board: BoardModel<TileData>, first: TileData, second: TileData): void {
    board.swap(first.x, first.y, second.x, second.y)
  }
}
