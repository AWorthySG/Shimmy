// Cross-device check: every route on 7 device profiles (Chromium emulation; no WebKit/Firefox).
// Checks status, JS errors, console errors, horizontal overflow, broken images and the phone menu.
//
//   npm run build && npx next start -p 3320 &
//   node scripts/qa-devices.cjs [http://localhost:3320] [output-dir]
//
// Stop any older `next-server` first: a stale server on the port serves an old build's chunks.
const { chromium, devices } = require("playwright");
const fs = require("fs");
const os = require("os");
const BASE = process.argv[2] || "http://localhost:3320";
const S = process.argv[3] || os.tmpdir();

async function sitemapRoutes() {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
}
const EXTRA = ["/admin", "/brows/selfie", "/links", "/launch", "/ref/TESTCODE", "/wishlist", "/blog/tag/embroidery", "/this-page-does-not-exist"];


const PROFILES = [
  ["iPhone SE (320)", devices["iPhone SE"]],
  ["iPhone 15 Pro (393)", devices["iPhone 15 Pro"]],
  ["Pixel 7 (412)", devices["Pixel 7"]],
  ["iPad Mini (768)", devices["iPad Mini"]],
  ["iPad Pro landscape (1194)", devices["iPad Pro 11 landscape"]],
  ["Laptop (1280)", devices["Desktop Chrome"]],
  ["Desktop (1920)", { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } }],
];

const IGNORE_CONSOLE = /googletagmanager|favicon|Download the React DevTools|\[Fast Refresh\]|preload/i;

(async () => {
  const routes = [...new Set([...(await sitemapRoutes()), ...EXTRA])];
  const browser = await chromium.launch();
  const issues = [];
  let checked = 0;

  for (const [name, profile] of PROFILES) {
    const context = await browser.newContext({ ...profile, reducedMotion: "reduce" });
    // Accept cookies and dismiss the welcome banner up front so they don't skew layout checks.
    await context.addInitScript(() => {
      try {
        localStorage.setItem("shimmy-cookies-accepted", "true");
      } catch {}
    });

    const queue = [...routes];
    const worker = async () => {
      while (queue.length) {
        const route = queue.shift();
        const page = await context.newPage();
        const errs = [];
        page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 160)));
        page.on("console", (m) => {
          if (m.type() === "error" && !IGNORE_CONSOLE.test(m.text())) errs.push("console: " + m.text().slice(0, 160));
        });
        try {
          const res = await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
          const status = res ? res.status() : 0;
          const expect404 = route === "/this-page-does-not-exist";
          if ((expect404 && status !== 404) || (!expect404 && status !== 200)) issues.push([name, route, `HTTP ${status}`]);

          // Scroll through the page so lazy images and observers fire.
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 60));
            }
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(400);

          const r = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const overflow = document.documentElement.scrollWidth - vw;
            let culprits = [];
            if (overflow > 1) {
              culprits = [...document.querySelectorAll("body *")]
                .filter((el) => {
                  const b = el.getBoundingClientRect();
                  const cs = getComputedStyle(el);
                  return b.width > 0 && b.right > vw + 1 && cs.position !== "fixed" && !el.closest("[aria-hidden=true]");
                })
                .slice(0, 3)
                .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} (right ${Math.round(el.getBoundingClientRect().right)})`);
            }
            const broken = [...document.images]
              .filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src") && !i.src.startsWith("data:"))
              .map((i) => i.getAttribute("src").slice(0, 80));
            return { overflow, culprits, broken };
          });
          if (r.overflow > 1) issues.push([name, route, `horizontal overflow ${r.overflow}px: ${r.culprits.join(" | ")}`]);
          for (const b of r.broken) issues.push([name, route, `broken image ${b}`]);
          for (const e of [...new Set(errs)]) issues.push([name, route, e]);
        } catch (e) {
          issues.push([name, route, "load failed: " + e.message.slice(0, 120)]);
        }
        checked++;
        await page.close();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);

    // Phone and tablet portrait: the menu button must open the navigation.
    if (profile.viewport.width < 1024) {
      const page = await context.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      const btn = page.locator('button[aria-label*="menu" i]').first();
      if ((await btn.count()) === 0 || !(await btn.isVisible())) {
        issues.push([name, "/", "no visible menu button"]);
      } else {
        try {
          await btn.click({ timeout: 5000 });
        } catch (e) {
          const hit = await btn.evaluate((b) => {
            const r = b.getBoundingClientRect();
            const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return el ? `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)}` : "nothing";
          });
          issues.push([name, "/", `menu button can't be tapped: covered by ${hit}`]);
          await page.screenshot({ path: `${S}/menu-${name.split(" ")[0]}.png` });
        }
        await page.waitForTimeout(500);
        const links = await page.locator('nav a[href="/brows"], [role="dialog"] a[href="/brows"], a[href="/brows/services"]').filter({ visible: true }).count();
        if (links === 0) issues.push([name, "/", "menu opened but no navigation links visible"]);
      }
      await page.close();
    }
    await context.close();
    console.log(`${name}: done`);
  }

  await browser.close();
  fs.writeFileSync(S + "/qa-issues.json", JSON.stringify(issues, null, 1));
  const real = issues.filter(([, r, m]) => !(r === "/this-page-does-not-exist" && /404/.test(m)));
  process.exitCode = real.length ? 1 : 0;
  console.log(`\nChecked ${checked} page loads (${routes.length} routes x ${PROFILES.length} devices). ${issues.length} issues.`);
  const byIssue = {};
  for (const [d, r, m] of issues) {
    const key = `${r}  ${m}`;
    (byIssue[key] ??= []).push(d.split(" (")[0]);
  }
  for (const [k, ds] of Object.entries(byIssue)) console.log(`- ${k}\n    on: ${ds.join(", ")}`);
})();
