// PlaytestPilot bot (rough draft). Usage: node bot/playtest.mjs <url> [seconds]
import { chromium } from 'playwright';
const url = process.argv[2]; const secs = +(process.argv[3] || 30);
const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','KeyZ','KeyX'];
const report = { url, errors: [], crashed: false, frozen: false, inputs: 0 };
const browser = await chromium.launch(); const page = await browser.newPage();
page.on('pageerror', e => report.errors.push(String(e)));
page.on('console', m => m.type() === 'error' && report.errors.push(m.text()));
page.on('crash', () => report.crashed = true);
await page.goto(url, { waitUntil: 'load' }); await page.mouse.click(400, 300);
let last = null, same = 0;
for (let t = 0; t < secs * 4; t++) {
  await page.keyboard.press(keys[Math.floor(Math.random() * keys.length)]); report.inputs++;
  await page.mouse.click(Math.random() * 800, Math.random() * 600);
  if (t % 20 === 0) { const shot = (await page.screenshot()).toString('base64');
    same = shot === last ? same + 1 : 0; last = shot; if (same >= 3) report.frozen = true; }
  await page.waitForTimeout(250);
}
await page.screenshot({ path: 'playtest-final.png' }); await browser.close();
report.pass = !report.crashed && !report.frozen && report.errors.length === 0;
console.log(JSON.stringify(report, null, 2)); process.exit(report.pass ? 0 : 1);
