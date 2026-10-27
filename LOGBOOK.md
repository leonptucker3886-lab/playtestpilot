# PlaytestPilot Logbook

## v0.1, rough draft (2026-10-27)
- Created the repo, the landing page, the headless bot (`bot/playtest.mjs`) and a manual GitHub Action.
- Deployed to https://playtestpilot.vercel.app and added playtestpilot.leonlink.net in Vercel (it needs a CNAME record).
- Posted the PDF guide and HOWTO.md.

## Self-review of v0.1: what was wrong
1. **The page made a false claim.** It said the bot "runs on every push". The Action was manual only.
2. **The in-browser PASS meant almost nothing.** Browsers block cross-origin key events, so no inputs ever reached the game. PASS only meant the page loaded.
3. **There was no way to repeat a bug.** Inputs were random, with no seed.
4. **Key taps were too short.** Single `press` taps are too quick for games that check whether a key is held each frame.
5. **The report wasn't saved.** It was printed to the log only, with no artifact and no screenshot attached to the run.
6. **Choosing a game was awkward.** It needed a repo variable instead of a field on the run form.
7. **There was no load check or timeout.** A page that failed to load could still "pass", and it reported noise such as favicon 404 errors.

## v0.2: fixes
- The landing page is honest now. With no setup, the result is labelled **LOAD CHECK**, and it explains what it didn't test.
- Added `ptp-sdk.js`, a one-line opt-in script for games. It lets the in-browser tester send keys, collect errors and detect a stopped render loop, even cross-origin.
- The bot uses seeded input (the seed is printed so a run can be repeated), holds keys for 80–200 ms, uses WASD as well as the arrows, has a 30-second load timeout and an HTTP status check, filters noise, removes duplicate errors, and gives a one-line summary.
- The bot writes `playtest-report.json` and `playtest-final.png`. The Action uploads both and puts PASS or FAIL in the run summary.
- The Action has run-form fields for the game URL, the seconds to play and the seed.
- Rewrote HOWTO.md to match.

## Still not verified
- No end-to-end run on joustline yet. My sandbox has no browser. The first real check is a manual Action run.
