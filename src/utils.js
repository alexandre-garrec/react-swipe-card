
export const translate3d = (x, y) => {
  const translate = `translate3d(${x}px, ${y}px, 0px)`
  return {
    msTransform: translate,
    WebkitTransform: translate,
    transform: translate
  }
}
