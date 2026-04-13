const path = require('path');

/**
 * Determine whether a file path corresponds to a route template.
 * Mirrors ember-template-lint's is-route-template.js heuristic:
 *  - If the path is unknown, assume it could be a route (don't report).
 *  - Partials (basename starts with '-') are not routes.
 *  - Classic component templates (<app>/templates/components/) are not routes.
 *  - Co-located component templates (<app>/components/) are not routes.
 *
 * Note: GJS/GTS files can be route templates (e.g. app/routes/foo.gjs).
 */
function isRouteTemplate(filePath) {
  if (typeof filePath !== 'string') {
    return true; // unknown — assume it could be a route
  }

  const normalized = filePath.replaceAll('\\', '/');
  const baseName = path.basename(normalized);

  if (baseName.startsWith('-')) {
    return false;
  }

  return (
    !/^[^/]+\/templates\/components\//.test(normalized) && // classic component
    !/^[^/]+\/components\//.test(normalized) // co-located component template
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{outlet}} outside of route templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-outlet-outside-routes.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noOutletOutsideRoutes: 'outlet should only be used in route templates.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-outlet-outside-routes.js',
      docs: 'docs/rule/no-outlet-outside-routes.md',
      tests: 'test/unit/rules/no-outlet-outside-routes-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const filename = context.filename;

    const routeTemplate = isRouteTemplate(filename);

    function isJsScopeVariable(node) {
      if (!sourceCode || !node.path?.original) {
        return false;
      }
      const name = node.path.original;
      try {
        let scope = sourceCode.getScope(node);
        while (scope) {
          if (scope.variables.some((v) => v.name === name)) {
            return true;
          }
          scope = scope.upper;
        }
      } catch {
        // sourceCode.getScope may not be available in .hbs-only mode; ignore.
      }
      return false;
    }

    function checkForOutlet(node) {
      if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'outlet') {
        if (!routeTemplate && !isJsScopeVariable(node)) {
          context.report({
            node,
            messageId: 'noOutletOutsideRoutes',
          });
        }
      }
    }

    return {
      GlimmerMustacheStatement: checkForOutlet,
      GlimmerBlockStatement: checkForOutlet,
    };
  },
};
