function isEmptyNode(node) {
  return (
    node.type === 'GlimmerMustacheCommentStatement' ||
    node.type === 'GlimmerCommentStatement' ||
    (node.type === 'GlimmerTextNode' && !node.chars.trim())
  );
}

function isYieldOnly(node) {
  return (
    node.type === 'GlimmerMustacheStatement' &&
    node.path &&
    node.path.type === 'GlimmerPathExpression' &&
    node.path.original === 'yield' &&
    node.params &&
    node.params.length === 0
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow components that only yield',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-only.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noYieldOnly: '{{yieldExpression}}-only templates are not allowed',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-yield-only.js',
      docs: 'docs/rule/no-yield-only.md',
      tests: 'test/unit/rules/no-yield-only-test.js',
    },
  },

  create(context) {
    let isOnlyYield = false;

    return {
      GlimmerTemplate(node) {
        const templateNodes =
          node.body[0] &&
          node.body[0].type === 'GlimmerElementNode' &&
          node.body[0].tag === 'template'
            ? node.body[0].children
            : node.body;

        const nonEmptyNodes = templateNodes.filter((n) => !isEmptyNode(n));
        if (nonEmptyNodes.length === 1 && isYieldOnly(nonEmptyNodes[0])) {
          isOnlyYield = true;
        }
      },

      GlimmerMustacheStatement(node) {
        if (isOnlyYield) {
          context.report({
            node,
            messageId: 'noYieldOnly',
            data: { yieldExpression: '{{yield}}' },
          });
        }
      },
    };
  },
};
