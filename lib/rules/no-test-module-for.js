'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const utils = require('../utils/utils');

const ERROR_MESSAGE = 'moduleFor* apis are are not allowed. Use `module` instead of `moduleFor`';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of moduleFor, moduleForComponent, etc',
      category: 'Testing',
      recommended: false,
    },
    fixable: null,
  },

  ERROR_MESSAGE,

  create(context) {
    const filename = context.getFilename();
    const isTestFile =
      emberUtils.isTestFile(filename) ||
      (filename.includes('tests') && filename.includes('helpers'));

    if (!isTestFile) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        if (isModuleFor(context, node)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
      CallExpression(node) {
        if (isModuleFor(context, node)) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};

function isModuleFor(context, node) {
  const { callee, id } = node; // CallExpression | FunctionDeclaration
  const identifier = callee || id;

  if (!identifier || !types.isIdentifier(identifier)) {
    return false;
  }

  // catches everything from legacy ember-qunit
  const isLegacyApi =
    identifier.name.startsWith('moduleFor') &&
    utils.getSourceModuleNameForIdentifier(context, identifier) === 'ember-qunit';

  // will error on the definition of moduleForAcceptance, likely in
  // tests/helpers/start-app.js
  // moduleForAcceptance was the default name from the ember blueprint
  const isBespokeModule = identifier.name.startsWith('moduleForAcceptance');

  // in case someone renames a moduleFor to something else like,
  // - moduleForUtil
  // - moduleForRoute
  // the entire pattern is not allowed.
  const isBespokeInvocation = identifier.name.startsWith('moduleFor');

  return isLegacyApi || isBespokeModule || isBespokeInvocation;
}
