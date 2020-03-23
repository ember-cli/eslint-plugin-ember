'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// Ember Data - Be explicit with Ember data attribute types
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of empty attributes in Ember Data models',
      category: 'Ember Data',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-empty-attrs.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Supply proper attribute type';
    const filePath = context.getFilename();

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!ember.isDSModel(node, filePath)) {
          return;
        }

        const allProperties = ember.getModuleProperties(node);
        const isDSAttr = allProperties.filter((property) =>
          ember.isModule(property.value, 'attr', 'DS')
        );

        isDSAttr.forEach((attr) => {
          if (attr.value.arguments.length === 0) {
            report(attr.value);
          }
        });
      },
    };
  },
};
