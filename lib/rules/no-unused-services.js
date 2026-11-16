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
    const sourceCode = context.sourceCode;

    let importedComputedName;
    let importedEmberName;
    let importedGetName;
    let importedGetPropertiesName;
    let importedInjectName;
    let importedObserverName;
    let importedObservesName;
    let importedSetName;
    let importedSetPropertiesName;
    const macros = getMacros();
    const importedMacros = {};
    // Classes that pass their `this` to a call. We cannot know what the call
    // reads from it, so the rule is turned off for them.
    const classesPassingThis = new Set();

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
      const { node: classNode, services, uses } = currentClass;
      if (Object.keys(services).length === 0 || classesPassingThis.has(classNode)) {
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

    // `thisStack` tells which class instance `this` is at the current point of
    // the traversal. Each entry is `{ node, owner, nextFunctionOwner }`:
    // - `owner`: class whose instance `this` is here (undefined if none)
    // - `nextFunctionOwner`: inside a classic class property (`foo: ...`), a regular
    //   function gets the class instance as `this` (`foo() {}`, `computed(function () {})`)
    // Arrow functions keep the outer `this`, so they do not get an entry.
    const thisStack = new Stack();
    thisStack.push({ node: null, owner: undefined, nextFunctionOwner: undefined });

    function enterThisScope(node, owner, nextFunctionOwner) {
      thisStack.push({ node, owner, nextFunctionOwner });
    }

    function exitThisScope(node) {
      if (thisStack.peek().node === node) {
        thisStack.pop();
      }
    }

    /**
     * Marks the class as passing `this` when the call gets the class instance.
     * `get(this, 'foo')` and similar calls from `@ember/object` do not count.
     * @param {CallExpression|NewExpression} node
     */
    function checkThisPassedToCall(node) {
      const owner = thisStack.peek().owner;
      if (!owner || classesPassingThis.has(owner)) {
        return;
      }
      const emberObjectFunctions = [
        importedGetName,
        importedGetPropertiesName,
        importedSetName,
        importedSetPropertiesName,
      ].filter(Boolean);
      const args =
        types.isThisExpression(node.arguments[0]) &&
        node.callee.type === 'Identifier' &&
        emberObjectFunctions.includes(node.callee.name)
          ? node.arguments.slice(1)
          : node.arguments;
      if (args.some(containsPassedThis)) {
        classesPassingThis.add(owner);
      }
    }

    function enterFunction(node) {
      const owner =
        node.parent.type === 'MethodDefinition' && node.parent.value === node
          ? node.parent.parent.parent // MethodDefinition -> ClassBody -> class
          : thisStack.peek().nextFunctionOwner;
      enterThisScope(node, owner, undefined);
    }

    /**
     * @param {Property} node
     * @returns {ASTNode|undefined} the `Foo.extend()` call if `node` is one of its properties
     */
    function getClassicClassOfProperty(node) {
      const currentClass = classStack.peek();
      if (
        currentClass &&
        currentClass.node.type === 'CallExpression' &&
        node.parent.type === 'ObjectExpression' &&
        currentClass.node.arguments.includes(node.parent)
      ) {
        return currentClass.node;
      }
      return undefined;
    }

    // Handle either ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8).
    function visitClassPropertyOrPropertyDefinition(node) {
      // A class field value gets the class instance as `this`.
      enterThisScope(node, node.static ? undefined : node.parent.parent, undefined);

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
          importedSetName = importedSetName || getImportIdentifier(node, '@ember/object', 'set');
          importedSetPropertiesName =
            importedSetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'setProperties');
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
        checkThisPassedToCall(node);
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
        const classicClass = getClassicClassOfProperty(node);
        if (classicClass) {
          enterThisScope(node, thisStack.peek().owner, classicClass);
        }

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
      'Property:exit': exitThisScope,
      'ClassProperty:exit': exitThisScope,
      'PropertyDefinition:exit': exitThisScope,
      StaticBlock(node) {
        enterThisScope(node, undefined, undefined);
      },
      'StaticBlock:exit': exitThisScope,
      'FunctionExpression, FunctionDeclaration': enterFunction,
      'FunctionExpression, FunctionDeclaration:exit': exitThisScope,
      // fn(this), new Foo(this)
      NewExpression: checkThisPassedToCall,
      OptionalCallExpression: checkThisPassedToCall,
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

/**
 * Checks if `this` is a call or `new` argument, either directly (`fn(this)`)
 * or inside an array or object (`fn({ owner: this })`, `fn(...[this])`).
 * Only goes down into the arguments, never up the tree.
 * @param {ASTNode} node
 * @returns {boolean}
 */
function containsPassedThis(node) {
  if (!node) {
    return false;
  }
  switch (node.type) {
    case 'ThisExpression': {
      return true;
    }
    case 'SpreadElement': {
      return containsPassedThis(node.argument);
    }
    case 'ArrayExpression': {
      return node.elements.some(containsPassedThis);
    }
    case 'ObjectExpression': {
      return node.properties.some((prop) =>
        containsPassedThis(prop.type === 'Property' ? prop.value : prop)
      );
    }
    default: {
      return false;
    }
  }
}
