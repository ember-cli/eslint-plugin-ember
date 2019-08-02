'use strict';

const EMBER_NAMESPACES = ['inject.controller', 'inject.service'];

function buildMessage(obj) {
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
    importSpecifier =
      obj.match.localName && obj.match.localName !== obj.match.export
        ? `{ ${obj.match.export} as ${obj.match.localName} }`
        : `{ ${obj.match.export} }`;
  } else if (isNamedExport && isNamespace) {
    importSpecifier = `{ ${obj.parent} as ${obj.key} }`;
  } else {
    importSpecifier = obj.match.localName || obj.customKey || obj.key;
  }

  const replacement = `import ${importSpecifier} from '${obj.match.module}';`;

  if (obj.type === 'Property') {
    const global = obj.match.global.match(/^DS/) ? 'DS' : 'Ember';
    message = `Use \`${replacement}\` instead of using ${global} destructuring`;
  } else {
    message = `Use \`${replacement}\` instead of using ${obj.fullName}`;
  }

  return message;
}

/**
 * This function returns a fix function. The fix function can update the old
 * imports to the new ones.
 * @param {Object} node - the AST node related to the import problem
 * @param {Object} modulesData - the data set that maps old imports to the new
 * ones. It is an object like this one:
 * {
 *   'ember-array': {
 *     default: ['@ember/array'],
 *   },
 *   'ember-array/mutable': {
 *     default: ['@ember/array/mutable'],
 *   },
 *   'ember-array/utils': {
 *     A: ['@ember/array', 'A'],
 *     isEmberArray: ['@ember/array', 'isArray'],
 *     wrap: ['@ember/array', 'makeArray'],
 *   },
 * }
 * @return {function(fixer: Object): function} a function that applies a fix to
 * update the import
 */
function buildFix(node, modulesData) {
  const moduleName = node.source.value;
  const moduleMappings = modulesData[moduleName];

  const fix = function(fixer) {
    const newImports = {};

    node.specifiers.forEach(specifier => {
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

    const lines = Object.keys(newImports).map(module => {
      const newModuleImport = newImports[module];

      const defaultImport = newModuleImport
        .filter(it => it.importedName === 'default')
        .map(it => it.localName);

      const namedImports = newModuleImport
        .filter(it => it.importedName !== 'default')
        .map(it =>
          it.importedName !== it.localName
            ? `${it.importedName} as ${it.localName}`
            : it.importedName
        )
        .join(', ');

      const specifiers = defaultImport
        .concat(namedImports ? `{ ${namedImports} }` : '')
        .filter(Boolean)
        .join(', ');

      return `import ${specifiers} from '${module}';`;
    });

    return fixer.replaceText(node, lines.join('\n'));
  };

  return fix;
}

function isInitImportedFrom(node, module) {
  const { name } = node.init;
  const pp = node.parent.parent;
  return pp.body.some(n => {
    function containsInitSpecifier(specifiers) {
      return specifiers.some(s => {
        return s.local.name === name;
      });
    }

    return (
      n.type === 'ImportDeclaration' &&
      n.source.value === module &&
      containsInitSpecifier(n.specifiers)
    );
  });
}

module.exports = {
  buildFix,
  buildMessage,
  isInitImportedFrom,
};
