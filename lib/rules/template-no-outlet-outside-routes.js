const path = require('path');

/**
 * Determine whether a file path corresponds to a route template.
 * Mirrors ember-template-lint's is-route-template.js heuristic:
 *  - If the path is unknown, assume it could be a route (don't report).
 *  - Partials (basename starts with '-') are not routes.
 *  - Classic component templates (templates/components/) are not routes.
 *  - Co-located component templates (app/components/) are not routes.
 */
function isRouteTemplate(filePath) {
  if (typeof filePath !== 'string') {
    return true; // unknown — assume it could be a route
  }

  // GJS/GTS files are always components, never route templates
  if (filePath.endsWith('.gjs') || filePath.endsWith('.gts')) {
    return false;
  }

  const baseName = path.basename(filePath);

  // Partials start with '-'
  if (baseName.startsWith('-')) {
    return false;
  }

  const normalized = filePath.replaceAll('\\', '/');

  // Classic component template: <app>/templates/components/...
  if (
    /\/templates\/components\//.test(normalized) ||
    /^[^/]+\/templates\/components\//.test(normalized)
  ) {
    return false;
  }

  // Co-located component: <app>/components/...
  if (/\/components\//.test(normalized) && !/\/templates\//.test(normalized)) {
    return false;
  }

  return true;
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

    // In GJS/GTS (strict) mode, templates are always in components — never route templates.
    // Only .hbs files can be route templates, so apply the filePath heuristic only for those.
    const routeTemplate = filename.endsWith('.hbs') ? isRouteTemplate(filename) : false;

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
