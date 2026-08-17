'use strict';

const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE =
  'This modifier never uses its element. Modifiers exist to add behavior to an element, so element-free logic belongs somewhere else.';

/**
 * Unwraps a parameter to the node that binds a name, so that `...element` and
 * `element = fallback` are treated the same as `element`.
 */
function unwrapParam(param) {
  if (!param) {
    return null;
  }

  if (param.type === 'RestElement') {
    return unwrapParam(param.argument);
  }

  if (param.type === 'AssignmentPattern') {
    return unwrapParam(param.left);
  }

  return param;
}

function isFunction(node) {
  return (
    Boolean(node) &&
    (node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression' ||
      node.type === 'FunctionDeclaration')
  );
}

/**
 * A destructuring pattern reads the element to build its bindings, so it counts
 * as usage without any reference to look up.
 */
function isElementUsed(sourceCode, fnNode) {
  const param = unwrapParam(fnNode.params[0]);

  if (!param) {
    return false;
  }

  if (param.type !== 'Identifier') {
    return true;
  }

  const variable = sourceCode
    .getDeclaredVariables(fnNode)
    .find((candidate) => candidate.defs.some((def) => def.name === param));

  return Boolean(variable) && variable.references.length > 0;
}

function isThisElement(node) {
  if (node.object.type !== 'ThisExpression') {
    return false;
  }

  return node.computed
    ? node.property.type === 'Literal' && node.property.value === 'element'
    : node.property.type === 'Identifier' && node.property.name === 'element';
}

function isModifyMember(node) {
  return (
    (node.type === 'MethodDefinition' || node.type === 'PropertyDefinition') &&
    !node.static &&
    !node.computed &&
    node.key.type === 'Identifier' &&
    node.key.name === 'modify'
  );
}

function getModifyFunction(modifyMember) {
  if (modifyMember.type === 'MethodDefinition') {
    return modifyMember.value;
  }

  return isFunction(modifyMember.value) ? modifyMember.value : null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow modifiers that never use their element',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-modifier-without-element-usage.md',
    },
    fixable: null,
    schema: [],
    messages: {
      main: ERROR_MESSAGE,
    },
  },

  ERROR_MESSAGE,

  create(context) {
    const { sourceCode } = context;

    let functionModifierName;
    const classModifierNames = new Set();
    const classStack = [];

    function enterClass(node) {
      const isModifier =
        node.superClass?.type === 'Identifier' && classModifierNames.has(node.superClass.name);
      const modifyMember = isModifier ? node.body.body.find(isModifyMember) : undefined;

      classStack.push({
        node,
        isModifier,
        modifyMember,
        modifyFn: modifyMember && getModifyFunction(modifyMember),
        usesThisElement: false,
      });
    }

    function exitClass() {
      const { node, isModifier, modifyMember, modifyFn, usesThisElement } = classStack.pop();

      if (!isModifier || usesThisElement) {
        return;
      }

      // `modify` assigned from elsewhere cannot be checked here.
      if (modifyMember && !modifyFn) {
        return;
      }

      if (modifyFn && isElementUsed(sourceCode, modifyFn)) {
        return;
      }

      context.report({
        node: modifyFn?.params[0] ?? modifyMember?.key ?? node.id ?? node.superClass,
        messageId: 'main',
      });
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'ember-modifier') {
          return;
        }

        functionModifierName ??= getImportIdentifier(node, 'ember-modifier', 'modifier');

        for (const name of [
          getImportIdentifier(node, 'ember-modifier'),
          getImportIdentifier(node, 'ember-modifier', 'ClassBasedModifier'),
        ]) {
          if (name) {
            classModifierNames.add(name);
          }
        }
      },

      CallExpression(node) {
        if (!functionModifierName) {
          return;
        }

        if (node.callee.type !== 'Identifier' || node.callee.name !== functionModifierName) {
          return;
        }

        const callback = node.arguments[0];

        if (!isFunction(callback) || isElementUsed(sourceCode, callback)) {
          return;
        }

        context.report({
          node: callback.params[0] ?? node.callee,
          messageId: 'main',
        });
      },

      ClassDeclaration: enterClass,
      ClassExpression: enterClass,
      'ClassDeclaration:exit': exitClass,
      'ClassExpression:exit': exitClass,

      MemberExpression(node) {
        const classInfo = classStack.at(-1);

        if (classInfo?.isModifier && isThisElement(node)) {
          classInfo.usesThisElement = true;
        }
      },
    };
  },
};
