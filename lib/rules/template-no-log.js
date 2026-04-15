/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{log}} in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-log.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected log statement in template.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-log.js',
      docs: 'docs/rule/no-log.md',
      tests: 'test/unit/rules/no-log-test.js',
    },
  },

  create(context) {
    // `log` is an ambient strict-mode keyword (Glimmer CALL_KEYWORDS), so
    // `{{log foo}}` works in .gjs/.gts without an import. Still flag it — but
    // skip when `log` resolves to a binding (JS import/const, or template
    // block param). ember-eslint-parser registers template block params in
    // scope, so a single getScope walk covers both.
    const sourceCode = context.sourceCode;

    function isInScope(node, name) {
      if (!sourceCode) {
        return false;
      }
      try {
        let scope = sourceCode.getScope(node);
        while (scope) {
          if (scope.variables.some((v) => v.name === name)) {
            return true;
          }
          scope = scope.upper;
        }
      } catch {
        // getScope not available in .hbs-only mode
      }
      return false;
    }

    function checkForLog(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'log' &&
        !isInScope(node, 'log')
      ) {
        context.report({ node, messageId: 'unexpected' });
      }
    }

    return {
      GlimmerBlockStatement(node) {
        checkForLog(node);
      },
      GlimmerMustacheStatement(node) {
        checkForLog(node);
      },
    };
  },
};
