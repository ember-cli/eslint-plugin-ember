'use strict';

const ember = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule - Always return a value from computed properties
//------------------------------------------------------------------------------

function isReachable(segment) {
  return segment.reachable;
}

const ERROR_MESSAGE = 'Always return a value from computed properties';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow missing return statements in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-return-from-computed.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    let funcInfo = {
      upper: null,
      codePath: null,
      shouldCheck: false,
      node: null,
    };

    function checkLastSegment(node) {
      if (funcInfo.shouldCheck && funcInfo.codePath.currentSegments.some(isReachable)) {
        report(node);
      }
    }

    let importedEmberName;
    let importedComputedName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
        }
      },

      onCodePathStart(codePath) {
        funcInfo = {
          upper: funcInfo,
          codePath,
          shouldCheck:
            context
              .getAncestors()
              .findIndex((node) =>
                ember.isComputedProp(node, importedEmberName, importedComputedName)
              ) > -1,
        };
      },

      onCodePathEnd() {
        funcInfo = funcInfo.upper;
      },

      'FunctionExpression:exit'(node) {
        if (node.parent.parent.parent === null) {
          return;
        }

        if (
          ember.isComputedProp(node.parent, importedEmberName, importedComputedName) ||
          ember.isComputedProp(node.parent.parent.parent, importedEmberName, importedComputedName)
        ) {
          checkLastSegment(node);
        }
      },
    };
  },
};
