import BoosterButton from '../components/buttons/BoosterButton'
import { BaseButtonView } from './BaseButtonView'

export class BoosterButtonView extends BaseButtonView<BoosterButton> {
  constructor(
    component: BoosterButton,
    private readonly icon: cc.SpriteFrame,
  ) {
    super(component)
    this.component.setup(this.icon)
  }

  public render(count: number) {
    this.component.setCount(count)
    if (count === 0) {
      this.component.setEnabled(false)
    }
  }
}
