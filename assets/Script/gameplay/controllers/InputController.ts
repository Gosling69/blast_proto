import { TTileData } from '../../board/board.types'
import { TInputState, TInputAction } from '../gameplay.types'

export class InputController {
  private state: TInputState = { type: 'default' }

  getState(): TInputState {
    return this.state
  }

  setDefault() {
    this.state = { type: 'default' }
  }

  enableBomb() {
    this.state = { type: 'bomb' }
  }

  enableSwap() {
    this.state = {
      type: 'swap',
      firstTile: null,
    }
  }

  resolveTileClick(tile: TTileData): TInputAction {
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
