'use strict';

// Invokables that are available in every Ember project without any extra
// packages.  User-provided `invokables` config is merged on top of these so
// any entry here can be overridden by the consuming project.
const BUILTIN_INVOKABLES = {
  fn: ['fn', '@ember/helper'],
  get: ['get', '@ember/helper'],
  hash: ['hash', '@ember/helper'],
  array: ['array', '@ember/helper'],
  concat: ['concat', '@ember/helper'],
  htmlSafe: ['htmlSafe', '@ember/template'],
  trustedHTML: ['trustedHTML', '@ember/template'],
  LinkTo: ['LinkTo', '@ember/routing'],
  on: ['on', '@ember/modifier'],
  trackedArray: ['trackedArray', '@ember/reactive/collections'],
  trackedObject: ['trackedObject', '@ember/reactive/collections'],
  trackedSet: ['trackedSet', '@ember/reactive/collections'],
  trackedWeakSet: ['trackedWeakSet', '@ember/reactive/collections'],
  trackedWeakMap: ['trackedWeakMap', '@ember/reactive/collections'],
};

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
    const invokables = { ...BUILTIN_INVOKABLES, ...context.options[0]?.invokables };

    // takes a node with a `.path` property
    function checkInvokable(node) {
      if (node.path.type === 'GlimmerPathExpression' && node.path.tail.length === 0) {
        if (!isBound(node.path.head, sourceCode.getScope(node.path))) {
          const matched = invokables[node.path.head.name];
          if (matched) {
            const [name, moduleName] = matched;
            const importStatement = buildImportStatement(node.path.head.name, name, moduleName);
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
