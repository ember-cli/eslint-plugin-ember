/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{unbound}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unbound.md',
      templateMode: 'both',
    },
    schema: [],
    messages: { unexpected: 'Unexpected {{unboundHelper}} usage.' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unbound.js',
      docs: 'docs/rule/no-unbound.md',
      tests: 'test/unit/rules/no-unbound-test.js',
    },
  },
  create(context) {
    // `unbound` is an ambient strict-mode keyword (registered in Ember's
    // STRICT_MODE_KEYWORDS, backed by BUILTIN_KEYWORD_HELPERS.unbound), so
    // `{{unbound foo}}` works in .gjs/.gts without an import. Flag it
    // everywhere unless shadowed by a JS binding or template block param —
    // ember-eslint-parser registers template block params in scope, so a
    // single getScope walk covers both.
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

    function check(node) {
      if (
        node.path?.type === 'GlimmerPathExpression' &&
        node.path.original === 'unbound' &&
        !isInScope(node, 'unbound')
      ) {
        context.report({
          node,
          messageId: 'unexpected',
          data: { unboundHelper: '{{unbound}}' },
        });
      }
    }

    return {
      GlimmerMustacheStatement: check,
      GlimmerBlockStatement: check,
      GlimmerSubExpression: check,
    };
  },
};
