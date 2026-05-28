import { TTileData, TileType } from '../../board/board.types'
import { BoardModel } from '../../board/models/BoardModel'
import { GameModel } from '../models/GameModel'
export class SpecialTileController {
  getTargets(board: BoardModel<TTileData>, tile: TTileData, gameModel: GameModel): TTileData[] {
    switch (tile.type) {
      case TileType.SuperRow:
        return this.getRowTargets(board, tile.y)

      case TileType.SuperColumn:
        return this.getColumnTargets(board, tile.x)

      case TileType.SuperBomb:
        return this.getRadiusTargets(board, tile.x, tile.y, gameModel.bombRadius)

      case TileType.SuperAll:
        return this.getAllTargets(board)
      default:
        return []
    }
  }

  private getRowTargets(board: BoardModel<TTileData>, y: number): TTileData[] {
    return board.grid[y].filter(Boolean) as TTileData[]
  }

  private getColumnTargets(board: BoardModel<TTileData>, x: number): TTileData[] {
    const result: TTileData[] = []

    for (let y = 0; y < board.grid.length; y++) {
      const tile = board.grid[y][x]
      if (tile) result.push(tile)
    }

    return result
  }

  private getRadiusTargets(
    board: BoardModel<TTileData>,
    centerX: number,
    centerY: number,
    radius: number,
  ): TTileData[] {
    const result: TTileData[] = []

    for (let y = centerY - radius; y <= centerY + radius; y++) {
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        if (!board.hasCell(x, y)) continue

        const tile = board.grid[y][x]
        if (tile) result.push(tile)
      }
    }

    return result
  }

  private getAllTargets(board: BoardModel<TTileData>): TTileData[] {
    return board.flat().filter(Boolean) as TTileData[]
  }
}
