import { BoardModel } from '../models/BoardModel'
import { TileData, TileType } from '../models/TileData'
import { floodFill, hasAvailableMoves } from './utils'

export class MatchController {
  constructor() {}
  findGroup(board: BoardModel<TileData>, tile: TileData) {
    if (tile.type !== TileType.Regular) {
      return []
    }
    return floodFill(board, tile)
  }
  checkIsNoTurnsLeft(board: BoardModel<TileData>) {
    return hasAvailableMoves(board)
  }
}
