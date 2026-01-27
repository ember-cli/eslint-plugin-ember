const ERROR_MESSAGE =
  'Only default slot used — prefer direct block content without <:default> for clarity and simplicity.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using only the default slot',
      category: 'Stylistic Issues',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-only-default-slot.md',
    },
    fixable: 'code',
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === ':default') {
          // Find the parent element node
          const parent = node.parent;

          if (parent && parent.type === 'GlimmerElementNode') {
            // Check if parent has only one child (the :default node)
            if (parent.children && parent.children.length === 1) {
              context.report({
                node,
                message: ERROR_MESSAGE,
                fix(fixer) {
                  const sourceCode = context.getSourceCode();
                  // Replace the :default node with its children
                  if (node.children && node.children.length > 0) {
                    const childrenText = node.children
                      .map((child) => sourceCode.getText(child))
                      .join('');
                    return fixer.replaceText(node, childrenText);
                  } else {
                    // If no children, just remove the :default node
                    return fixer.remove(node);
                  }
                },
              });
            }
          }
        }
      },
    };
  },
};
