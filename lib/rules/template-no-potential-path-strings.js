const FINE_SYMBOLS = ['|', '/', '\\'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow potential path strings in attribute values',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-potential-path-strings.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noPotentialPathStrings:
        'Potential path in attribute string detected. Did you mean {{{{path}}}}?',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-potential-path-strings.js',
      docs: 'docs/rule/no-potential-path-strings.md',
      tests: 'test/unit/rules/no-potential-path-strings-test.js',
    },
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (!node.value || node.value.type !== 'GlimmerTextNode') {
          return;
        }

        const chars = node.value.chars;
        const hasSpecialPrefix = chars.startsWith('this.') || chars.startsWith('@');

        if (hasSpecialPrefix && !FINE_SYMBOLS.some((symbol) => chars.includes(symbol))) {
          context.report({
            node: node.value,
            messageId: 'noPotentialPathStrings',
            data: { path: chars },
          });
        }
      },
    };
  },
};
