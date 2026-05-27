// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator

@ccclass
export default class Overlay extends cc.Component {
  onLoad(): void {
    this.node.active = false
    this.node.opacity = 0
  }

  show(duration = 0.2, opacity = 160): Promise<void> {
    this.node.active = true
    this.node.opacity = 0
    return new Promise<void>((resolve) => {
      cc.tween(this.node).to(duration, { opacity }, { easing: 'quadOut' }).call(resolve).start()
    })
  }

  hide(duration = 0.2): Promise<void> {
    return new Promise<void>((resolve) => {
      cc.tween(this.node)
        .to(duration, { opacity: 0 }, { easing: 'quadOut' })
        .call(() => {
          this.node.active = false
          resolve()
        })
        .start()
    })
  }
}
