export const shakeNode = (node: cc.Node, amplitude = 8, duration = 0.05) => {
  const tween = cc
    .tween(node)
    .repeatForever(cc.tween().to(duration, { angle: -amplitude }).to(duration, { angle: amplitude }))

  tween.start()

  return tween
}
