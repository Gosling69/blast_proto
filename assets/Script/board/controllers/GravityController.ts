import { BoardModel } from '../models/BoardModel'
import { TileData } from '../models/TileData'

export type TGravityMove = {
  tile: TileData
  yFrom: number
  yTo: number
}

export class GravityController {
  constructor() {}

  applyGravity(board: BoardModel<TileData>): TGravityMove[] {
    const { grid } = board

    const moves: TGravityMove[] = []

    const height = grid.length
    const width = grid[0].length

    for (let x = 0; x < width; x++) {
      let writeY = height - 1

      for (let y = height - 1; y >= 0; y--) {
        const tile = grid[y][x]

        if (!tile) continue

        if (y !== writeY) {
          moves.push({
            tile,
            yFrom: y,
            yTo: writeY,
          })

          grid[writeY][x] = tile
          grid[y][x] = null

          tile.x = x
          tile.y = writeY
        }

        writeY--
      }
    }
    return moves
  }
}
