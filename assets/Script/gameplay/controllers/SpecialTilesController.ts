import { BoardModel } from '../../board/models/BoardModel'
import { TileData, TileType } from '../../board/models/TileData'
import { GameModel } from '../models/GameModel'
export class SpecialTileController {
  getTargets(board: BoardModel<TileData>, tile: TileData, gameModel: GameModel): TileData[] {
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

  private getRowTargets(board: BoardModel<TileData>, y: number): TileData[] {
    return board.grid[y].filter(Boolean) as TileData[]
  }

  private getColumnTargets(board: BoardModel<TileData>, x: number): TileData[] {
    const result: TileData[] = []

    for (let y = 0; y < board.grid.length; y++) {
      const tile = board.grid[y][x]
      if (tile) result.push(tile)
    }

    return result
  }

  private getRadiusTargets(board: BoardModel<TileData>, centerX: number, centerY: number, radius: number): TileData[] {
    const result: TileData[] = []

    for (let y = centerY - radius; y <= centerY + radius; y++) {
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        if (!board.hasCell(x, y)) continue

        const tile = board.grid[y][x]
        if (tile) result.push(tile)
      }
    }

    return result
  }

  private getAllTargets(board: BoardModel<TileData>): TileData[] {
    return board.flat().filter(Boolean) as TileData[]
  }
}
