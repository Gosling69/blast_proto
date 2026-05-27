import { GameEvents } from './types'

type Listener = (...args: any[]) => void
class EventEmitter<T extends { [K in keyof T]: Listener }> {
  private listeners: {
    [K in keyof T]?: T[K][]
  } = {}

  on<K extends keyof T>(event: K, listener: T[K]) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event]!.push(listener)
  }

  off<K extends keyof T>(event: K, listener: T[K]) {
    const listeners = this.listeners[event]

    if (!listeners) return

    this.listeners[event] = listeners.filter((l) => l !== listener) as T[K][]
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    const listeners = this.listeners[event]

    if (!listeners) return

    for (const listener of listeners) {
      listener(...args)
    }
  }
}
export const Events = new EventEmitter<GameEvents>()
