# PlaytestPilot v0.2 (beta): How to use it

PlaytestPilot plays a web game automatically and reports crashes, errors and frozen screens. It is not linked from LeonLink until it's polished.

## 1. Quick test in the browser
1. Open https://playtestpilot.vercel.app
2. Paste a game URL, such as https://joustline-alpha.vercel.app, and press **Run playtest**.
3. With no setup, this is a **load check** only. It confirms the page loads, can be embedded and stays up for 20 seconds.
4. For real inputs and error capture, add this line to the game's HTML, then run it again:
   `<script src="https://playtestpilot.vercel.app/ptp-sdk.js"></script>`
   The log will say "SDK connected". You get PASS or FAIL based on errors, a frozen screen, or the game no longer responding.

If the frame stays blank, the game blocks embedding. Use the bot in step 2.

## 2. Full bot with GitHub Actions
1. Go to https://github.com/leonptucker3886-lab/playtestpilot/actions
2. Choose **PlaytestPilot**, then **Run workflow**.
3. Enter the game URL, how many seconds to play (30 by default) and, optionally, a seed.
4. The run summary shows PASS or FAIL. Download **playtest-report** for the full JSON report and the final screenshot.
5. To repeat a failing run exactly, run it again with the seed shown in the summary.

## 3. Run it on your own computer
```
npm i playwright && npx playwright install chromium
node bot/playtest.mjs <game-url> [seconds] [seed]
```
Exit code 0 means pass, 1 means fail, 2 means the command was wrong.

## What counts as a fail
- The page didn't load (it timed out or returned an HTTP error)
- The browser tab crashed
- A JavaScript error or console error (missing favicon errors are ignored)
- The screen didn't change for about 20 seconds while the bot was pressing keys

## Known limits
- A game whose title screen doesn't move until you click may be flagged as frozen.
- The in-browser test can't press keys in games that don't include ptp-sdk.js.

See LOGBOOK.md for the change history.
