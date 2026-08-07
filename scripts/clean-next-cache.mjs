import { rmSync } from "node:fs";
import { resolve } from "node:path";

const cachePath = resolve(process.cwd(), ".next");

try {
  rmSync(cachePath, { recursive: true, force: true });
  console.log("Cleaned Next.js cache: .next");
} catch (error) {
  console.error("Could not clean .next. Stop the dev server, then run npm.cmd run dev again.");
  console.error(error);
  process.exit(1);
}
