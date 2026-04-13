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
    schema: [],
    messages: {
      // Split from a single `missingTitle` into four messageIds aligned with
      // upstream ember-template-lint, providing richer diagnostic detail.
      missingTitle: '<iframe> elements must have a unique title property.',
      emptyTitle: '<iframe> elements must have a unique title property.',
      dynamicFalseTitle: '<iframe> elements must have a unique title property.',
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
    // Each entry: { value, node, index }
    //  - value: trimmed title string
    //  - node: original element node for the first occurrence
    //  - index: duplicate-group index (1-based), assigned lazily on collision
    const knownTitles = [];
    let nextDuplicateIndex = 1;

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
              const value = titleAttr.value.chars.trim();
              if (value.length === 0) {
                context.report({ node, messageId: 'emptyTitle' });
              } else {
                // Check for duplicate titles. Upstream reports BOTH the
                // first and the current occurrence of a duplicated title
                // on every collision, sharing a `#N` index so users can
                // correlate them. For three or more duplicates the first
                // occurrence is therefore re-reported once per collision.
                const existing = knownTitles.find((entry) => entry.value === value);
                if (existing) {
                  if (existing.index === null) {
                    existing.index = nextDuplicateIndex++;
                  }
                  const index = existing.index;

                  // Report on the first occurrence on every collision,
                  // matching upstream ember-template-lint behavior.
                  context.report({
                    node: existing.node,
                    messageId: 'duplicateTitleFirst',
                    data: { index: String(index) },
                  });

                  // Report on the current (duplicate) occurrence.
                  context.report({
                    node,
                    messageId: 'duplicateTitleOther',
                    data: { title: titleAttr.value.chars, index: String(index) },
                  });
                } else {
                  knownTitles.push({ value, node, index: null });
                }
              }
              break;
            }
            case 'GlimmerMustacheStatement': {
              // title={{false}} → BooleanLiteral false is invalid
              if (titleAttr.value.path?.type === 'GlimmerBooleanLiteral') {
                context.report({ node, messageId: 'dynamicFalseTitle' });
              }
              break;
            }
            case 'GlimmerConcatStatement': {
              // title="{{false}}" → ConcatStatement with single BooleanLiteral part
              const parts = titleAttr.value.parts || [];
              if (
                parts.length === 1 &&
                parts[0].type === 'GlimmerMustacheStatement' &&
                parts[0].path?.type === 'GlimmerBooleanLiteral'
              ) {
                context.report({ node, messageId: 'dynamicFalseTitle' });
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
