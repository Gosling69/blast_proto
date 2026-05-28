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

  private resize = (): void => {
    const frame = this.sprite.spriteFrame
    if (!frame) return

    const design = cc.view.getDesignResolutionSize()
    const canvasRect = cc.game.canvas.getBoundingClientRect()

    const canvasAspect = canvasRect.width / canvasRect.height
    const designAspect = design.width / design.height

    let visibleWidth = design.width
    let visibleHeight = design.height

    if (canvasAspect > designAspect) {
      visibleWidth = design.height * canvasAspect
    } else {
      visibleHeight = design.width / canvasAspect
    }

    const rect = frame.getRect()

    const scale = Math.max(visibleWidth / rect.width, visibleHeight / rect.height)

    this.node.setContentSize(rect.width, rect.height)
    this.node.scaleX = scale
    this.node.scaleY = scale
    this.node.setPosition(0, 0)
  }
}
