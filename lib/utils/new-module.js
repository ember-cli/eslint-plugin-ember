'use strict';

const EMBER_NAMESPACES = ['inject.controller', 'inject.service'];

function populateMessage(obj, context) {
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
    importSpecifier = obj.match.localName
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
    message = `Use ${replacement} instead of using ${global} destructuring`;
  } else {
    message = `Use ${replacement} instead of using ${obj.fullName}`;
  }

  // report the issue to ESLint
  context.report(obj.node, message);

  return true;
}

module.exports = {
  populateMessage,
};
