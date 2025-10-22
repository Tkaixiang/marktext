# MarkText Build Optimization Plan

## Prompt to Begin Implementation

```
I need to optimize the MarkText DMG build process. The current builds are:
- DMG size: 148MB (arm64) / 155MB (x64) - target is ~100-120MB
- Build time: painfully slow
- Unpacked app: 419MB - target is ~280-330MB

Please implement the optimization plan in BUILD_OPTIMIZATION_PLAN.md, starting with Phase 1.
For each phase:
1. Show what you're changing and why
2. Test that the build still works
3. Measure the size savings achieved

After each phase, we should do a test build to verify the changes work correctly.
```

---

## Analysis Summary

### Current State
- **DMG size:** 148MB (arm64) / 155MB (x64)
- **Unpacked app:** 419MB
- **App.asar bundle:** 160MB containing 191MB of node_modules (25,499 files)
- **Electron Framework:** 252MB (standard, not easily reducible)
- **Compiled code:** 22MB

### Key Issues Identified

#### 1. Unused Dependencies Being Bundled (~9-10MB)
- **languine** - Not used anywhere in src/ but pulls in:
  - @trigger.dev/sdk
  - @opentelemetry packages (~8.7MB)
- **Duplicate utility libraries:**
  - lodash (4.9MB) AND lodash-es (2.6MB) both present
- **@babel runtime** (4MB) - appears to be dev dependency leaked into production

#### 2. Unnecessary Files in Bundle (~10-15MB)
- 712 documentation files (README, LICENSE, CHANGELOG)
- 1,178 TypeScript definition/source files (.d.ts, .ts)
- 46 source maps (despite config excluding *.map files - some still getting through)
- 34 test files (.test.js, .spec.js)
- 268 element-plus locale files (2MB total) when only en-US is needed

#### 3. Large Dependencies (Needs Investigation)
- element-plus: 22MB
- mermaid: 11MB
- cytoscape-fcose: 9.1MB
- snapsvg: 4.7MB
- jsdom: 4.2MB
- prismjs: 3.4MB
- katex: 3.4MB

#### 4. Missing Build Optimizations
- No ASAR compression configured (default is enabled but not explicitly set)
- No explicit prune of unnecessary file types beyond basic exclusions
- Element-plus bundling all locales despite `electronLanguages: en-US` setting

---

## Optimization Phases

### Phase 1: Remove Unused Dependencies
**Estimated savings: 15-20MB**
**Estimated time: 30 minutes**

#### Tasks:
1. **Remove languine dependency**
   - Check if actually used: `grep -r "languine" src/`
   - If not used, remove from package.json
   - Run `npm install` to update lock file
   - Saves ~9MB (@trigger.dev + @opentelemetry)

2. **Deduplicate lodash libraries**
   - Check which is being used: `grep -r "from 'lodash'" src/`
   - Keep only one (prefer lodash-es for tree-shaking)
   - Update imports if needed
   - Saves ~4.9MB

3. **Move @babel to devDependencies**
   - Check if @babel runtime is needed in production
   - Move babel packages to devDependencies if possible
   - Saves ~4MB

#### Validation:
- Run `npm run build`
- Test the app launches and basic functionality works
- Check for any missing dependency errors

---

### Phase 2: Enhanced File Exclusions
**Estimated savings: 8-12MB**
**Estimated time: 45 minutes**

#### Tasks:
1. **Add comprehensive file exclusions to electron-builder.yml**

Add to the `files:` section:
```yaml
# TypeScript files (not needed in production)
- '!node_modules/**/*.d.ts'
- '!node_modules/**/*.d.cts'
- '!node_modules/**/*.d.mts'
- '!node_modules/**/src/**/*.ts'

# Test files
- '!node_modules/**/{test,tests,__tests__}/**'
- '!node_modules/**/*.{test,spec}.{js,mjs,cjs}'
- '!node_modules/**/test.js'

# Documentation
- '!node_modules/**/README*'
- '!node_modules/**/CHANGELOG*'
- '!node_modules/**/HISTORY*'
- '!node_modules/**/*.md'
- '!node_modules/**/docs/**'
- '!node_modules/**/examples/**'

# Additional source maps that slip through
- '!node_modules/**/*.map'

# Development configs
- '!node_modules/**/{.eslintrc,.prettierrc}*'
- '!node_modules/**/tsconfig*.json'
```

2. **Exclude element-plus locales except en-US**

