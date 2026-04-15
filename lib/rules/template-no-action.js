function isActionHelperPath(node) {
  if (!node.path || node.path.type !== 'GlimmerPathExpression') {
    return false;
  }

  // Check if it's the action helper (not this.action or @action)
  const path = node.path;
  if (path.original !== 'action') {
    return false;
  }
  // Avoid deprecated data/this properties — those are not the helper.
  const head = path.head;
  if (head && (head.type === 'AtHead' || head.type === 'ThisHead')) {
    return false;
  }
  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{action}} helper',
      category: 'Deprecations',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action.md',
    },
    fixable: null,
    schema: [],
    messages: {
      subExpression:
        'Do not use `action` as (action ...) — deprecated in Ember 5.9, removed in 6.0. Use the `fn` helper instead.',
      mustache:
        'Do not use `action` in templates — deprecated in Ember 5.9, removed in 6.0. Use the `on` modifier and `fn` helper instead.',
      modifier:
        'Do not use `action` as an element modifier — deprecated in Ember 5.9, removed in 6.0. Use the `on` modifier instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-action.js',
      docs: 'docs/rule/no-action.md',
      tests: 'test/unit/rules/no-action-test.js',
    },
  },

  create(context) {
    // `action` is an ambient strict-mode keyword in Ember (registered in
    // STRICT_MODE_KEYWORDS), so `{{action this.x}}` works in .gjs/.gts without
    // an import. Still flag the ambient keyword everywhere — but skip when
    // `action` resolves to a binding (JS import/const, or template block param).
    // ember-eslint-parser already registers template block params in scope, so
    // a single getScope walk covers both.
    const sourceCode = context.sourceCode;

    function isInScope(node) {
      if (!sourceCode) {
        return false;
      }
      try {
        let scope = sourceCode.getScope(node);
        while (scope) {
          if (scope.variables.some((v) => v.name === 'action')) {
            return true;
          }
          scope = scope.upper;
        }
      } catch {
        // getScope not available in .hbs-only mode
      }
      return false;
    }

    function shouldFlag(node) {
      return isActionHelperPath(node) && !isInScope(node);
    }

    return {
      GlimmerSubExpression(node) {
        if (shouldFlag(node)) {
          context.report({ node, messageId: 'subExpression' });
        }
      },

      GlimmerMustacheStatement(node) {
        if (shouldFlag(node)) {
          context.report({ node, messageId: 'mustache' });
        }
      },

      GlimmerElementModifierStatement(node) {
        if (shouldFlag(node)) {
          context.report({ node, messageId: 'modifier' });
        }
      },
    };
  },
};
