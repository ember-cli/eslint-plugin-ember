'use strict';

const ember = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule - Always return a value from computed properties
//------------------------------------------------------------------------------

function isAnySegmentReachable(segments) {
  for (const segment of segments) {
    if (segment.reachable) {
      return true;
    }
  }

  return false;
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
      currentSegments: [],
    };

    function checkLastSegment(node) {
      if (funcInfo.shouldCheck && isAnySegmentReachable(funcInfo.currentSegments)) {
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

      onCodePathStart(codePath, node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const ancestors = sourceCode.getAncestors
          ? sourceCode.getAncestors(node)
          : context.getAncestors();

        funcInfo = {
          upper: funcInfo,
          codePath,
          shouldCheck:
            ancestors.findIndex((node) =>
              ember.isComputedProp(node, importedEmberName, importedComputedName)
            ) > -1,
          node,
          currentSegments: new Set(),
        };
      },

      // Pops this function's information.
      onCodePathEnd() {
        funcInfo = funcInfo.upper;
      },
      onUnreachableCodePathSegmentStart(segment) {
        funcInfo.currentSegments.add(segment);
      },

      onUnreachableCodePathSegmentEnd(segment) {
        funcInfo.currentSegments.delete(segment);
      },

      onCodePathSegmentStart(segment) {
        funcInfo.currentSegments.add(segment);
      },

      onCodePathSegmentEnd(segment) {
        funcInfo.currentSegments.delete(segment);
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
