'use strict';

const EMBER_NAMESPACES = ['inject.controller', 'inject.service'];
const MAPPING = require('ember-rfc176-data');

const GLOBALS = MAPPING.reduce((memo, exportDefinition) => {
  if (exportDefinition.deprecated) {
    return memo;
  }

  if (exportDefinition.global in memo) {
    return memo;
  }

  memo[exportDefinition.global] = exportDefinition; // eslint-disable-line no-param-reassign

  return memo;
}, Object.create(null));

//------------------------------------------------------------------------------
// General rule - Use "New Module Imports" from Ember RFC #176
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: ' Use "New Module Imports" from Ember RFC #176',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/new-module-imports.md'
    },
  },

  create(context) {
    return {
      VariableDeclarator(node) {
        // Filter out non-Ember variable declarations
        if (!node.init || node.init.name !== 'Ember') return;

        const properties = node.id.properties;
        // Iterate through the destructured properties and report them
        properties.forEach((item) => {
          // Locate nested destructuring
          if (item.value.properties) {
            const parent = item.key.name;
            const props = item.value.properties;
            reportNestedProperties(props, parent);
          } else {
            const key = item.key.name;
            const match = GLOBALS[`Ember.${key}`];
            populateMessage({
              node: item,
              customKey: (key !== item.value.name) ? item.value.name : null,
              key,
              match,
              type: item.type
            });
          }
        });
      },

      'MemberExpression > Identifier[name=Ember]': function (node) {
        // filter out "foo.Ember"
        if (node.parent.object !== node) return;

        // build an array of full expression names
        // e.g. [Ember.computed, Ember.computed.or]
        let fullName = 'Ember';
        const fullNames = [];
        let parentNode = node.parent;
        while (parentNode.type === 'MemberExpression') {
          fullName += `.${parentNode.property.name}`;
          fullNames.push(fullName);
          parentNode = parentNode.parent;
        }

        fullNames.reverse();

        // find a matching expression starting at the end
        for (let i = 0; i < fullNames.length; i++) {
          fullName = fullNames[i];

          const key = fullName.replace(/^Ember\./, '');
          const match = GLOBALS[fullName];

          const reportedError = populateMessage({ node, fullName, key, match });

          if (reportedError) {
            // exit the loop after the first match was found
            break;
          }
        }
      }
    };

    function reportNestedProperties(properties, parent) {
      properties.forEach((item) => {
        const match = GLOBALS[`Ember.${parent}.${item.key.name}`];

        populateMessage({
          node: item,
          key: item.key.name,
          match,
          parent,
          type: item.type
        });
      });
    }

    function populateMessage(obj) {
      // if a given global path does not exist in `globals.json` there is no
      // JS module import for it, so do not report the error
      if (!obj.match) {
        return false;
      }

      // Both the Controller module and Service module each make available the
      // "inject" namespace. In order to make it more readable, so it's more
      // explicit at first glance from which module the "inject" namespace
      // belongs to or is being imported from, let's check against this so we
      // can properly populate the import specifier to report the ESLint error.
      // Ex: import { inject as service } from '@ember/service';
      const isNamespace = EMBER_NAMESPACES.indexOf(`${obj.parent}.${obj.key}`) !== -1;

      const isNamedExport = obj.match.export !== 'default';

      let importSpecifier;
      let message;

      if (isNamedExport && !isNamespace) {
        importSpecifier = obj.match.localName ? `{ ${obj.match.export} as ${obj.match.localName} }` : `{ ${obj.match.export} }`;
      } else if (isNamedExport && isNamespace) {
        importSpecifier = `{ ${obj.parent} as ${obj.key} }`;
      } else {
        importSpecifier = obj.match.localName || obj.customKey || obj.key;
      }

      const replacement = `import ${importSpecifier} from '${obj.match.module}';`;

      if (obj.type === 'Property') {
        message = `Use ${replacement} instead of using Ember destructuring`;
      } else {
        message = `Use ${replacement} instead of using ${obj.fullName}`;
      }

      // report the issue to ESLint
      context.report(obj.node, message);

      return true;
    }
  }
};
