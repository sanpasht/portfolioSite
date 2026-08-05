import "server-only";

import { createHighlighter, type Highlighter } from "shiki";

/**
 * Highlighting runs on the server only. The browser never downloads a
 * highlighter. Dual themes are emitted as CSS variables so switching the site
 * theme doesn't require re-highlighting.
 */

const languages = [
  "c",
  "cpp",
  "rust",
  "python",
  "typescript",
  "javascript",
  "tsx",
  "go",
  "asm",
  "verilog",
  "bash",
  "json",
  "yaml",
  "sql",
  "makefile",
  "diff",
];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: languages,
  });
  return highlighterPromise;
}

export async function highlight(code: string, lang?: string | null) {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  const language = lang && loaded.includes(lang) ? lang : "text";

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    // Light colours land inline; dark ones ride along as --shiki-dark and are
    // swapped by a single CSS rule in globals.css.
    defaultColor: "light",
  });
}
