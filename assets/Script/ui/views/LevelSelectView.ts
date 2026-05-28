import { TDifficulty } from '../../shared/shared.types'
import { tweenToPromise } from '../../shared/shared.utils'
import BaseButton from '../components/buttons/BaseButton'
import LevelSelectPanel from '../components/popUps/LevelSelectPanel'
import { BaseButtonView } from './BaseButtonView'
const FADE_Y_POS = 2000
const TARGET_Y_POS = 0

export class LevelSelectView {
  private readonly buttons: Record<TDifficulty, BaseButtonView<BaseButton>>

  constructor(private readonly component: LevelSelectPanel) {
    const { easy, medium, hard } = this.component.buttons
    this.buttons = {
      easy: new BaseButtonView(easy),
      medium: new BaseButtonView(medium),
      hard: new BaseButtonView(hard),
    }
  }
  async playSpawnAnimation() {
    this.component.node.y = FADE_Y_POS
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
          y: FADE_Y_POS,
        },
        { easing: `cubicOut` },
      ),
    )
    this.component.setVisible(false)
    return Promise.resolve()
  }

  public setOnClickHandler(type: TDifficulty, callback: (() => void) | undefined): void {
    if (!callback) return
    this.buttons[type].setClickHandler(callback)
  }
  public dispose(): void {
    this.component.dispose()
  }
}
