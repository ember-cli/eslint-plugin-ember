const ember = require('../utils/ember');
const utils = require('../utils/utils');

const ERROR_MESSAGE = 'Use the @action decorator instead of declaring an actions hash';

module.exports = {
  ERROR_MESSAGE,
  meta: {
    docs: {
      description: 'Disallows the actions hash in components, controllers and routes',
      category: 'Ember Object',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    url:
      'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-actions-hash.md',
  },

  create: context => {
    const filePath = context.getFilename();

    function inClassWhichCanContainActions(node, filePath) {
      return (
        ember.isEmberComponent(node, filePath) ||
        ember.isEmberController(node, filePath) ||
        ember.isEmberRoute(node, filePath)
      );
    }

    function reportActionsProp(properties) {
      properties.forEach(property => {
        if (ember.isActionsProp(property)) {
          context.report(property, ERROR_MESSAGE);
        }
      });
    }

    return {
      ClassDeclaration(node) {
        if (inClassWhichCanContainActions(node, filePath)) {
          reportActionsProp(utils.findNodes(node.body.body, 'ClassProperty'));
        }
      },
      CallExpression(node) {
        if (inClassWhichCanContainActions(node, filePath)) {
          reportActionsProp(ember.getModuleProperties(node));
        }
      },
    };
  },
};
