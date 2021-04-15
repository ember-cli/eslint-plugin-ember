'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const propertyGetterUtils = require('../utils/property-getter');

function getErrorMessage(serviceName) {
  return `The service \`${serviceName}\` is not referenced in this JS file, but it may still be referenced in the corresponding HBS file. Please remove this service if it is not being used within the HBS file.`;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused service injections',
      category: 'Services',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unused-services.md',
    },
    fixable: null,
    schema: [],
  },

  getErrorMessage,

  create(context) {
    const unusedServicesMapping = {};

    return {
      // foo: service('bar')
      Property(node) {
        if (emberUtils.isInjectedServiceProp(node)) {
          const name = node.key.name;
          unusedServicesMapping[name] = node;
        }
      },
      // @service('bar') foo;
      ClassProperty(node) {
        if (emberUtils.isInjectedServiceProp(node)) {
          const name = node.key.name;
          unusedServicesMapping[name] = node;
        }
      },
      // this.foo...
      MemberExpression(node) {
        if (isEmpty(unusedServicesMapping) || !propertyGetterUtils.isSimpleThisExpression(node)) {
          return;
        }
        const name = node.property.name;
        delete unusedServicesMapping[name];
      },
      // 1. get(this, 'foo...');
      // 2. getProperties(this, [..., 'foo..', ...]); or getProperties(this, ..., 'foo..', ...);
      // 3. this.get('foo...');
      // 4. this.getProperties([..., 'foo..', ...]); or this.getProperties(..., 'foo..', ...);
      CallExpression(node) {
        if (isEmpty(unusedServicesMapping)) {
          return;
        }

        if (node.callee.name === 'get' && types.isThisExpression(node.arguments[0])) {
          // 1. get(this, 'foo...');
          const name = splitValue(node.arguments[1].value);
          delete unusedServicesMapping[name];
        } else if (
          node.callee.name === 'getProperties' &&
          types.isThisExpression(node.arguments[0])
        ) {
          // 2. getProperties(this, [..., 'foo..', ...]); or getProperties(this, ..., 'foo..', ...);
          const argArray = types.isArrayExpression(node.arguments[1])
            ? node.arguments[1].elements
            : node.arguments.slice(1);
          for (const elem of argArray) {
            const name = splitValue(elem.value);
            delete unusedServicesMapping[name];
          }
        } else if (propertyGetterUtils.isThisGetCall(node)) {
          // 3. this.get('foo...');
          const name = splitValue(node.arguments[0].value);
          delete unusedServicesMapping[name];
        } else if (
          types.isThisExpression(node.callee.object) &&
          node.callee.property.name === 'getProperties'
        ) {
          // 4. this.getProperties([..., 'foo..', ...]); or this.getProperties(..., 'foo..', ...);
          const argArray = types.isArrayExpression(node.arguments[0])
            ? node.arguments[0].elements
            : node.arguments;
          for (const elem of argArray) {
            const name = splitValue(elem.value);
            delete unusedServicesMapping[name];
          }
        }
      },
      // const { foo, ... } = this;
      VariableDeclarator(node) {
        if (isEmpty(unusedServicesMapping)) {
          return;
        }

        if (types.isThisExpression(node.init) && types.isObjectPattern(node.id)) {
          for (const property of node.id.properties) {
            delete unusedServicesMapping[property.key.name];
          }
        }
      },
      // Collect all the instances and report as needed
      'Program:exit': () => {
        for (const name of Object.keys(unusedServicesMapping)) {
          const node = unusedServicesMapping[name];
          context.report({
            node,
            message: getErrorMessage(name),
            suggest: [
              {
                desc: 'Remove the service injection if not used within the corresponding HBS file.',
                fix: (fixer) => {
                  if (types.isProperty(node)) {
                    // Gotta remove that trailing comma
                    return fixer.removeRange([node.range[0], node.range[1] + 1]);
                  }
                  return fixer.remove(node);
                },
              },
            ],
          });
        }
      },
    };
  },
};

function splitValue(value) {
  return value ? value.split('.')[0] : undefined;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
