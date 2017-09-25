'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

//----------------------------------------------
// General rule - Don\'t use .on() in components
//----------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of `on` calls in components',
      category: 'Best Practices',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Don\'t use .on() in components';

    const filePath = context.getFilename();

    const isOnCall = function (node) {
      const value = node.value;
      const callee = value.callee;

      return utils.isCallExpression(value) &&
        (
          (utils.isIdentifier(callee) && callee.name === 'on') ||
          (
            utils.isMemberExpression(callee) &&
            utils.isIdentifier(callee.object) && callee.object.name === 'Ember' &&
            utils.isIdentifier(callee.property) && callee.property.name === 'on'
          )
        );
    };

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!ember.isEmberComponent(node, filePath)) return;

        const propertiesWithOnCalls = ember.getModuleProperties(node).filter(isOnCall);

        if (propertiesWithOnCalls.length) {
          propertiesWithOnCalls.forEach((property) => {
            report(property.value);
          });
        }
      },
    };
  }
};
