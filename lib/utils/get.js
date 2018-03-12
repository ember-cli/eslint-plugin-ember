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

  let property = node[parts[0]];

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

    node = node.parent;
  }

  return null;
}

module.exports = {
  get,
  getParent
};
