const { get } = require('./get');

function collectObjectPatternBindings(node, initialObjToBinding) {
  const identifiers = Object.keys(initialObjToBinding);
  const objBindingName = get(node, 'parent.init.name');
  const bindingIndex = identifiers.indexOf(objBindingName);
  if (bindingIndex > -1) {
    const binding = identifiers[bindingIndex];
    return node.properties.filter(({ key }) => initialObjToBinding[binding].includes(key.name))
                          .map(({ value }) => value.name);
  }

  return [];
}

module.exports = {
  collectObjectPatternBindings
};
