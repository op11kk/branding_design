import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const sourcePath = process.argv[2];

if (!sourcePath || extname(sourcePath).toLowerCase() !== ".html") {
  console.error("Usage: node scripts/extract-prd-assets.mjs /path/to/spec.html");
  process.exit(1);
}

// PRD images are visual references, not runtime media. Keep them outside public/ so
// they cannot accidentally be presented as finished page assets.
const outputDir = resolve("reference/prd-assets");
const html = await readFile(sourcePath, "utf8");
const imagePattern = /<img\s+class="[^"]*"\s+src="data:image\/([^;]+);base64,([^"]+)"\s+alt="([^"]*)"/g;

const filenames = [
  "hand-underwater",
  "hand-surface",
  "hand-holding-water",
  "ubl-tree-portal",
  "life-uno",
  "life-laundry",
  "life-birds",
  "life-phone",
  "beach-wide",
  "beach-split",
  "income-phone",
  "waitlist-reference",
];

await mkdir(outputDir, { recursive: true });

const manifest = [];
let match;
let index = 0;

while ((match = imagePattern.exec(html)) !== null) {
  const [, rawExtension, base64, alt] = match;
  const extension = rawExtension === "jpeg" ? "jpg" : rawExtension;
  const basename = filenames[index] ?? `prd-image-${index + 1}`;
  const filename = `${basename}.${extension}`;
  const bytes = Buffer.from(base64, "base64");

  await writeFile(resolve(outputDir, filename), bytes);
  manifest.push({ filename, alt, bytes: bytes.byteLength });
  index += 1;
}

await writeFile(
  resolve(outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Extracted ${manifest.length} images to ${outputDir}`);
