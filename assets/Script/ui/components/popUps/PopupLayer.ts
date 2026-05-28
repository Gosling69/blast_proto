// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RoundOverPopup from './RoudOverPopup'

const { ccclass, property } = cc._decorator

@ccclass
export default class PopupLayer extends cc.Component {
  @property(RoundOverPopup)
  popup: RoundOverPopup = null

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
