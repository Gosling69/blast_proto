import { TileType, Cell, TTileData } from '../board/board.types'

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
export type TInputModeType = `default` | `bomb` | `swap`
export type TInputState = { type: 'default' } | { type: 'bomb' } | { type: 'swap'; firstTile: Cell<TTileData> }

export type TDestroyAction = { type: 'defaultTileClick'; tile: TTileData } | { type: 'bombTileClick'; tile: TTileData }

export type TSwapAction = { type: 'swapApply'; firstTile: TTileData; secondTile: TTileData }

export type TSelectionAction =
  | { type: 'swapSelectFirst'; tile: TTileData }
  | { type: 'swapDeselectFirst'; tile: TTileData }

export type TInputAction = TDestroyAction | TSwapAction | TSelectionAction
export type TGameStatus = `win` | `lose` | `playing`
