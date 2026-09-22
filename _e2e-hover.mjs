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
  await page.waitForTimeout(5000);

  const sel = 'div.flex-1.overflow-y-auto.overflow-x-hidden.p-6';
  await page.evaluate((s) => { document.querySelector(s).scrollTop = 780; }, sel);
  await page.waitForTimeout(400);

  // hover the "Rape" row in Crime Types Distribution
  const row = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div')).find(
      (d) => d.children.length === 0 && d.textContent.trim() === 'Rape'
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!row) { console.log('Rape row not found'); }
  else {
    await page.mouse.move(row.x, row.y);
    await page.waitForTimeout(400);
    const tip = await page.evaluate(() => {
      const t = document.querySelector('[role="tooltip"]');
      if (!t) return null;
      const cs = getComputedStyle(t);
      return { text: t.innerText.replace(/\n/g, ' | '), pointerEvents: cs.pointerEvents, zIndex: cs.zIndex };
    });
    console.log('TOOLTIP:', JSON.stringify(tip));
    await page.screenshot({ path: `${OUT}/hover-ranked.png` });
  }
  console.log('done');
} finally {
  await browser.close();
  await prisma.$disconnect();
}
