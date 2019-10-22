const ember = require('../utils/ember');

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
    let inClassWhichCanContainActions = false;

    function _inClassWhichCanContainActions(node, filePath) {
      return (
        inClassWhichCanContainActions ||
        ember.isEmberComponent(node, filePath) ||
        ember.isEmberController(node, filePath) ||
        ember.isEmberRoute(node, filePath)
      );
    }

    return {
      ClassDeclaration(node) {
        inClassWhichCanContainActions = _inClassWhichCanContainActions(node, filePath);
      },
      CallExpression(node) {
        inClassWhichCanContainActions = _inClassWhichCanContainActions(node, filePath);
      },
      ObjectExpression(node) {
        if (!inClassWhichCanContainActions) {
          return;
        }

        node.properties.forEach(property => {
          if (property.key.name === 'actions') {
            context.report(node, ERROR_MESSAGE);
          }
        });
      },
      ClassProperty(node) {
        if (!inClassWhichCanContainActions) {
          return;
        }

        if (node.value.type === 'ObjectExpression' && node.key.name === 'actions') {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
