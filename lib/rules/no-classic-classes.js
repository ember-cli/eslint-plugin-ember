'use strict';

const { getSourceModuleNameForIdentifier } = require('../utils/import');
const { isObjectExpression } = require('../utils/types');

const ERROR_MESSAGE_NO_CLASSIC_CLASSES =
  'Native JS classes should be used instead of classic classes';

function hasNoArguments(node) {
  return node.arguments.length === 0;
}

function hasObjectArgument(node) {
  return node.arguments.some(isObjectExpression);
}

function isEmberImport(classImportedFrom) {
  if (!classImportedFrom) {
    return false;
  }

  // Warn about classes imported from the `@ember/` and Ember Data namespaces
  return (
    classImportedFrom.startsWith('@ember/') ||
    classImportedFrom.startsWith('@ember-data/') ||
    classImportedFrom === 'ember-data'
  );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  ERROR_MESSAGE_NO_CLASSIC_CLASSES,

  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow "classic" classes in favor of native JS classes',
      category: 'Ember Octane',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-classic-classes.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          additionalClassImports: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalClassImports = options.additionalClassImports || [];

    function reportNode(node) {
      context.report(node, ERROR_MESSAGE_NO_CLASSIC_CLASSES);
    }

    return {
      'CallExpression > MemberExpression[property.name="extend"]'(node) {
        const callExpression = node.parent;

        // Invalid if there are no arguments because that is equivalent to not called `extend` at all
        // Invalid with an object as an argument because that logic needs conversion to a native class
        // Still allows `.extend` if some other identifier is passed, like a Mixin
        if (hasNoArguments(callExpression) || hasObjectArgument(callExpression)) {
          const classImportedFrom = getSourceModuleNameForIdentifier(context, node.object);
          if (
            isEmberImport(classImportedFrom) ||
            additionalClassImports.includes(classImportedFrom)
          ) {
            reportNode(callExpression);
          }
        }
      },
    };
  },
};
