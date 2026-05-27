import { Cell } from '../../board/models/BoardModel'
import { TileData } from '../../board/models/TileData'
export type TInputModeType = `default` | `bomb` | `swap`
export type TInputState = { type: 'default' } | { type: 'bomb' } | { type: 'swap'; firstTile: Cell<TileData> }

export type TDestroyAction = { type: 'defaultTileClick'; tile: TileData } | { type: 'bombTileClick'; tile: TileData }

export type TSwapAction = { type: 'swapApply'; firstTile: TileData; secondTile: TileData }

export type TSelectionAction =
  | { type: 'swapSelectFirst'; tile: TileData }
  | { type: 'swapDeselectFirst'; tile: TileData }

export type TInputAction = TDestroyAction | TSwapAction | TSelectionAction

export class InputController {
  private state: TInputState = { type: 'default' }

  getState(): TInputState {
    return this.state
  }

  setDefault(): void {
    this.state = { type: 'default' }
  }

  enableBomb(): void {
    this.state = { type: 'bomb' }
  }

  enableSwap(): void {
    this.state = {
      type: 'swap',
      firstTile: null,
    }
  }

  resolveTileClick(tile: TileData): TInputAction {
    switch (this.state.type) {
      case 'default':
        return {
          type: 'defaultTileClick',
          tile,
        }

      case 'bomb':
        this.setDefault()

        return {
          type: 'bombTileClick',
          tile,
        }

      case 'swap': {
        const firstTile = this.state.firstTile

        if (!firstTile) {
          this.state = {
            type: 'swap',
            firstTile: tile,
          }

          return {
            type: 'swapSelectFirst',
            tile,
          }
        }

        if (firstTile.id === tile.id) {
          this.state = {
            type: 'swap',
            firstTile: null,
          }

          return {
            type: 'swapDeselectFirst',
            tile,
          }
        }

        this.setDefault()

        return {
          type: 'swapApply',
          firstTile,
          secondTile: tile,
        }
      }
    }
  }
}
