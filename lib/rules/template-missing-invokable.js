/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow referencing let variables in \\<template\\>',
      category: 'Ember Octane',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-missing-invokable.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      'missing-invokable':
        'Not in scope. Did you forget to import this? Auto-fix may be configured.',
    },
  },

  create: (context) => {
    const sourceCode = context.sourceCode;

    // TODO make real config
    const config = {
      eq: { name: 'eq', module: 'ember-truth-helpers' },
      on: { name: 'on', module: '@ember/modifier' },
    };

    // takes a node with a `.path` property
    function checkInvokable(node) {
      if (node.path.type === 'GlimmerPathExpression' && node.path.tail.length === 0) {
        if (!isBound(node.path.head, sourceCode.getScope(node.path))) {
          const matched = config[node.path.head.name];
          if (matched) {
            context.report({
              node: node.path,
              messageId: 'missing-invokable',
              fix(fixer) {
                return fixer.insertTextBeforeRange(
                  [0, 0],
                  `import { ${matched.name} } from '${matched.module}';\n`
                );
              },
            });
          }
        }
      }
    }

    return {
      GlimmerSubExpression(node) {
        return checkInvokable(node);
      },
      GlimmerElementModifierStatement(node) {
        return checkInvokable(node);
      },
      GlimmerMustacheStatement(node) {
        return checkInvokable(node);
      },
    };
  },
};

function isBound(node, scope) {
  const ref = scope.references.find((v) => v.identifier === node);
  if (!ref) {
    // TODO: can we make a test case for this?
    return false;
  }
  return Boolean(ref.resolved);
}
