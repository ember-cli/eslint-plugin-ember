const TRANSFORMATIONS = {
  hasBlock: 'has-block',
  hasBlockParams: 'has-block-params',
};

function getErrorMessage(name) {
  return `\`${name}\` is deprecated. Use the \`${TRANSFORMATIONS[name]}\` helper instead.`;
}

function shouldWrapInSubExpression(node) {
  const parent = node.parent;

  if (!parent) {
    return false;
  }

  if (parent.type === 'GlimmerBlockStatement') {
    return true;
  }

  if (
    (parent.type === 'GlimmerMustacheStatement' || parent.type === 'GlimmerSubExpression') &&
    parent.path !== node
  ) {
    return true;
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require (has-block) helper usage instead of hasBlock property',
      category: 'Best Practices',
      fixable: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-has-block-helper.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-has-block-helper.js',
      docs: 'docs/rule/require-has-block-helper.md',
      tests: 'test/unit/rules/require-has-block-helper-test.js',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        const replacement = TRANSFORMATIONS[node.original];

        if (replacement) {
          context.report({
            node,
            message: getErrorMessage(node.original),
            fix(fixer) {
              return fixer.replaceTextRange(
                node.range,
                shouldWrapInSubExpression(node) ? `(${replacement})` : replacement
              );
            },
          });
        }
      },
    };
  },
};
