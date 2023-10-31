'use strict';

const { startsWithThisExpression } = require('../utils/utils');
const { nodeToDependentKey } = require('../utils/property-getter');
const { getImportIdentifier } = require('../utils/import');
const { isClassPropertyOrPropertyDefinitionWithDecorator } = require('../utils/decorators');

const ERROR_MESSAGE =
  'Do not use this.args to create @tracked properties as this will not be updated if the args change. Instead use a getter.';

function visitClassPropertyOrPropertyDefinition(node, context, trackedImportName) {
  const hasTrackedDecorator =
    node.decorators?.length > 0 &&
    isClassPropertyOrPropertyDefinitionWithDecorator(node, trackedImportName);

  const hasThisArgsValue =
    node.value &&
    startsWithThisExpression(node.value) &&
    nodeToDependentKey(node.value, context)?.split('.')[0] === 'args';

  if (hasTrackedDecorator && hasThisArgsValue) {
    context.report({ node, messageId: 'main' });
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow creating @tracked properties from this.args',
      category: 'Ember Octane',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-tracked-properties-from-args.md',
    },
    fixable: null,
    schema: [],
    messages: {
      main: ERROR_MESSAGE,
    },
  },
  create(context) {
    let trackedImportName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@glimmer/tracking') {
          trackedImportName =
            trackedImportName || getImportIdentifier(node, '@glimmer/tracking', 'tracked');
        }
      },
      ClassProperty(node) {
        visitClassPropertyOrPropertyDefinition(node, context, trackedImportName);
      },
      PropertyDefinition(node) {
        visitClassPropertyOrPropertyDefinition(node, context, trackedImportName);
      },
    };
  },
};
