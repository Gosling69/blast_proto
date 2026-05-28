import { TGravityMove } from '../controllers/GravityController'
//tuta
import { BoardModel } from '../models/BoardModel'
import Tile from '../components/Tile'
import { TileColor, TileData, TileType } from '../models/TileData'
import { TileView } from './TileView'
import Board from '../components/Board'
import { sleep, tweenToPromise } from '../../shared/shared.utils'
export type TColorFrames = Record<TileColor, cc.SpriteFrame>
export type TParticleColors = Record<TileColor, cc.Color>
export type TSpecialFrames = Record<Exclude<TileType, TileType.Regular>, cc.SpriteFrame>
export type TBoardConfig = {
  width: number
  height: number
}
const VERTICAL_PADDING = 20
const HORIZONTAL_PADDING = 35
const TARGET_Y_POS = 25
//окей, переименовать в BoardLayout и сделать отдельно BoardView как Cocos Node
export class BoardView {
  private readonly spawnFallSpeed = 50 // px/sec
  private readonly minSpawnDuration = 0.18
  private readonly maxSpawnDuration = 0.55
  private readonly rowSpawnDelayMs = 60
  private fadeYPos: number = 2000

  private tilePrefab: cc.Prefab
  private explosionParticlePrefab: cc.Prefab
  private regularTileFrames: TColorFrames
  private specialTileFrames: TSpecialFrames

