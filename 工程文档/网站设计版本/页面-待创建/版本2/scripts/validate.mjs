import { readFileSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(process.cwd());
const read = (file) => readFileSync(resolve(root, file), "utf8");
const stat = (file) => statSync(resolve(root, file));

const requiredFiles = [
  "index.html",
  "src/styles.css",
  "src/main.js",
  "public/media/SOURCES.md",
  "public/media/product/egoclip-hero-cutout.webp",
  ...["cream", "navy", "coral", "sage", "lilac"].map((colour) => `public/media/product/shells/egoclip-shell-${colour}.webp`),
  ...["pov-bike", "friends-walk", "wear-fabric", "friends-lawn"].map((name) => `public/media/life/${name}.jpg`),
  "public/media/life/pov-cycling.mp4",
  "public/media/life/pov-cycling-poster.jpg",
  "public/media/life/prototype-layers.mp4",
  "public/media/life/prototype-layers-poster.jpg",
];

for (const file of requiredFiles) {
  const fileStat = stat(file);
  if (!fileStat.isFile() || fileStat.size === 0) throw new Error(`Missing or empty required file: ${file}`);
}

const html = read("index.html");
const css = read("src/styles.css");
const script = read("src/main.js");
const sources = read("public/media/SOURCES.md");

const checks = [
  [html.includes('<meta name="viewport"'), "responsive viewport"],
  [(html.match(/data-section="\d{2}"/g) ?? []).length === 9, "nine unique story chapters"],
  [(html.match(/data-shell-src=/g) ?? []).length === 5, "five product shell studies"],
  [(html.match(/<video\b/g) ?? []).length === 2, "two local video stories"],
  [(html.match(/<video[^>]+poster="\/media\//g) ?? []).length === 2, "poster for every video"],
  [html.includes("Verified from source files") && html.includes("No battery, capture resolution, storage or waterproof rating"), "product fact boundary"],
  [html.includes("not an EgoClip production line") && html.includes("does not imply product endorsement"), "stock-media disclosure"],
  [html.includes('data-waitlist data-endpoint=""') && script.includes("this preview did not send or store your email"), "honest waitlist preview"],
  [script.includes("fetch(endpoint") && script.includes('method: "POST"'), "real endpoint path"],
  [script.includes("navigator.connection?.saveData") && script.includes("visibilitychange"), "responsible video loading"],
  [css.includes("@media(max-width:820px)") && css.includes("@media(max-width:540px)"), "tablet and mobile layouts"],
  [css.includes("@media(prefers-reduced-motion:reduce)"), "reduced-motion mode"],
  [/\.product-viewer>img\{[^}]*height:auto/.test(css) && /\.wear-device\{[^}]*height:auto/.test(css), "intrinsic product image proportions"],
  [!/(?:src|href|poster)="https?:\/\//.test(html), "no remote runtime resources"],
  [!/(?:src|href|poster)="\/reference\//.test(html), "no reference assets at runtime"],
  [!/(life-birds|life-phone|hero-water)/.test(html), "no legacy or unlicensed runtime media"],
  [!script.includes("setTimeout("), "no simulated network success"],
  [!/(\$\s?\d|\d+%\s*(?:return|APY)|guaranteed return)/i.test(html), "no unconfirmed financial claim"],
];

for (const [passed, label] of checks) {
  if (!passed) throw new Error(`Validation failed: ${label}`);
}

const imgTags = html.match(/<img\b[^>]*>/g) ?? [];
if (!imgTags.length) throw new Error("Validation failed: no images");
for (const tag of imgTags) {
  if (!/\balt="[^"]*"/.test(tag)) throw new Error(`Image missing alt: ${tag}`);
  if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) throw new Error(`Image missing intrinsic dimensions: ${tag}`);
}

const localRuntimePaths = [...html.matchAll(/(?:src|href|poster)="(\/(?:media|src)\/[^"#?]+)"/g)].map((match) => match[1]);
for (const pathname of new Set(localRuntimePaths)) {
  const file = pathname.startsWith("/media/") ? `public${pathname}` : pathname.slice(1);
  const fileStat = stat(file);
  const extension = extname(file).toLowerCase();
  const maxBytes = extension === ".mp4" ? 9 * 1024 * 1024 : [".jpg", ".jpeg", ".webp"].includes(extension) ? 1024 * 1024 : Infinity;
  if (fileStat.size > maxBytes) throw new Error(`Runtime asset exceeds delivery cap: ${file} (${fileStat.size} bytes)`);
}

const sourceRequirements = [
  "Pexels License",
  "Jonathan Borba",
  "Mizuno K",
  "Filipp Romanovski",
  "Jessica Iroh",
  "Alan Morales",
  "Jakub Zerdzicki",
  "egoclip-hero-cutout.webp",
  "pov-cycling.mp4",
  "prototype-layers.mp4",
  "PDF files were intentionally not opened",
];
for (const item of sourceRequirements) {
  if (!sources.includes(item)) throw new Error(`Media register missing: ${item}`);
}

console.log(`Validated ${requiredFiles.length} required files, ${checks.length} page contracts, ${imgTags.length} images and ${new Set(localRuntimePaths).size} runtime paths.`);
