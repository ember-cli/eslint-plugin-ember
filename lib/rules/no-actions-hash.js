const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ERROR_MESSAGE = 'Use the @action decorator instead of declaring an actions hash';

module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallows the actions hash in components, controllers and routes',
      category: 'Ember Octane',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-actions-hash.md',
    },
    fixable: null, // or "code" or "whitespace"
  },

  create: context => {
    function inClassWhichCanContainActions(context, node) {
      return (
        ember.isEmberComponent(context, node) ||
        ember.isEmberController(context, node) ||
        ember.isEmberRoute(context, node)
      );
    }

    function reportActionsProp(properties) {
      const actionsProp = properties.find(property => ember.isActionsProp(property));
      if (actionsProp) {
        context.report(actionsProp, ERROR_MESSAGE);
      }
    }

    return {
      ClassDeclaration(node) {
        if (inClassWhichCanContainActions(context, node)) {
          reportActionsProp(utils.findNodes(node.body.body, 'ClassProperty'));
        }
      },
      CallExpression(node) {
        if (inClassWhichCanContainActions(context, node)) {
          reportActionsProp(ember.getModuleProperties(node));
        }
      },
    };
  },
};
