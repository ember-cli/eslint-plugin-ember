'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Ember object rule - Avoid using needs in controllers
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoids using needs in controllers',
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/avoid-using-needs-in-controllers.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const report = function(node) {
      const message =
        '`needs` API has been deprecated, `Ember.inject.controller` should be used instead';
      context.report(node, message);
    };

    function checkMemberExpression(memberExpressionNode) {
      const node = memberExpressionNode.parent;

      if (!ember.isEmberController(context, node)) {
        return;
      }

      const properties = ember.getModuleProperties(node);

      properties.forEach(property => {
        if (property.key.name === 'needs') {
          report(property);
        }
      });
    }

    return {
      'CallExpression > MemberExpression[property.name="extend"]': checkMemberExpression,
      'CallExpression > MemberExpression[property.name="reopen"]': checkMemberExpression,
      'CallExpression > MemberExpression[property.name="reopenClass"]': checkMemberExpression,
      'CallExpression > MemberExpression[property.value="extend"]': checkMemberExpression,
    };
  },
};
