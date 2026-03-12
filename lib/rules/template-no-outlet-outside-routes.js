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
    const filename = context.filename || context.getFilename();

    const routeTemplate = isRouteTemplate(filename);

    return {
      GlimmerMustacheStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'outlet') {
          if (!routeTemplate) {
            context.report({
              node,
              messageId: 'noOutletOutsideRoutes',
            });
          }
        }
      },
    };
  },
};
