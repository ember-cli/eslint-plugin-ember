/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow missing helpers, modifiers, or components in \\<template\\> with auto-fix to import them',
      category: 'Ember Octane',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-missing-invokable.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          invokables: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              prefixItems: [
                { type: 'string', description: 'The name to import from the module' },
                { type: 'string', description: 'The module to import from' },
              ],
            },
          },
        },
      },
    ],
    messages: {
      'missing-invokable':
        'Not in scope. Did you forget to import this? Auto-fix may be configured.',
    },
  },

  create: (context) => {
    const sourceCode = context.sourceCode;

    // takes a node with a `.path` property
    function checkInvokable(node) {
      if (node.path.type === 'GlimmerPathExpression' && node.path.tail.length === 0) {
        if (!isBound(node.path.head, sourceCode.getScope(node.path))) {
          const matched = context.options[0]?.invokables?.[node.path.head.name];
          if (matched) {
            const [name, module] = matched;
            const importStatement = buildImportStatement(node.path.head.name, name, module);
            context.report({
              node: node.path,
              messageId: 'missing-invokable',
              fix(fixer) {
                return fixer.insertTextBeforeRange([0, 0], `${importStatement};\n`);
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
    return false;
  }
  return Boolean(ref.resolved);
}

function buildImportStatement(consumedName, exportedName, module) {
  if (exportedName === 'default') {
    return `import ${consumedName} from '${module}'`;
  } else {
    return consumedName === exportedName
      ? `import { ${consumedName} } from '${module}'`
      : `import { ${exportedName} as ${consumedName} } from '${module}'`;
  }
}
