//добавить какую нибудь циферку отвечающую за количество очков которые можно выбить в начале уровня
export type TInitialSpawnSettings = {
  connectedRatio: number
  minGroupSize: number
  maxGroupSize: number
}
export type TRoundConfig = {
  targetScore: number
  numTurnsLeft: number
  numBombBoosters: number
  bombRadius: number
  numTeleportBoosters: number
  boardHeight: number
  boardWidth: number
  groupSizeForSuperSpawn: number
  initialSpawnSettings: TInitialSpawnSettings
  boardShufflesLeft: number
}
export type TDifficulty = `easy` | `medium` | `hard`
export type TGameDifficulties = Record<TDifficulty, TRoundConfig>
