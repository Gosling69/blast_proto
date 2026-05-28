import { TileType } from '../../board/board.types'
import { TDestroyContext, TGameStatus, TTurnResolution } from '../gameplay.types'
import { GameModel } from '../models/GameModel'

export class RulesController {
  constructor() {}

  canSwap(gameModel: GameModel) {
    return gameModel.numTeleportBoosters > 0
  }
  canDestroy(context: TDestroyContext, minGroupSizeForDestroy: number): boolean {
    switch (context.type) {
      case 'bombClick':
        return context.targetsCount > 0

      case 'regularClick':
        switch (context.tileType) {
          case TileType.Regular:
            return context.groupSize >= minGroupSizeForDestroy

          case TileType.SuperRow:
          case TileType.SuperColumn:
          case TileType.SuperBomb:
          case TileType.SuperAll:
            return context.targetsCount > 0
        }
    }
  }
  getTurnResolution(params: {
    score: number
    targetScore: number
    turnsLeft: number
    hasAvailableMoves: boolean
    hasBoosters: boolean
    shufflesLeft: number
  }): TTurnResolution {
    if (params.score >= params.targetScore) {
      return 'win'
    }

    if (params.turnsLeft <= 0) {
      return 'lose'
    }

    if (params.hasAvailableMoves || params.hasBoosters) {
      return 'playing'
    }
    if (params.shufflesLeft > 0) {
      return 'needShuffle'
    }

    return 'lose'
  }
  getGameResult(gameModel: GameModel, hasAvailableMoves: boolean): TGameStatus {
    if (this.isWin(gameModel)) return `win`
    if (this.isLose(gameModel, hasAvailableMoves)) return `lose`
    return `playing`
  }
  shouldSpawnSuperTile(gameModel: GameModel, context: TDestroyContext): boolean {
    return (
      context.type === 'regularClick' &&
      context.tileType === TileType.Regular &&
      context.groupSize >= gameModel.groupSizeForSuperSpawn
    )
  }
  private isWin(gameModel: GameModel) {
    return gameModel.score >= gameModel.targetScore
  }
  private isLose(state: GameModel, hasAvailableMoves: boolean): boolean {
    return state.numTurnsLeft <= 0 || !hasAvailableMoves
  }
}
