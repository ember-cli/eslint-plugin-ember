/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow components that only yield',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-only.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noYieldOnly:
        'Component should not only yield. Add wrapper element or additional functionality.',
    },
  },

  create(context) {
    return {
      GlimmerTemplate(node) {
        // The template body contains a GlimmerElementNode for <template>
        // The actual content is in its children
        if (!node.body || node.body.length === 0) {
          return;
        }

        const templateElement = node.body[0];
        if (!templateElement || templateElement.type !== 'GlimmerElementNode') {
          return;
        }

        const children = templateElement.children || [];

        let hasYield = false;
        let yieldNode = null;
        let hasOtherContent = false;

        for (const child of children) {
          if (child.type === 'GlimmerMustacheStatement') {
            if (
              child.path &&
              child.path.type === 'GlimmerPathExpression' &&
              child.path.original === 'yield'
            ) {
              hasYield = true;
              yieldNode = child;
            } else {
              hasOtherContent = true;
            }
          } else if (child.type === 'GlimmerElementNode') {
            hasOtherContent = true;
          } else if (
            child.type === 'GlimmerTextNode' &&
            child.chars &&
            child.chars.trim().length > 0
          ) {
            hasOtherContent = true;
          }
        }

        if (hasYield && !hasOtherContent && yieldNode) {
          context.report({
            node: yieldNode,
            messageId: 'noYieldOnly',
          });
        }
      },
    };
  },
};
