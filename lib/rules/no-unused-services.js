'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const propertyGetterUtils = require('../utils/property-getter');
const { getImportIdentifier } = require('../utils/import');
const {
  getMacros,
  MACROS_TO_TRACKED_ARGUMENT_COUNT,
} = require('../utils/computed-property-macros');
const Stack = require('../utils/stack');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused service injections (see rule doc for limitations)',
      category: 'Services',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unused-services.md',
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      main: 'The service `{{name}}` is not referenced in this file and might be unused (note: it could still be used in a corresponding handlebars template file, mixin, or parent/child class).',
      removeServiceInjection: 'Remove the service injection.',
    },
  },

  create(context) {
    const classStack = new Stack();
    const sourceCode = context.getSourceCode();

    let importedComputedName;
    let importedEmberName;
    let importedGetName;
    let importedGetPropertiesName;
    let importedInjectName;
    let importedObserverName;
    let importedObservesName;
    const macros = getMacros();
    const importedMacros = {};

    /**
     * Gets the trailing comma token of the given node.
     * If the trailing comma does not exist, this returns undefined.
     * @param {ASTNode} node The given node
     * @returns {Token|undefined} The trailing comma token or undefined
     */
    function getTrailingToken(node) {
      const nextToken = sourceCode.getTokenAfter(node);
      return types.isCommaToken(nextToken) ? nextToken : undefined;
    }

    /**
     * Go through the current class and report any unused services
     * @returns {void}
     */
    function reportInstances() {
      const currentClass = classStack.pop();
      const { services, uses } = currentClass;
      if (Object.keys(services).length === 0) {
        return;
      }

      for (const name of Object.keys(services)) {
        if (!uses.has(name)) {
          const node = services[name];
          context.report({
            node,
            data: { name },
            messageId: 'main',
            suggest: [
              {
                messageId: 'removeServiceInjection',
                fix(fixer) {
                  const fixers = [fixer.remove(node)];
                  if (types.isProperty(node)) {
                    const trailingTokenNode = getTrailingToken(node);
                    if (trailingTokenNode) {
                      fixers.push(fixer.remove(trailingTokenNode));
                    }
                  }
                  return fixers;
                },
              },
            ],
          });
        }
      }
    }

    // Handle either ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8).
    function visitClassPropertyOrPropertyDefinition(node) {
      // Handles:
      //   @service(...) foo;
      // If Ember and Ember.inject weren't imported, skip out early
      if (!importedEmberName && !importedInjectName) {
        return;
      }

      const currentClass = classStack.peek();
      if (
        currentClass &&
        emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName)
      ) {
        if (node.key.type === 'Identifier') {
          const name = node.key.name;
          currentClass.services[name] = node;
        } else if (types.isStringLiteral(node.key)) {
          const name = node.key.value;
          currentClass.services[name] = node;
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedComputedName =
            importedComputedName || getImportIdentifier(node, '@ember/object', 'computed');
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedGetPropertiesName =
            importedGetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'getProperties');
          importedObserverName =
            importedObserverName || getImportIdentifier(node, '@ember/object', 'observer');
        }
        if (node.source.value === '@ember/object/computed') {
          for (const spec of node.specifiers) {
            if (spec.type === 'ImportDefaultSpecifier') {
              continue;
            }
            const name = spec.imported.name;
            if (macros.includes(name)) {
              const localName = spec.local.name;
              importedMacros[localName] = name;
            }
          }
        }
        if (node.source.value === '@ember/service') {
          importedInjectName =
            importedInjectName ||
            getImportIdentifier(node, '@ember/service', 'inject') ||
            getImportIdentifier(node, '@ember/service', 'service');
        }
        if (node.source.value === '@ember-decorators/object') {
          importedObservesName =
            importedObservesName ||
            getImportIdentifier(node, '@ember-decorators/object', 'observes');
        }
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
      },
      // Native JS class
      ClassDeclaration(node) {
        classStack.push({ node, services: {}, uses: new Set() });
      },
      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          // Classic class
          classStack.push({ node, services: {}, uses: new Set() });
        } else {
          const currentClass = classStack.peek();
          if (!currentClass) {
            return;
          }

          if (
            emberUtils.isComputedProp(node, importedEmberName, importedComputedName, {
              includeMacro: true,
            })
          ) {
            // Ember.computed(), Ember.computed.or(), computed.or()
            if (types.isMemberExpression(node.callee)) {
              if (
                types.isIdentifier(node.callee.object) &&
                node.callee.object.name === importedEmberName
              ) {
                // Ember.computed()
                for (const elem of node.arguments) {
                  if (types.isStringLiteral(elem)) {
                    const name = splitValue(elem.value);
                    currentClass.uses.add(name);
                  }
                }
              } else if (types.isIdentifier(node.callee.property)) {
                // Ember.computed.or(), computed.or()
                const macroName = node.callee.property.name;
                if (macros.includes(macroName)) {
                  for (
                    let idx = 0;
                    idx < MACROS_TO_TRACKED_ARGUMENT_COUNT[macroName] &&
                    idx < node.arguments.length;
                    idx++
                  ) {
                    const elem = node.arguments[idx];
                    if (types.isStringLiteral(elem)) {
                      const name = splitValue(elem.value);
                      currentClass.uses.add(name);
                    }
                  }
                }
              }
            } else {
              // computed()
              for (const elem of node.arguments) {
                if (types.isStringLiteral(elem)) {
                  const name = splitValue(elem.value);
                  currentClass.uses.add(name);
                }
              }
            }
          } else if (propertyGetterUtils.isThisGetCall(node)) {
            // this.get('foo...');
            const name = splitValue(node.arguments[0].value);
            currentClass.uses.add(name);
          } else if (
            types.isThisExpression(node.callee.object) &&
            node.callee.property.name === 'getProperties'
          ) {
            // this.getProperties([..., 'foo..', ...]); or this.getProperties(..., 'foo..', ...);
            const argArray = types.isArrayExpression(node.arguments[0])
              ? node.arguments[0].elements
              : node.arguments;
            for (const elem of argArray) {
              const name = splitValue(elem.value);
              currentClass.uses.add(name);
            }
          } else if (types.isIdentifier(node.callee)) {
            const calleeName = node.callee.name;
            if (types.isThisExpression(node.arguments[0])) {
              // If Ember.get and Ember.getProperties weren't imported, skip out early
              if (!importedGetName && !importedGetPropertiesName) {
                return;
              }

              if (calleeName === importedGetName) {
                // get(this, 'foo...');
                const name = splitValue(node.arguments[1].value);
                currentClass.uses.add(name);
              } else if (calleeName === importedGetPropertiesName) {
                // getProperties(this, [..., 'foo..', ...]); or getProperties(this, ..., 'foo..', ...);
                const argArray = types.isArrayExpression(node.arguments[1])
                  ? node.arguments[1].elements
                  : node.arguments.slice(1);
                for (const elem of argArray) {
                  const name = splitValue(elem.value);
                  currentClass.uses.add(name);
                }
              }
            } else if (importedMacros[calleeName]) {
              // Computed macros like @alias(), @or()
              const macroName = importedMacros[calleeName];
              for (
                let idx = 0;
                idx < MACROS_TO_TRACKED_ARGUMENT_COUNT[macroName] && idx < node.arguments.length;
                idx++
              ) {
                const elem = node.arguments[idx];
                if (types.isStringLiteral(elem)) {
                  const name = splitValue(elem.value);
                  currentClass.uses.add(name);
                }
              }
            } else if (calleeName === importedObserverName) {
              // observer('foo', ...)
              for (const elem of node.arguments) {
                if (types.isStringLiteral(elem)) {
                  const name = splitValue(elem.value);
                  currentClass.uses.add(name);
                }
              }
            }
          } else if (
            types.isMemberExpression(node.callee) &&
            types.isIdentifier(node.callee.object) &&
            node.callee.object.name === importedEmberName &&
            types.isIdentifier(node.callee.property) &&
            node.callee.property.name === 'observer'
          ) {
            // Ember.observer('foo', ...)
            for (const elem of node.arguments) {
              if (types.isStringLiteral(elem)) {
                const name = splitValue(elem.value);
                currentClass.uses.add(name);
              }
            }
          }
        }
      },
      'ClassDeclaration:exit'(node) {
        if (classStack.peek() && classStack.peek().node === node) {
          // Leaving current (native) class.
          reportInstances();
        }
      },
      'CallExpression:exit'(node) {
        if (classStack.peek() && classStack.peek().node === node) {
          // Leaving current (classic) class.
          reportInstances();
        }
      },
      // @observes('foo', ...)
      Decorator(node) {
        // If Ember and Ember.inject weren't imported OR observes wasn't imported, skip out early
        if ((!importedEmberName && !importedInjectName) || !importedObservesName) {
          return;
        }

        const currentClass = classStack.peek();
        if (
          currentClass &&
          emberUtils.isObserverDecorator(node, importedObservesName) &&
          types.isCallExpression(node.expression)
        ) {
          for (const elem of node.expression.arguments) {
            if (types.isStringLiteral(elem)) {
              const name = splitValue(elem.value);
              currentClass.uses.add(name);
            }
          }
        }
      },
      // foo: service(...)
      Property(node) {
        // If Ember and Ember.inject weren't imported, skip out early
        if (!importedEmberName && !importedInjectName) {
          return;
        }

        const currentClass = classStack.peek();
        if (
          currentClass &&
          emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName)
        ) {
          if (node.key.type === 'Identifier') {
            const name = node.key.name;
            currentClass.services[name] = node;
          } else if (types.isStringLiteral(node.key)) {
            const name = node.key.value;
            currentClass.services[name] = node;
          }
        }
      },

      ClassProperty: visitClassPropertyOrPropertyDefinition,
      PropertyDefinition: visitClassPropertyOrPropertyDefinition,

      // this.foo...
      MemberExpression(node) {
        const currentClass = classStack.peek();
        if (
          currentClass &&
          types.isThisExpression(node.object) &&
          types.isIdentifier(node.property)
        ) {
          const name = node.property.name;
          currentClass.uses.add(name);
        }
      },
      GlimmerPathExpression(node) {
        const currentClass = classStack.peek();
        if (currentClass && node.head.type === 'ThisHead' && node.tail.length > 0) {
          const name = node.tail[0];
          currentClass.uses.add(name);
        }
      },
      VariableDeclarator(node) {
        const currentClass = classStack.peek();
        if (
          currentClass &&
          node.init &&
          types.isThisExpression(node.init) &&
          types.isObjectPattern(node.id)
        ) {
          for (const property of node.id.properties) {
            currentClass.uses.add(property.key.name);
          }
        }
      },
    };
  },
};

/**
 * Splits the value by "." and returns the first element
 * @param {String} value The given value
 * @returns {String|undefined} The first split element or undefined if value does not exist
 */
function splitValue(value) {
  return value ? value.split('.')[0] : undefined;
}
