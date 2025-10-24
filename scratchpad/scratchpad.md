# Scratchpad

## Branching Strategy

**Personal Fork Setup:**
- **Individual feature/fix branches** - Each submitted as a separate PR to upstream (Tkaixiang/marktext)
  - `fix/null-pointer-header-normalization` → PR #32
  - `fix/no-auto-format-on-open` → PR #25
  - `fix/subdirectory-rendering` → PR #33
  - `feature/open-last-folder` → PR #34
  - `fix/macos-native-module-compilation` → PR #24

- **`dev-combined` branch** - Personal daily-driver version
  - Merges ALL feature/fix branches together
  - Contains all improvements in one place for personal use
  - **Never submit as a PR** - this is your combined features branch
  - Update by merging in new feature branches or rebasing on trunk

**Workflow:**
1. Create individual feature branches for each fix/feature
2. Submit each as a separate PR to upstream
3. Merge all feature branches into `dev-combined` for daily use
4. When PRs are accepted upstream, sync trunk and rebuild `dev-combined`

---

## Windows Build Troubleshooting

**Subject: Building MarkText Windows Installer - Native Module Compilation Issues**

I'm working on building Windows x64 installers for MarkText (an Electron 38 app) and hitting native module compilation errors.

**Project Context:**
- MarkText v0.18.5
- Electron 38.4.0
- Uses native modules: `native-keymap`, `ced`, `keytar`
- Built with electron-builder
- Has `npmRebuild: true` in electron-builder.yml

**What Works:**
- ✅ macOS x64 and ARM64 builds work perfectly (using patch-package to add C++20 flags to native-keymap)
- ✅ Cross-compiling Windows from macOS with `npmRebuild: false` creates installers, but they fail at runtime

**The Problem:**

When building Windows installers on my Windows machine (Windows 11, Visual Studio 2022 Community), `npm install` fails during native-keymap compilation:

```
error MSB8040: Spectre-mitigated libraries are required for this project.
Install them from the Visual Studio installer (Individual components tab)
```

**What I've Tried:**
1. ✅ Installed Visual Studio 2022 with "Desktop development with C++" workload
2. ❌ Tried installing Spectre-mitigated libraries via VS Installer - doesn't seem to actually install
3. ❌ Tried creating `.npmrc` with `msvs_version=2022` - still requires Spectre
4. ❌ Tried patching `native-keymap` binding.gyp to add `'SpectreMitigation': 'false'` - still fails
5. ❌ Building from macOS with `npmRebuild: false` creates installer, but fails at runtime with "ced.node is not a valid Win32 application" (because it packages macOS native modules)

**Current Setup:**
- Windows machine: Windows 11 with VS 2022 Community
- Node.js v20.18.0
- The project uses `patch-package` with this patch for macOS:
  - `patches/native-keymap+3.3.5.patch` (adds C++20 xcode_settings for macOS)

**What I Need:**
A working approach to build Windows x64 installers on Windows that:
1. Either bypasses the Spectre requirement completely
2. Or properly installs Spectre libraries
3. Or uses a different build approach that avoids native module recompilation

The Windows installer must have properly compiled Windows native modules (not macOS ones).

**Files:**
- `electron-builder.yml` has `npmRebuild: true`
- `package.json` has `postinstall: "patch-package"`
- `patches/native-keymap+3.3.5.patch` currently only patches macOS build

How can I get Windows native modules to compile successfully?

---

## Context from Today's Session

**Completed Work:**
- ✅ Updated PR #24 with missing `patch-package` devDependency
- ✅ Built working macOS x64 and ARM64 installers from Mac (11:50-11:55 AM)
- ✅ Built Windows installer from Mac (12:36 PM) but it has wrong architecture native modules
- ✅ Added comprehensive build documentation to CLAUDE.md

**Current Branch:** `fix/macos-native-module-compilation`

**Build Status:**
- macOS Intel (x64): ✅ Working - `dist/marktext-mac-x64-0.18.5.dmg` (154M)
- macOS ARM64 (M4): ✅ Working - `dist/marktext-mac-arm64-0.18.5.dmg` (148M)
- Windows x64: ❌ Built but has wrong native modules - runtime error "ced.node is not a valid Win32 application"

**The Issue:**
When building Windows from macOS with `npmRebuild: false`, it packages macOS-compiled native binaries into the Windows installer. These fail at runtime on Windows.

Need to successfully build on Windows machine, but hitting Spectre mitigation library requirements during native module compilation.

---

## CURRENT TASK: Testing Windows Spectre Fix (2025-10-24)

**Status:** Created test branch with Windows Spectre mitigation fix, needs testing on Windows machine.

**What Was Done on Mac:**
1. ✅ Identified root cause: `native-keymap` binding.gyp line 10 has `'SpectreMitigation': 'Spectre'`
2. ✅ Updated patch to change it to `'SpectreMitigation': 'false'`
3. ✅ Created test branch: `test/windows-spectre-fix`
4. ✅ Committed and pushed updated patch file
5. ⏳ Needs testing on Windows

**The Fix:**
Updated `patches/native-keymap+3.3.5.patch` to include TWO fixes:
- Line 10 in binding.gyp: Changed `'SpectreMitigation': 'Spectre'` → `'SpectreMitigation': 'false'` (Windows fix)
- Lines 65-69: Added C++20 xcode_settings for macOS (existing fix)

**Problem Found During Initial Test:**
`npm install` tries to compile native modules BEFORE `patch-package` runs in postinstall, so the patch never gets applied.

---

## COMMANDS TO RUN ON WINDOWS (PowerShell)

