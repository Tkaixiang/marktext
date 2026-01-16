# MarkText Testing Infrastructure

This directory contains all tests for the MarkText application.

## Directory Structure

- `unit/` - Unit tests for individual functions and modules
- `integration/` - Integration tests for component interactions
- `e2e/` - End-to-end tests for full application workflows (future)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## Writing Tests

### Unit Tests

Unit tests should test individual functions or small modules in isolation.

Example:
```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../../src/path/to/module.js'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction(input)).toBe(expectedOutput)
  })
})
```

### Integration Tests

Integration tests should test how multiple modules work together.

### Best Practices

1. **Descriptive test names** - Use clear, descriptive names that explain what is being tested
2. **Arrange-Act-Assert** - Structure tests with setup, execution, and verification
3. **One assertion per test** - Focus each test on a single behavior
4. **Test edge cases** - Include tests for boundary conditions and error cases
5. **Mock external dependencies** - Use vi.mock() for external APIs, file system, etc.

## Test Coverage Goals

- **Critical paths**: 80%+ coverage
- **Utility functions**: 90%+ coverage
- **UI components**: 60%+ coverage
- **Overall project**: 60%+ coverage

## Current Status

- ✓ Testing framework set up (Vitest)
- ✓ Unit test example created
- ✓ Test directory structure created
- ⏳ Integration tests (TODO)
- ⏳ E2E tests (TODO)
- ⏳ CI/CD integration (TODO)

## Security Testing

Tests should verify:
- Proper input validation
- XSS prevention in markdown rendering
- File path sanitization
- IPC message validation

## Future Enhancements

1. Add E2E testing with Playwright or Spectron
2. Add visual regression testing
3. Add performance benchmarks
4. Integrate with CI/CD for automated testing
5. Add mutation testing for coverage quality
