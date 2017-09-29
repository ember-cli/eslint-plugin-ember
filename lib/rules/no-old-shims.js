'use strict';

const MAPPING = require('ember-rfc176-data');

const GLOBALS = MAPPING.reduce((memo, exportDefinition) => {
  if (!exportDefinition.deprecated) {
    return memo;
  }

  if (exportDefinition.replacement) {
    return memo;
  }

  const exportName = exportDefinition.export;
  const moduleName = exportDefinition.module;

  if (!(moduleName in memo)) {
    memo[moduleName] = {}; // eslint-disable-line no-param-reassign
  }

  memo[moduleName][exportName] = exportDefinition; // eslint-disable-line no-param-reassign

  return memo;
}, Object.create(null));

//------------------------------------------------------------------------------
// General rule - Don't use import paths from ember-cli-shims
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of old shims for modules',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-old-shims.md'
    },
    fixable: 'code',
    deprecated: true
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value;
        if (!(moduleName in GLOBALS)) {
          return;
        }

        const moduleMappings = GLOBALS[moduleName];

        const deprecatedSpecifiers = node.specifiers
          .map(importedName)
          .filter(x => x in moduleMappings);

        context.report({
          node,
          message: `Importing ${deprecatedSpecifiers.join(', ')} from ${moduleName} is deprecated.`
        });
      },
    };
  }
};

function importedName(specifier) {
  if (specifier.type === 'ImportDefaultSpecifier') {
    return 'default';
  }
  return specifier.imported.name;
}
