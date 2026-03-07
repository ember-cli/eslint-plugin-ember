'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Lightweight .editorconfig parser.
 *
 * Walks up from `filePath` collecting .editorconfig files, parses their
 * INI-like sections, and returns the merged properties that apply.
 *
 * Only simple glob patterns are supported:
 *   *            – matches everything
 *   *.ext        – matches files with that extension
 *   *.{a,b}      – matches files with extension a or b
 *   [section]    – literal pattern
 *
 * This intentionally does NOT replicate the full editorconfig-core spec
 * (no ** path globs, no numeric ranges, etc.) because for indent_size
 * resolution the simple patterns cover virtually all real configs.
 */

const COMMENT_RE = /^\s*[#;]/;
const SECTION_RE = /^\s*\[(.+?)]\s*$/;
const PROPERTY_RE = /^\s*([\w.-]+)\s*=\s*(.*?)\s*$/;

function parseEditorConfig(contents) {
  const sections = [];
  let current = { glob: null, props: {} }; // preamble (root, etc.)
  sections.push(current);

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || COMMENT_RE.test(line)) {
      continue;
    }
    const sectionMatch = SECTION_RE.exec(line);
    if (sectionMatch) {
      current = { glob: sectionMatch[1], props: {} };
      sections.push(current);
      continue;
    }
    const propMatch = PROPERTY_RE.exec(line);
    if (propMatch) {
      const key = propMatch[1].toLowerCase();
      let value = propMatch[2].toLowerCase();
      // Parse numbers and booleans
      if (/^\d+$/.test(value)) {
        value = Number(value);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      current.props[key] = value;
    }
  }
  return sections;
}

/**
 * Tests whether a simple editorconfig glob matches a filename (basename only).
 */
function globMatchesFilename(glob, filename) {
  // Strip leading path separators (editorconfig globs without / apply to basename)
  if (glob.includes('/')) {
    // Path-style globs are not supported in this lightweight impl
    return false;
  }
  if (glob === '*') {
    return true;
  }
  // Handle *.{ext1,ext2} and *.ext
  const braceMatch = /^\*\.{([^}]+)}$/.exec(glob);
  if (braceMatch) {
    const extensions = braceMatch[1].split(',').map((e) => e.trim());
    return extensions.some((ext) => filename.endsWith(`.${ext}`));
  }
  if (glob.startsWith('*.')) {
    const ext = glob.slice(1); // e.g. ".hbs"
    return filename.endsWith(ext);
  }
  // Literal match
  return filename === glob;
}

/**
 * Collect .editorconfig files from `dir` up to the filesystem root,
 * stopping at a file that declares `root = true`.
 */
function collectConfigFiles(dir) {
  const files = [];
  let current = dir;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const configPath = path.join(current, '.editorconfig');
    try {
      const contents = fs.readFileSync(configPath, 'utf8');
      const sections = parseEditorConfig(contents);
      const isRoot = sections[0] && sections[0].glob === null && sections[0].props.root === true;
      files.push({ dir: current, sections });
      if (isRoot) {
        break;
      }
    } catch {
      // No .editorconfig at this level, keep going
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return files;
}

/**
 * Resolve editorconfig properties for a given file path.
 *
 * Returns an object like `{ indent_size: 4, indent_style: 'space', ... }`
 * with only the properties that matched. Returns an empty object if no
 * .editorconfig is found or no sections match.
 */
function resolveEditorConfig(filePath) {
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath);
  const configFiles = collectConfigFiles(dir);

  // Merge: outermost first, innermost wins (same as editorconfig spec)
  const merged = {};
  for (let i = configFiles.length - 1; i >= 0; i--) {
    for (const section of configFiles[i].sections) {
      if (section.glob === null) {
        continue; // preamble section (root = true, etc.)
      }
      if (globMatchesFilename(section.glob, filename)) {
        Object.assign(merged, section.props);
      }
    }
  }

  // Apply editorconfig post-processing rules
  if (merged.indent_style === 'tab' && merged.indent_size === undefined) {
    merged.indent_size = 'tab';
  }
  if (
    merged.indent_size !== undefined &&
    merged.tab_width === undefined &&
    merged.indent_size !== 'tab'
  ) {
    merged.tab_width = merged.indent_size;
  }
  if (merged.indent_size === 'tab' && merged.tab_width !== undefined) {
    merged.indent_size = merged.tab_width;
  }

  return merged;
}

module.exports = { resolveEditorConfig };
