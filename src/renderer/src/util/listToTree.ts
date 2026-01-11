export interface TocItem {
  parent?: TocNode | null
  lvl: number | null
  content: string | null
  slug: string | null
}

export interface TocNode {
  parent: TocNode | null
  lvl: number | null
  label: string | null
  slug: string | null
  children: TocNode[]
}

class Node implements TocNode {
  parent: TocNode | null
  lvl: number | null
  label: string | null
  slug: string | null
  children: TocNode[]

  constructor(item: TocItem) {
    const { parent, lvl, content, slug } = item
    this.parent = parent ?? null
    this.lvl = lvl
    this.label = content
    this.slug = slug
    this.children = []
  }

  // Add child node.
  addChild(node: TocNode): void {
    this.children.push(node)
  }
}

const findParent = (item: TocItem, lastNode: TocNode | null, rootNode: TocNode): TocNode => {
  if (!lastNode) {
    return rootNode
  }
  const { lvl: lastLvl } = lastNode
  const { lvl } = item

  if (lvl !== null && lastLvl !== null && lvl < lastLvl) {
    return findParent(item, lastNode.parent, rootNode)
  } else if (lvl === lastLvl) {
    return lastNode.parent ?? rootNode
  } else {
    return lastNode
  }
}

const listToTree = (list: TocItem[]): TocNode[] => {
  const rootNode = new Node({ parent: null, lvl: null, content: null, slug: null })
  let lastNode: TocNode | null = null

  for (const item of list) {
    const parent = findParent(item, lastNode, rootNode)

    const node = new Node({ parent, ...item })
    parent.addChild(node)
    lastNode = node
  }

  return rootNode.children
}

export default listToTree
