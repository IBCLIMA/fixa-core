import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readdirSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const framesDir = join(__dirname, '..', 'public', 'demo', 'frames');
const outputPath = join(__dirname, '..', 'public', 'demo', 'fixa-demo.webm');

// Clean up frames directory
try { mkdirSync(framesDir, { recursive: true }); } catch {}
for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));

const FPS = 24;
const FRAME_DELAY = 1000 / FPS;
let frameCount = 0;

async function captureFrames(page, durationMs) {
  const frames = Math.ceil(durationMs / FRAME_DELAY);
  for (let i = 0; i < frames; i++) {
    const path = join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
    await page.screenshot({ path, type: 'png' });
    await page.waitForTimeout(FRAME_DELAY);
  }
}

async function smoothScroll(page, pixels, durationMs) {
  const steps = Math.ceil(durationMs / FRAME_DELAY);
  const perStep = pixels / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((px) => window.scrollBy(0, px), perStep);
    const path = join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
    await page.screenshot({ path, type: 'png' });
    await page.waitForTimeout(FRAME_DELAY / 2);
  }
}

async function moveCursor(page, fromX, fromY, toX, toY, steps = 15) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t * t * (3 - 2 * t); // smoothstep
    const x = fromX + (toX - fromX) * ease;
    const y = fromY + (toY - fromY) * ease;
    await page.mouse.move(x, y);
    const path = join(framesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
    await page.screenshot({ path, type: 'png' });
  }
}

async function recordDemo() {
  console.log('🎬 Starting cinematic FIXA demo recording...');
  console.log(`📐 Resolution: 1440x900 @ ${FPS}fps`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // --- SCENE 1: Hero landing ---
  console.log('🎬 Scene 1: Hero...');
  await page.goto('http://localhost:3000/inicio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await captureFrames(page, 3000); // Hold on hero for 3s

  // --- SCENE 2: Scroll to social proof ---
  console.log('🎬 Scene 2: Social proof...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 1500);

  // --- SCENE 3: Video demo section ---
  console.log('🎬 Scene 3: Scroll past video...');
  await smoothScroll(page, 600, 1500);
  await captureFrames(page, 1000);

  // --- SCENE 4: Problems ---
  console.log('🎬 Scene 4: Problems...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 1500);

  // --- SCENE 5: Before/After ---
  console.log('🎬 Scene 5: Before/After...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 1500);

  // --- SCENE 6: Features with cursor interaction ---
  console.log('🎬 Scene 6: Features + cursor spotlight...');
  await smoothScroll(page, 800, 2500);
  await captureFrames(page, 1000);

  // Hover over feature cards to show spotlight
  const cards = await page.$$('.card-spotlight');
  if (cards.length >= 3) {
    for (let i = 0; i < 3; i++) {
      const box = await cards[i].boundingBox();
      if (box) {
        await moveCursor(page, 720, 100, box.x + box.width / 2, box.y + box.height / 2, 12);
        await captureFrames(page, 800);
      }
    }
  }

  // --- SCENE 7: How it works ---
  console.log('🎬 Scene 7: How it works...');
  await smoothScroll(page, 800, 2000);
  await captureFrames(page, 2000);

  // --- SCENE 8: Testimonials ---
  console.log('🎬 Scene 8: Testimonials...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 2000);

  // --- SCENE 9: Comparison ---
  console.log('🎬 Scene 9: Comparison table...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 1500);

  // --- SCENE 10: Pricing ---
  console.log('🎬 Scene 10: Pricing...');
  await smoothScroll(page, 700, 2000);
  await captureFrames(page, 2000);

  // --- SCENE 11: CTA ---
  console.log('🎬 Scene 11: CTA final...');
  await smoothScroll(page, 800, 2000);
  await captureFrames(page, 2500);

  // --- SCENE 12: Scroll back to top ---
  console.log('🎬 Scene 12: Back to top...');
  const totalScroll = await page.evaluate(() => window.scrollY);
  await smoothScroll(page, -totalScroll, 3000);
  await captureFrames(page, 1500);

  await browser.close();

  // --- ENCODE with ffmpeg ---
  console.log(`📦 Encoding ${frameCount} frames to video...`);
  try {
    execSync(
      `ffmpeg -y -framerate ${FPS} -i "${framesDir}/frame_%05d.png" ` +
      `-c:v libvpx-vp9 -b:v 2M -pix_fmt yuv420p -an ` +
      `-vf "scale=1440:900" ` +
      `"${outputPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Demo video saved: ${outputPath}`);
    console.log(`📊 Frames: ${frameCount} | FPS: ${FPS} | Duration: ~${Math.round(frameCount / FPS)}s`);
  } catch (e) {
    console.error('❌ ffmpeg encoding failed:', e.message);
  }

  // Cleanup frames
  console.log('🧹 Cleaning up frames...');
  for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));

  console.log('🎬 Recording complete!');
}

recordDemo().catch(console.error);
