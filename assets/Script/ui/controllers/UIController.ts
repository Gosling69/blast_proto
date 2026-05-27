import { GameModel, TGameStatus } from '../../gameplay/models/GameModel'
import { TBoosterType, TSelectedBooster } from '../../core/types'
import { BoosterPanelView } from '../views/BoosterPanelView'
import LevelSelectPanel from '../components/popUps/LevelSelectPanel'
import { LevelSelectView } from '../views/LevelSelectView'
import TopPanel from '../components/roundPanels/TopPanel'
import { TopPanelView } from '../views/TopPanelView'
import BoosterPanel from '../components/roundPanels/BoosterPanel'
import { TDifficulty } from '../../shared/types'
import PopupLayer from '../components/popUps/PopupLayer'
export type TUIView = {
  topPanel: TopPanel
  boosterPanel: BoosterPanel
  // roundOverPopup: RoundOverPopup
  popupLayer: PopupLayer
  levelSelectPanel: LevelSelectPanel
}
//TODO: заменить поля на геттеры
export class UIController {
  private boosterPanelView: BoosterPanelView
  private levelSelectView: LevelSelectView
  private topPanelView: TopPanelView

  private popupLayer: PopupLayer
  onBombButtonClick: (() => void) | undefined = () => {}
  onSwapButtonClick: (() => void) | undefined = () => {}
  difficultyOnClick: Record<TDifficulty, (() => void) | undefined> = {
    easy: () => {},
    medium: () => {},
    hard: () => {},
  }

  constructor(private readonly view: TUIView) {
    this.boosterPanelView = new BoosterPanelView(view.boosterPanel)
    this.levelSelectView = new LevelSelectView(view.levelSelectPanel)
    this.topPanelView = new TopPanelView(view.topPanel)
    this.popupLayer = view.popupLayer
    this.boosterPanelView.setOnClickHandler('bomb', () => this.onBombButtonClick?.())
    this.boosterPanelView.setOnClickHandler('teleport', () => this.onSwapButtonClick?.())
    this.levelSelectView.setOnClickHandler(`easy`, () => this.difficultyOnClick.easy?.())
    this.levelSelectView.setOnClickHandler(`medium`, () => this.difficultyOnClick.medium?.())
    this.levelSelectView.setOnClickHandler(`hard`, () => this.difficultyOnClick.hard?.())
  }
  disableGameUI() {
    this.boosterPanelView.disable()
  }
  enableGameUI() {
    this.boosterPanelView.enable()
  }
  render(model: GameModel): void {
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
  public setLevelSelectOnClickHandler(callbackRecord: Partial<Record<TDifficulty, (() => void) | undefined>>): void {
    for (const mode in callbackRecord) {
      const callback = callbackRecord[mode]
      if (!callback) continue
      this.difficultyOnClick[mode] = callback
    }
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
  async showGameResult(status: TGameStatus) {
    await Promise.all([this.popupLayer.overlay.show(), this.popupLayer.popup.show(status)])

    return this.popupLayer.overlay.hide()
  }
  public setSelectedBooster(mode: TSelectedBooster): void {
    this.boosterPanelView.setSelected(mode)
  }
}
