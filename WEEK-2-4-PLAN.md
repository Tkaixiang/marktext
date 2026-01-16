# Week 2-4 Implementation Plan

**Dates**: 2026-01-15 onwards
**Status**: 🚀 In Progress
**Focus**: Testing & Code Quality (Target: 40% Coverage)

---

## Overview

Building on Week 1's critical security fixes, Week 2-4 focuses on establishing a robust testing foundation and improving code quality across the MarkText project.

### Success Criteria
- ✅ 40%+ overall test coverage
- ✅ 90%+ coverage for critical utilities
- ✅ Pre-commit hooks configured
- ✅ Stricter ESLint rules for production
- ✅ All critical paths tested

---

## Week 2 Priorities (Days 1-7)

### Day 1-2: Core Utility Tests (HIGH PRIORITY)

**Target: src/common/filesystem/**

- [ ] **paths.js** (90% coverage target)
  - [ ] hasMarkdownExtension()
  - [ ] isImageFile()
  - [ ] isChildOfDirectory()
  - [ ] isSamePathSync()
  - [ ] All path validation functions

- [ ] **filesystem index** (80% coverage target)
  - [ ] isFile()
  - [ ] isDirectory()
  - [ ] ensureDirSync()
  - [ ] File existence checks

- [ ] **Additional filesystem utilities** (70% coverage)
  - [ ] File reading/writing helpers
  - [ ] Directory operations
  - [ ] Permission checks

**Estimated Time**: 8-12 hours

### Day 3-4: Preload & IPC Tests (HIGH PRIORITY)

**Target: src/preload/**

- [ ] **Preload API exposure** (80% coverage target)
  - [ ] contextBridge API validation
  - [ ] File utils API tests
  - [ ] Crypto API tests
  - [ ] Process API tests
  - [ ] Command existence checks

**Target: IPC Communication**

- [ ] **IPC handler tests** (70% coverage)
  - [ ] Window management IPC
  - [ ] File operation IPC
  - [ ] Preference sync IPC
  - [ ] Watcher IPC

**Estimated Time**: 10-14 hours

### Day 5-6: Integration Tests (MEDIUM PRIORITY)

- [ ] **File Operations Integration**
  - [ ] Open file workflow
  - [ ] Save file workflow
  - [ ] File watching
  - [ ] Import/Export

- [ ] **Editor Integration**
  - [ ] Editor initialization
  - [ ] Tab management
  - [ ] Content rendering

**Estimated Time**: 8-12 hours

### Day 7: Code Quality Tools (HIGH PRIORITY)

- [ ] **Pre-commit Hooks**
  - [ ] Install and configure husky
  - [ ] Set up lint-staged
  - [ ] Configure pre-commit tests
  - [ ] Add commit message linting

- [ ] **ESLint Enhancement**
  - [ ] Add no-console for production
  - [ ] Add security rules
  - [ ] Configure import ordering
  - [ ] Add complexity limits

**Estimated Time**: 4-6 hours

**Week 2 Total Estimate**: 30-44 hours

---

## Week 3 Priorities (Days 8-14)

### More Integration Tests
- [ ] Preferences system tests
- [ ] Menu action tests
- [ ] Window state management
- [ ] Theme switching

### Renderer Component Tests
- [ ] Critical Vue component tests
- [ ] Store/Pinia tests
- [ ] Router tests

### Coverage Improvement
- [ ] Identify coverage gaps
- [ ] Write tests for uncovered critical paths
- [ ] Refactor for testability

**Week 3 Target**: Reach 35% overall coverage

---

## Week 4 Priorities (Days 15-21)

### Additional Test Types
- [ ] E2E test framework evaluation
- [ ] Performance benchmarks
- [ ] Security-focused tests

### Documentation
- [ ] Update testing documentation
- [ ] Create contribution guide
- [ ] Document test patterns

### Coverage Push
- [ ] Final push to 40%+ coverage
- [ ] Document remaining gaps
- [ ] Prioritize future test work

**Week 4 Target**: Reach 40%+ overall coverage

---

## Testing Strategy

### Test Pyramid

```
    /\
   /E2\    E2E Tests (10%)
  /----\
 /Integ\   Integration Tests (30%)
/-------\
/ Unit  /   Unit Tests (60%)
--------
```

### Coverage Targets by Area

| Area | Target | Priority | Week |
|------|--------|----------|------|
| src/common/filesystem/paths.js | 90% | Critical | 2 |
| src/common/filesystem/*.js | 80% | Critical | 2 |
| src/preload/index.js | 80% | Critical | 2 |
| IPC handlers (main) | 70% | High | 2 |
| File operations integration | 70% | High | 2-3 |
| Renderer utilities | 70% | High | 3 |
| Vue components | 50% | Medium | 3-4 |
| Store/Pinia | 60% | Medium | 3 |
| Overall Project | 40%+ | High | 4 |

---

## Test Categories

### 1. Unit Tests (Days 1-2, 8-10)

**What**: Individual functions in isolation

**Examples**:
- Path validation functions
- String utilities
- Data transformations
- Pure business logic

**Tools**: Vitest, vi.mock()

### 2. Integration Tests (Days 3-4, 11-13)

**What**: Multiple modules working together

**Examples**:
- IPC message flow
- File save → disk → load
- Preference changes → UI update
- Menu action → editor change

**Tools**: Vitest, mocking

### 3. E2E Tests (Week 4+)

**What**: Full application workflows

**Examples**:
- Launch app → create file → edit → save → exit
- Open existing file → search → replace → save
- Import markdown → export PDF

**Tools**: Playwright (future)

---

## Code Quality Improvements

### Pre-commit Hooks (Day 7)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### ESLint Rules (Day 7)

Add to eslint.config.js:
```javascript
{
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'complexity': ['warn', 15],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true }]
  }
}
```

---

## Daily Checklist Template

### Each Day:
- [ ] Write tests (minimum 3-5 new test files)
- [ ] Run tests: `npm test`
- [ ] Check coverage: `npm run test:coverage`
- [ ] Fix any failing tests
- [ ] Commit progress
- [ ] Update this document

### Each Week:
- [ ] Measure overall coverage
- [ ] Review and refactor tests
- [ ] Update documentation
- [ ] Plan next week
- [ ] Push to remote

---

## Progress Tracking

### Week 2 Progress

**Day 1**: ⏳ In Progress
- [ ] Core path utilities tests
- [ ] File system tests
- [ ] Coverage: _%

**Day 2**: ⏳ Pending
- [ ] Complete filesystem tests
- [ ] Start preload tests
- [ ] Coverage: _%

**Day 3**: ⏳ Pending
- [ ] Preload API tests
- [ ] IPC handler tests
- [ ] Coverage: _%

**Day 4**: ⏳ Pending
- [ ] Complete IPC tests
- [ ] Start integration tests
- [ ] Coverage: _%

**Day 5**: ⏳ Pending
- [ ] File operations integration
- [ ] Editor integration
- [ ] Coverage: _%

**Day 6**: ⏳ Pending
- [ ] Complete integration tests
- [ ] Refactor as needed
- [ ] Coverage: _%

**Day 7**: ⏳ Pending
- [ ] Pre-commit hooks
- [ ] ESLint enhancement
- [ ] Coverage: _%

---

## Success Metrics

### Quantitative
- Test coverage: 40%+ overall
- Unit tests: 100+ test cases
- Integration tests: 30+ test cases
- Zero failing tests
- ESLint errors: 0
- ESLint warnings: <50

### Qualitative
- All critical paths tested
- Tests are maintainable
- Tests are fast (<30s total)
- Good test documentation
- Team can easily add tests

---

## Risk Management

### Identified Risks

1. **Build environment issues** (MEDIUM)
   - **Mitigation**: Use existing node_modules
   - **Fallback**: Manual testing

2. **Time estimates too optimistic** (MEDIUM)
   - **Mitigation**: Focus on critical paths first
   - **Fallback**: Extend to Week 4

3. **Tests break existing functionality** (LOW)
   - **Mitigation**: Run app after each major change
   - **Fallback**: Revert and refactor

4. **Coverage tool issues** (LOW)
   - **Mitigation**: Manual code review
   - **Fallback**: Focus on critical paths

---

## Resources & References

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

### Internal Docs
- `TESTING-SETUP.md` - Setup instructions
- `tests/README.md` - Testing guidelines
- `SECURITY-ANALYSIS.md` - Security considerations

---

## Notes & Learnings

### Week 2 Notes
- [To be added as we progress]

### Challenges Encountered
- [To be documented]

### Solutions & Workarounds
- [To be documented]

---

**Status**: 📝 Ready to start Week 2 implementation
**Next Action**: Write core utility tests (paths.js, filesystem)
**Updated**: 2026-01-15
