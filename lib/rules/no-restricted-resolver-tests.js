'use strict';

const utils = require('../utils/utils');

//------------------------------------------------------------------------------------------------
// General Rule - Don't use constructs or configuration that use the restricted resolver in tests.
//------------------------------------------------------------------------------------------------

function getNoUnitTrueMessage(fn) {
  return `Do not use ${fn} with \`unit: true\``;
}

function getNoNeedsMessage(fn) {
  return `Do not use ${fn} with \`needs: [...]\``;
}

function getSingleStringArgumentMessage(fn) {
  return `Do not use ${fn} with a single string argument (implies unit: true)`;
}

function getNoPOJOWithoutIntegrationTrueMessage(fn) {
  return `Do not use ${fn} whose last parameter is an object unless used in conjunction wtih \`integration: true\``;
}

function hasOnlyStringArgument(node) {
  const parentMethodCall = getParentCallExpression(node);
  const args = parentMethodCall.arguments;

  return args.length === 1 && utils.isLiteral(args[0]);
}

function hasUnitTrue(node) {
  return node.properties.some(
    property =>
    property.key.name === 'unit' && property.value.value === true
  );
}

function hasNeeds(node) {
  return node.properties.some(
    property =>
    property.key.name === 'needs' && property.value.type === 'ArrayExpression'
  );
}

function hasIntegrationTrue(node) {
  return node.properties.some(
    property =>
    property.key.name === 'integration' && property.value.value === true
  );
}

function getParentCallExpression(node) {
  return utils.getParent(node, parent => parent.type === 'CallExpression');
}

function getLastArgument(node) {
  const parentMethodCall = utils.getParent(
    node,
    parent => parent.type === 'CallExpression'
  );
  const args = parentMethodCall.arguments;
  const lastArgument = args[args.length - 1];

  return lastArgument;
}

module.exports = {
  meta: {
    docs: {
      description: 'Prevents the use of `unit:true` in ember tests.',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace",
    messages: {
      getNoUnitTrueMessage,
      getNoNeedsMessage,
      getSingleStringArgumentMessage,
      getNoPOJOWithoutIntegrationTrueMessage
    }
  },

  create(context) {
    const visitors = {};

    [
      'moduleFor',
      'moduleForComponent',
      'moduleForModel',
      'setupTest',
      'setupComponentTest',
      'setupModelTest'
    ].forEach((fn) => {
      visitors[`Identifier[name="${fn}"]`] = function (node) {
        const lastArgument = getLastArgument(node);

        if (hasOnlyStringArgument(node)) {
          context.report(node, getSingleStringArgumentMessage(fn));
          return;
        }

        if (hasUnitTrue(lastArgument)) {
          context.report(lastArgument, getNoUnitTrueMessage(fn));
          return;
        }

        if (hasNeeds(lastArgument)) {
          context.report(lastArgument, getNoNeedsMessage(fn));
          return;
        }

        if (
          utils.isObjectExpression(lastArgument) &&
          !hasIntegrationTrue(lastArgument)
        ) {
          context.report(
            lastArgument,
            getNoPOJOWithoutIntegrationTrueMessage(fn)
          );
        }
      };
    });

    return visitors;
  },
};
