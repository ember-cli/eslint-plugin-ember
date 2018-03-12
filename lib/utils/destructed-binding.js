const { get } = require('./get');

function collectObjectPatternBindings(node, initialObjToBinding) {
  let identifiers = Object.keys(initialObjToBinding);
  let objBindingName = get(node, 'parent.init.name');
  let bindingIndex = identifiers.indexOf(objBindingName);
  if (bindingIndex > -1) {
    let binding = identifiers[bindingIndex];
    return node.properties.filter(({ key }) => {
      return initialObjToBinding[binding].includes(key.name);
    }).map(({ value }) => {
      return value.name;
    });
  }

  return [];
}

module.exports = {
  collectObjectPatternBindings
};
