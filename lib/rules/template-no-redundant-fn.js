/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary usage of (fn) helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-fn.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      redundant:
        'Unnecessary use of (fn) helper. Pass the function directly instead: {{suggestion}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-redundant-fn.js',
      docs: 'docs/rule/no-redundant-fn.md',
      tests: 'test/unit/rules/no-redundant-fn-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Check whether `fn` in the template resolves to a local/imported binding.
     * If it does, the user has shadowed Ember's built-in `fn` helper and we
     * should not flag the usage.
     */
    function isFnShadowed(node) {
      const head = node.path?.head;
      if (!head) {
        return false;
      }
      const scope = sourceCode.getScope(node);
      const ref = scope.references.find((r) => r.identifier === head);
      return ref?.resolved !== null && ref?.resolved !== undefined;
    }

    function checkFnUsage(node) {
      // Check if this is an (fn) call with only one argument (the function itself)
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'fn' &&
        node.params &&
        node.params.length === 1 &&
        !node.hash?.pairs?.length
      ) {
        // In gjs/gts, `fn` may be shadowed by a local import — skip if so.
        if (isFnShadowed(node)) {
          return;
        }
        const param = node.params[0];
        const paramText =
          param.type === 'GlimmerPathExpression'
            ? param.original
            : context.sourceCode.getText(param);

        context.report({
          node,
          messageId: 'redundant',
          data: {
            suggestion: paramText,
          },
        });
      }
    }

    return {
      GlimmerSubExpression(node) {
        checkFnUsage(node);
      },

      GlimmerMustacheStatement(node) {
        checkFnUsage(node);
      },
    };
  },
};
