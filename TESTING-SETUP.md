# Testing Infrastructure Setup

## Status: Ready for Installation

The testing infrastructure has been configured and is ready to use once Vitest is installed.

## What's Been Set Up

### 1. Vitest Configuration ✓
- `vitest.config.js` - Configured with proper aliases and coverage settings
- Node environment for main/preload tests
- Coverage reporting with v8 provider

### 2. Test Directory Structure ✓
```
tests/
├── README.md          # Testing documentation
├── unit/              # Unit tests
│   └── filesystem.test.js  # Example test
├── integration/       # Integration tests (empty, ready for tests)
└── e2e/              # End-to-end tests (empty, ready for tests)
```

### 3. Example Tests ✓
- `tests/unit/filesystem.test.js` - Example unit tests for filesystem utilities
- Demonstrates proper test structure and assertions
- Tests for hasMarkdownExtension, isImageFile, and MARKDOWN_INCLUSIONS

## Installation Required

Due to build environment constraints, Vitest needs to be installed separately:

```bash
# Install Vitest and related packages
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8

# Or if using yarn
yarn add --dev vitest @vitest/ui @vitest/coverage-v8
```

## Package.json Scripts (To Be Added)

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Running Tests

Once Vitest is installed:

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Interactive UI
npm run test:ui

# With coverage report
npm run test:coverage
```

## Next Steps

### Week 1 (Immediate)
- [x] Configure Vitest
- [x] Create test directory structure
- [x] Write example unit tests
- [ ] Install Vitest when build environment is fixed
- [ ] Verify tests run successfully

### Week 2-4 (High Priority)
- [ ] Write unit tests for critical utilities
  - [ ] File system operations
  - [ ] Path utilities
  - [ ] Markdown parsing helpers
  - [ ] IPC message handlers
- [ ] Write integration tests
  - [ ] Editor component initialization
  - [ ] File open/save workflows
  - [ ] Preference management
- [ ] Aim for 40% code coverage

### Month 2-3 (Medium Priority)
- [ ] Add E2E testing with Playwright
- [ ] Increase coverage to 60%+
- [ ] Add tests for security-critical paths
- [ ] Set up CI/CD integration

## Test Writing Guidelines

### Unit Tests

Test individual functions in isolation:

```javascript
describe('functionName', () => {
  it('should handle normal input', () => {
    expect(functionName('input')).toBe('output')
  })

  it('should handle edge cases', () => {
    expect(functionName(null)).toBeUndefined()
  })

  it('should throw on invalid input', () => {
    expect(() => functionName(invalid)).toThrow()
  })
})
```

### Integration Tests

Test multiple components working together:

```javascript
describe('File Operations', () => {
  it('should save and load a file', async () => {
    const content = 'test content'
    await saveFile('/tmp/test.md', content)
    const loaded = await loadFile('/tmp/test.md')
    expect(loaded).toBe(content)
  })
})
```

### Mocking

Mock external dependencies:

```javascript
import { vi } from 'vitest'

vi.mock('fs-extra', () => ({
  readFile: vi.fn().mockResolvedValue('mocked content'),
  writeFile: vi.fn().mockResolvedValue()
}))
```

## Coverage Goals

| Area | Target Coverage | Priority |
|------|----------------|----------|
| Utilities (src/common) | 90% | High |
| Main Process | 70% | High |
| Preload Scripts | 80% | High |
| Renderer Utils | 80% | High |
| Vue Components | 60% | Medium |
| Overall Project | 60% | High |

## Security Testing Priorities

1. **Input Validation**
   - Test all user input sanitization
   - Test file path validation

2. **XSS Prevention**
   - Test markdown rendering with malicious input
   - Test HTML sanitization

3. **IPC Security**
   - Test IPC message validation
   - Test unauthorized access attempts

4. **File System Security**
   - Test path traversal prevention
   - Test file permission checks

## CI/CD Integration (Future)

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Build Environment Issue

**Current Issue**: Native module (`native-keymap`) compilation fails due to missing system libraries.

**Error**: `Package 'xkbfile', required by 'virtual:world', not found`

**Solution**: Install required system libraries or use a different build environment:
```bash
# On Ubuntu/Debian
apt-get install libx11-dev libxkbfile-dev

# On macOS
brew install libxkbfile

# Or use a proper development container with all dependencies
```

**Workaround**: Test infrastructure is ready; install Vitest once build environment is fixed.

## Verification Checklist

After installing Vitest:

- [ ] `npm test` runs successfully
- [ ] Example test passes
- [ ] Coverage report generates
- [ ] Test watch mode works
- [ ] UI mode launches (optional)

## Support and Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Best Practices](https://testingjavascript.com/)
- `tests/README.md` - Testing guidelines for contributors
