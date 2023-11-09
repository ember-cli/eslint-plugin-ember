/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow referencing let variables in \\<template\\>',
      category: 'Ember Octane',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-let-reference.md',
    },
    fixable: null,
    schema: [],
    messages: {
      'no-let': 'update-able variables are not supported in templates, reference a const variable',
    },
  },

  create: (context) => {
    const sourceCode = context.sourceCode;

    function checkIfWritableReferences(node, scope) {
      const ref = scope.references.find((v) => v.identifier === node);
      if (!ref) {
        return;
      }
      if (ref.resolved?.identifiers.some((i) => ['let', 'var'].includes(i.parent.parent.kind))) {
        context.report({ node, messageId: 'no-let' });
      }
    }

    return {
      GlimmerPathExpression(node) {
        checkIfWritableReferences(node.head, sourceCode.getScope(node));
      },

      GlimmerElementNode(node) {
        // glimmer element is in its own scope, need to get upper scope
        const scope = sourceCode.getScope(node.parent);
        // GlimmerElementNode is not referenced, instead use tag name parts[0]
        checkIfWritableReferences(node.parts[0], scope);
      },
    };
  },
};