Add specific exclusion:
```yaml
# Exclude all element-plus locales except en-US
- '!node_modules/element-plus/dist/locale/*'
- 'node_modules/element-plus/dist/locale/en.{js,mjs,min.js,min.mjs}'
```

3. **Exclude unused babel files**
```yaml
# Babel runtime files if not needed
- '!node_modules/@babel/**/node_modules/**'
```

#### Validation:
- Run `npm run build:mac`
- Extract asar: `npx asar extract dist/mac-arm64/marktext.app/Contents/Resources/app.asar /tmp/test-extract`
- Verify excluded files are gone: `find /tmp/test-extract -name "*.d.ts" | wc -l` (should be 0 or very low)
- Test app functionality, especially UI components (element-plus)

---

### Phase 3: ASAR Compression Configuration
**Estimated savings: 20-30MB**
**Estimated time: 30 minutes**

#### Tasks:
1. **Configure ASAR compression in electron-builder.yml**

Add at root level:
```yaml
asar:
  compression: normal  # Options: normal, maximum, or omit for store-only
```

Note: electron-builder enables asar by default, but we can configure compression level.

2. **Alternative: Try maximum compression**
```yaml
asar:
  compression: maximum
```

This may increase build time but could save 5-10MB more.

#### Validation:
- Build with `normal` compression first
- Measure app.asar size
- Test app launch time (ensure compression doesn't slow it too much)
- If acceptable, try `maximum` and compare

---

### Phase 4: Build Speed Improvements
**Estimated savings: 0MB (time savings only)**
**Estimated time: 20 minutes**

#### Tasks:
1. **Enable electron-builder caching**

Set environment variable or add to package.json scripts:
```json
"build:mac": "npm run minify-locales && npm run build && ELECTRON_BUILDER_CACHE=.cache electron-builder --mac --publish never"
```

2. **Consider separate arch builds during development**
```json
"build:mac:arm64": "npm run minify-locales && npm run build && electron-builder --mac --arm64 --publish never",
"build:mac:x64": "npm run minify-locales && npm run build && electron-builder --mac --x64 --publish never"
```

3. **Optimize minify-locales script** (if it's slow)
- Check scripts/minify-locales.mjs for optimization opportunities

#### Validation:
- Time builds before and after
- Verify cache directory is being used
- Ensure cached builds produce identical output

---

### Phase 5: Advanced Optimizations (Optional)
**Estimated savings: 10-20MB**
**Estimated time: 2-3 hours**

#### Tasks (investigate if needed):

1. **Tree-shake large dependencies**
   - Check if mermaid can use core version only
   - Investigate if jsdom is needed in renderer (usually only in main process)
   - Check if all of cytoscape-fcose is needed

2. **Consider replacing heavy dependencies**
   - snapsvg (4.7MB) - check if a lighter SVG library would work
   - Review if all prismjs languages are needed

3. **Split resources more effectively**
   - Move more resources to `asarUnpack` if they're accessed frequently
   - Or move more INTO asar if currently unpacked unnecessarily

---

## Success Metrics

### Size Targets
- [x] Current DMG: 148MB (arm64) / 155MB (x64)
- [ ] Phase 1 target: ~130-135MB
- [ ] Phase 2 target: ~120-125MB
- [ ] Phase 3 target: ~100-120MB
- [ ] Final target: ~100MB or less

### Build Time Targets
- [ ] Measure current build time (baseline)
- [ ] Phase 4 target: 20-30% faster than baseline

### Quality Checks
- [ ] App launches successfully
- [ ] All markdown features work (mermaid, katex, etc.)
- [ ] UI components render correctly (element-plus)
- [ ] File watching works (chokidar)
- [ ] Auto-update mechanism works
- [ ] All native modules load correctly (keytar, native-keymap, etc.)

---

## Testing Checklist (Run After Each Phase)

```bash
# Build
npm run build:mac

# Check sizes
ls -lh dist/*.dmg
du -sh dist/mac-arm64/marktext.app
du -sh dist/mac-arm64/marktext.app/Contents/Resources/app.asar

# Launch app and test:
# - Open/edit markdown file
# - Test mermaid diagram rendering
# - Test math (katex) rendering
# - Test code highlighting (prismjs)
# - Test preferences/settings
# - Test file watching
# - Check for console errors
```

---

## Notes

- All changes should be tested incrementally
- Keep the original electron-builder.yml backed up
- Document any breaking changes or functionality impacts
- Consider creating a universal DMG instead of separate x64/arm64 if size permits
- The 252MB Electron Framework is standard and cannot be significantly reduced
