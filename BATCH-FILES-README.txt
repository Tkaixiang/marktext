=====================================
MarkText Windows Batch Files Guide
=====================================

Choose the right batch file for your needs:

-------------------------------------
1. setup-and-run.bat
-------------------------------------
USE THIS FIRST TIME! ⭐

What it does:
- Checks Node.js and npm
- Installs all dependencies
- Verifies everything is working
- Starts MarkText developer mode

When to use:
- First time running MarkText
- After getting new code
- When something is broken
- If you deleted node_modules

Time: 2-5 minutes first run

-------------------------------------
2. start-dev.bat
-------------------------------------
Standard startup script

What it does:
- Quick checks
- Installs deps if needed
- Starts developer mode

When to use:
- Regular development
- Daily work

Time: 5-10 seconds

-------------------------------------
3. quick-start.bat
-------------------------------------
Fastest option (after initial setup)

What it does:
- Minimal checks
- Starts immediately

When to use:
- After first setup
- When you know deps are installed
- For quick testing

Time: 2-3 seconds

-------------------------------------
QUICK START GUIDE
-------------------------------------

FIRST TIME:
1. Double-click: setup-and-run.bat
2. Wait for installation (2-5 minutes)
3. MarkText window opens!

EVERY OTHER TIME:
1. Double-click: quick-start.bat
2. MarkText opens in 2-3 seconds!

IF SOMETHING BREAKS:
1. Delete the "node_modules" folder
2. Run: setup-and-run.bat
3. Problem solved!

-------------------------------------
TROUBLESHOOTING
-------------------------------------

Problem: "Node.js is not installed"
Solution: Install Node.js 20.x from https://nodejs.org/

Problem: Install fails
Solution: Run setup-and-run.bat as Administrator
         (Right-click → Run as administrator)

Problem: Window doesn't open
Solution: Check if port 5173 is free
         Or restart your computer

Problem: Slow installation
Solution: Normal! Takes 2-5 minutes first time
         Temporarily disable antivirus for faster install

-------------------------------------
WHAT YOU'LL SEE
-------------------------------------

When you run setup-and-run.bat:

[Step 1/6] Checking Node.js...
[Step 2/6] Checking npm...
[Step 3/6] Dependency Check...
[Step 4/6] Installing dependencies...
[Step 5/6] Verifying critical dependencies...
[Step 6/6] Starting Developer Mode...

Starting MarkText Development Server
The application window will open shortly.

Tips:
  - Press Ctrl+C to stop the server
  - Changes to code will auto-reload

[Then MarkText window opens!]

-------------------------------------
TIPS
-------------------------------------

✓ Use setup-and-run.bat first time
✓ Use quick-start.bat after that
✓ Press Ctrl+C to stop server
✓ F12 opens developer tools
✓ Changes auto-reload (save and watch!)
✓ Keep terminal open while using app

-------------------------------------
NEED MORE HELP?
-------------------------------------

Read: WINDOWS-SETUP.md (detailed guide)

Quick help:
1. Make sure Node.js 20.x is installed
2. Run setup-and-run.bat as Administrator
3. Wait for it to finish
4. Enjoy MarkText!

=====================================
Happy Coding! 🚀
=====================================
