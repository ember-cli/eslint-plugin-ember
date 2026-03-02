function isViewPath(pathNode) {
  return (
    pathNode &&
    pathNode.type === 'GlimmerPathExpression' &&
    pathNode.original &&
    pathNode.original.startsWith('view.') &&
    pathNode.head?.type !== 'ThisHead' &&
    pathNode.head?.type !== 'AtHead'
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline {{view}} helper',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-deprecated-inline-view-helper.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated:
        'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/deprecated-inline-view-helper.js',
      docs: 'docs/rule/deprecated-inline-view-helper.md',
      tests: 'test/unit/rules/deprecated-inline-view-helper-test.js',
    },
  },

  create(context) {
    function checkHashForViewPaths(node) {
      if (node.hash && node.hash.pairs) {
        for (const pair of node.hash.pairs) {
          if (isViewPath(pair.value)) {
            context.report({
              node,
              messageId: 'deprecated',
            });
            return true;
          }
        }
      }
      return false;
    }

    function checkForView(node) {
      if (node.path && node.path.type === 'GlimmerPathExpression') {
        // Check for {{view ...}} with params or hash pairs
        if (node.path.original === 'view') {
          if (
            (node.hash && node.hash.pairs && node.hash.pairs.length > 0) ||
            (node.params && node.params.length > 0)
          ) {
            context.report({
              node,
              messageId: 'deprecated',
            });
            return;
          }
        }
        // Check for {{view.something}} paths
        if (isViewPath(node.path)) {
          context.report({
            node,
            messageId: 'deprecated',
          });
          return;
        }
      }
      // Check hash values for view.* references
      checkHashForViewPaths(node);
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForView(node);
      },

      GlimmerBlockStatement(node) {
        checkForView(node);
      },
    };
  },
};
