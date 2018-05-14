'use strict';

const oldShimsData = require('ember-rfc176-data/old-shims.json');

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
        if (!(moduleName in oldShimsData)) {
          return;
        }

        const moduleMappings = oldShimsData[moduleName];

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
            const moduleMapping = moduleMappings[importedName];
            if (!moduleMapping) {
              module = moduleName;
            } else {
              module = moduleMapping[0];
              importedName = moduleMapping[1] || 'default';
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
