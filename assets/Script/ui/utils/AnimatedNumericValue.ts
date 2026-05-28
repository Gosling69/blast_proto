export class AnimatedNumericValue {
  private value = 0
  private state = cc.v2(0, 0)
  private activeTween: cc.Tween = null

  constructor(initialValue: number) {
    this.value = initialValue
    this.state.x = initialValue
  }

  get current(): number {
    return this.value
  }

  setImmediate(value: number) {
    this.cancel()

    this.value = value
    this.state.x = value
  }

  animateTo(params: {
    target: number
    duration: number
    easing?: string
    onUpdate: (value: number) => void
    onComplete?: () => void
  }) {
    this.cancel()

    this.state.x = this.value

    this.activeTween = cc
      .tween(this.state)
      .to(
        params.duration,
        {
          x: params.target,
        },
        {
          easing: params.easing || 'quadOut',
          progress: (start: number, end: number, current: number, ratio: number) => {
            const value = start + (end - start) * ratio

            this.value = value
            params.onUpdate(value)

            return value
          },
        },
      )
      .call(() => {
        this.value = params.target
        this.state.x = params.target

        params.onUpdate(params.target)
        params.onComplete?.()

        this.activeTween = null
      })

    this.activeTween.start()
  }

  cancel() {
    if (this.activeTween) {
      this.activeTween.stop()
      this.activeTween = null
    }

    cc.Tween.stopAllByTarget(this.state)
  }

  dispose() {
    this.cancel()
  }
}
