import { TTileData, TileType } from '../board/board.types'
import { TDestroyContext, TInputAction, TInputState } from '../gameplay/gameplay.types'
import { TSelectedBooster } from '../shared/shared.types'

export const inputStateToSelectedBooster = (state: TInputState): TSelectedBooster => {
  switch (state.type) {
    case 'bomb':
      return 'bomb'

    case 'swap':
      return 'teleport'

    case 'default':
      return null
  }
}

export const createDestroyContext = (
  action: TInputAction,
  clickedTile: TTileData,
  targets: TTileData[],
): TDestroyContext => {
  if (action.type === 'bombTileClick') {
    return {
      type: 'bombClick',
      targetsCount: targets.length,
    }
  }

  switch (clickedTile.type) {
    case TileType.Regular:
      return {
        type: 'regularClick',

        tileType: TileType.Regular,

        groupSize: targets.length,
      }

    case TileType.SuperRow:
    case TileType.SuperColumn:
    case TileType.SuperBomb:
    case TileType.SuperAll:
      return {
        type: 'regularClick',

        tileType: clickedTile.type,

        targetsCount: targets.length,
      }
  }
}
