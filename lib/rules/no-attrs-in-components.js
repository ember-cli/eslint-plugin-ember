'use strict';

const types = require('../utils/types');
const { isEmberComponent, isGlimmerComponent } = require('../utils/ember');

const ERROR_MESSAGE = 'Do not use `this.attrs`';

//------------------------------------------------------------------------------
// General rule - Don't use this.attrs
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of `this.attrs` in components',
      category: 'Components',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-attrs-in-components.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    let currentEmberComponent = null;

    return {
      ClassDeclaration(node) {
        if (isEmberComponent(context, node) || isGlimmerComponent(context, node)) {
          currentEmberComponent = node;
        }
      },

      CallExpression(node) {
        if (isEmberComponent(context, node)) {
          currentEmberComponent = node;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentEmberComponent === node) {
          currentEmberComponent = null;
        }
      },

      'CallExpression:exit'(node) {
        if (currentEmberComponent === node) {
          currentEmberComponent = null;
        }
      },

      MemberExpression(node) {
        if (currentEmberComponent && isThisAttrsExpression(node)) {
          context.report({ node: node.property, message: ERROR_MESSAGE });
        }
      },
    };
  },
};

function isThisAttrsExpression(node) {
  return types.isThisExpression(node.object) && node.property.name === 'attrs';
}
