'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

function makeErrorMessage(functionName) {
  return `Do not use \`this.${functionName}()\`. Prefer \`${functionName}\` from \`@ember/test-helpers\` instead.`;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "disallow usage of the `this.render` in tests, recommending to use @ember/test-helpers' `render` instead.",
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-this-render.md',
    },
    fixable: null,
    schema: [],
  },

  makeErrorMessage,

  create(context) {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          types.isThisExpression(callee.object) &&
          types.isIdentifier(callee.property) &&
          (callee.property.name === 'render' || callee.property.name === 'clearRender')
        ) {
          context.report({
            node,
            message: makeErrorMessage(callee.property.name),
          });
        }
      },
    };
  },
};
