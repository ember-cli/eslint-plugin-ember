/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require self-closing on void elements',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-self-closing-void-elements.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireSelfClosing: 'Void element should be self-closing.',
    },
  },

  create(context) {
    const VOID_ELEMENTS = new Set([
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]);

    return {
      GlimmerElementNode(node) {
        if (VOID_ELEMENTS.has(node.tag) && !node.selfClosing) {
          context.report({
            node,
            messageId: 'requireSelfClosing',
          });
        }
      },
    };
  },
};
