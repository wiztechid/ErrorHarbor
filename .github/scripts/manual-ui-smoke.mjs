import { chromium } from "playwright";

const base = (process.env.BASE_URL || "https://errorharbor.com").replace(/\/$/, "");
const article = base + "/errors/dev/node-npm/eacces-permission-denied/";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertOk(response, label) {
  assert(response, label + ": no response");
  assert(response.status() < 400, label + ": HTTP " + response.status());
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
const page = await context.newPage();

try {
  await assertOk(await page.goto(article, { waitUntil: "domcontentloaded" }), "article");
  await page.locator("h1").waitFor({ state: "visible" });
  assert((await page.locator("h1").innerText()).includes("EACCES"), "EACCES H1 missing");

  // Every hash navigation target exposed by the article must exist.
  const hashTargets = await page.locator('a[href^="#"]').evaluateAll(nodes =>
    [...new Set(nodes.map(a => a.getAttribute("href")).filter(Boolean))]
  );
  for (const href of hashTargets) {
    const id = decodeURIComponent(href.slice(1));
    assert(await page.locator("#" + CSS.escape(id)).count(), "Missing hash target: " + href);
  }

  // Header search must navigate to a real indexed result.
  const search = page.locator("[data-site-search]").first();
  await search.locator("input").fill("npm EACCES Permission Denied");
  await Promise.all([
    page.waitForURL(url => url.pathname.includes("/eacces-permission-denied/"), { timeout: 10000 }),
    search.locator('button[type="submit"]').click()
  ]);

  // Copy must produce a real clipboard value.
  const copyButton = page.locator("[data-copy]").first();
  await copyButton.click();
  await page.waitForTimeout(150);
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  assert(clipboard.includes("npm config get prefix"), "Copy button did not write expected command");

  // Negative feedback must skip hidden ad placeholders and reach the next real section.
  const noButton = page.locator('[data-feedback="no"]').first();
  await noButton.click();
  await page.waitForTimeout(500);
  const diagnoseTop = await page.locator("#diagnose").evaluate(el => el.getBoundingClientRect().top);
  assert(diagnoseTop < 500, "No/continue did not advance to the next troubleshooting section");

  // TOC links must map to real content.
  const toc = page.locator('.toc a[href="#diagnose"]');
  assert(await toc.count(), "TOC diagnose link missing");
  await toc.click();
  await page.waitForTimeout(250);
  assert(page.url().endsWith("#diagnose"), "TOC click did not update hash");

  // Internal visible navigation links on the article must resolve.
  const internal = await page.locator("a[href]").evaluateAll((nodes, origin) => {
    const urls = [];
    for (const a of nodes) {
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
      const u = new URL(raw, origin);
      if (u.origin === origin) urls.push(u.href.split("#")[0]);
    }
    return [...new Set(urls)];
  }, base);

  for (const url of internal) {
    const response = await context.request.get(url, { failOnStatusCode: false, timeout: 15000 });
    assert(response.status() < 400, "Broken internal link " + url + " -> HTTP " + response.status());
  }

  console.log("PASS ErrorHarbor manual UI smoke");
  console.log("Checked internal URLs:", internal.length);
} finally {
  await browser.close();
}
