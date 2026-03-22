'use strict';

const noop = require('ember-eslint-parser/noop');

/**
 * Regex pattern for template-lint-disable mustache comments:
 *   {{! template-lint-disable rule1 rule2 }}
 *   {{!-- template-lint-disable rule1 rule2 --}}
 */
const TEMPLATE_LINT_DISABLE_REGEX =
  /{{!-*\s*template-lint-disable\s*([\s\S]*?)-*}}/g;

// Store disable directives per file
const fileDisableDirectives = new Map();

/**
 * Parse template-lint-disable comments from source text and store
 * which lines/rules should be suppressed.
 *
 * template-lint-disable means "disable next line" (like eslint-disable-next-line).
 */
function parseDisableDirectives(text) {
  const directives = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    TEMPLATE_LINT_DISABLE_REGEX.lastIndex = 0;
    let match;

    while ((match = TEMPLATE_LINT_DISABLE_REGEX.exec(line)) !== null) {
      const rulesPart = (match[1] || '').trim();
      // Strip trailing -- from mustache block comments
      const cleaned = rulesPart.replace(/-+$/, '').trim();

      const rules = cleaned
        ? cleaned.split(/[\s,]+/).filter(Boolean)
        : []; // empty = disable all

      directives.push({
        // comment is on line i+1 (1-indexed), next line is i+2
        line: i + 2,
        rules,
      });
    }
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
    if (message.line !== directive.line) {
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
