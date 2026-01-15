# Testing Issues - MarkText

## Critical Finding: No Test Infrastructure

**Status**: CRITICAL - No automated testing exists

**Current State**:
- No test framework configured
- No test files present
- No CI/CD pipeline for testing
- 0% code coverage

**Impact**:
- High risk of regressions when refactoring
- Difficult to verify bug fixes
- No safety net for security changes
- Challenging to onboard new contributors

---

## Recommended Testing Strategy

### Phase 1: Setup (Week 1)

#### 1. Install Vitest

```bash
npm install -D vitest @vitest/ui happy-dom
```

#### 2. Create `vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: ['node_modules/', 'src/muya/dist/**']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer/src'),
      common: resolve(__dirname, 'src/common'),
      muya: resolve(__dirname, 'src/muya')
    }
  }
})
```

#### 3. Add Test Scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### Phase 2: Unit Tests (Weeks 2-4)

#### Priority Test Areas:

1. **Utility Functions** (Highest Priority)
   - File path manipulation
   - Markdown parsing helpers
   - String utilities
   - Date formatting
   - Validation functions

2. **Store/State Management**
   - Pinia store actions
   - State mutations
   - Getters

3. **Vue Components** (Composables)
   - Component composition functions
   - Custom hooks
   - Computed properties

#### Example Test Structure:

```
tests/
├── unit/
│   ├── common/
│   │   ├── utils.test.js
│   │   └── validators.test.js
│   ├── stores/
│   │   ├── editor.test.js
│   │   └── preferences.test.js
│   └── components/
│       └── composables.test.js
├── integration/
│   └── ipc/
│       └── file-operations.test.js
└── e2e/
    ├── editor.spec.js
    └── menu.spec.js
```

---

### Phase 3: Integration Tests (Weeks 5-6)

#### Test IPC Communication:

```javascript
// tests/integration/ipc/file-operations.test.js
import { test, expect } from 'vitest'

test('should read file via IPC', async () => {
  // Mock IPC call
  const result = await window.electron.ipcRenderer.invoke('read-file', '/path/to/file.md')
  expect(result).toBeDefined()
})
```

---

### Phase 4: E2E Tests (Weeks 7-8)

#### Install Playwright for Electron:

```bash
npm install -D playwright @playwright/test
```

#### Example E2E Test:

```javascript
// e2e/editor.spec.js
import { test, expect } from '@playwright/test'
import { _electron as electron } from 'playwright'

test('should open and edit markdown file', async () => {
  const app = await electron.launch({ args: ['.'] })
  const window = await app.firstWindow()
  
  // Test file opening
  await window.click('[data-testid="open-file"]')
  // ... more interactions
  
  await app.close()
})
```

---

## Coverage Targets

### Milestones:

- **Week 4**: 40% code coverage (utilities + stores)
- **Week 8**: 60% code coverage (+ components)
- **Week 12**: 75% code coverage (+ E2E)

### Focus Areas:

1. **Critical Paths** (Must have 80%+ coverage):
   - File I/O operations
   - IPC handlers
   - Data serialization
   - Security-related code

2. **Important Features** (Target 60%+ coverage):
   - Editor state management
   - Markdown rendering
   - Theme switching
   - Settings management

3. **Nice to Have** (Target 40%+ coverage):
   - UI components
   - Styling logic
   - Animations

---

## Testing Best Practices

### Do's ✓
- Test behavior, not implementation
- Mock external dependencies (fs, IPC)
- Use descriptive test names
- Test edge cases and error conditions
- Keep tests fast and isolated
- Use test fixtures for complex data

### Don'ts ✗
- Don't test third-party libraries
- Don't test generated code
- Don't make tests depend on each other
- Don't skip error cases
- Don't test UI styling details

---

## CI/CD Integration

### GitHub Actions Workflow:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Effort Estimate

- **Setup & Configuration**: 4-8 hours
- **Writing Unit Tests (40% coverage)**: 40-60 hours
- **Integration Tests**: 16-24 hours
- **E2E Tests**: 24-32 hours
- **CI/CD Setup**: 4-8 hours

**Total**: ~88-132 hours (2.5-3.5 weeks)

---

## Success Criteria

- [ ] Vitest configured and running
- [ ] Test script in package.json
- [ ] At least 40% code coverage
- [ ] All critical paths tested
- [ ] CI/CD pipeline running tests
- [ ] Coverage reports generated
- [ ] Documentation for running tests
