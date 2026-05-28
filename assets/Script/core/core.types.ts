import { TileData } from '../board/models/TileData'

export type TBoosterType = `bomb` | `teleport`
export type TSelectedBooster = TBoosterType | null
export interface GameEvents {
  tileClicked: (data: TileData) => void
  boosterButtonClicked: (type: TBoosterType) => void
}
