import fs from "node:fs";
import path from "node:path";

/**
 * Returns the public URL if a file exists in /public, otherwise null.
 * Lets sections show a designed fallback until real photography is dropped in
 * (e.g. /public/images/hero.jpg) with no code changes.
 * Server-only: call from server components.
 */
export function publicImage(relativePath: string): string | null {
  const clean = relativePath.replace(/^\//, "");
  try {
    return fs.existsSync(path.join(process.cwd(), "public", clean))
      ? `/${clean}`
      : null;
  } catch {
    return null;
  }
}
