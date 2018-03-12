function getMemberExpression(node) {
  const obj = node.object.type === 'ThisExpression' ? 'this' : (node.object.type === 'MemberExpression' ? getCaller(node.object) : node.object.name); // eslint-disable-line no-nested-ternary
  const property = node.property.name || node.property.value;
  return property ? `${obj}.${property}` : obj;
}

function getCaller(node) {
  if (node.type === 'MemberExpression') {
    return getMemberExpression(node);
  }

  const callee = node.callee;

  if (!callee) {
    return '';
  }

  if (callee.type === 'MemberExpression') {
    return getMemberExpression(callee);
  }
  return callee.name;
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function cleanCaller(caller) {
  if (!caller) {
    return '';
  }

  ['.call', '.apply'].forEach((application) => {
    if (endsWith(caller, application)) {
      const i = caller.lastIndexOf(application);
      caller = caller.substr(0, i); // eslint-disable-line no-param-reassign
    }
  });

  return caller;
}

function isCallingWithCall(caller) {
  return endsWith(caller, '.call');
}

function isCallingWithApply(caller) {
  return endsWith(caller, '.apply');
}

module.exports = {
  getCaller,
  cleanCaller,
  isCallingWithApply,
  isCallingWithCall
};
