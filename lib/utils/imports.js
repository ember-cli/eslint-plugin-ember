const { get } = require('./get');

function collectImportBindings(node, imports) {
  const sources = Object.keys(imports);
  const sourceName = sources[sources.indexOf(node.source.value)];
  const importedBindings = imports[sourceName];

  if (sourceName) {
    return node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier' && importedBindings.includes(specifier.imported.name)).map(specifier => specifier.local.name);
  }

  return [];
}

function getEmberImportBinding(node) {
  if (get(node, 'parent.source.raw') === '\'ember\'') {
    return node.local.name;
  }
  return '';
}

module.exports = {
  collectImportBindings,
  getEmberImportBinding
};
