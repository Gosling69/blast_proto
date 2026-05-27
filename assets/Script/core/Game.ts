// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Board from '../board/components/Board'
import UIRoot from '../ui/components/UIRoot'
import { GameController } from './GameController'

const { ccclass, property } = cc._decorator

@ccclass
export default class Game extends cc.Component {
  @property(Board)
  board: Board = null

  @property(UIRoot)
  UIRoot: UIRoot = null

  @property(GameController)
  private controller: GameController = null

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.controller = new GameController(this.board, this.UIRoot)
    this.controller.initializeGame()
  }

  start() {}

  // update (dt) {}
}
