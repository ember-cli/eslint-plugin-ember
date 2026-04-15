const path = require('path');

/**
 * Determine whether a file path corresponds to a route template.
 * Mirrors ember-template-lint's is-route-template.js heuristic (and the
 * duplicate in template-no-outlet-outside-routes.js):
 *  - If the path is unknown, assume it could be a route (default-lint).
 *  - Partials (basename starts with '-') are not routes.
 *  - Classic component templates (<app>/templates/components/) are not routes.
 *  - Co-located component templates (<app>/components/) are not routes.
 *
 * Note: GJS/GTS files can be route templates (e.g. app/routes/foo.gjs), so
 * we do not gate on file extension.
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
    type: 'suggestion',
    docs: {
      description: 'disallow @model argument in route templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-model-argument-in-route-templates.md',
      templateMode: 'loose',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noModelArgumentInRouteTemplates:
        'Unexpected @model in route template. Use this.model in the controller or component instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-model-argument-in-route-templates.js',
      docs: 'docs/rule/no-model-argument-in-route-templates.md',
      tests: 'test/unit/rules/no-model-argument-in-route-templates-test.js',
    },
  },

  create(context) {
    const routeTemplate = isRouteTemplate(context.filename);

    if (!routeTemplate) {
      return {};
    }

    return {
      GlimmerPathExpression(node) {
        // Check for @model usage
        if (node.original === '@model' || node.original.startsWith('@model.')) {
          const replacement = node.original.replace('@model', 'this.model');
          context.report({
            node,
            messageId: 'noModelArgumentInRouteTemplates',
            fix(fixer) {
              return fixer.replaceText(node, replacement);
            },
          });
        }
      },
    };
  },
};
