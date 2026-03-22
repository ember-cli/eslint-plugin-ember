'use strict';

const noop = require('ember-eslint-parser/noop');

/**
 * Regex patterns for template-lint-disable mustache comments.
 * Two separate patterns to avoid polynomial backtracking (ReDoS):
 *   {{! template-lint-disable rule1 rule2 }}
 *   {{!-- template-lint-disable rule1 rule2 --}}
 */
const MUSTACHE_COMMENT_REGEX =
  /{{!\s+template-lint-disable([\w\s,/-]*)}}/g;
const MUSTACHE_BLOCK_COMMENT_REGEX =
  /{{!--\s*template-lint-disable([\w\s,/-]*)--}}/g;

// Store disable directives per file
const fileDisableDirectives = new Map();

/**
 * Parse template-lint-disable comments from source text and store
 * which lines/rules should be suppressed.
 *
 * template-lint-disable means "disable next line" (like eslint-disable-next-line).
 */
function collectMatches(line, lineIndex, directives) {
  for (const regex of [MUSTACHE_COMMENT_REGEX, MUSTACHE_BLOCK_COMMENT_REGEX]) {
    regex.lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      const rulesPart = (match[1] || '').trim();
      const rules = rulesPart
        ? rulesPart.split(/[\s,]+/).filter(Boolean)
        : []; // empty = disable all

      // Comment is on line lineIndex+1 (1-indexed), next line is lineIndex+2.
      // In template ASTs, TextNodes can start on the same line as the comment
      // (e.g. the newline after {{! template-lint-disable }} is part of the
      // following TextNode), so we suppress both the comment line and the next.
      directives.push({
        commentLine: lineIndex + 1,
        nextLine: lineIndex + 2,
        rules,
      });
    }
  }
}

function parseDisableDirectives(text) {
  const directives = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    collectMatches(lines[i], i, directives);
  }

  return directives;
}

/**
 * Map a rule name from template-lint format to eslint-plugin-ember format.
 * e.g. "no-bare-strings" -> "ember/template-no-bare-strings"
 *
 * Also accepts already-qualified names like "ember/template-no-bare-strings".
 */
function matchesRule(ruleId, disableRuleName) {
  if (ruleId === disableRuleName) {
    return true;
  }
  // Map template-lint name to eslint-plugin-ember name
  if (ruleId === `ember/template-${disableRuleName}`) {
    return true;
  }
  return false;
}

function shouldSuppressMessage(message, directives) {
  for (const directive of directives) {
    if (message.line !== directive.commentLine && message.line !== directive.nextLine) {
      continue;
    }
    // No rules specified = suppress all
    if (directive.rules.length === 0) {
      return true;
    }
    // Check if any specified rule matches this message's rule
    if (directive.rules.some((rule) => matchesRule(message.ruleId, rule))) {
      return true;
    }
  }
  return false;
}

module.exports = {
  registerParsedFile: noop.registerParsedFile,

  preprocess(text, fileName) {
    const directives = parseDisableDirectives(text);
    if (directives.length > 0) {
      fileDisableDirectives.set(fileName, directives);
    } else {
      fileDisableDirectives.delete(fileName);
    }
    // Return text as-is (single code block)
    return [text];
  },

  postprocess(messages, fileName) {
    // First, apply noop's postprocess logic (config validation)
    const msgs = noop.postprocess(messages, fileName);

    const directives = fileDisableDirectives.get(fileName);
    if (!directives) {
      return msgs;
    }

    fileDisableDirectives.delete(fileName);
    return msgs.filter((message) => !shouldSuppressMessage(message, directives));
  },

  supportsAutofix: true,
};
