// Rebuild app/landing/content.js from the three landing source files.
import { readFileSync, writeFileSync } from "node:fs";
const esc = (t) => t.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const css = readFileSync("app/landing/landing.css", "utf8");
const html = readFileSync("app/landing/landing-body.html", "utf8");
const js = readFileSync("app/landing/landing-script.js", "utf8");
writeFileSync("app/landing/content.js",
  "// Generated from landing-body.html / landing-script.js / landing.css — edit those, then run: node scripts/build-landing.mjs\n" +
  "export const LANDING_CSS = `\n" + esc(css) + "\n`;\n\nexport const LANDING_HTML = `" + esc(html) + "`;\n\nexport const LANDING_JS = `" + esc(js) + "`;\n");
console.log("content.js rebuilt");
