// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LevelSelectPanel from './popUps/LevelSelectPanel'
import PopupLayer from './popUps/PopupLayer'
import BoosterPanel from './roundPanels/BoosterPanel'
import TopPanel from './roundPanels/TopPanel'

const { ccclass, property } = cc._decorator

@ccclass
export default class UIRoot extends cc.Component {
  @property(BoosterPanel)
  boosterPanel: BoosterPanel = null
  @property(TopPanel)
  topPanel: TopPanel = null
  //TODO: move to PopupRoot
  @property(PopupLayer)
  popupLayer: PopupLayer = null
  @property(LevelSelectPanel)
  levelSelectPanel: LevelSelectPanel = null
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
