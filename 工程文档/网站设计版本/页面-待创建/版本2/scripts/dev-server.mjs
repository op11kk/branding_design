import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2);
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const host = valueAfter("--host", "127.0.0.1");
const port = Number(valueAfter("--port", process.env.PORT || "4173"));
const root = resolve(process.cwd());

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function safePath(pathname) {
  const publicPath = pathname.startsWith("/media/") ? `/public${pathname}` : pathname;
  const requested = publicPath === "/" ? "/index.html" : publicPath;
  const filePath = normalize(join(root, decodeURIComponent(requested)));
  return filePath.startsWith(root) ? filePath : null;
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://${request.headers.host}`).pathname;
  const filePath = safePath(pathname);

  if (!filePath) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }

  if (!stat.isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }

  const mime = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
  const range = request.headers.range;
  const headers = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
    "Content-Type": mime,
  };

  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      response.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
      return;
    }

    const start = Number(match[1]);
    const end = Math.min(match[2] ? Number(match[2]) : stat.size - 1, stat.size - 1);
    if (start > end || start >= stat.size) {
      response.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
      return;
    }

    response.writeHead(206, {
      ...headers,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...headers, "Content-Length": stat.size });
  if (request.method === "HEAD") response.end();
  else createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`EgoClip landing page: http://${host}:${port}`);
});
