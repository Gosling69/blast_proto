// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TDifficulty } from '../../../shared/types'
import BaseButton from '../buttons/BaseButton'

const { ccclass, property } = cc._decorator

@ccclass
export default class LevelSelectPanel extends cc.Component {
  @property(BaseButton)
  easyDifficulty: BaseButton = null
  @property(BaseButton)
  mediumDifficulty: BaseButton = null
  @property(BaseButton)
  hardDifficulty: BaseButton = null
  // LIFE-CYCLE CALLBACKS:
  setVisible(value: boolean) {
    this.node.active = value
  }
  get buttons(): Record<TDifficulty, BaseButton> {
    return {
      easy: this.easyDifficulty,
      medium: this.mediumDifficulty,
      hard: this.hardDifficulty,
    }
  }
  // onLoad () {}

  start() {}
  dispose() {}
  // update (dt) {}
}
