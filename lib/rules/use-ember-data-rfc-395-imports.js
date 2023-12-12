'use strict';

const MAPPINGS = require('@ember-data/rfc395-data');
const { buildFix, buildMessage, getFullNames, isDestructuring } = require('../utils/new-module');
const { getSourceModuleNameForIdentifier } = require('../utils/import');

/**
 * This function returns an object like this:
 * {
 *   'ember-data/model': {
 *     default: ['@ember-data/model'],
 *   },
 * }
 */
function oldDataImportsReducer(acc, mapping) {
  const obj = Object.create(null);
  obj[mapping.export] = [mapping.replacement.module, mapping.replacement.export];
  acc[mapping.module] = obj; // eslint-disable-line no-param-reassign

  return acc;
}

const OLD_DATA_IMPORTS = MAPPINGS.reduce(oldDataImportsReducer, Object.create(null));

/**
 * This function returns an object like this:
 * {
 *   "DS.Model": {
 *     global: "DS.Model",
 *     export: "default",
 *     localName: "Model",
 *     module: "@ember-data/model" <- replacement
 *   }
 * }
 */
function globalsReducer(acc, mapping) {
  const { global, replacement, localName } = mapping;
  if (global in acc) {
    return acc;
  }

  const obj = {
    global,
    export: replacement.export,
    localName,
    module: replacement.module,
  };

  acc[global] = obj; // eslint-disable-line no-param-reassign

  return acc;
}

const GLOBALS = MAPPINGS.reduce(globalsReducer, Object.create(null));

const ERROR_MESSAGE =
  'Imports from @ember-data packages should be preferred over imports from ember-data';

//------------------------------------------------------------------------------
// Rule Definition - Use "Ember Data Packages" from Ember RFC #395
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `@ember-data/` package imports instead `ember-data`',
      category: 'Ember Data',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/use-ember-data-rfc-395-imports.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    //----------------------------------------------------------------------
    // Variables
    //----------------------------------------------------------------------

    const message = ERROR_MESSAGE;

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      /**
       * turn `import Model from "ember-data/model"`
       * into `import Model from "@ember-data/model"`
       * or
       * `import attr from "ember-data/attr"`
       * into `import { attr } from "@ember-data/attr"`
       */
      ImportDeclaration(node) {
        if (node.source.value in OLD_DATA_IMPORTS) {
          const fix = buildFix(node, OLD_DATA_IMPORTS);
          context.report({ node, message, fix });
          return;
        }

        if (
          node.source.value === 'ember-data' ||
          (node.source.value.startsWith('ember-data/') &&
            !node.source.value.startsWith('ember-data/types/registries/'))
        ) {
          context.report({ node, message });
        }
      },

      /**
       * warn against `const { Model } = DS`
       * and against `const { Model } = ED` (only) if ED is imported from ember-data
       */
      VariableDeclarator(node) {
        // Filter out non-ember-data variable declarations
        if (
          !isDestructuring(node) ||
          getSourceModuleNameForIdentifier(context, node.init) !== 'ember-data'
        ) {
          return;
        }

        const properties = node.id.properties;
        // Iterate through the destructured properties and report them
        for (const item of properties) {
          const key = item.key.name;
          const match = GLOBALS[`DS.${key}`];
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
      },

      /**
       * warn against DS usage in `name: DS.attr('string')`
       * taken from
       * https://github.com/ember-cli/eslint-plugin-ember/blob/v6.7.1/lib/rules/new-module-imports.js#L63
       */
      'MemberExpression > Identifier[name=DS]'(node) {
        // filter out "foo.DS"
        if (node.parent.object !== node) {
          return;
        }

        // build an array of full expression names
        // e.g. [DS.Model, DS.JSONSerializer]

        let fullName = 'DS';
        const fullNames = getFullNames(fullName, node);

        // find a matching expression starting at the end
        for (const element of fullNames) {
          fullName = element;

          const key = fullName.replace(/^DS\./, '');
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
