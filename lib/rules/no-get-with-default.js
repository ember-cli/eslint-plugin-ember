'use strict';

const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE = 'Use `||` or the ternary operator instead of `getWithDefault()`';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of the Ember's `getWithDefault` function",
      category: 'Ember Object',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-get-with-default.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          catchSafeObjects: {
            type: 'boolean',
            default: true,
            description:
              "Whether the rule should catch non-`this` imported usages like `getWithDefault(person, 'name', '')`.",
          },
          catchUnsafeObjects: {
            type: 'boolean',
            default: true,
            description:
              "Whether the rule should catch non-`this` usages like `person.getWithDefault('name', '')` even though we don't know for sure if `person` is an Ember object.",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    let importedGetName;
    let importedGetWithDefaultName;

    const catchSafeObjects = !context.options[0] || context.options[0].catchSafeObjects;
    const catchUnsafeObjects = !context.options[0] || context.options[0].catchUnsafeObjects;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedGetWithDefaultName =
            importedGetWithDefaultName ||
            getImportIdentifier(node, '@ember/object', 'getWithDefault');
        }
      },

      CallExpression(node) {
        if (
          types.isMemberExpression(node.callee) &&
          (types.isThisExpression(node.callee.object) || catchUnsafeObjects) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getWithDefault' &&
          node.arguments.length === 2
        ) {
          // Example: this.getWithDefault('foo', 'bar');
          context.report({
            node,
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fix({
                fixer,
                context,
                node,
                nodeObject: node.callee.object,
                nodeProperty: node.arguments[0],
                nodeDefault: node.arguments[1],
                isImported: false,
                importedGetName,
              });
            },
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetWithDefaultName &&
          node.arguments.length === 3 &&
          (types.isThisExpression(node.arguments[0]) || catchSafeObjects)
        ) {
          // Example: getWithDefault(this, 'foo', 'bar');
          context.report({
            node,
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fix({
                fixer,
                context,
                node,
                nodeObject: node.arguments[0],
                nodeProperty: node.arguments[1],
                nodeDefault: node.arguments[2],
                isImported: true,
                importedGetName,
              });
            },
          });
        }
      },
    };
  },
};

/**
 * @param {fixer} fixer
 * @param {context} context
 * @param {node} node - node with: this.getWithDefault('foo', 'bar');
 * @param {node} nodeObject - node with: 'this'
 * @param {node} nodeProperty - node with: 'foo'
 * @param {node} nodeDefault - node with: 'bar'
 * @param {boolean} isImported - whether we are dealing with the imported version of `getWithDefault`
 * @param {string} importedGetName - name that `get` is imported under (if at all)
 */
function fix({
  fixer,
  context,
  node,
  nodeObject,
  nodeProperty,
  nodeDefault,
  isImported,
  importedGetName,
}) {
  const sourceCode = context.getSourceCode();

  const nodeObjectSourceText = sourceCode.getText(nodeObject);
  const nodePropertySourceText = sourceCode.getText(nodeProperty);
  const nodeDefaultSourceText = sourceCode.getText(nodeDefault);

  // We convert it to use `this.get('property')` here for safety in case of nested paths.
  // The `no-get` rule can then convert it to ES5 getters (`this.property`) if safe.
  // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
  const getName = importedGetName ? importedGetName : 'get';
  const fixed = isImported
    ? `(${getName}(${nodeObjectSourceText}, ${nodePropertySourceText}) === undefined ? ${nodeDefaultSourceText} : ${getName}(${nodeObjectSourceText}, ${nodePropertySourceText}))`
    : `(${nodeObjectSourceText}.get(${nodePropertySourceText}) === undefined ? ${nodeDefaultSourceText} : ${nodeObjectSourceText}.get(${nodePropertySourceText}))`;

  return !isImported || importedGetName
    ? fixer.replaceText(node, fixed)
    : [
        // Need to add import statement for `get`.
        fixer.insertTextBefore(sourceCode.ast, "import { get } from '@ember/object';\n"),
        fixer.replaceText(node, fixed),
      ];
}
