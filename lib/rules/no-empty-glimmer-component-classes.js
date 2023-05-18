'use strict';

const { isGlimmerComponent } = require('../utils/ember');
const { isClassPropertyOrPropertyDefinition } = require('../utils/types');

const ERROR_MESSAGE = 'Do not create empty backing classes for Glimmer components.';
const ERROR_MESSAGE_TEMPLATE_TAG =
  'Do not create empty backing classes for Glimmer template tag only components.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty backing classes for Glimmer components',
      category: 'Ember Octane',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-empty-glimmer-component-classes.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,
  ERROR_MESSAGE_TEMPLATE_TAG,

  create(context) {
    return {
      ClassDeclaration(node) {
        if (isGlimmerComponent(context, node) && !node.decorators && node.body.body.length === 0) {
          context.report({ node, message: ERROR_MESSAGE });
        } else if (
          isGlimmerComponent(context, node) &&
          node.body.body.length === 1 &&
          isClassPropertyOrPropertyDefinition(node.body.body[0]) &&
          node.body.body[0].key?.callee?.name === '__GLIMMER_TEMPLATE'
        ) {
          context.report({ node, message: ERROR_MESSAGE_TEMPLATE_TAG });
        }
      },
    };
  },
};
