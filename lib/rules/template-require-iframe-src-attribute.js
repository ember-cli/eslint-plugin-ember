const ERROR_MESSAGE =
  'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require iframe elements to have src attribute',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-iframe-src-attribute.md',
    },
    fixable: null,
    schema: [],
    messages: {},
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
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
