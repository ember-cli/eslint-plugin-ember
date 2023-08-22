const ERROR_MESSAGE =
  'update-able variables are not supported in templates, reference a const variable';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow referencing let variables in \\<template\\>',
      category: 'Ember Octane',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-let-reference.md',
    },
    fixable: null,
    schema: [],
  },

  create: (context) => {
    const sourceCode = context.sourceCode;

    function checkIfWritableReferences(node, scope) {
      const ref = scope.references.find((v) => v.identifier === node);
      if (!ref) {
        return;
      }
      if (ref.resolved?.identifiers.some((i) => ['let', 'var'].includes(i.parent.parent.kind))) {
        context.report({ node, message: ERROR_MESSAGE });
      }
    }

    return {
      GlimmerPathExpression(node) {
        checkIfWritableReferences(node.head, sourceCode.getScope(node));
      },

      GlimmerElementNode(node) {
        // glimmer element is in its own scope, need tp get upper scope
        const scope = sourceCode.getScope(node.parent);
        checkIfWritableReferences(node, scope);
      },
    };
  },
};
