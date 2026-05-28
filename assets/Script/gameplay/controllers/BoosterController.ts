import { TTileData } from '../../board/board.types'
import { BoardModel } from '../../board/models/BoardModel'

export class BoosterController {
  constructor() {}

  getBombTargets(board: BoardModel<TTileData>, center: TTileData, radius: number): TTileData[] {
    const { grid } = board
    const result: TTileData[] = []

    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        if (!board.hasCell(x, y)) continue

        const tile = grid[y][x]
        if (tile) result.push(tile)
      }
    }

    return result
  }

  swapTiles(board: BoardModel<TTileData>, first: TTileData, second: TTileData) {
    board.swap(first.x, first.y, second.x, second.y)
  }
}
