'use strict';

const { isGlimmerComponent } = require('../utils/ember');

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
        if (!isGlimmerComponent(context, node)) {
          return;
        }

        const subClassHasTypeDefinition = node.typeParameters?.params?.length > 0;
        if (!node.decorators?.length && node.body.body.length === 0 && !subClassHasTypeDefinition) {
          context.report({ node, message: ERROR_MESSAGE });
        } else if (
          node.body.body.length === 1 &&
          node.body.body[0].type === 'GlimmerTemplate' &&
          !subClassHasTypeDefinition
        ) {
          context.report({ node, message: ERROR_MESSAGE_TEMPLATE_TAG });
        }
      },
    };
  },
};
