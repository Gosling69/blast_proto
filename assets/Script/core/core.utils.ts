import { TInputState } from '../gameplay/controllers/InputController'
import { TSelectedBooster } from './core.types'

export const createGrid = <T>(width: number, height: number, value: T) => {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => value))
}
export const getRandomArrayElement = <T>(arr: readonly T[]) => {
  if (arr.length === 0) {
    throw new Error('Array is empty')
  }
  return arr[Math.floor(Math.random() * arr.length)]
}
export const getRandomEnumValue = <T extends Record<string, string>>(enumeration: T): T[keyof T] => {
  const values = Object.values(enumeration) as Array<T[keyof T]>

  return values[Math.floor(Math.random() * values.length)]
}
export const inputStateToSelectedBooster = (state: TInputState): TSelectedBooster => {
  switch (state.type) {
    case 'bomb':
      return 'bomb'

    case 'swap':
      return 'teleport'

    case 'default':
      return null
  }
}
