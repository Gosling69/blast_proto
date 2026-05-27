// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { COLOR_BLUE, COLOR_GREEN, COLOR_PURPLE, COLOR_RED, COLOR_YELLOW } from '../constants'
import { TColorFrames, TParticleColors, TSpecialFrames } from '../views/BoardView'

const { ccclass, property } = cc._decorator

@ccclass
export default class Board extends cc.Component {
  //tiles
  @property(cc.Prefab)
  tilePrefab: cc.Prefab = null

  @property(cc.SpriteFrame)
  redFrame: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  blueFrame: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  greenFrame: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  purpleFrame: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  yellowFrame: cc.SpriteFrame = null

  //special tiles
  @property(cc.SpriteFrame)
  superRow: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  superColumn: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  superBomb: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
  superAll: cc.SpriteFrame = null

  //explosion particle
  @property(cc.Prefab)
  explosionParticlePrefab: cc.Prefab = null

  getColorFramesMap(): TColorFrames {
    return {
      red: this.redFrame,
      green: this.greenFrame,
      blue: this.blueFrame,
      purple: this.purpleFrame,
      yellow: this.yellowFrame,
    }
  }
  getSpecialFrames(): TSpecialFrames {
    return {
      superRow: this.superRow,
      superColumn: this.superColumn,
      superBomb: this.superBomb,
      superAll: this.superAll,
    }
  }
  getParticleColors(): TParticleColors {
    return {
      blue: COLOR_BLUE,
      red: COLOR_RED,
      green: COLOR_GREEN,
      yellow: COLOR_YELLOW,
      purple: COLOR_PURPLE,
    }
  }
  setVisible(value: boolean) {
    this.node.active = value
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
