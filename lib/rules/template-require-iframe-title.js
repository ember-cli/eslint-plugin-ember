'use strict';

// Non-string literal AST nodes (boolean/null/undefined/number) don't represent
// a meaningful author-provided title. Even though they would coerce to strings
// at runtime (e.g. `true` → "true", `42` → "42"), those strings do not describe
// the frame's content — the rule rejects the literal forms.
const INVALID_LITERAL_TYPES = new Set([
  'GlimmerBooleanLiteral',
  'GlimmerNullLiteral',
  'GlimmerUndefinedLiteral',
  'GlimmerNumberLiteral',
]);

function isInvalidTitleLiteralPath(path) {
  return INVALID_LITERAL_TYPES.has(path?.type);
}

function getInvalidLiteralType(path) {
  if (!path) {
    return undefined;
  }
  switch (path.type) {
    case 'GlimmerBooleanLiteral': {
      return 'boolean';
    }
    case 'GlimmerNullLiteral': {
      return 'null';
    }
    case 'GlimmerUndefinedLiteral': {
      return 'undefined';
    }
    case 'GlimmerNumberLiteral': {
      return 'number';
    }
    default: {
      return undefined;
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require iframe elements to have a title attribute',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-iframe-title.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowWhitespaceOnlyTitle: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      // Five messageIds (missingTitle, emptyTitle, invalidTitleLiteral,
      // duplicateTitleFirst, duplicateTitleOther) for richer diagnostic detail.
      missingTitle: '<iframe> elements must have a unique title property.',
      emptyTitle: '<iframe> elements must have a unique title property.',
      invalidTitleLiteral:
        '<iframe title> must be a non-empty string. Got {{literalType}} literal, which does not describe the frame contents.',
      duplicateTitleFirst: 'This title is not unique. #{{index}}',
      duplicateTitleOther:
        '<iframe> elements must have a unique title property. Value title="{{title}}" already used for different iframe. #{{index}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-iframe-title.js',
      docs: 'docs/rule/require-iframe-title.md',
      tests: 'test/unit/rules/require-iframe-title-test.js',
    },
  },
  create(context) {
    // Whitespace-only `title="   "` is technically spec-compliant: ACCNAME
    // 1.2 step 2I (Tooltip) does not whitespace-trim like step 2D
    // (aria-label) does, so a 3-space accessible name is assigned. That is
    // useless in practice but not a spec violation. Default behavior flags
    // it as authoring hygiene; set `allowWhitespaceOnlyTitle: true` to
    // align with spec/peer behavior.
    const allowWhitespaceOnlyTitle = Boolean(context.options[0]?.allowWhitespaceOnlyTitle);

    // Each entry: { value, node, index }
    //  - value: trimmed title string
    //  - node: original element node for the first occurrence
    //  - index: duplicate-group index (1-based), assigned lazily on collision
    const knownTitles = [];
    let nextDuplicateIndex = 1;

    // Process a statically-known title string (from a text node OR a
    // mustache string literal OR a single-part concat). Handles the empty /
    // whitespace / duplicate logic that's shared across those AST shapes.
    function processStaticTitle(node, raw) {
      const value = raw.trim();
      if (value.length === 0) {
        // Empty-string title always fails: no accessible name for screen readers.
        // Whitespace-only titles are controlled by `allowWhitespaceOnlyTitle`.
        if (raw.length === 0 || !allowWhitespaceOnlyTitle) {
          context.report({ node, messageId: 'emptyTitle' });
        }
        return;
      }
      // Duplicate check — reports BOTH the first and the current occurrence
      // on every collision, sharing a `#N` index so users can correlate them.
      // For three or more duplicates the first occurrence is therefore
      // re-reported once per collision.
      const existing = knownTitles.find((entry) => entry.value === value);
      if (existing) {
        if (existing.index === null) {
          existing.index = nextDuplicateIndex++;
        }
        const index = existing.index;
        context.report({
          node: existing.node,
          messageId: 'duplicateTitleFirst',
          data: { index: String(index) },
        });
        context.report({
          node,
          messageId: 'duplicateTitleOther',
          data: { title: raw, index: String(index) },
        });
      } else {
        knownTitles.push({ value, node, index: null });
      }
    }

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'iframe') {
          return;
        }

        // Skip if aria-hidden or hidden
        const hasAriaHidden = node.attributes?.some((a) => a.name === 'aria-hidden');
        const hasHidden = node.attributes?.some((a) => a.name === 'hidden');
        if (hasAriaHidden || hasHidden) {
          return;
        }

        // Check for title attribute
        const titleAttr = node.attributes?.find((a) => a.name === 'title');
        if (!titleAttr) {
          context.report({ node, messageId: 'missingTitle' });
          return;
        }

        if (titleAttr.value) {
          switch (titleAttr.value.type) {
            case 'GlimmerTextNode': {
              processStaticTitle(node, titleAttr.value.chars);
              break;
            }
            case 'GlimmerMustacheStatement': {
              // Non-string literal mustaches — boolean / null / undefined /
              // number — get a specific "invalidTitleLiteral" diagnostic
              // because the literal coerces to a string at runtime that
              // doesn't describe the frame contents.
              if (isInvalidTitleLiteralPath(titleAttr.value.path)) {
                context.report({
                  node,
                  messageId: 'invalidTitleLiteral',
                  data: { literalType: getInvalidLiteralType(titleAttr.value.path) },
                });
                break;
              }
              // String-literal mustaches resolve to their static value — a
              // non-empty literal supplies an accessible name the same as a
              // text node. Empty / whitespace literals are flagged the same
              // way as `title=""` / `title="   "`.
              if (titleAttr.value.path?.type === 'GlimmerStringLiteral') {
                processStaticTitle(node, titleAttr.value.path.value);
              }
              break;
            }
            case 'GlimmerConcatStatement': {
              const parts = titleAttr.value.parts || [];
              // Single-part concat wrapping a non-string literal — same
              // diagnostic as the bare mustache form.
              if (
                parts.length === 1 &&
                parts[0].type === 'GlimmerMustacheStatement' &&
                isInvalidTitleLiteralPath(parts[0].path)
              ) {
                context.report({
                  node,
                  messageId: 'invalidTitleLiteral',
                  data: { literalType: getInvalidLiteralType(parts[0].path) },
                });
                break;
              }
              // Single-part concat wrapping a string literal — resolve to
              // the static value and apply the same checks as a text node.
              if (
                parts.length === 1 &&
                parts[0].type === 'GlimmerMustacheStatement' &&
                parts[0].path?.type === 'GlimmerStringLiteral'
              ) {
                processStaticTitle(node, parts[0].path.value);
              }
              break;
            }
            default: {
              break;
            }
          }
        }
      },
    };
  },
};
