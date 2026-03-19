function isModifierHelper(node) {
  return node.path?.original === 'modifier';
}

function isValidFirstParam(node) {
  return (
    node.type === 'GlimmerStringLiteral' || (node.type === 'GlimmerPathExpression' && node.original)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require simple modifier syntax',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-simple-modifiers.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidFirstArgument:
        'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/simple-modifiers.js',
      docs: 'docs/rule/simple-modifiers.md',
      tests: 'test/unit/rules/simple-modifiers-test.js',
    },
  },

  create(context) {
    return {
      // This catches {{(modifier ...)}} expressions
      GlimmerSubExpression(node) {
        if (!isModifierHelper(node)) {
          return;
        }

        const firstParam = node.params?.[0];

        if (!firstParam) {
          context.report({
            node,
            messageId: 'invalidFirstArgument',
          });
          return;
        }

        if (!isValidFirstParam(firstParam)) {
          context.report({
            node: firstParam,
            messageId: 'invalidFirstArgument',
          });
        }
      },
    };
  },
};
