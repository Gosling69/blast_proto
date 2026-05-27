// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Events } from '../../core/EventEmitter'
import { TileData } from '../models/TileData'

const { ccclass, property } = cc._decorator

@ccclass
export default class Tile extends cc.Component {
  data: TileData = null
  @property(cc.Sprite)
  private sprite: cc.Sprite = null
  @property(cc.Node)
  selectedGlow: cc.Node = null

  setup(data: TileData, frame: cc.SpriteFrame) {
    this.sprite.spriteFrame = frame
    this.data = data
  }
  onClick() {
    Events.emit(`tileClicked`, this.data)
  }
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.sprite = this.getComponent(cc.Sprite)
    this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this)
  }

  start() {}
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this)
  }

  // update (dt) {}
}
