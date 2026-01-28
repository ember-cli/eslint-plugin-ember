/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow element event actions (use {{on}} modifier instead)',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-element-event-actions.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noElementEventActions: 'Do not use element event actions. Use the (on) modifier instead.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.attributes) {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name && attr.name.startsWith('on')) {
            context.report({
              node: attr,
              messageId: 'noElementEventActions',
            });
          }
        }
      },
    };
  },
};
