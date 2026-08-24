import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/visuals/earnings-phone.png", import.meta.url));
const output = fileURLToPath(new URL("../public/visuals/earnings-phone-cutout.png", import.meta.url));
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const pixels = width * height;
const outside = new Uint8Array(pixels);
const queue = new Int32Array(pixels);
let head = 0;
let tail = 0;

function isBackground(index) {
  const offset = index * channels;
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const darkest = Math.min(red, green, blue);
  const lightest = Math.max(red, green, blue);
  return darkest >= 185 && lightest - darkest <= 28;
}

function enqueue(index) {
  if (!outside[index] && isBackground(index)) {
    outside[index] = 1;
    queue[tail++] = index;
  }
}

for (let x = 0; x < width; x += 1) {
  enqueue(x);
  enqueue((height - 1) * width + x);
}
for (let y = 0; y < height; y += 1) {
  enqueue(y * width);
  enqueue(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head++];
  const x = index % width;
  const y = Math.floor(index / width);
  if (x > 0) enqueue(index - 1);
  if (x + 1 < width) enqueue(index + 1);
  if (y > 0) enqueue(index - width);
  if (y + 1 < height) enqueue(index + width);
}

const rgba = Buffer.alloc(pixels * 4);
for (let index = 0; index < pixels; index += 1) {
  const sourceOffset = index * channels;
  const outputOffset = index * 4;
  rgba[outputOffset] = data[sourceOffset];
  rgba[outputOffset + 1] = data[sourceOffset + 1];
  rgba[outputOffset + 2] = data[sourceOffset + 2];
  rgba[outputOffset + 3] = outside[index] ? 0 : 255;
}

await sharp(rgba, { raw: { width, height, channels: 4 } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .extend({
    top: 3,
    right: 3,
    bottom: 3,
    left: 3,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(output);
