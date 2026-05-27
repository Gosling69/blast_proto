// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TBoosterType } from '../../../core/types'
import BoosterButton from '../buttons/BoosterButton'

const { ccclass, property } = cc._decorator

@ccclass
export default class BoosterPanel extends cc.Component {
  @property(BoosterButton)
  bombButton: BoosterButton = null

  @property(BoosterButton)
  teleportButton: BoosterButton = null

  @property(cc.SpriteFrame)
  bombIcon: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  teleportIcon: cc.SpriteFrame = null
  setVisible(value: boolean) {
    this.node.active = value
  }
  public getIcon(type: TBoosterType): cc.SpriteFrame {
    switch (type) {
      case 'bomb':
        return this.bombIcon
      case 'teleport':
        return this.teleportIcon
    }
  }
}
