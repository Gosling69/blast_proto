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
export type BaseTileData = {
  id: string
  type: TileType
} & TCellPosition
export type RegularTileData = BaseTileData & {
  type: TileType.Regular
  color: TileColor
}
export type SuperTileData = BaseTileData & {
  type: TileType.SuperRow | TileType.SuperColumn | TileType.SuperBomb | TileType.SuperAll
}
export type TileData = RegularTileData | SuperTileData