**Step 1: Fetch and checkout test branch**
```powershell
cd C:\git\marktext
git fetch origin
git checkout test/windows-spectre-fix
```

**Step 2: Install dependencies WITHOUT building native modules**
```powershell
# This prevents native modules from compiling before patch is applied
npm install --ignore-scripts
```

**Step 3: Apply the patch**
```powershell
npx patch-package
```

**Step 4: Verify the patch was applied**
```powershell
# This should show: 'SpectreMitigation': 'false'
Get-Content node_modules/native-keymap/binding.gyp | Select-String -Pattern "SpectreMitigation"
```

**Expected output:**
```
        'SpectreMitigation': 'false'
```

**Step 5: Rebuild native modules with patched code**
```powershell
npm rebuild
```

**Step 6: If rebuild succeeds, test the build**
```powershell
npm run build
npm run build:win
```

---

## SUCCESS CRITERIA

✅ **Success indicators:**
- `npm rebuild` completes WITHOUT MSB8040 Spectre error
- `native-keymap`, `ced`, and `keytar` all compile successfully
- `npm run build:win` creates installers in `dist/`
- Windows app launches and runs correctly

❌ **Failure indicators:**
- Still getting MSB8040 Spectre error
- Different compilation errors
- App crashes at runtime

---

## NEXT STEPS BASED ON RESULTS

**If it works:**
1. Merge `test/windows-spectre-fix` → `fix/macos-native-module-compilation`
2. Update PR #24 title/description to cover both macOS and Windows fixes
3. Test building on both Mac and Windows to ensure both platforms still work
4. Update CLAUDE.md with Windows build instructions

**If it doesn't work:**
1. Report exact error messages
2. Check if patch was actually applied (step 4 above)
3. Try alternative approaches:
   - Modify binding.gyp to also disable other MSVC security features
   - Investigate if other native modules (ced, keytar) also need patches
   - Consider using prebuilt binaries instead of compiling

**Branch Management:**
- Current branch: `test/windows-spectre-fix` (testing)
- Original branch: `fix/macos-native-module-compilation` (PR #24)
- If successful, merge test branch into original branch

---

## TEST RESULTS (2025-10-24 17:30 UTC)

### ✅ SPECTRE FIX: **SUCCESS!**

**What We Did:**
1. Cleaned node_modules and package-lock.json
2. Ran `npm install --ignore-scripts` (installed packages without building native modules)
3. Ran `npx patch-package` (applied the SpectreMitigation patch)
4. Verified patch was applied: `'SpectreMitigation': 'false'` ✓
5. Ran `npm rebuild` → **Rebuilt dependencies successfully WITHOUT MSB8040 Spectre error!**

**Result:** The Spectre mitigation bypass patch **works perfectly**. Native modules (native-keymap, ced, keytar) all compiled successfully on Windows without requiring Spectre-mitigated libraries.

### ❌ SECONDARY ISSUE: electron-vite ESM/CommonJS Error

**Problem:** After successful native module compilation, attempting to run `npm run dev` or `npm run build` fails with:
```
Error [ERR_REQUIRE_ESM]: require() of ES Module C:\git\marktext\node_modules\electron-vite\dist\index.js from C:\git\marktext\electron.vite.config.js not supported.
```

**Root Cause:** electron-vite v4.0.1 requires Node.js ^20.19.0 or >=22.12.0, but Windows machine is running Node.js v20.18.0 (just one minor version behind).

**Solution Required:** Upgrade Node.js to v20.19.0 or higher on Windows machine.

### NEXT STEPS

**Option 1: Upgrade Node.js (Recommended)**
- Download Node.js 20.19.0 or newer from https://nodejs.org/
- Reinstall and test the build

**Option 2: Downgrade electron-vite**
- Modify package.json to use an older electron-vite version compatible with Node 20.18.0
- Test if this resolves the ESM issue

**After Resolving Node.js Issue:**
1. Test full Windows build with `npm run build:win`
2. Verify the installer works and runs correctly
3. Merge `test/windows-spectre-fix` → `fix/macos-native-module-compilation`
4. Update PR #24 to cover both platforms

---

## FINAL SUCCESS! (2025-10-24 18:27 UTC)

### 🎉 COMPLETE WINDOWS BUILD SUCCESS!

**Node.js Upgrade:**
- Upgraded from v20.18.0 → **v20.19.5**

**Build Results:**
```bash
npm install --ignore-scripts && npx patch-package && npm rebuild
npm run build:win
```

✅ **All native modules compiled successfully** (no Spectre errors!)
✅ **Dev server runs perfectly** (electron-vite ESM issue resolved)
✅ **Full production build completed**
✅ **Windows installer created:** `dist/marktext-win-x64-0.18.5-setup.exe` (123.5 MB)

**What Worked:**
1. Spectre mitigation bypass patch (`'SpectreMitigation': 'false'`) ✓
2. Node.js v20.19.5 (satisfies electron-vite v4.0.1 requirements) ✓
3. Proper installation sequence:
   - `npm install --ignore-scripts` (prevent early compilation)
   - `npx patch-package` (apply patches)
   - `npm rebuild` (compile with patched code)

### READY FOR NEXT STEPS:

1. ✅ **Test the installer** - Run `dist/marktext-win-x64-0.18.5-setup.exe` to verify it installs and launches correctly
2. **Merge branches** - Merge `test/windows-spectre-fix` → `fix/macos-native-module-compilation`
3. **Update PR #24** - Expand title/description to cover both macOS and Windows native module fixes
4. **Document requirements** - Update build docs to specify Node.js ≥20.19.0 requirement
