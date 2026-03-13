/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of the mut helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-mut-helper.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          setterAlternative: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpected:
        'Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.',
      unexpectedWithAlternative:
        'Unexpected usage of mut helper. If using mut as a setter, consider using a JS action or {{setterAlternative}} instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-mut-helper.js',
      docs: 'docs/rule/no-mut-helper.md',
      tests: 'test/unit/rules/no-mut-helper-test.js',
    },
  },

  create(context) {
    const setterAlternative = context.options[0]?.setterAlternative;

    function checkForMutHelper(node) {
      if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'mut') {
        if (setterAlternative) {
          context.report({
            node,
            messageId: 'unexpectedWithAlternative',
            data: { setterAlternative },
          });
        } else {
          context.report({ node, messageId: 'unexpected' });
        }
      }
    }

    return {
      GlimmerMustacheStatement: checkForMutHelper,
      GlimmerSubExpression: checkForMutHelper,
    };
  },
};
