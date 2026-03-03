/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require iframe elements to have a title attribute',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-iframe-title.md',
    },
    schema: [],
    messages: {
      missingTitle: '<iframe> elements must have a unique title property.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-iframe-title.js',
      docs: 'docs/rule/require-iframe-title.md',
      tests: 'test/unit/rules/require-iframe-title-test.js',
    },
  },
  create(context) {
    const knownTitles = [];

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
                context.report({ node, messageId: 'missingTitle' });
              } else {
                // Check for duplicate titles
                const existingIdx = knownTitles.findIndex(([val]) => val === value);
                if (existingIdx === -1) {
                  knownTitles.push([value, node]);
                } else {
                  context.report({ node, messageId: 'missingTitle' });
                }
              }
              break;
            }
            case 'GlimmerMustacheStatement': {
              // title={{false}} → BooleanLiteral false is invalid
              if (titleAttr.value.path?.type === 'GlimmerBooleanLiteral') {
                context.report({ node, messageId: 'missingTitle' });
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
                context.report({ node, messageId: 'missingTitle' });
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
