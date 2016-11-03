'use strict';

var utils = require('./utils/utils');
var ember = require('./utils/ember');

//------------------------------------------------------------------------------
// Components rule - Avoid leaking state
// (Don't use arrays or objects as default props)
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    schema: [
      {
        type: "object",
        properties: {
          exceptions: {
              type: "array",
              items: {type: "string"},
              uniqueItems: true,
          }
        },
        additionalProperties: false,
      },
    ],
  },

  create: function(context) {
    var message = {
      array: 'Avoid using arrays as default properties',
      object: 'Avoid using objects as default properties',
    };

    var report = function(node, messageType) {
      context.report(node, message[messageType]);
    };

    var ignoredProperties = [
      'classNames',
      'classNameBindings',
      'actions',
      'concatenatedProperties',
      'mergedProperties',
      'positionalParams',
    ];

    return {
      CallExpression: function(node) {
        if (!ember.isEmberComponent(node)) return;

        var properties = ember.getModuleProperties(node);

        properties
          .filter(function(property) {
            return ignoredProperties.indexOf(property.key.name) === -1;
          })
          .forEach(function(property) {
            if (ember.isObjectProp(property)) {
              report(property, 'object');
            } else if (ember.isArrayProp(property)) {
              report(property, 'array');
            }
          });
      }
    };
  },
};
