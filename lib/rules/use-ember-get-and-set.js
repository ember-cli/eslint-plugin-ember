'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General - use get and set
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces usage of Ember.get and Ember.set',
      category: 'General',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Use get/set';

    const report = function (node) {
      context.report(node, message);
    };

    const avoidedProperties = [
      'get',
      'set',
      'getProperties',
      'setProperties',
      'getWithDefault',
    ];

    return {
      MemberExpression(node) {
        if (
          utils.isIdentifier(node.property) &&
          avoidedProperties.indexOf(node.property.name) > -1
        ) {
          report(node.property);
        }
      },
    };
  }
};
