'use strict';

const path = require('node:path');
const fs = require('node:fs');

// Packages that ship with Ember/Glimmer are always available to auto-fix.
function isBuiltinPackage(moduleName) {
  return moduleName.startsWith('@ember/') || moduleName.startsWith('@glimmer/');
}

// Returns the root package name from a module specifier, e.g.
//   'ember-truth-helpers'          -> 'ember-truth-helpers'
//   'ember-truth-helpers/helpers'  -> 'ember-truth-helpers'
//   '@scope/pkg/deep'              -> '@scope/pkg'
function rootPackageName(moduleName) {
  if (moduleName.startsWith('@')) {
    const parts = moduleName.split('/');
    return parts.slice(0, 2).join('/');
  }
  return moduleName.split('/')[0];
}

// Walk up the directory tree from startDir to find the nearest package.json.
function findNearestPackageJson(startDir) {
  let dir = startDir;
  let parent = path.dirname(dir);
  while (dir !== parent) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    dir = parent;
    parent = path.dirname(dir);
  }
  return null;
}

function isPackageInProjectDeps(moduleName, fileDir) {
  try {
    const pkgPath = findNearestPackageJson(fileDir);
    if (!pkgPath) {
      return false;
    }
    const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const pkg = rootPackageName(moduleName);
    return Boolean(
      (packageJson.dependencies && pkg in packageJson.dependencies) ||
        (packageJson.devDependencies && pkg in packageJson.devDependencies) ||
        (packageJson.peerDependencies && pkg in packageJson.peerDependencies)
    );
  } catch {
    return false;
  }
}

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
            const [name, moduleName] = matched;
            const fileDir = path.dirname(
              path.resolve(context.getPhysicalFilename?.() ?? context.getFilename())
            );
            const canAutoFix =
              isBuiltinPackage(moduleName) ||
              isPackageInProjectDeps(moduleName, fileDir);

            const importStatement = buildImportStatement(node.path.head.name, name, moduleName);
            context.report({
              node: node.path,
              messageId: 'missing-invokable',
              fix: canAutoFix
                ? function (fixer) {
                    return fixer.insertTextBeforeRange([0, 0], `${importStatement};\n`);
                  }
                : null,
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
