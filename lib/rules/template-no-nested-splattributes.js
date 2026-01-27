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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-nested-splattributes.js',
      docs: 'docs/rule/no-nested-splattributes.md',
      tests: 'test/unit/rules/no-nested-splattributes-test.js',
    },
  },

  create(context) {
    const splattributesStack = [];

    return {
      GlimmerElementNode(node) {
        const hasSplattributes = node.attributes.some(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === '...attributes'
        );

        if (hasSplattributes) {
          if (splattributesStack.length > 0) {
            // Found ...attributes on an element nested inside another element with ...attributes
            const attr = node.attributes.find(
              (a) => a.type === 'GlimmerAttrNode' && a.name === '...attributes'
            );
            context.report({
              node: attr,
              messageId: 'noNestedSplattributes',
            });
          }
          splattributesStack.push(node);
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (splattributesStack.length > 0 && splattributesStack.at(-1) === node) {
          splattributesStack.pop();
        }
      },
    };
  },
};
