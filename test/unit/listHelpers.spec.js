
import { getNestedIndex } from '../../src/muya/lib/contentState/listHelpers'

describe('getNestedIndex', () => {
  it('should calculate the correct index for a nested list item', () => {
    const mockNode = {
      type: 'li',
      parent: {
        type: 'ol',
        listType: 'order',
        children: [
          { type: 'li' },
          { type: 'li' },
          { type: 'li' }
        ],
        parent: {
          type: 'li',
          parent: {
            type: 'ol',
            listType: 'order',
            children: [
              { type: 'li' }
            ]
          }
        }
      }
    }
    mockNode.parent.children[1] = mockNode
    mockNode.parent.parent.parent.children[0] = mockNode.parent.parent

    const result = getNestedIndex(mockNode)
    expect(result).toBe('1.2')
  })

  it('should handle a custom start number', () => {
    const mockNode = {
      type: 'li',
      parent: {
        type: 'ol',
        listType: 'order',
        start: 5,
        children: [
          { type: 'li' },
          { type: 'li' }
        ],
        parent: {
          type: 'li',
          parent: {
            type: 'ol',
            listType: 'order',
            start: 2,
            children: [
              { type: 'li' },
              { type: 'li' }
            ]
          }
        }
      }
    }
    mockNode.parent.children[1] = mockNode
    mockNode.parent.parent.parent.children[1] = mockNode.parent.parent

    const result = getNestedIndex(mockNode)
    expect(result).toBe('3.6')
  })

  it('should return an empty string for a top-level item in an unordered list', () => {
    const mockNode = {
      type: 'li',
      parent: {
        type: 'ul',
        listType: 'bullet',
        children: [
          { type: 'li' },
          { type: 'li' }
        ]
      }
    }
    mockNode.parent.children[1] = mockNode

    const result = getNestedIndex(mockNode)
    expect(result).toBe('')
  })
})
