'use strict';

const types = require('../utils/types');

//----------------------------------------------------------------------------------------------
// General rule - Don't use Ember's function prototype extensions like .property() or .observe()
//----------------------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of Ember's `function` prototype extensions",
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-function-prototype-extensions.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = "Don't use Ember's function prototype extensions";

    const functionPrototypeExtensionNames = ['property', 'observes', 'observesBefore', 'on'];

    const isFunctionPrototypeExtension = function (property) {
      return (
        types.isIdentifier(property) && functionPrototypeExtensionNames.includes(property.name)
      );
    };

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          types.isCallExpression(node) &&
          types.isMemberExpression(callee) &&
          types.isFunctionExpression(callee.object) &&
          isFunctionPrototypeExtension(callee.property)
        ) {
          report(node);
        }
      },
    };
  },
};
