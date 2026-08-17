import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const requiredFiles = ["index.html", "src/styles.css", "src/main.js", "reference/prd-assets/life-laundry.png", "reference/prd-assets/life-uno.png", "reference/prd-assets/life-birds.jpg", "reference/prd-assets/life-phone.png"];
for (const file of requiredFiles) {
  const stat = statSync(resolve(root, file));
  if (!stat.isFile() || stat.size === 0) throw new Error(`Missing or empty required file: ${file}`);
}

const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "src/styles.css"), "utf8");
const script = readFileSync(resolve(root, "src/main.js"), "utf8");
const checks = [
  [html.includes('<meta name="viewport"'), "responsive viewport"],
  [html.match(/data-section=/g)?.length >= 8, "eight-part narrative"],
  [html.includes("data-wallet") && html.includes("identity-card"), "wallet-to-card interaction"],
  [html.includes("data-shell") && script.includes("--shell"), "shell selector"],
  [html.includes("data-waitlist") && script.includes('dataset.state = "loading"'), "waitlist states"],
  [css.includes("prefers-reduced-motion:reduce"), "reduced-motion mode"],
  [css.includes("@media(max-width:520px)"), "mobile breakpoint"],
  [!/(https?:)?\/\//.test(html), "no remote runtime resources"],
];
for (const [passed, label] of checks) if (!passed) throw new Error(`Validation failed: ${label}`);
console.log(`Validated ${requiredFiles.length} files and ${checks.length} EgoClip page contracts.`);
