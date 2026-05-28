import { AnimatedNumericValue } from '../utils/AnimatedNumericValue'

export class CurrentScoreView {
  private readonly animatedScore = new AnimatedNumericValue(0)
  constructor(private readonly label: cc.Label) {}

  render(score: number, targetScore: number) {
    this.animatedScore.animateTo({
      target: score,
      duration: 0.35,
      easing: 'quadOut',
      onUpdate: (value) => {
        this.label.string = `${Math.floor(value)}/${targetScore}`
      },
    })
  }

  dispose() {
    this.animatedScore.dispose()
  }
}
