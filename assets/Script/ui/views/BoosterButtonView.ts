import BoosterButton from '../components/buttons/BoosterButton'
import { TBoosterType } from '../../core/types'
import { BaseButtonView } from './BaseButtonView'

export class BoosterButtonView extends BaseButtonView<BoosterButton> {
  constructor(
    component: BoosterButton,
    private readonly type: TBoosterType,
    private readonly icon: cc.SpriteFrame,
  ) {
    super(component)
    this.component.setup(this.icon)
  }

  public render(count: number): void {
    this.component.setCount(count)
    if (count === 0) {
      this.component.setEnabled(false)
    }
  }
}
