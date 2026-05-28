import BaseButton from './BaseButton'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.himpor
const { ccclass, property } = cc._decorator

@ccclass
export default class BoosterButton extends BaseButton {
  @property(cc.Sprite)
  icon: cc.Sprite = null
  setup(icon: cc.SpriteFrame) {
    this.icon.spriteFrame = icon
    this.setSelected(false)
  }
  setCount(count: number) {
    this.label.string = `${count}`
  }
}
