import { TileType } from '../board/models/TileData'

export type TDestroyContext =
  | {
      type: 'regularClick'
      tileType: TileType.Regular
      groupSize: number
    }
  | {
      type: 'regularClick'
      tileType: TileType.SuperRow | TileType.SuperColumn | TileType.SuperBomb | TileType.SuperAll

      targetsCount: number
    }
  | {
      type: 'bombClick'
      targetsCount: number
    }
