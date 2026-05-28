import { TBoosterType, TSelectedBooster } from '../../core/core.types'
import { BoosterPanelView } from '../views/BoosterPanelView'
import LevelSelectPanel from '../components/popUps/LevelSelectPanel'
import { LevelSelectView } from '../views/LevelSelectView'
import TopPanel from '../components/roundPanels/TopPanel'
import { TopPanelView } from '../views/TopPanelView'
import BoosterPanel from '../components/roundPanels/BoosterPanel'
import { TDifficulty } from '../../shared/shared.types'
import PopupLayer from '../components/popUps/PopupLayer'
import Overlay from '../components/popUps/Overlay'
import { THudViewModel } from '../ui.types'
export type TUIComponents = {
  topPanel: TopPanel
  boosterPanel: BoosterPanel
  overlay: Overlay
  popupLayer: PopupLayer
  levelSelectPanel: LevelSelectPanel
}
export class UIController {
  private boosterPanelView: BoosterPanelView
  private levelSelectView: LevelSelectView
  private topPanelView: TopPanelView
  private popupLayer: PopupLayer
  private overlay: Overlay
  onBombButtonClick: (() => void) | undefined = () => {}
  onSwapButtonClick: (() => void) | undefined = () => {}
  onDifficultySelect: (difficulty: TDifficulty) => void = () => {}

  constructor(private readonly components: TUIComponents) {
    this.boosterPanelView = new BoosterPanelView(components.boosterPanel)
    this.levelSelectView = new LevelSelectView(components.levelSelectPanel)
    this.topPanelView = new TopPanelView(components.topPanel)
    this.popupLayer = components.popupLayer
    this.overlay = components.overlay
    this.boosterPanelView.setOnClickHandler('bomb', () => this.onBombButtonClick?.())
    this.boosterPanelView.setOnClickHandler('teleport', () => this.onSwapButtonClick?.())
    this.levelSelectView.setOnClickHandler((difficulty) => this.onDifficultySelect(difficulty))
  }
  disableGameUI() {
    this.boosterPanelView.disable()
  }
  enableGameUI() {
    this.boosterPanelView.enable()
  }
  render(model: THudViewModel) {
    this.topPanelView.render(model)
    this.boosterPanelView.render({
      bomb: model.numBombBoosters,
      teleport: model.numTeleportBoosters,
    })
  }
  handleButtonClick(buttonType: TBoosterType) {
    switch (buttonType) {
      case 'bomb':
        this.onBombButtonClick?.()
        break
      case 'teleport':
        this.onSwapButtonClick?.()
        break
    }
  }
  setLevelSelectOnClickHandler(callback: (difficulty: TDifficulty) => void) {
    this.onDifficultySelect = callback
  }
  setSelectedBooster(mode: TSelectedBooster) {
    this.boosterPanelView.setSelected(mode)
  }
  async playLevelSelectPanelSpawnAnimation() {
    return this.levelSelectView.playSpawnAnimation()
  }
  async playLevelSelectPanelDeSpawnAnimation() {
    return this.levelSelectView.playDespawnAnimation()
  }
  async playRoundUISpawnAnimation() {
    return Promise.all([this.topPanelView.playSpawnAnimation(), this.boosterPanelView.playSpawnAnimation()])
  }
  async playRoundUIDespawnAnimation() {
    return Promise.all([this.topPanelView.playDespawnAnimation(), this.boosterPanelView.playDespawnAnimation()])
  }
  async showGameResult(status: string) {
    await Promise.all([this.overlay.show(), this.popupLayer.popup.show(status)])

    return this.overlay.hide()
  }
}
