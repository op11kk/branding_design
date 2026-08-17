import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

test("renders the eight-part EgoClip story without PRD-document chrome", () => {
  assert.match(html, /Your life/);
  assert.match(html, /data-wallet/);
  assert.ok((html.match(/data-section=/g) ?? []).length >= 8);
  assert.doesNotMatch(html, /视觉与交互设计方案|工程实施版|前端实施清单/);
});

test("provides real page interactions", () => {
  assert.match(script, /scrollIntoView/);
  assert.match(script, /data-shell/);
  assert.match(script, /validity\.valid/);
  assert.match(script, /IntersectionObserver/);
});

test("has accessible controls and form feedback", () => {
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /type="email"/);
  assert.match(html, /aria-label="选择 EgoClip 外壳颜色"/);
});

test("supports mobile and reduced motion", () => {
  assert.match(css, /@media\(max-width:520px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /overflow-x:clip/);
});

test("does not load remote runtime assets or claim an unconfirmed return", () => {
  assert.doesNotMatch(html, /(?:src|href)="https?:\/\//);
  assert.doesNotMatch(html, /\$\s?\d|% return|APY/i);
});
