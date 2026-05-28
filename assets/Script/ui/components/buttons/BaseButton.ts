// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator

@ccclass
export default class BaseButton extends cc.Component {
  @property(cc.Button)
  button: cc.Button = null

  @property(cc.Label)
  label: cc.Label = null

  @property(cc.Node)
  selectedGlow: cc.Node = null

  private clickHandler: (() => void) | null = null

  private isSelected = false
  private isEnabled = true
  private isHover = false
  private isPressed = false

  private readonly transitionDuration = 0.12

  onLoad() {
    this.button.transition = cc.Button.Transition.NONE

    if (this.selectedGlow) {
      this.selectedGlow.active = false
      this.selectedGlow.opacity = 0
    }

    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.handleHover, this)
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.handleNormal, this)
    this.node.on(cc.Node.EventType.TOUCH_START, this.handlePressed, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.handleNormal, this)

    this.applyVisualState(true)
  }

  setSelected(value: boolean) {
    this.isSelected = value
    this.applyVisualState()
  }

  setEnabled(value: boolean) {
    this.isEnabled = value
    this.button.interactable = value

    if (!value) {
      this.isHover = false
      this.isPressed = false
    }

    this.applyVisualState()
  }

  setClickHandler(callback: () => void) {
    if (this.clickHandler) {
      this.button.node.off('click', this.clickHandler, this)
    }

    this.clickHandler = callback
    this.button.node.on('click', this.clickHandler, this)
  }

  dispose() {
    if (this.clickHandler) {
      this.button.node.off('click', this.clickHandler, this)
      this.clickHandler = null
    }
  }

  onDestroy() {
    this.dispose()

    cc.Tween.stopAllByTarget(this.node)

    if (this.selectedGlow) {
      cc.Tween.stopAllByTarget(this.selectedGlow)
    }

    this.node.off(cc.Node.EventType.MOUSE_ENTER, this.handleHover, this)
    this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.handleNormal, this)
    this.node.off(cc.Node.EventType.TOUCH_START, this.handlePressed, this)
    this.node.off(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this)
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.handleNormal, this)
  }

  private handleHover() {
    if (!this.isEnabled || this.isSelected) return

    this.isHover = true
    this.isPressed = false

    this.applyVisualState()
  }

  private handlePressed() {
    if (!this.isEnabled) return

    this.isPressed = true
    this.applyVisualState()
  }

  private handleTouchEnd() {
    if (!this.isEnabled) return

    this.isPressed = false
    this.applyVisualState()
  }

  private handleNormal() {
    if (!this.isEnabled) return

    this.isHover = false
    this.isPressed = false

    this.applyVisualState()
  }

  private applyVisualState(immediate = false) {
    const targetScale = this.getTargetScale()
    const targetOpacity = this.getTargetOpacity()

    cc.Tween.stopAllByTarget(this.node)
    if (immediate) {
      this.node.scale = targetScale
      this.node.opacity = targetOpacity
    } else {
      cc.tween(this.node)
        .to(
          this.transitionDuration,
          {
            scale: targetScale,
            opacity: targetOpacity,
          },
          {
            easing: 'quadOut',
          },
        )
        .start()
    }

    this.applySelectedGlow(immediate)
  }

  private applySelectedGlow(immediate = false) {
    if (!this.selectedGlow) return

    cc.Tween.stopAllByTarget(this.selectedGlow)

    if (this.isSelected && this.isEnabled) {
      this.selectedGlow.active = true

      if (immediate) {
        this.selectedGlow.opacity = 255
        return
      }

      cc.tween(this.selectedGlow).to(0.12, { opacity: 255 }, { easing: 'quadOut' }).start()

      return
    }

    if (immediate) {
      this.selectedGlow.opacity = 0
      this.selectedGlow.active = false
      return
    }

    cc.tween(this.selectedGlow)
      .to(0.1, { opacity: 0 }, { easing: 'quadOut' })
      .call(() => {
        this.selectedGlow.active = false
      })
      .start()
  }

  private getTargetScale(): number {
    if (!this.isEnabled) return 1

    if (this.isPressed) return 0.95

    if (this.isSelected) return 1.08

    if (this.isHover) return 1.05

    return 1
  }

  private getTargetOpacity(): number {
    if (!this.isEnabled) return 110

    if (this.isPressed) return 220
    if (this.isSelected) return 120

    return 255
  }
}
