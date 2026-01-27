/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require splattributes usage in component templates',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-splattributes.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      'GlimmerTemplate:exit'(node) {
        // Check if any element in the template has splattributes
        let hasSplattributes = false;

        function checkNode(n) {
          if (!n) {
            return;
          }
          if (n.type === 'GlimmerElementNode') {
            const hasSplat =
              n.attributes && n.attributes.some((attr) => attr.name === '...attributes');
            if (hasSplat) {
              hasSplattributes = true;
            }
            // Check children
            if (n.children) {
              for (const child of n.children) {
                checkNode(child);
              }
            }
          } else if (n.children) {
            for (const child of n.children) {
              checkNode(child);
            }
          }
        }

        // Check body
        if (node.body) {
          for (const child of node.body) {
            checkNode(child);
          }
        }

        if (hasSplattributes) {
          return;
        }

        // Find all top-level element nodes in the body
        const elementNodes = node.body.filter((child) => child.type === 'GlimmerElementNode');

        // Count text nodes that aren't just whitespace
        const significantTextNodes = node.body.filter(
          (child) => child.type === 'GlimmerTextNode' && child.chars.trim() !== ''
        );

        const hasOnlyOneElement = elementNodes.length === 1 && significantTextNodes.length === 0;

        if (hasOnlyOneElement) {
          // Single root element with no other content, should have splattributes
          context.report({
            node: elementNodes[0],
            message: 'The root element in this template should use `...attributes`',
          });
        } else if (elementNodes.length > 1) {
          // Multiple elements, at least one should have splattributes
          context.report({
            node,
            message: 'At least one element in this template should use `...attributes`',
          });
        }
      },
    };
  },
};
