/**
 * Get the hierarchical index of a list item.
 * e.g. 1. 2. 1.
 * @param {Block} listitem the list item block
 */
export const getNestedIndex = listitem => {
  const indices = []
  let current = listitem
  while (current && current.type === 'li') {
    const parent = current.parent
    if (parent && /ol|ul/.test(parent.type)) {
      if (parent.listType === 'order') {
        const index = parent.children.indexOf(current)
        const start = parent.start || 1
        indices.unshift(index + start)
      }
      // Go up to the parent list item
      current = parent.parent
    } else {
      // Not in a list environment, break.
      break
    }
  }
  return indices.join('.')
}
