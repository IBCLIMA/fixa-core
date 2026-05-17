import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readdirSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const framesDir = join(__dirname, '..', 'public', 'demo', 'frames');
const outputPath = join(__dirname, '..', 'public', 'demo', 'fixa-demo.webm');

// Clean frames dir
try { mkdirSync(framesDir, { recursive: true }); } catch {}
for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));

// Use lower FPS and deviceScaleFactor=1 for reasonable recording time
// The video will be upscaled to 1440x900 by ffmpeg if needed
const FPS = 12;
const FRAME_DELAY = 1000 / FPS;
let frameCount = 0;

const CLERK_SECRET_KEY = 'sk_test_hkntzOuPnXfByD3N6RtR9pWVZ0sg4v6HHdBE32Ogvl';
const USER_ID = 'user_3DGMEMw37Cp49Q4gbKFDsXzHxkI';
const BASE_URL = 'http://localhost:3000';
const NAV_TIMEOUT = 120000;

async function capture(page, durationMs) {
  const frames = Math.ceil(durationMs / FRAME_DELAY);
  for (let i = 0; i < frames; i++) {
    await page.screenshot({
      path: join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`),
      type: 'png',
    });
    await page.waitForTimeout(FRAME_DELAY);
  }
}

async function smoothScroll(page, pixels, durationMs) {
  const steps = Math.ceil(durationMs / FRAME_DELAY);
  const perStep = pixels / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((px) => window.scrollBy(0, px), perStep);
    await page.screenshot({
      path: join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`),
      type: 'png',
    });
    await page.waitForTimeout(FRAME_DELAY / 2);
  }
}

async function createSignInToken() {
  const res = await fetch('https://api.clerk.com/v1/sign_in_tokens', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: USER_ID }),
  });
  const data = await res.json();
  if (!data.token) {
    throw new Error(`Failed to create sign-in token: ${JSON.stringify(data)}`);
  }
  return data;
}

async function authenticateWithClerk(page) {
  // Warm up the dev server
  console.log('Warming up dev server...');
  await page.goto(`${BASE_URL}/inicio`, {
    timeout: NAV_TIMEOUT,
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(5000);
  console.log('Server ready.');

  // Create sign-in token and use __clerk_ticket to authenticate
  console.log('Creating Clerk sign-in token...');
  const tokenData = await createSignInToken();
  console.log(`Token created: ${tokenData.id}`);

  console.log('Signing in with ticket...');
  await page.goto(`${BASE_URL}/sign-in?__clerk_ticket=${tokenData.token}`, {
    timeout: NAV_TIMEOUT,
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(12000);

  const url = page.url();
  console.log(`Post-auth URL: ${url}`);

  if (url.includes('sign-in')) {
    await page.goto(`${BASE_URL}/`, {
      timeout: NAV_TIMEOUT,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(5000);
    const finalUrl = page.url();
    console.log(`Dashboard URL: ${finalUrl}`);
    return !finalUrl.includes('sign-in');
  }

  return true;
}

async function goTo(page, path) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(`${BASE_URL}${path}`, {
        timeout: NAV_TIMEOUT,
        waitUntil: 'domcontentloaded',
      });
      await page.waitForTimeout(4000);
      return;
    } catch (e) {
      console.log(`  Navigation to ${path} failed (attempt ${attempt + 1}/3): ${e.message}`);
      if (attempt === 2) throw e;
      await page.waitForTimeout(3000);
    }
  }
}

async function recordDemo() {
  console.log('=== FIXA APP Demo Recording ===');
  console.log(`Resolution: 1440x900 @ ${FPS}fps`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    deviceScaleFactor: 1, // Use 1x for faster screenshots
  });
  const page = await context.newPage();

  const authenticated = await authenticateWithClerk(page);

  if (!authenticated) {
    console.log('Authentication failed - recording fallback');
    await recordFallback(page);
  } else {
    console.log('Authenticated! Recording dashboard demo...');
    await recordDashboard(page);
  }

  await browser.close();
  encodeVideo();
  cleanup();
  console.log('Done!');
}

async function recordDashboard(page) {
  // --- SCENE 1: Panel del dia (dashboard) ---
  console.log('Scene 1: Dashboard / Panel del dia');
  await goTo(page, '/');
  await capture(page, 2500);        // 2.5s hold
  await smoothScroll(page, 300, 1500);
  await capture(page, 1500);

  // --- SCENE 2: Ordenes ---
  console.log('Scene 2: Ordenes');
  await goTo(page, '/ordenes');
  await capture(page, 2000);
  await smoothScroll(page, 200, 1000);
  await capture(page, 1500);

  // --- SCENE 3: Nueva orden ---
  console.log('Scene 3: Crear orden');
  await goTo(page, '/ordenes/nueva');
  await capture(page, 2000);

  // Type license plate slowly
  try {
    const plateInput = await page.$(
      'input[placeholder*="matrícula"], input[placeholder*="Matrícula"], ' +
      'input[name="matricula"], input[placeholder*="matricula"], ' +
      'input[placeholder*="placa"], input[placeholder*="plate"]'
    );
    if (plateInput) {
      console.log('  Typing license plate...');
      for (const char of '4523 BCD') {
        await plateInput.type(char, { delay: 80 });
        await page.screenshot({
          path: join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`),
          type: 'png',
        });
      }
      await capture(page, 1000);
    } else {
      console.log('  License plate input not found');
      await capture(page, 1000);
    }
  } catch (e) {
    console.log(`  License plate error: ${e.message}`);
  }

  // --- SCENE 4: Clientes ---
  console.log('Scene 4: Clientes');
  await goTo(page, '/clientes');
  await capture(page, 2000);

  // --- SCENE 5: Calendario ---
  console.log('Scene 5: Calendario');
  await goTo(page, '/calendario');
  await capture(page, 2000);

  // --- SCENE 6: Back to dashboard ---
  console.log('Scene 6: Back to dashboard');
  await goTo(page, '/');
  await capture(page, 2000);
}

async function recordFallback(page) {
  console.log('Fallback: Recording sign-in + landing page');
  await goTo(page, '/sign-in');
  await capture(page, 2000);

  await goTo(page, '/inicio');
  await capture(page, 2000);
  await smoothScroll(page, 3000, 10000);
  await capture(page, 1500);
}

function encodeVideo() {
  console.log(`Encoding ${frameCount} frames to video...`);
  try {
    // Use cwd option to avoid spaces-in-path issues with ffmpeg's %d pattern
    execSync(
      `ffmpeg -y -framerate ${FPS} -i "frame_%05d.png" ` +
      `-c:v libvpx-vp9 -b:v 2M -pix_fmt yuv420p -an ` +
      `-vf "scale=1440:900" ` +
      `"${outputPath}"`,
      { stdio: 'inherit', cwd: framesDir }
    );
    console.log(`Video saved: ${outputPath}`);
    console.log(`Frames: ${frameCount} | FPS: ${FPS} | Duration: ~${Math.round(frameCount / FPS)}s`);
  } catch (e) {
    console.error(`ffmpeg failed: ${e.message}`);
  }
}

function cleanup() {
  console.log('Cleaning up frames...');
  try {
    for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));
  } catch {}
}

recordDemo().catch(console.error);