  private tileViews = new Map<string, TileView>()
  private tileSize!: number
  private usableWidth: number
  private usableHeight: number
  private gridWidth!: number
  private gridHeight!: number
  constructor(private component: Board) {
    this.tilePrefab = component.tilePrefab
    this.explosionParticlePrefab = component.explosionParticlePrefab
    this.regularTileFrames = component.getColorFramesMap()
    this.specialTileFrames = component.getSpecialFrames()
    this.usableWidth = this.component.node.width - HORIZONTAL_PADDING * 2
    this.usableHeight = this.component.node.height - VERTICAL_PADDING * 2
    this.component.setVisible(false)
  }
  shakeTile(tile: TileData) {
    const tileView = this.tileViews.get(tile.id)
    if (!tileView) return
    tileView.playInvalidClickAnimation()
  }
  async playSpawnAnimation() {
    this.component.node.y = this.fadeYPos
    this.component.setVisible(true)
    const duration = 0.3
    return tweenToPromise(
      cc.tween(this.component.node).to(
        duration,
        {
          y: TARGET_Y_POS,
        },
        { easing: `cubicOut` },
      ),
    )
  }
  async playDespawnAnimation() {
    const duration = 0.3
    await tweenToPromise(
      cc.tween(this.component.node).to(
        duration,
        {
          y: this.fadeYPos,
        },
        { easing: `cubicOut` },
      ),
    )
    this.component.setVisible(false)
    return Promise.resolve()
  }
  async clear(): Promise<unknown> {
    await Promise.all(Array.from(this.tileViews.keys()).map((id) => this.destroyAndRemoveFromMapSingleTile(id, true)))
    await sleep(500)
    return this.playDespawnAnimation()
  }
  reset(boardConfig: TBoardConfig) {
    this.tileSize = this.calculateTileSize(boardConfig)
    this.gridWidth = this.tileSize * boardConfig.width
    this.gridHeight = this.tileSize * boardConfig.height
  }
  setTileSelected(data: TileData, value: boolean) {
    const tileView = this.tileViews.get(data.id)
    if (!tileView) {
      throw new Error(`tile not found for select`)
    }
    tileView.setSelected(value)
  }
  async animateSwap(firstTile: TileData, secondTile: TileData) {
    const firstTileComponent = this.tileViews.get(firstTile.id)
    if (!firstTileComponent) {
      throw new Error(`first tile for swap not found`)
    }
    const secondTileComponent = this.tileViews.get(secondTile.id)
    if (!secondTileComponent) {
      throw new Error(`second tile for swap not found`)
    }
    const animationPromises: Array<Promise<unknown>> = []
    const firstPos = this.gridToWorld(firstTile.x, firstTile.y)
    const secondPos = this.gridToWorld(secondTile.x, secondTile.y)
    const duration = 0.5
    animationPromises.push(
      this.animateTileMove(firstTileComponent.component.node, firstPos, duration),
      this.animateTileMove(secondTileComponent.component.node, secondPos, duration),
    )
    await Promise.all(animationPromises)
    return Promise.resolve()
  }
  async renderByRows(board: BoardModel<TileData>): Promise<void> {
    const sortedRows = board.groupByRows()
    for (let y = sortedRows.length - 1; y >= 0; y--) {
      const rowTiles = sortedRows[y]
      let needToSleep = false
      for (const tile of rowTiles) {
        if (!tile || this.tileViews.has(tile.id)) continue
        if (!this.tileViews.has(tile.id)) {
          this.spawnTile(tile, true)
          needToSleep = true
        }
      }
      if (needToSleep) {
        await sleep(this.rowSpawnDelayMs)
      }
    }
    return Promise.resolve()
  }
  private async playExplosion(position: cc.Vec3, color?: cc.Color, wait = false): Promise<void> {
    const node = cc.instantiate(this.explosionParticlePrefab)

    this.component.node.addChild(node)
    node.setPosition(position)
    //TODO: fix
    const particle = node.getComponent(cc.ParticleSystem) || node.getComponentInChildren(cc.ParticleSystem)
    if (!particle) return
    if (color) {
      particle.startColor = color
      particle.endColor = new cc.Color(255, 255, 255, 0)
    }

    particle.resetSystem()
    const duration = particle.duration + particle.life + particle.lifeVar
    const promise = sleep(duration * 1000).then(() => {
      node.destroy()
    })

    return wait ? promise : Promise.resolve()
  }
  private getFallAnimationDuration(distance: number) {
    return this.clamp(distance / this.spawnFallSpeed, this.minSpawnDuration, this.maxSpawnDuration)
    return distance / this.spawnFallSpeed
  }
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
  async animateGravity(moves: TGravityMove[]) {
    const promises = moves.map((move) => {
      const tileView = this.tileViews.get(move.tile.id)
      if (!tileView) {
        console.error(`Tile with x:${move.tile.x}, y:${move.tile.y} not found`)
        return Promise.resolve()
      }
      const positionTo = this.gridToWorld(move.tile.x, move.yTo)
      const positionFrom = this.gridToWorld(move.tile.x, move.yFrom)
      const distance = Math.abs(positionFrom.y - positionTo.y)

      //duration from distance and speed
      const duration = this.getFallAnimationDuration(distance)
      return this.animateTileMove(tileView.component.node, positionTo, duration)
    })
    return Promise.all(promises)
  }
  private animateTileMove(node: cc.Node, position: cc.Vec3, duration: number): Promise<void> {
    return tweenToPromise(
      cc.tween(node).to(
        duration,
        {
          position,
        },
        {
          easing: 'cubicOut',
        },
      ),
    )
  }
  //TODO: add animation
  async removeTiles(tiles: Array<TileData>) {
    const animationPromises: Array<Promise<void>> = []
    for (const tile of tiles) {
      animationPromises.push(this.destroyAndRemoveFromMapSingleTile(tile.id))
    }
    return Promise.all(animationPromises)
  }
  //TODO: spawnAnimation
  async spawnTile(tile: TileData, animated: boolean = false) {
    const node = cc.instantiate(this.tilePrefab)

    node.parent = this.component.node
    node.width = this.tileSize
    node.height = this.tileSize

    const finalPos = this.gridToWorld(tile.x, tile.y)

    const startPos = animated ? cc.v3(finalPos.x, this.gridHeight / 2) : finalPos

    node.setPosition(startPos)

    const tileComponent = node.getComponent(Tile)
    if (!tileComponent) {
      throw new Error('Tile prefab does not contain TileView component')
    }
    const tileView = new TileView(tileComponent)

    tileView.setup(tile, this.getFrame(tile))

    this.tileViews.set(tile.id, tileView)

    if (animated) {
      const distance = Math.abs(startPos.y - finalPos.y)
      const duration = this.getFallAnimationDuration(distance)
      return tileView.playSpawnAnimation(duration, finalPos)
    }
    return Promise.resolve()
  }

  private async destroyAndRemoveFromMapSingleTile(id: string, wait = false) {
    const tileView = this.tileViews.get(id)
    if (!tileView) return Promise.resolve()
    const position = tileView.node.position
    const data = tileView.component.data
    const colors = this.component.getParticleColors()
    return (async () => {
      await tileView.destroy()
      this.playExplosion(position, data.type === TileType.Regular ? colors[data.color] : undefined, wait)
      this.tileViews.delete(id)
    })()
  }
  private getFrame(tile: TileData): cc.SpriteFrame {
    if (tile.type === TileType.Regular) {
      return this.regularTileFrames[tile.color]
    }
    return this.specialTileFrames[tile.type]
  }
  private calculateTileSize(boardConfig: TBoardConfig) {
    const { width, height } = boardConfig
    return Math.min(this.usableWidth / width, this.usableHeight / height)
  }
  //start at top left
  private gridToWorld(x: number, y: number): cc.Vec3 {
    const startX = -(this.gridWidth / 2)
    const startY = this.gridHeight / 2
    return new cc.Vec3(startX + x * this.tileSize + this.tileSize / 2, startY - y * this.tileSize - this.tileSize / 2)
  }
}
