// PlaytestPilot bot v0.2. Usage: node bot/playtest.mjs <url> [seconds] [seed]
// Plays a web game with seeded random input in headless Chromium, then writes
// playtest-report.json and playtest-final.png. Exit 0 = pass, 1 = fail, 2 = bad usage.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) { console.error('Usage: node bot/playtest.mjs <https://game-url> [seconds] [seed]'); process.exit(2); }
const secs = Math.max(5, +(process.argv[3] || 30));
const seed = +(process.argv[4] || Date.now() % 100000);
let s = seed; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); // reproducible runs
const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','KeyZ','KeyX','KeyW','KeyA','KeyS','KeyD'];
const IGNORE = [/favicon\.ico/i, /Failed to load resource.*404/i]; // noise, not game bugs
const report = { version: '0.2.0', url, seed, seconds: secs, startedAt: new Date().toISOString(),
  loaded: false, loadMs: null, errors: [], warnings: 0, crashed: false, frozen: false, frozenChecks: 0, inputs: 0 };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
const addErr = (m) => { if (!IGNORE.some(r => r.test(m)) && !report.errors.includes(m)) report.errors.push(m); };
page.on('pageerror', e => addErr('pageerror: ' + String(e)));
page.on('console', m => { if (m.type() === 'error') addErr('console: ' + m.text()); if (m.type() === 'warning') report.warnings++; });
page.on('crash', () => { report.crashed = true; });
try {
  const t0 = Date.now();
  const res = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  report.loadMs = Date.now() - t0; report.httpStatus = res ? res.status() : null;
  report.loaded = !!res && res.ok();
} catch (e) { addErr('load: ' + String(e)); }
if (report.loaded) {
  await page.mouse.click(400, 300); // focus the game
  let last = null, same = 0;
  for (let t = 0; t < secs * 4 && !report.crashed; t++) {
    const k = keys[Math.floor(rnd() * keys.length)];
    await page.keyboard.down(k); await page.waitForTimeout(80 + Math.floor(rnd() * 120)); await page.keyboard.up(k);
    report.inputs++;
    if (t % 8 === 0) await page.mouse.click(Math.floor(rnd() * 800), Math.floor(rnd() * 600));
    if (t % 20 === 19) { // frozen = identical frames across 4 checks (~20s) despite input
      const shot = (await page.screenshot()).toString('base64'); report.frozenChecks++;
      same = shot === last ? same + 1 : 0; last = shot; if (same >= 3) report.frozen = true;
    }
    await page.waitForTimeout(50);
  }
  try { await page.screenshot({ path: 'playtest-final.png' }); } catch {}
}
await browser.close();
report.finishedAt = new Date().toISOString();
report.pass = report.loaded && !report.crashed && !report.frozen && report.errors.length === 0;
report.summary = report.pass ? `PASS: ${report.inputs} inputs, no errors, no crash, no freeze.`
  : 'FAIL: ' + [!report.loaded && 'page did not load', report.crashed && 'tab crashed', report.frozen && 'screen froze',
    report.errors.length && report.errors.length + ' error(s)'].filter(Boolean).join(', ') + '.';
writeFileSync('playtest-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);
