/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{partial}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-partial.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected partial usage. Partials are deprecated, use components instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-partial.js',
      docs: 'docs/rule/no-partial.md',
      tests: 'test/unit/rules/no-partial-test.js',
    },
  },

  create(context) {
    function checkForPartial(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'partial'
      ) {
        // Check if this is not inside an attribute
        let parent = node.parent;
        while (parent) {
          if (parent.type === 'GlimmerAttrNode') {
            return; // Don't report if inside an attribute
          }
          parent = parent.parent;
        }

        context.report({
          node,
          messageId: 'unexpected',
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForPartial(node);
      },
    };
  },
};
