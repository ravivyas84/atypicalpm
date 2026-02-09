#!/usr/bin/env node

/**
 * Link checker for the Atypical PM site.
 *
 * Usage:
 *   node scripts/check-links.mjs              # Check internal links only
 *   node scripts/check-links.mjs --external    # Also check external links
 *
 * Requires a built site in dist/ — run `pnpm build` first.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { URL } from "node:url";

const DIST_DIR = resolve(import.meta.dirname, "..", "dist");
const CHECK_EXTERNAL = process.argv.includes("--external");

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function extractLinks(html) {
  const linkRegex = /<a\s[^>]*href="([^"]*)"[^>]*>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  return links;
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function resolveInternalLink(href, htmlFilePath) {
  // Compute the page URL path from the file system path
  const relativeToDistDir = htmlFilePath
    .replace(DIST_DIR, "")
    .replace(/\\/g, "/");
  // e.g. /what-is-pm/what-is/index.html -> /what-is-pm/what-is/
  const pageUrl = relativeToDistDir.replace(/index\.html$/, "");

  // Use URL resolution to resolve the href relative to the page URL
  const base = new URL(pageUrl, "http://localhost");
  const resolved = new URL(href, base);
  return resolved.pathname;
}

async function checkInternalLink(resolvedPath) {
  // Try the path as-is (file), as directory with index.html, and with .html
  const candidates = [
    join(DIST_DIR, resolvedPath),
    join(DIST_DIR, resolvedPath, "index.html"),
    join(DIST_DIR, resolvedPath + ".html"),
  ];

  // If path has trailing slash, also check without it
  if (resolvedPath.endsWith("/")) {
    const withoutSlash = resolvedPath.slice(0, -1);
    candidates.push(
      join(DIST_DIR, withoutSlash + ".html"),
      join(DIST_DIR, withoutSlash, "index.html")
    );
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return true;
    }
  }
  return false;
}

async function checkExternalLink(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "AtypicalPM-LinkChecker/1.0" },
    });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: err.message };
  }
}

async function main() {
  const htmlFiles = await findHtmlFiles(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files in dist/\n`);

  const broken = [];
  const externalLinks = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf-8");
    const links = extractLinks(html);
    const pagePath = file.replace(DIST_DIR, "").replace(/\\/g, "/");

    for (const href of links) {
      // Skip anchors, mailto, tel, javascript
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        continue;
      }

      if (href.startsWith("http://") || href.startsWith("https://")) {
        externalLinks.push({ href, page: pagePath });
        continue;
      }

      // Internal link
      const resolved = resolveInternalLink(href, file);
      const exists = await checkInternalLink(resolved);
      if (!exists) {
        broken.push({
          page: pagePath,
          href,
          resolved,
          type: "internal",
        });
      }
    }
  }

  // Report internal link results
  if (broken.length > 0) {
    console.log(`BROKEN INTERNAL LINKS (${broken.length}):`);
    console.log("─".repeat(60));
    for (const b of broken) {
      console.log(`  Page:     ${b.page}`);
      console.log(`  Link:     ${b.href}`);
      console.log(`  Resolves: ${b.resolved}`);
      console.log("");
    }
  } else {
    console.log("All internal links are valid.");
  }

  // Check external links if requested
  if (CHECK_EXTERNAL && externalLinks.length > 0) {
    console.log(`\nChecking ${externalLinks.length} external links...\n`);
    const brokenExternal = [];

    for (const { href, page } of externalLinks) {
      const result = await checkExternalLink(href);
      if (!result.ok) {
        brokenExternal.push({ page, href, status: result.status });
      }
    }

    if (brokenExternal.length > 0) {
      console.log(`\nBROKEN EXTERNAL LINKS (${brokenExternal.length}):`);
      console.log("─".repeat(60));
      for (const b of brokenExternal) {
        console.log(`  Page:   ${b.page}`);
        console.log(`  Link:   ${b.href}`);
        console.log(`  Status: ${b.status}`);
        console.log("");
      }
    } else {
      console.log("All external links are valid.");
    }
  } else if (!CHECK_EXTERNAL) {
    console.log(
      `\nSkipped ${externalLinks.length} external links. Use --external to check them.`
    );
  }

  // Exit with error code if any broken links
  const totalBroken = broken.length;
  if (totalBroken > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Link checker failed:", err);
  process.exit(2);
});
