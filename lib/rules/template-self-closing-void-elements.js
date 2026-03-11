/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require self-closing on void elements',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-self-closing-void-elements.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [{ type: 'boolean' }, { type: 'string', enum: ['require'] }],
      },
    ],
    messages: {
      redundantSelfClosing: 'Self-closing a void element is redundant.',
      requireSelfClosing: 'Self-closing a void element is required.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/self-closing-void-elements.js',
      docs: 'docs/rule/self-closing-void-elements.md',
      tests: 'test/unit/rules/self-closing-void-elements-test.js',
    },
  },

  create(context) {
    const VOID_ELEMENTS = new Set([
      'area',
      'base',
      'br',
      'col',
      'command',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]);

    const config = context.options[0];
    const requireSelfClosing = config === 'require';

    return {
      GlimmerElementNode(node) {
        if (!VOID_ELEMENTS.has(node.tag)) {
          return;
        }

        if (requireSelfClosing) {
          if (!node.selfClosing) {
            context.report({
              node,
              messageId: 'requireSelfClosing',
            });
          }
        } else {
          if (node.selfClosing) {
            context.report({
              node,
              messageId: 'redundantSelfClosing',
            });
          }
        }
      },
    };
  },
};
