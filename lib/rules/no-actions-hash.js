const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ERROR_MESSAGE = 'Use the @action decorator instead of declaring an actions hash';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the actions hash in components, controllers, and routes',
      category: 'Ember Octane',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-actions-hash.md',
    },
    fixable: null,
    schema: [],
  },

  create: (context) => {
    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    function reportActionsProp(properties) {
      const actionsProp = properties.find((property) => ember.isActionsProp(property));
      if (actionsProp) {
        context.report({ node: actionsProp, message: ERROR_MESSAGE });
      }
    }

    return {
      ClassDeclaration(node) {
        if (inClassWhichCanContainActions(context, node)) {
          reportActionsProp([
            ...utils.findNodes(node.body.body, 'ClassProperty'), // ESLint v7
            ...utils.findNodes(node.body.body, 'PropertyDefinition'), // ESLint v8
          ]);
        }
      },
      CallExpression(node) {
        if (inClassWhichCanContainActions(context, node)) {
          reportActionsProp(ember.getModuleProperties(node, scopeManager));
        }
      },
    };
  },
};

function inClassWhichCanContainActions(context, node) {
  return (
    ember.isEmberComponent(context, node) ||
    ember.isEmberController(context, node) ||
    ember.isEmberRoute(context, node)
  );
}
