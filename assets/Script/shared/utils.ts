export const tweenToPromise = (tween: cc.Tween, onCall?: () => void) => {
  return new Promise<void>((resolve) => {
    tween
      .call(() => {
        onCall?.()
        resolve()
      })
      .start()
  })
}
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
