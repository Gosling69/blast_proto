// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { tweenToPromise } from '../../../shared/utils'

const { ccclass, property } = cc._decorator
const INITIAL_POSITION = 500
const END_POSITION = 0
@ccclass
export default class RoundOverPopup extends cc.Component {
  @property(cc.Label)
  messageLabel: cc.Label = null

  onLoad(): void {
    this.node.y = INITIAL_POSITION
    this.node.active = false
  }

  show(message: string): Promise<void> {
    this.node.active = true
    this.node.opacity = 0
    this.messageLabel.string = message
    const duration = 0.4
    const delay = 1
    return tweenToPromise(
      cc
        .tween(this.node)
        .to(duration, { opacity: 255, y: END_POSITION }, { easing: 'cubicOut' })
        .delay(delay)
        .to(duration, { opacity: 0, y: INITIAL_POSITION }, { easing: 'cubicIn' }),
    )
  }
}
