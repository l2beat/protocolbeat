export function detectDrag(
  el: HTMLElement,
  onDrag: (x: number, y: number, event: PointerEvent) => void,
  onStart: (event: PointerEvent) => void,
  onEnd: (event: PointerEvent) => void,
): () => void {
  let pointerStart: [number, number] | undefined
  el.style.touchAction = 'none'

  function down(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.stopPropagation()
    pointerStart = [e.pageX, e.pageY]
    onStart(e)
  }

  function move(e: PointerEvent) {
    if (!pointerStart) return
    e.preventDefault()
    const [x, y] = [e.pageX, e.pageY]
    const delta = [x - pointerStart[0], y - pointerStart[1]]
    const zoom = el.getBoundingClientRect().width / el.offsetWidth
    onDrag(delta[0] / zoom, delta[1] / zoom, e)
  }

  function up(e: PointerEvent) {
    if (!pointerStart) return
    pointerStart = undefined
    onEnd(e)
  }

  el.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)

  return () => {
    el.removeEventListener('pointerdown', down)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}
