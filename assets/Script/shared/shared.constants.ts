import { TGroupSizeSettings as TBoardSpawnSettings, TRoundConfig, TGameDifficulties } from './shared.types'

const BOARD_WIDTH = 8
const BOARD_HEIGHT = 8
const TURNS_LEFT = 3
const TARGET_SCORE = 200
const NUM_SWAP_BOOSTERS = 3
const NUM_BOMB_BOOSTERS = 5
const BOMB_RADIUS = 1
const NUM_TILES_FOR_SUPER_TILE_SPAWN = 6
const NUM_BOARD_SHUFFLES_LEFT = 3
const MIN_GROUP_SIZE_FOR_DESTROY = 2
const DEFAULT_GROUP_SIZE_SETTINGS: TBoardSpawnSettings = {
  minGroupSize: 2,
  maxGroupSize: 5,
}
const DEFAULT_CONNECTED_RATIO = 0.2

export const DEFAULT_CONFIG: TRoundConfig = {
  targetScore: TARGET_SCORE,
  numTurnsLeft: TURNS_LEFT,
  numTeleportBoosters: NUM_SWAP_BOOSTERS,
  numBombBoosters: NUM_BOMB_BOOSTERS,
  bombRadius: BOMB_RADIUS,
  boardHeight: BOARD_HEIGHT,
  boardWidth: BOARD_WIDTH,
  groupSizeForSuperSpawn: NUM_TILES_FOR_SUPER_TILE_SPAWN,
  groupSizeSettings: DEFAULT_GROUP_SIZE_SETTINGS,
  boardShufflesLeft: NUM_BOARD_SHUFFLES_LEFT,
  minGroupSizeForTurn: MIN_GROUP_SIZE_FOR_DESTROY,
  initialConnectedGroupsRatio: DEFAULT_CONNECTED_RATIO,
}
export const BASE_DIFFICULTIES: TGameDifficulties = {
  easy: {
    boardHeight: 6,
    boardWidth: 7,
    boardShufflesLeft: 3,
    bombRadius: 2,
    numBombBoosters: 5,
    numTeleportBoosters: 5,
    groupSizeForSuperSpawn: 5,
    numTurnsLeft: 20,
    targetScore: 100,
    initialConnectedGroupsRatio: 0.5,
    groupSizeSettings: {
      minGroupSize: 3,
      maxGroupSize: 6,
    },
    minGroupSizeForTurn: 2,
  },
  medium: {
    boardHeight: 8,
    boardWidth: 8,
    boardShufflesLeft: 3,
    bombRadius: 1,
    numBombBoosters: 4,
    numTeleportBoosters: 4,
    groupSizeForSuperSpawn: 5,
    numTurnsLeft: 17,
    targetScore: 140,
    initialConnectedGroupsRatio: 0.3,
    groupSizeSettings: {
      minGroupSize: 2,
      maxGroupSize: 5,
    },
    minGroupSizeForTurn: 2,
  },
  hard: {
    boardHeight: 9,
    boardWidth: 9,
    boardShufflesLeft: 3,
    bombRadius: 1,
    numBombBoosters: 3,
    numTeleportBoosters: 3,
    groupSizeForSuperSpawn: 6,
    numTurnsLeft: 15,
    targetScore: 170,
    initialConnectedGroupsRatio: 0.2,
    groupSizeSettings: {
      minGroupSize: 2,
      maxGroupSize: 4,
    },
    minGroupSizeForTurn: 2,
  },
  nightmare: {
    boardHeight: 9,
    boardWidth: 9,
    boardShufflesLeft: 3,
    bombRadius: 1,
    numBombBoosters: 2,
    numTeleportBoosters: 2,
    groupSizeForSuperSpawn: 6,
    numTurnsLeft: 20,
    targetScore: 200,
    initialConnectedGroupsRatio: 0.01,
    groupSizeSettings: {
      minGroupSize: 2,
      maxGroupSize: 3,
    },
    minGroupSizeForTurn: 2,
  },
} as const
