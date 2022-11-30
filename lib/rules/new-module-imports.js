'use strict';

const MAPPING = require('ember-rfc176-data');
const { buildMessage, getFullNames, isDestructuring } = require('../utils/new-module');
const { getSourceModuleNameForIdentifier } = require('../utils/import');

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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce using "New Module Imports" from Ember RFC #176',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/new-module-imports.md',
    },
    schema: [],
  },

  create(context) {
    function reportNestedProperties(properties, parent) {
      for (const item of properties) {
        const match = GLOBALS[`Ember.${parent}.${item.key.name}`];

        if (match) {
          const message = buildMessage({
            node: item,
            key: item.key.name,
            match,
            parent,
            type: item.type,
          });

          context.report({ node: item, message });
        }
      }
    }

    return {
      VariableDeclarator(node) {
        if (
          !isDestructuring(node) ||
          getSourceModuleNameForIdentifier(context, node.init) !== 'ember'
        ) {
          return;
        }

        const properties = node.id.properties;
        // Iterate through the destructured properties and report them
        for (const item of properties) {
          // Locate nested destructuring
          if (item.value.properties) {
            const parent = item.key.name;
            const props = item.value.properties;
            reportNestedProperties(props, parent);
          } else {
            const key = item.key.name;
            const match = GLOBALS[`Ember.${key}`];

            if (match) {
              const message = buildMessage({
                node: item,
                customKey: key === item.value.name ? null : item.value.name,
                key,
                match,
                type: item.type,
              });

              context.report({ node: item, message });
            }
          }
        }
      },

      'MemberExpression > Identifier[name=Ember]'(node) {
        // filter out "foo.Ember"
        if (node.parent.object !== node) {
          return;
        }

        // build an array of full expression names
        // e.g. [Ember.computed, Ember.computed.or]
        let fullName = 'Ember';
        const fullNames = getFullNames(fullName, node);

        // find a matching expression starting at the end
        for (const element of fullNames) {
          fullName = element;

          const key = fullName.replace(/^Ember\./, '');
          const match = GLOBALS[fullName];

          // if a given global path does not exist in `mappings.json` there is no
          // JS module import for it, so do not report the error
          if (match) {
            const message = buildMessage({ node, fullName, key, match });
            context.report({ node, message });
            break;
          }
        }
      },
    };
  },
};
