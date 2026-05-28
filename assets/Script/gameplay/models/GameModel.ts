import { TInitialSpawnSettings, TRoundConfig } from '../../shared/shared.types'

export type TGameStatus = `win` | `lose` | `playing`

export class GameModel {
  public score = 0
  public numTurnsLeft: number
  public targetScore: number
  public numBombBoosters: number
  public bombRadius: number
  public numTeleportBoosters: number
  public groupSizeForSuperSpawn: number
  public boardShufflesLeft: number
  public difficultySettings: TInitialSpawnSettings

  public status: TGameStatus = `playing`

  constructor(config: TRoundConfig) {
    const {
      targetScore,
      numTurnsLeft,
      numBombBoosters,
      numTeleportBoosters: numSwapBoosters,
      groupSizeForSuperSpawn,
      initialSpawnSettings: difficultySettings,
      boardShufflesLeft,
      bombRadius,
    } = config
    this.targetScore = targetScore
    this.numTurnsLeft = numTurnsLeft
    this.numBombBoosters = numBombBoosters
    this.numTeleportBoosters = numSwapBoosters
    this.groupSizeForSuperSpawn = groupSizeForSuperSpawn
    this.difficultySettings = difficultySettings
    this.boardShufflesLeft = boardShufflesLeft
    this.bombRadius = bombRadius
  }
  addScore(value: number) {
    this.score += value
  }
  spendTurn() {
    this.numTurnsLeft--
  }
  setStatus(status: TGameStatus) {
    this.status = status
  }
  spendBombBooster() {
    this.numBombBoosters--
  }
  spendSwapBooster() {
    this.numTeleportBoosters--
  }
  spendBoardShuffle() {
    this.boardShufflesLeft--
  }
}
