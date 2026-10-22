import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * True if a file exists at the given public-relative path (e.g.
 * "/assets/banners/banner-about.jpg"). Lets a page render an optional image
 * only once someone has actually dropped the file in — no content or code
 * change needed when it arrives, and nothing breaks while it's still missing.
 */
export function assetExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\/+/, "")));
  } catch {
    return false;
  }
}
