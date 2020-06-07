'use strict';

const ember = require('../utils/ember');
const { hasDecorator } = require('../utils/types');

//------------------------------------------------------------------------------
// General rule - Always return a value from computed properties
//------------------------------------------------------------------------------

function isReachable(segment) {
  return segment.reachable;
}

function isComputedProp(node) {
  return (
    ember.isComputedProp(node) ||
    (node.type === 'MethodDefinition' && hasDecorator(node, 'computed'))
  );
}

const ERROR_MESSAGE = 'Always return a value from computed properties';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow missing return statements in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-return-from-computed.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
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

    return {
      onCodePathStart(codePath) {
        funcInfo = {
          upper: funcInfo,
          codePath,
          shouldCheck: context.getAncestors().findIndex(isComputedProp) > -1,
        };
      },

      onCodePathEnd() {
        funcInfo = funcInfo.upper;
      },

      'FunctionExpression:exit'(node) {
        if (isComputedProp(node.parent) || isComputedProp(node.parent.parent.parent)) {
          checkLastSegment(node);
        }
      },
    };
  },
};
