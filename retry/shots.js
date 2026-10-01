// Run: NODE_PATH=/usr/local/lib/node_modules node shots.js
const { chromium } = require('playwright-core');
const URL = 'file:///workspace/ga-retry-save/mockup.html';
const OUT = '/workspace/ga-retry-save/shots/';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--headless=new'] });
  for (const [name, w, dsf] of [['desktop-1280', 1280, 1], ['mobile-720', 720, 1], ['mobile-390', 390, 2]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: dsf });
    const pg = await ctx.newPage(); await pg.goto(URL); await pg.waitForTimeout(300);
    await pg.screenshot({ path: OUT + name + '-all-states.png', fullPage: true });
    await ctx.close();
  }
  // title-row close-ups at 2x: error / hover / focus / blocked
  for (const [tag, w] of [['1280', 1280], ['390', 390]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage(); await pg.goto(URL); await pg.waitForTimeout(300);
    const clip = async (sel, h, file, pad = 0) => {
      const bx = await pg.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width }; }, sel);
      await pg.screenshot({ path: OUT + file, fullPage: true, clip: { x: bx.x, y: bx.y - pad, width: bx.w, height: h } });
    };
    await clip('#st-error .card', 64, `closeup-${tag}-error.png`);
    await clip('#st-hover .card', 96, `closeup-${tag}-hover-tooltip.png`);
    await clip('#st-focus .card', 96, `closeup-${tag}-focus-tooltip.png`);
    await clip('#st-retrying .card', 64, `closeup-${tag}-retrying.png`);
    await clip('#st-blocked .card', await pg.evaluate(() => document.querySelector('#st-blocked .card').getBoundingClientRect().height), `closeup-${tag}-blocked-action.png`);
    await ctx.close();
  }
  // real (not forced) hover and keyboard focus from the live demo, at 1280
  const ctx = await b.newContext({ viewport: { width: 1280, height: 700 }, deviceScaleFactor: 2 });
  const pg = await ctx.newPage(); await pg.goto(URL + '?live=1'); await pg.waitForTimeout(300);
  await pg.click('#live textarea'); await pg.keyboard.type('x'); await pg.waitForTimeout(500);
  await pg.evaluate(() => document.activeElement.blur());
  const card = await pg.evaluate(() => { const r = document.querySelector('#live .card').getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width }; });
  const bb = await (await pg.$('#live .save-retry')).boundingBox();
  await pg.mouse.move(bb.x + 12, bb.y + 12); await pg.waitForTimeout(150);
  await pg.screenshot({ path: OUT + 'live-1280-real-hover.png', fullPage: true, clip: { x: card.x, y: card.y, width: card.w, height: 96 } });
  await pg.mouse.move(0, 0); await pg.focus('#live .tabs .btn-default'); await pg.keyboard.press('Shift+Tab');
  await pg.waitForTimeout(150);
  console.log('focus before shot:', await pg.evaluate(() => document.activeElement.className + ' tip=' + getComputedStyle(document.querySelector('#live .save-tip')).visibility));
  await pg.screenshot({ path: OUT + 'live-1280-real-keyboard-focus.png', fullPage: true, clip: { x: card.x, y: card.y, width: card.w, height: 96 } });
  await b.close();
})();
