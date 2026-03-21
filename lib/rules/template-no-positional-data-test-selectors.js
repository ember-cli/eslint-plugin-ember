const BUILT_INS = new Set([
  'action',
  'array',
  'component',
  'concat',
  'debugger',
  'each',
  'each-in',
  'fn',
  'get',
  'hasBlock',
  'has-block',
  'has-block-params',
  'hash',
  'if',
  'input',
  'let',
  'link-to',
  'loc',
  'log',
  'mount',
  'mut',
  'on',
  'outlet',
  'partial',
  'query-params',
  'textarea',
  'unbound',
  'unless',
  'with',
  '-in-element',
  'in-element',
]);

function checkNode(node, context) {
  if (!node.path || BUILT_INS.has(node.path.original)) {
    return;
  }

  if (!node.params) {
    return;
  }

  for (const param of node.params) {
    if (
      param.type === 'GlimmerPathExpression' &&
      param.original &&
      param.original.startsWith('data-test-')
    ) {
      context.report({
        node,
        messageId: 'noPositionalDataTest',
      });
      return;
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positional data-test-* params in curly invocations',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-positional-data-test-selectors.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noPositionalDataTest:
        'Passing a `data-test-*` positional param to a curly invocation should be avoided.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-positional-data-test-selectors.js',
      docs: 'docs/rule/no-positional-data-test-selectors.md',
      tests: 'test/unit/rules/no-positional-data-test-selectors-test.js',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        checkNode(node, context);
      },

      GlimmerBlockStatement(node) {
        checkNode(node, context);
      },
    };
  },
};
