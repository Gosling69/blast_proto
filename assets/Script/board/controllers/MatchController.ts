import { TTileData, TileType } from '../board.types'
import { floodFill, hasAvailableMoves } from '../board.utils'
import { BoardModel } from '../models/BoardModel'

export class MatchController {
  constructor() {}
  findGroup(board: BoardModel<TTileData>, tile: TTileData) {
    if (tile.type !== TileType.Regular) {
      return []
    }
    return floodFill(board, tile)
  }
  hasAvailableMoves(board: BoardModel<TTileData>, minGroupSize: number) {
    return hasAvailableMoves(board, minGroupSize)
  }
}
