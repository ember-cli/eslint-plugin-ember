/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow nested ...attributes usage',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-nested-splattributes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noNestedSplattributes:
        'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        // Check each attribute of this element
        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name === '...attributes') {
            // Check if THIS element has a parent element
            let parent = node.parent;
            while (parent) {
              if (parent.type === 'GlimmerElementNode') {
                // Found a parent element - this is nested!
                context.report({
                  node: attr,
                  messageId: 'noNestedSplattributes',
                });
                break;
              }
              parent = parent.parent;
            }
          }
        }
      },
    };
  },
};
