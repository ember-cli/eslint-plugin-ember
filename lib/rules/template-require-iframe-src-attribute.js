const ERROR_MESSAGE =
  'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.';
const FIXED_SRC_ATTRIBUTE = 'src="about:blank"';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require iframe elements to have src attribute',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-iframe-src-attribute.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireSrc: ERROR_MESSAGE,
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-iframe-src-attribute.js',
      docs: 'docs/rule/require-iframe-src-attribute.md',
      tests: 'test/unit/rules/require-iframe-src-attribute-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'iframe') {
          return;
        }

        const hasSrcAttribute = node.attributes.find((attr) => attr.name === 'src');

        if (!hasSrcAttribute) {
          context.report({
            node,
            messageId: 'requireSrc',
            fix(fixer) {
              const firstModifier = node.modifiers[0];

              if (firstModifier) {
                return fixer.insertTextBeforeRange(
                  [firstModifier.range[0], firstModifier.range[0]],
                  `${FIXED_SRC_ATTRIBUTE} `
                );
              }

              const lastAttribute = node.attributes.at(-1);

              if (lastAttribute) {
                return fixer.insertTextAfterRange(lastAttribute.range, ` ${FIXED_SRC_ATTRIBUTE}`);
              }

              const tagNameEnd = node.parts.at(-1)?.range[1] ?? node.range[0] + '<iframe'.length;

              return fixer.insertTextAfterRange(
                [tagNameEnd, tagNameEnd],
                ` ${FIXED_SRC_ATTRIBUTE}`
              );
            },
          });
        }
      },
    };
  },
};
