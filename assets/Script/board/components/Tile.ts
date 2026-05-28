// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class Tile extends cc.Component {
  @property(cc.Sprite)
  private sprite: cc.Sprite = null
  @property(cc.Node)
  selectedGlow: cc.Node = null
  private clickHandler: () => void = () => {}

  setup(frame: cc.SpriteFrame) {
    this.sprite.spriteFrame = frame
  }
  setClickHandler(callback: () => void) {
    if (this.clickHandler) {
      this.node.off(cc.Node.EventType.TOUCH_END, this.clickHandler, this)
    }

    this.clickHandler = callback
    this.node.on(cc.Node.EventType.TOUCH_END, this.clickHandler, this)
  }
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.sprite = this.getComponent(cc.Sprite)
    this.node.on(cc.Node.EventType.TOUCH_END, this.clickHandler, this)
  }

  start() {}
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END, this.clickHandler, this)
  }

  // update (dt) {}
}
