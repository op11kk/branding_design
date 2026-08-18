import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const sources = readFileSync(new URL("../public/media/SOURCES.md", import.meta.url), "utf8");

test("keeps the nine-chapter story while chapter one becomes a focused home scene", () => {
  assert.equal((html.match(/data-section="\d{2}"/g) ?? []).length, 9);
  assert.deepEqual([...html.matchAll(/data-section="(\d{2})"/g)].map((match) => match[1]), ["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
  const home = html.match(/<section\b[^>]*id="home"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(home, /data-home-scene/);
  assert.match(home, /<source[^>]+media="\(max-width: 680px\)"[^>]+entryway-mobile-v1\.jpg/);
  assert.match(home, /<img[^>]+entryway-desktop-v1\.jpg[^>]+width="1672"[^>]+height="941"/);
  assert.doesNotMatch(html, /视觉与交互设计方案|工程实施版|前端实施清单/);
});

test("places the everyday-carry trio in the minimal first chapter", () => {
  const home = html.match(/<section\b[^>]*id="home"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(home, /class="[^"]*wallet-object[^"]*"[^>]+aria-label="Wallet"/);
  assert.match(home, /class="[^"]*keys-object[^"]*"[^>]+aria-label="House keys"/);
  assert.match(home, /<button[^>]+class="[^"]*egoclip-object[^"]*"[^>]+data-income-trigger[^>]+aria-pressed="false"/);
  assert.match(home, /egoclip-hero-cutout\.webp/);
  assert.match(home, /data-income-status[^>]+aria-live="polite"/);
  assert.doesNotMatch(`${html}\n${css}\n${script}`, /hero-device-wrap|product-stage|life-chip|record-state|scroll-cue|data-title-reveal-at/);
});

test("uses the supplied product language without inventing hardware specifications", () => {
  assert.match(html, /supplied Rhino, KeyShot and printable STL files/);
  assert.match(html, /No battery, capture resolution, storage or waterproof rating is claimed/);
  assert.match(html, /concept render · supplied geometry/i);
  assert.doesNotMatch(html, /\b(?:4K|8K|IP\d{2}|Wi-?Fi 6|Bluetooth 5|\d+\s?GB|\d+\s?mAh|\d+\s?hours? battery)\b/i);
});

test("provides complete local product, video and lifestyle media", () => {
  assert.match(html, /egoclip-hero-cutout\.webp/);
  assert.equal((html.match(/data-shell-src=/g) ?? []).length, 5);
  assert.equal((html.match(/<video\b/g) ?? []).length, 2);
  assert.equal((html.match(/poster="\/media\/life\//g) ?? []).length, 2);
  assert.match(html, /friends-walk\.jpg/);
  assert.match(html, /wear-fabric\.jpg/);
  assert.doesNotMatch(html, /\/reference\//);
  assert.doesNotMatch(html, /life-birds|life-phone|hero-water/);
});

test("implements navigation, colour, video, state and app interactions", () => {
  assert.match(script, /incomeTrigger\.addEventListener\("click"/);
  assert.match(script, /incomeStatus\.textContent = "Income received"/);
  assert.match(script, /classList\.toggle\("is-open"/);
  assert.match(script, /data-shell-preview/);
  assert.match(script, /await video\.play\(\)/);
  assert.match(script, /userPaused/);
  assert.match(script, /data-state-toggle/);
  assert.match(script, /data-review-item/);
  assert.match(script, /IntersectionObserver/);
});

test("has accessible controls and live feedback", () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="site-nav" aria-expanded="false"/);
  assert.match(html, /role="group" aria-label="Choose a shell colour concept"/);
  assert.equal((html.match(/aria-pressed=/g) ?? []).length, 10);
  assert.match(html, /type="email"/);
  assert.match(html, /aria-live="polite"/);
});

test("supports narrow screens, reduced motion and data-saving playback", () => {
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(css, /@media\(max-width:540px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.product-viewer>img\{[^}]*height:auto/);
  assert.match(css, /\.wear-device\{[^}]*height:auto/);
  assert.match(css, /overflow-x:clip/);
  assert.match(script, /prefers-reduced-motion: reduce/);
  assert.match(script, /navigator\.connection\?\.saveData/);
});

test("waitlist succeeds only through a configured endpoint", () => {
  assert.match(html, /data-waitlist data-endpoint=""/);
  assert.match(script, /const endpoint = form\.dataset\.endpoint\.trim\(\)/);
  assert.match(script, /fetch\(endpoint/);
  assert.match(script, /this preview did not send or store your email/);
  assert.doesNotMatch(script, /setTimeout/);
});

test("records media authorship and avoids remote runtime or commercial claims", () => {
  for (const author of ["Jonathan Borba", "Mizuno K", "Filipp Romanovski", "Jessica Iroh", "Alan Morales", "Jakub Zerdzicki"]) {
    assert.match(sources, new RegExp(author));
  }
  assert.match(sources, /Pexels License/);
  assert.match(sources, /entryway-desktop-v1\.jpg/);
  assert.match(sources, /entryway-mobile-v1\.jpg/);
  assert.match(sources, /built-in image generation tool/);
  assert.doesNotMatch(html, /(?:src|href|poster)="https?:\/\//);
  assert.doesNotMatch(html, /\$\s?\d|\d+%\s*(?:return|APY)|guaranteed return/i);
});

test("keeps the income interaction conceptual and amount-free", () => {
  const incomeSlip = html.match(/<span class="income-slip"[\s\S]*?<\/span>/)?.[0] ?? "";
  const numericAmount = /(?:[$€£¥￥]\s*\d|\d[\d,.]*\s*(?:USD|CNY|RMB|dollars?|yuan|元))/i;
  assert.match(incomeSlip, /Income received/);
  assert.doesNotMatch(incomeSlip, /\d/);
  assert.doesNotMatch(`${html}\n${script}`, numericAmount);
  assert.match(html, /Concept interaction · no payment processed/);
});
