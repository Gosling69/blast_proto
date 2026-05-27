// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class BackgroundCover extends cc.Component {
  @property(cc.Sprite)
  sprite: cc.Sprite = null

  onLoad(): void {
    this.resize()
    cc.view.on('canvas-resize', this.resize, this)
  }

  onDestroy(): void {
    cc.view.off('canvas-resize', this.resize, this)
  }

  private resize(): void {
    const visibleSize = cc.view.getVisibleSize()

    const frame = this.sprite.spriteFrame
    if (!frame) return

    const rect = frame.getRect()

    const scale = Math.max(visibleSize.width / rect.width, visibleSize.height / rect.height)

    this.node.width = rect.width * scale
    this.node.height = rect.height * scale

    this.node.setPosition(0, 0)
  }
}
