'use strict';

const MAPPING = require('ember-rfc176-data');

const GLOBALS = MAPPING.reduce((memo, exportDefinition) => {
  if (!exportDefinition.deprecated) {
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
  },

  create(context) {
    const message = 'Don\'t use import paths from ember-cli-shims';

    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value;
        if (!(moduleName in GLOBALS)) {
          return;
        }

        const moduleMappings = GLOBALS[moduleName];

        const fix = function (fixer) {
          const newImports = {};

          node.specifiers.forEach((specifier) => {
            const localName = specifier.local.name;

            let importedName;
            if (specifier.type === 'ImportDefaultSpecifier') {
              importedName = 'default';
            } else {
              importedName = specifier.imported.name;
            }

            let module;
            let moduleMapping = moduleMappings[importedName];
            if (!moduleMapping) {
              module = moduleName;
            } else {
              moduleMapping = moduleMapping.replacement;
              module = moduleMapping.module;
              importedName = moduleMapping.export;
            }

            newImports[module] = newImports[module] || [];
            newImports[module].push({ localName, importedName });
          });

          const lines = Object.keys(newImports).map((module) => {
            const newModuleImport = newImports[module];

            const defaultImport = newModuleImport
              .filter(it => it.importedName === 'default')
              .map(it => it.localName);

            const namedImports = newModuleImport
              .filter(it => it.importedName !== 'default')
              .map(it => (it.importedName !== it.localName ? `${it.importedName} as ${it.localName}` : it.importedName))
              .join(', ');

            const specifiers = defaultImport
              .concat(namedImports ? `{ ${namedImports} }` : '')
              .filter(Boolean)
              .join(', ');

            return `import ${specifiers} from '${module}';`;
          });

          return fixer.replaceText(node, lines.join('\n'));
        };

        context.report({ node, message, fix });
      },
    };
  }
};
