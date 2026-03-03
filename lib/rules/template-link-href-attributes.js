/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require href attribute on link elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-link-href-attributes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingHref:
        '<a> elements must have an href attribute. Use <button> for clickable elements that are not links.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/link-href-attributes.js',
      docs: 'docs/rule/link-href-attributes.md',
      tests: 'test/unit/rules/link-href-attributes-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }

        const hasHref = node.attributes?.some((attr) => attr.name === 'href');

        if (!hasHref) {
          // An anchor with both role and aria-disabled is a valid disabled link pattern
          const hasAriaRole = node.attributes?.some((attr) => attr.name === 'role');
          const hasAriaDisabled = node.attributes?.some((attr) => attr.name === 'aria-disabled');
          if (hasAriaRole && hasAriaDisabled) {
            return;
          }

          context.report({
            node,
            messageId: 'missingHref',
          });
        }
      },
    };
  },
};
