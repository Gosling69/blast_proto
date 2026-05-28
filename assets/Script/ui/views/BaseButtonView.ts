import BaseButton from '../components/buttons/BaseButton'

export class BaseButtonView<T extends BaseButton> {
  constructor(protected readonly component: T) {}

  setEnabled(value: boolean) {
    this.component.setEnabled(value)
  }
  public setSelected(value: boolean) {
    this.component.setSelected(value)
  }

  public setClickHandler(callback: () => void) {
    this.component.setClickHandler(callback)
  }

  public dispose() {
    this.component.dispose()
  }
}
