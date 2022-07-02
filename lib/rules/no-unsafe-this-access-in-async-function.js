'use strict';

const ERROR_MESSAGE =
  // eslint-disable-next-line eslint-plugin/prefer-placeholders
  'Unsafe `this` access after `await`. ' +
  'Guard against accessing data on destroyed objects with `@ember/destroyable` `isDestroyed` and `isDestroying`';

const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

// Test here:
// https://astexplorer.net/#/gist/e364803b7c576e08f232839bf3c17287/15913876e050a1ca02af71932e14b14242e36ead

/**
 * These objects have their own destroyable APIs on `this`
 */
const FRAMEWORK_EXTENDABLES = [
  {
    importPath: '@glimmer/component',
  },
  {
    importPath: '@ember/component',
  },
  {
    importPath: '@ember/component/helper',
  }
  {
    importPath: '@ember/routing/route',
  },
  {
    importPath: '@ember/controller',
  },
];

/**
  * These objects don't have their own destroyable APIs but are
  * wired in to the framework via associateDestroyableChild
  */
const KNOWN_DESTROYABLES = [
  {
    importPath: 'ember-modifier'
  }
]

// if already has protection, also early return
// two forms:
//   - isDestroying(this) || isDestroyed(this) // on any destroyable object
//   - this.isDestroying || this.isDestroyed  // available on most framework objects
function isProtection(node) {
  const fns = new Set(['isDestroying', 'isDestroyed']);

  switch (node.type) {
    case 'CallExpression': {
      return (
        fns.has(node.callee.name) &&
        node.arguments.length === 1 &&
        node.arguments[0].type === 'ThisExpression'
      );
    }
    case 'MemberExpression':
      return node.object.type === 'ThisExpression' && fns.has(node.property.name);
    default:
      console.log('unhandled protection check', node);
  }

  return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  KNOWN_DESTROYABLES,
  FRAMEWORK_EXTENDABLES,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow `this` access after await unless destruction protection is present',
      category: 'Miscellaneous',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unsafe-this-access-in-async-function.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const inFunction = [];
    const inClass = [];
    let encounteredAwait;
    let lastProtection;

    // https://eslint.org/docs/developer-guide/working-with-rules#contextgetsourcecode
    const source = context.getSourceCode();

    return {
      ClassDeclaration(node) {
        inClass.push(node);
      },
      'ClassDeclaration:exit'(node) {
        inClass.pop();
      },
      FunctionExpression(node) {
        inFunction.push(node);
        encounteredAwait = null;
      },
      'FunctionExpression:exit'(node) {
        inFunction.pop();
      },
      IfStatement(node) {
        const { test } = node;

        switch (test.type) {
          case 'LogicalExpression': {
            const { left, right } = test;

            if (isProtection(left) || isProtection(right)) {
              lastProtection = node;
              encounteredAwait = null;
            }
            break;
          }
          default:
            console.log('unhandled if statestatement', node);
        }
      },
      AwaitExpression(node) {
        if (inClass.length === 0) {
          return;
        }
        if (inFunction.length === 0) {
          return;
        }

        encounteredAwait = node.parent;
      },
      MemberExpression(node) {
        if (node.object.type !== 'ThisExpression') {
          return;
        }
        if (!encounteredAwait) {
          return;
        }

        context.report({
          node: node.object,
          message: ERROR_MESSAGE,

          // https://eslint.org/docs/developer-guide/working-with-rules#applying-fixes
          *fix(fixer) {
            if (!encounteredAwait) {
              return;
            }

            const toFix = encounteredAwait;
            encounteredAwait = null;

            const protection = '\nif (isDestroying(this) || isDestroyed(this)) return;';
            const original = source.getText(toFix);

            yield fixer.replaceText(toFix, original + protection);

            // extend range of the fix to the range
            yield fixer.insertTextBefore(toFix, '');
            yield fixer.insertTextAfter(toFix, '');
          },
        });
      },
    };
  },
};

