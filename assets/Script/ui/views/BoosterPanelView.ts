import { TBoosterType, TSelectedBooster } from '../../core/core.types'
import { tweenToPromise } from '../../shared/shared.utils'
import BoosterPanel from '../components/roundPanels/BoosterPanel'
import { BoosterButtonView } from './BoosterButtonView'
const TARGET_Y_POS = -624
const FADE_Y_POS = -2000
export class BoosterPanelView {
  private readonly buttons: Record<TBoosterType, BoosterButtonView>

  constructor(private readonly component: BoosterPanel) {
    this.buttons = {
      bomb: new BoosterButtonView(component.bombButton, 'bomb', component.getIcon('bomb')),

      teleport: new BoosterButtonView(component.teleportButton, 'teleport', component.getIcon('teleport')),
    }
    this.component.setVisible(false)
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
  disable() {
    this.buttons.bomb.setEnabled(false)
    this.buttons.teleport.setEnabled(false)
  }
  enable() {
    this.buttons.bomb.setEnabled(true)
    this.buttons.teleport.setEnabled(true)
  }
  public render(counts: Record<TBoosterType, number>): void {
    this.buttons.bomb.render(counts.bomb)
    this.buttons.teleport.render(counts.teleport)
  }

  public setSelected(type: TSelectedBooster): void {
    this.buttons.bomb.setSelected(type === 'bomb')
    this.buttons.teleport.setSelected(type === 'teleport')
  }

  public setOnClickHandler(type: TBoosterType, callback: (() => void) | undefined): void {
    if (!callback) return
    this.buttons[type].setClickHandler(callback)
  }

  public dispose(): void {
    this.buttons.bomb.dispose()
    this.buttons.teleport.dispose()
  }
}
