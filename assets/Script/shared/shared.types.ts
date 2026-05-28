export type TGroupSizeSettings = {
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
  groupSizeSettings: TGroupSizeSettings
  initialConnectedGroupsRatio: number
  boardShufflesLeft: number
  minGroupSizeForTurn: number
}
export const DifficultyLevels = [`easy`, `medium`, `hard`, `nightmare`] as const
export type TDifficulty = (typeof DifficultyLevels)[number]

export type TGameDifficulties = Record<TDifficulty, TRoundConfig>
export type TBoosterType = `bomb` | `teleport`
export type TSelectedBooster = TBoosterType | null
