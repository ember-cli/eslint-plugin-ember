const ERROR_MESSAGE =
  'Using `...attributes` with `class` attribute is not allowed. Use `...attributes` alone to allow class merging.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow splattributes with class attribute',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-splattributes-with-class.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const hasSplattributes = node.attributes.some((attr) => attr.name === '...attributes');
        const classAttribute = node.attributes.find((attr) => attr.name === 'class');

        if (hasSplattributes && classAttribute) {
          context.report({
            node: classAttribute,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
