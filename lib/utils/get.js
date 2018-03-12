function get(node, path) {
  let parts;
  if (typeof path === 'string') {
    parts = path.split('.');
  } else {
    parts = path;
  }

  if (parts.length === 1) {
    return node[path];
  }

  const property = node[parts[0]];

  if (property && parts.length > 1) {
    parts.shift();
    return get(property, parts);
  }

  return property;
}

function getParent(node, predicate) {
  while (node) {
    if (predicate(node)) {
      return node;
    }

    node = node.parent; // eslint-disable-line no-param-reassign
  }

  return null;
}

module.exports = {
  get,
  getParent
};
