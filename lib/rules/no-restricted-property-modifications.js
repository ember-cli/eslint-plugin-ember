'use strict';

const { isStringLiteral } = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');
const { isThisSet: isThisSetNative } = require('../utils/property-setter');
const { nodeToDependentKey } = require('../utils/property-getter');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow modifying the specified properties',
      category: 'Miscellaneous',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-restricted-property-modifications.md',
    },
    fixable: 'code',
    schema: {
      type: 'array',
      minItems: 1,
      maxItems: 1,
      items: [
        {
          type: 'object',
          properties: {
            properties: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
              uniqueItems: true,
              description:
                'Array of names of properties that should not be modified (modifying child/nested/sub-properties of these is also not allowed).',
            },
          },
          required: ['properties'],
          additionalProperties: false,
        },
      ],
    },
    messages: {
      doNotUseAssignment: 'Do not use assignment on properties that should not be modified.',
      doNotUseSet: 'Do not call `set` on properties that should not be modified.',
      useReadOnlyMacro:
        'Use the `readOnly` computed property macro for properties that should not be modified.',
    },
  },
  create(context) {
    let importedComputedName;
    let importedReadsName;
    let importedAliasName;

    const readOnlyProperties = context.options[0].properties;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
        } else if (node.source.value === '@ember/object/computed') {
          importedReadsName =
            importedReadsName || getImportIdentifier(node, '@ember/object/computed', 'reads');
          importedAliasName =
            importedAliasName || getImportIdentifier(node, '@ember/object/computed', 'alias');
        }
      },

      AssignmentExpression(node) {
        if (!isThisSetNative(node)) {
          return;
        }

        const dependentKey = nodeToDependentKey(node.left, context);
        if (
          readOnlyProperties.includes(dependentKey) ||
          readOnlyProperties.some((property) => dependentKey.startsWith(`${property}.`))
        ) {
          context.report({
            node,
            messageId: 'doNotUseAssignment',
          });
        }
      },

      CallExpression(node) {
        if (
          isReadOnlyPropertyUsingAliasOrReads(
            node,
            readOnlyProperties,
            importedComputedName,
            importedAliasName,
            importedReadsName
          )
        ) {
          context.report({
            node,
            messageId: 'useReadOnlyMacro',
            fix(fixer) {
              const argumentText0 = context.getSourceCode().getText(node.arguments[0]);
              return node.callee.type === 'MemberExpression'
                ? fixer.replaceText(node, `${importedComputedName}.readOnly(${argumentText0})`)
                : fixer.replaceText(node, `readOnly(${argumentText0})`);
            },
          });
        } else if (isThisSetReadOnlyProperty(node, readOnlyProperties)) {
          context.report({ node, messageId: 'doNotUseSet' });
        }
      },
    };
  },
};

function isReadOnlyPropertyUsingAliasOrReads(
  node,
  readOnlyProperties,
  importedComputedName,
  importedAliasName,
  importedReadsName
) {
  // Looks for: reads('readOnlyProperty') or alias('readOnlyProperty')
  return (
    (isAliasComputedProperty(node, importedComputedName, importedAliasName) ||
      isReadsComputedProperty(node, importedComputedName, importedReadsName)) &&
    node.arguments.length === 1 &&
    isStringLiteral(node.arguments[0]) &&
    isReadOnlyProperty(node.arguments[0].value, readOnlyProperties)
  );
}

function isThisSet(node) {
  // Looks for: this.set('readOnlyProperty...', ...);
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'ThisExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'set' &&
    node.arguments.length === 2 &&
    isStringLiteral(node.arguments[0])
  );
}

function isThisSetReadOnlyProperty(node, readOnlyProperties) {
  return isThisSet(node) && isReadOnlyProperty(node.arguments[0].value, readOnlyProperties);
}

function isAliasComputedProperty(node, importedComputedName, importedAliasName) {
  return (
    isIdentifierCall(node, importedAliasName) ||
    isMemberExpressionCall(node, importedComputedName, 'alias')
  );
}

function isReadsComputedProperty(node, importedComputedName, importedReadsName) {
  return (
    isIdentifierCall(node, importedReadsName) ||
    isMemberExpressionCall(node, importedComputedName, 'reads')
  );
}

function isIdentifierCall(node, name) {
  return (
    node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === name
  );
}

function isMemberExpressionCall(node, object, name) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === object &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === name
  );
}

function isReadOnlyProperty(property, readOnlyProperties) {
  return (
    readOnlyProperties.includes(property) ||
    readOnlyProperties.some((propertyCurrent) => property.startsWith(`${propertyCurrent}.`))
  );
}
