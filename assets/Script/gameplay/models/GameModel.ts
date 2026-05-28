import { TRoundConfig } from '../../shared/shared.types'
import { TGameStatus } from '../gameplay.types'

export class GameModel {
  public score = 0

  public status: TGameStatus = `playing`

  constructor(private roundConfig: TRoundConfig) {}
  get numBombBoosters() {
    return this.roundConfig.numBombBoosters
  }
  get boardShufflesLeft() {
    return this.roundConfig.boardShufflesLeft
  }
  get numTeleportBoosters() {
    return this.roundConfig.numTeleportBoosters
  }
  get difficultySettings() {
    return { ...this.roundConfig.groupSizeSettings }
  }
  get initialConnectedGroupsRatio() {
    return this.roundConfig.initialConnectedGroupsRatio
  }
  get minGroupSizeForTurn() {
    return this.roundConfig.minGroupSizeForTurn
  }
  get numTurnsLeft() {
    return this.roundConfig.numTurnsLeft
  }
  get bombRadius() {
    return this.roundConfig.bombRadius
  }
  get groupSizeForSuperSpawn() {
    return this.roundConfig.groupSizeForSuperSpawn
  }
  get targetScore() {
    return this.roundConfig.targetScore
  }
  addScore(value: number) {
    this.score += value
  }
  spendTurn() {
    this.roundConfig.numTurnsLeft--
  }
  setStatus(status: TGameStatus) {
    this.status = status
  }
  spendBombBooster() {
    this.roundConfig.numBombBoosters--
  }
  spendSwapBooster() {
    this.roundConfig.numTeleportBoosters--
  }
  spendBoardShuffle() {
    this.roundConfig.boardShufflesLeft--
  }
}
