import { chromium } from 'playwright';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '..', 'public', 'demo', 'screenshots');
mkdirSync(screenshotsDir, { recursive: true });

const CLERK_SECRET_KEY = 'sk_test_hkntzOuPnXfByD3N6RtR9pWVZ0sg4v6HHdBE32Ogvl';
const USER_ID = 'user_3DGMEMw37Cp49Q4gbKFDsXzHxkI';
const BASE = 'http://localhost:3000';

async function main() {
  console.log('📸 Capturing FIXA app screenshots...');

  // Get Clerk sign-in token
  const tokenRes = await fetch('https://api.clerk.com/v1/sign_in_tokens', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${CLERK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: USER_ID }),
  });
  const tokenData = await tokenRes.json();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();

  // Warm up + auth
  await page.goto(`${BASE}/inicio`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.goto(`${BASE}/sign-in?__clerk_ticket=${tokenData.token}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);

  const url = page.url();
  if (url.includes('sign-in')) {
    console.log('❌ Auth failed');
    await browser.close();
    return;
  }
  console.log('✅ Authenticated');

  const screens = [
    { path: '/', name: 'dashboard', wait: 3000 },
    { path: '/ordenes', name: 'ordenes', wait: 3000 },
    { path: '/ordenes/nueva', name: 'nueva-orden', wait: 3000 },
    { path: '/clientes', name: 'clientes', wait: 3000 },
    { path: '/calendario', name: 'calendario', wait: 3000 },
    { path: '/configuracion', name: 'configuracion', wait: 3000 },
  ];

  for (const screen of screens) {
    console.log(`  📷 ${screen.name}...`);
    await page.goto(`${BASE}${screen.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(screen.wait);
    await page.screenshot({
      path: join(screenshotsDir, `${screen.name}.png`),
      type: 'png',
    });
  }

  await browser.close();
  console.log(`✅ Screenshots saved to ${screenshotsDir}`);
}

main().catch(console.error);
