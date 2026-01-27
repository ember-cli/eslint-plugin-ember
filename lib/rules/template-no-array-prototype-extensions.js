/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of Ember Array prototype extensions',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-array-prototype-extensions.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noArrayPrototypeExtensions:
        'Do not use Ember Array prototype extension "{{property}}". Use native array methods or computed properties instead.',
    },
  },

  create(context) {
    const ARRAY_EXTENSIONS = new Set(['firstObject', 'lastObject', 'length', '@each', '[]']);

    return {
      GlimmerPathExpression(node) {
        // Check if this is a path that accesses an array extension
        if (node.parts && node.parts.length > 1) {
          const lastPart = node.parts.at(-1);
          if (ARRAY_EXTENSIONS.has(lastPart)) {
            context.report({
              node,
              messageId: 'noArrayPrototypeExtensions',
              data: {
                property: lastPart,
              },
            });
          }
        }
      },
    };
  },
};
