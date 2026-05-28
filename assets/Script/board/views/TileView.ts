import { tweenToPromise } from '../../shared/shared.utils'
import Tile from '../components/Tile'
import { shakeNode } from '../board.utils'
import { TTileData } from '../board.types'

export class TileView {
  private invalidClickTween: cc.Tween | null = null

  constructor(
    readonly component: Tile,
    public data: TTileData,
  ) {}
  get node(): cc.Node {
    return this.component.node
  }
  setup(frame: cc.SpriteFrame, clickHandler: () => void) {
    this.component.setup(frame)
    this.component.setClickHandler(clickHandler)
  }
  public async playInvalidClickAnimation(): Promise<void> {
    this.stopInvalidClickAnimation()

    const startAngle = this.node.angle
    const startScale = this.node.scale
    const shakeAmplitude = 8
    const duration = 0.04
    const repeats = 2
    const scaleFactor = 1.04
    this.invalidClickTween = cc.tween(this.node).parallel(
      cc
        .tween()
        .repeat(repeats, cc.tween().to(duration, { angle: -shakeAmplitude }).to(duration, { angle: shakeAmplitude }))
        .to(duration, { angle: startAngle }),

      cc
        .tween()
        .to(duration, {
          scale: startScale * scaleFactor,
        })
        .to(duration, {
          scale: startScale,
        }),
    )

    await tweenToPromise(this.invalidClickTween)

    this.invalidClickTween = null
    this.node.angle = startAngle
    this.node.scale = startScale
  }
  public stopInvalidClickAnimation() {
    if (this.invalidClickTween) {
      this.invalidClickTween.stop()
      this.invalidClickTween = null
    }

    this.node.angle = 0
  }
  async playSpawnAnimation(duration: number, position: cc.Vec3) {
    return tweenToPromise(cc.tween(this.node).to(duration, { position }, { easing: 'cubicOut' }))
  }
  private async playDestroyAnimation() {
    this.stopInvalidClickAnimation()

    const scaleFactor = 1.1
    const duration = 0.2
    const shakeTween = shakeNode(this.node)
    shakeTween.start()
    await tweenToPromise(
      cc.tween(this.node).to(duration, { scale: this.node.scale * scaleFactor }, { easing: 'cubicOut' }),
    )
    shakeTween.stop()
    return Promise.resolve()
  }
  async destroy() {
    await this.playDestroyAnimation()
    this.node.destroy()
  }
  public setSelected(value: boolean) {
    if (this.component.selectedGlow) {
      this.component.selectedGlow.active = value
    } else {
      this.component.node.opacity = value ? 180 : 255
    }
  }
}
