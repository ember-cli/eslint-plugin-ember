'use strict';

const ERROR_MESSAGE =
  'Do not use this.args to create @tracked properties as this will not be udpated if the args change. Instead use a getter.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow creating @tracked properties from this.args',
      category: 'Ember Decorator',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-tracked-properties-from-args.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      PropertyDefinition(node) {
        const hasTrackedDecorator =
          node.decorators?.length > 0 && node.decorators[0].expression.name === 'tracked';
        const hasThisArgsValue =
          node.value.object?.type === 'MemberExpression' &&
          node.value.object?.property.name === 'args';

        if (hasTrackedDecorator && hasThisArgsValue) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
