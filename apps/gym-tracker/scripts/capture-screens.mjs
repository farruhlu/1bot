/**
 * Optional demo screenshots (requires Playwright):
 *   npx playwright install chromium
 *   node scripts/capture-screens.mjs
 * App must be running: npx expo start --web --port 8081
 */
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Install playwright first: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const outDir = process.env.SCREENSHOT_DIR || '/cursor/stores/self/media/gym-tracker';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: 'ru-RU',
});
const page = await context.newPage();

async function shot(name, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(2500);
  const dest = path.join(outDir, name);
  await page.screenshot({ path: dest, fullPage: false });
  console.log('saved', dest);
}

await shot('01-log.png', 'http://localhost:8081/');
await shot('02-history.png', 'http://localhost:8081/history');
await shot('03-progress.png', 'http://localhost:8081/progress');
await shot('04-exercise-bench.png', 'http://localhost:8081/exercise/ex-bench');

await browser.close();
console.log('done');
