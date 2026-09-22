import { chromium } from 'playwright';
import { SignJWT } from 'jose';
import { prisma } from './backend/lib/prisma.ts';

const BASE = 'http://localhost:3000';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
const OUT = process.env.OUT_DIR;

const user = await prisma.user.findUnique({
  where: { accountNumber: 'ACC-DEFEFE' },
  include: { permissions: { include: { permission: true } } },
});
const permissions = user.permissions.map((p) => p.permission.permissionName);
const token = await new SignJWT({
  sessionId: crypto.randomUUID(), userId: user.id, accountNumber: user.accountNumber,
  fullName: user.fullName, permissions, mustChangePassword: false,
  defaultLandingPage: user.defaultLandingPage ?? 'dashboard',
  autoLogoutTimer: user.autoLogoutTimer,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
}).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(JWT_SECRET);

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([{ name: 'session', value: token, url: BASE, httpOnly: true, sameSite: 'Lax' }]);
  await context.addInitScript(() => sessionStorage.setItem('tabSessionActive', 'true'));
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text()); });

  await page.goto(`${BASE}/dashboard/analytics`);
  await page.waitForTimeout(5500);

  const clickText = async (text) => {
    const pos = await page.evaluate((t) => {
      const el = Array.from(document.querySelectorAll('div')).find(
        (d) => d.children.length === 0 && d.textContent.trim() === t
      );
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, text);
    if (!pos) throw new Error(`not found: ${text}`);
    await page.mouse.click(pos.x, pos.y);
  };

  const readModal = () => page.evaluate(() => {
    const d = document.querySelector('[data-slot="dialog-content"], [role="dialog"]');
    if (!d) return null;
    const rows = Array.from(d.querySelectorAll('div')).filter(
      (x) => x.style.gridTemplateColumns && x.style.gridTemplateColumns.includes('1.4fr')
    );
    const body = rows.slice(1).map((r) => r.innerText.replace(/\n/g, ' | '));
    return {
      title: d.querySelector('[data-slot="dialog-title"]')?.innerText,
      desc: d.querySelector('[data-slot="dialog-description"]')?.innerText,
      rowCount: body.length,
      sample: body.slice(0, 3),
      hasMap: Boolean(d.querySelector('.leaflet-container')),
    };
  });

  // ── Drill 1: crime type "Theft"
  const sel = 'div.flex-1.overflow-y-auto.overflow-x-hidden.p-6';
  await page.evaluate((s) => { document.querySelector(s).scrollTop = 780; }, sel);
  await page.waitForTimeout(400);
  await clickText('Theft');
  await page.waitForTimeout(1800);
  console.log('THEFT MODAL:', JSON.stringify(await readModal(), null, 1));
  await page.screenshot({ path: `${OUT}/drill-theft.png` });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  console.log('AFTER ESC:', JSON.stringify(await readModal()));

  // ── Drill 2: matrix cell (Theft × March = 2) — exercises the 2-field filter
  await page.evaluate((s) => { const e = document.querySelector(s); e.scrollTop = e.scrollHeight; }, sel);
  await page.waitForTimeout(600);
  const cell = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const theft = rows.find((r) => r.cells[0]?.innerText.trim() === 'Theft');
    if (!theft) return null;
    const c = theft.cells[3]; // label, Jan, Feb, Mar
    const r = c.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: c.innerText.trim() };
  });
  console.log('MATRIX CELL (Theft/Mar):', JSON.stringify(cell));
  if (cell) {
    await page.mouse.click(cell.x, cell.y);
    await page.waitForTimeout(2000);
    console.log('MATRIX MODAL:', JSON.stringify(await readModal(), null, 1));
    await page.screenshot({ path: `${OUT}/drill-matrix.png` });
  }
  console.log('done');
} finally {
  await browser.close();
  await prisma.$disconnect();
}
