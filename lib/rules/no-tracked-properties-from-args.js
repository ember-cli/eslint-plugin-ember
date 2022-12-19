'use strict';

const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE =
  'Do not use this.args to create @tracked properties as this will not be updated if the args change. Instead use a getter.';

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
      recommended: false,
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
          trackedImportName = getImportIdentifier(node, '@glimmer/tracking', 'tracked');
        }
      },
      PropertyDefinition(node) {
        const hasTrackedDecorator =
          node.decorators?.length > 0 && node.decorators[0].expression.name === trackedImportName;
        const hasThisArgsValue =
          node.value.object?.type === 'MemberExpression' &&
          node.value.object?.object.type === 'ThisExpression' &&
          node.value.object?.property.name === 'args';

        if (hasTrackedDecorator && hasThisArgsValue) {
          context.report({ node, messageId: 'main' });
        }
      },
    };
  },
};
