import { GameModel } from '../../gameplay/models/GameModel'
import { tweenToPromise } from '../../shared/shared.utils'
import TopPanel from '../components/roundPanels/TopPanel'
import { CurrentScoreView } from './CurrentScoreView'
const TARGET_Y_POS = 735
const FADE_Y_POS = 2000
export class TopPanelView {
  private readonly currentScore: CurrentScoreView
  constructor(private component: TopPanel) {
    this.currentScore = new CurrentScoreView(this.component.scoreLabel)
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
  render(model: GameModel) {
    this.currentScore.render(model.score, model.targetScore)
    this.component.turnsLabel.string = `${model.numTurnsLeft}`
  }
}
