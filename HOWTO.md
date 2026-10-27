# PlaytestPilot v0.1 — How to use it (rough draft)

PlaytestPilot plays a web game automatically and reports crashes, console errors and frozen screens. Not linked from LeonLink until polished.

## 1. Quick test in the browser
1. Open https://playtestpilot.vercel.app
2. Paste a game URL (e.g. https://joustline-alpha.vercel.app).
3. Start the run. The page loads the game and sends random inputs for about 20 seconds.
4. Watch the game frame for freezes or errors.

Note: some games block being shown inside another page. If the frame stays blank, use the bot (step 2).

## 2. Headless bot via GitHub Actions
1. Go to https://github.com/leonptucker3886-lab/playtestpilot/actions
2. Pick the **PlaytestPilot** workflow and click **Run workflow**.
3. It installs headless Chromium and runs `bot/playtest.mjs` against the game for 30 seconds.
4. Open the run log for the PASS / FAIL result and any errors found.

### Choosing the game
- Default target: https://joustline-alpha.vercel.app
- To test another game: Settings > Secrets and variables > Actions > Variables, add `GAME_URL` with the game's address.

## 3. Run locally
```
npm i playwright
npx playwright install chromium
node bot/playtest.mjs <game-url> <seconds>
```

## Roadmap
- Phase 2: run on every game, tune detection, auto-file bug reports as GitHub issues.
- Later: run on every push, move to a leonlink.net subdomain once DNS exists.
