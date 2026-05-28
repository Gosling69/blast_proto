export enum TileType {
  Regular = 'regular',
  SuperRow = 'superRow',
  SuperColumn = 'superColumn',
  SuperBomb = 'superBomb',
  SuperAll = 'superAll',
}
export type TSuperTileType = Exclude<TileType, TileType.Regular>

export const SUPER_TILE_TYPES = Object.values(TileType).filter((x) => x !== TileType.Regular) as TSuperTileType[]

export enum TileColor {
  Green = `green`,
  Blue = `blue`,
  Red = `red`,
  Purple = `purple`,
  Yellow = `yellow`,
}
export type TCellPosition = {
  x: number
  y: number
}
export type TBaseTileData = {
  id: string
  type: TileType
} & TCellPosition
export type TRegularTileData = TBaseTileData & {
  type: TileType.Regular
  color: TileColor
}
export type TSuperTileData = TBaseTileData & {
  type: TileType.SuperRow | TileType.SuperColumn | TileType.SuperBomb | TileType.SuperAll
}
export type TTileData = TRegularTileData | TSuperTileData

export type Cell<T> = T | null
export type TShuffleMove<T> = {
  tileFrom: T
  tileTo: T
}
export type TGravityMove = {
  tile: TTileData
  yFrom: number
  yTo: number
}
