import { chromium } from "playwright";

const base = (process.env.BASE_URL || "https://errorharbor.com").replace(/\/$/, "");
const articlePath = "/" + String(process.env.ARTICLE_PATH || "errors/dev/node-npm/eacces-permission-denied/").replace(/^\/+|\/+$/g, "") + "/";
const searchQuery = process.env.SEARCH_QUERY || "npm EACCES Permission Denied";
const article = base + articlePath;

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
  assert(await page.locator("h1").count() === 1, "Article must have exactly one H1");

  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert(canonical === article, "Canonical mismatch: " + canonical + " != " + article);
  const robots = (await page.locator('meta[name="robots"]').getAttribute("content").catch(() => "")) || "";
  assert(!/noindex/i.test(robots), "Article unexpectedly contains noindex");

  // Every hash navigation target exposed by the article must exist.
  const hashTargets = await page.locator('a[href^="#"]').evaluateAll(nodes =>
    [...new Set(nodes.map(a => a.getAttribute("href")).filter(Boolean))]
  );
  for (const href of hashTargets) {
    const id = decodeURIComponent(href.slice(1));
    const exists = await page.evaluate(targetId => Boolean(document.getElementById(targetId)), id);
    assert(exists, "Missing hash target: " + href);
  }

  // Header search must navigate to this exact indexed article.
  const search = page.locator("[data-site-search]").first();
  assert(await search.count(), "Header search missing");
  await search.locator("input").fill(searchQuery);
  await Promise.all([
    page.waitForURL(url => url.pathname === articlePath, { timeout: 10000 }),
    search.locator('button[type="submit"]').click()
  ]);

  // Copy buttons must write a real value when present.
  const copyButton = page.locator("[data-copy]").first();
  if (await copyButton.count()) {
    await copyButton.click();
    await page.waitForTimeout(150);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    assert(clipboard.trim().length > 0, "Copy button wrote an empty clipboard value");
  }

  // Negative feedback must advance to the next real visible troubleshooting section.
  const noButton = page.locator('[data-feedback="no"]').first();
  if (await noButton.count()) {
    const targetId = await noButton.evaluate(btn => {
      const block = btn.closest(".fix-feedback");
      let next = block?.nextElementSibling || null;
      while (next && (next.matches?.(".ad-placeholder,[hidden]") || getComputedStyle(next).display === "none")) next = next.nextElementSibling;
      while (next && next.tagName !== "SECTION") next = next.nextElementSibling;
      return next?.id || "";
    });
    assert(targetId, "Could not identify next real section for feedback navigation");
    await noButton.click();
    await page.waitForTimeout(500);
    const top = await page.locator("#" + targetId).evaluate(el => el.getBoundingClientRect().top);
    assert(top < 600, "No/continue did not advance to #" + targetId);
  }

  // TOC links must map to real sections and update the hash.
  const tocLinks = page.locator('.toc a[href^="#"]');
  const tocCount = await tocLinks.count();
  for (let i = 0; i < tocCount; i++) {
    const link = tocLinks.nth(i);
    const href = await link.getAttribute("href");
    if (!href) continue;
    await link.click();
    await page.waitForTimeout(80);
    assert(new URL(page.url()).hash === href, "TOC click did not update hash to " + href);
  }

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
  console.log("Article:", articlePath);
  console.log("Checked hash targets:", hashTargets.length);
  console.log("Checked internal URLs:", internal.length);
} finally {
  await browser.close();
}
