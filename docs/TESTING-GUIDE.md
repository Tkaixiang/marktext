# MarkText Testing Guide

This guide provides comprehensive information about writing, running, and maintaining tests for MarkText.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in interactive UI mode
npm run test:ui
```

### Writing Your First Test

```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../../src/path/to/module.js'

describe('myFunction', () => {
  it('should do something specific', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

---

## Test Structure

### Directory Organization

```
tests/
├── helpers/               # Reusable test utilities
│   └── testUtils.js      # Mock factories, helpers
├── unit/                 # Unit tests
│   ├── filesystem.test.js
│   ├── encoding.test.js
│   └── *.test.js
├── integration/          # Integration tests
│   ├── fileOperations.test.js
│   └── *.test.js
└── e2e/                  # End-to-end tests (future)
```

### Test File Naming

- **Unit tests**: `[module-name].test.js`
- **Integration tests**: `[feature-name].test.js`
- **E2E tests**: `[workflow-name].e2e.test.js`

---

## Writing Tests

### Test Anatomy

```javascript
describe('Feature or Module Name', () => {
  // Setup that runs before each test
  beforeEach(() => {
    // Initialize test data, mocks, etc.
  })

  // Cleanup after each test
  afterEach(() => {
    // Clean up mocks, reset state
  })

  describe('Specific Function or Behavior', () => {
    it('should handle normal input', () => {
      // Arrange: Set up test data
      const input = 'test'

      // Act: Execute the code under test
      const result = functionUnderTest(input)

      // Assert: Verify the outcome
      expect(result).toBe('expected')
    })

    it('should handle edge cases', () => {
      expect(functionUnderTest(null)).toBeUndefined()
      expect(functionUnderTest('')).toBe('')
    })

    it('should throw on invalid input', () => {
      expect(() => functionUnderTest(invalid)).toThrow('Error message')
    })
  })
})
```

### Assertions

```javascript
// Equality
expect(actual).toBe(expected)              // Strict equality (===)
expect(actual).toEqual(expected)           // Deep equality
expect(actual).not.toBe(unexpected)        // Negation

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(number).toBeGreaterThan(5)
expect(number).toBeLessThan(10)
expect(number).toBeCloseTo(0.3, 2)        // Floating point

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays/Objects
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(object).toHaveProperty('key')
expect(object).toHaveProperty('key', value)

// Exceptions
expect(() => func()).toThrow()
expect(() => func()).toThrow('Error message')
expect(() => func()).toThrow(Error)

// Async
await expect(asyncFunc()).resolves.toBe(value)
await expect(asyncFunc()).rejects.toThrow()
```

---

## Test Utilities

### Using Test Helpers

```javascript
import {
  setupWindowMocks,
  clearWindowMocks,
  createMockFile,
  SAMPLE_MARKDOWN
} from '../helpers/testUtils.js'

describe('My Component', () => {
  beforeEach(() => {
    setupWindowMocks()
  })

  afterEach(() => {
    clearWindowMocks()
  })

  it('should use mocked window APIs', async () => {
    const file = createMockFile({ name: 'test.md' })
    await window.fileUtils.writeFile(file.path, file.content)

    expect(window.fileUtils.writeFile).toHaveBeenCalled()
  })
})
```

### Mocking Functions

```javascript
import { vi } from 'vitest'

// Create a mock function
const mockFn = vi.fn()

// Mock with return value
const mockFn = vi.fn(() => 'return value')

// Mock with implementation
const mockFn = vi.fn((arg) => arg * 2)

// Mock resolved promise
const mockFn = vi.fn().mockResolvedValue('async result')

// Mock rejected promise
const mockFn = vi.fn().mockRejectedValue(new Error('failed'))

// Assertions on mocks
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('lastArg')

// Get mock call information
const firstCall = mockFn.mock.calls[0]
const firstCallResult = mockFn.mock.results[0]
```

### Mocking Modules

```javascript
// Mock an entire module
vi.mock('../../src/module', () => ({
  functionA: vi.fn(),
  functionB: vi.fn(() => 'mocked')
}))

// Partial module mock
vi.mock('../../src/module', async () => {
  const actual = await vi.importActual('../../src/module')
  return {
    ...actual,
    functionToMock: vi.fn()
  }
})
```

---

## Best Practices

### 1. Test Naming

**Good:**
```javascript
it('should return true for valid markdown extensions')
it('should throw error when file does not exist')
it('should handle empty input gracefully')
```

**Bad:**
```javascript
it('works')
it('test function')
it('edge case')
```

### 2. One Assertion Per Test (When Possible)

**Good:**
```javascript
it('should return true for .md files', () => {
  expect(hasMarkdownExtension('test.md')).toBe(true)
})

it('should return true for .markdown files', () => {
  expect(hasMarkdownExtension('test.markdown')).toBe(true)
})
```

**Acceptable:**
```javascript
it('should return true for all markdown extensions', () => {
  expect(hasMarkdownExtension('test.md')).toBe(true)
  expect(hasMarkdownExtension('test.markdown')).toBe(true)
  expect(hasMarkdownExtension('test.mdx')).toBe(true)
})
```

### 3. Test Independent Tests

Each test should be independent and not rely on other tests' side effects.

**Good:**
```javascript
describe('FileSystem', () => {
  beforeEach(() => {
    // Reset state for each test
    fs.clear()
  })

  it('should create file', () => {
    fs.create('test.md')
    expect(fs.exists('test.md')).toBe(true)
  })

  it('should delete file', () => {
    fs.create('test.md')  // Setup for this specific test
    fs.delete('test.md')
    expect(fs.exists('test.md')).toBe(false)
  })
})
```

### 4. Cover Edge Cases

Always test:
- Normal input
- Boundary conditions (empty, max, min)
- Invalid input (null, undefined, wrong type)
- Error conditions

```javascript
describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('should handle decimals', () => {
    expect(divide(10, 3)).toBeCloseTo(3.33, 2)
  })

  it('should throw on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero')
  })

  it('should handle null inputs', () => {
    expect(() => divide(null, 2)).toThrow()
  })
})
```

### 5. Use Descriptive Variables

```javascript
// Good
const validMarkdownFile = 'document.md'
const invalidExtension = 'document.txt'
const emptyPath = ''

// Bad
const file1 = 'document.md'
const file2 = 'document.txt'
const x = ''
```

---

## Common Patterns

### Testing Async Functions

```javascript
it('should load file asynchronously', async () => {
  const content = await loadFile('/path/to/file.md')
  expect(content).toContain('# Header')
})

it('should reject on error', async () => {
  await expect(loadFile('/nonexistent')).rejects.toThrow('File not found')
})
```

### Testing Event Emitters

```javascript
it('should emit change event on update', (done) => {
  editor.on('change', (data) => {
    expect(data.content).toBe('updated')
    done()
  })

  editor.update('updated')
})

// Or with async/await
it('should emit change event', async () => {
  const changePromise = new Promise(resolve => {
    editor.once('change', resolve)
  })

  editor.update('updated')

  const data = await changePromise
  expect(data.content).toBe('updated')
})
```

### Testing Timers

```javascript
import { vi } from 'vitest'

it('should call function after delay', () => {
  vi.useFakeTimers()

  const mockFn = vi.fn()
  setTimeout(mockFn, 1000)

  // Fast-forward time
  vi.advanceTimersByTime(1000)

  expect(mockFn).toHaveBeenCalled()

  vi.useRealTimers()
})
```

### Testing DOM Interactions (Vue)

```javascript
import { mount } from '@vue/test-utils'

it('should update on button click', async () => {
  const wrapper = mount(MyComponent)

  await wrapper.find('button').trigger('click')

  expect(wrapper.text()).toContain('Updated')
})
```

---

## Troubleshooting

### Common Issues

**Issue: Tests pass individually but fail together**
- **Cause**: Shared state between tests
- **Solution**: Use `beforeEach`/`afterEach` to reset state

**Issue: `window is not defined`**
- **Cause**: Testing code that expects browser environment
- **Solution**: Use `setupWindowMocks()` from test utils

**Issue: Async test timeout**
- **Cause**: Promise not resolved/rejected
- **Solution**: Always `await` promises or return them

**Issue: Mock not working**
- **Cause**: Mock defined after import
- **Solution**: Move `vi.mock()` to top of file

### Debugging Tests

```javascript
// Add .only to run single test
it.only('should debug this test', () => {
  console.log('Debug info')
  expect(true).toBe(true)
})

// Skip a test
it.skip('should skip this test', () => {
  // Won't run
})

// Add console.log for debugging
it('should debug', () => {
  const result = myFunction()
  console.log('Result:', result)
  expect(result).toBeDefined()
})
```

---

## Coverage Guidelines

### Coverage Targets

| Area | Target | Priority |
|------|--------|----------|
| Utilities | 90%+ | Critical |
| Main Process | 70%+ | High |
| Preload | 80%+ | High |
| Renderer Utils | 80%+ | High |
| Vue Components | 60%+ | Medium |
| **Overall** | **60%+** | **High** |

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### What to Focus On

**High Priority:**
- Business logic
- Data transformations
- Error handling
- Edge cases
- Security-critical paths

**Low Priority:**
- UI layout code
- Simple getters/setters
- Third-party library wrappers

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://testingjavascript.com/)

---

## Contributing

When adding new features:

1. Write tests first (TDD) or alongside code
2. Ensure tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Follow naming conventions
5. Add to relevant test file or create new one
6. Update this guide if introducing new patterns

---

**Last Updated**: 2026-01-15
**Maintainers**: MarkText Contributors
