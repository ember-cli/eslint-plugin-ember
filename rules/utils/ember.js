var utils = require('./utils');

module.exports = {
  isDSModel: isDSModel,
  isModule: isModule,
  isEmberComponent: isEmberComponent,
  isEmberController: isEmberController,
  isInjectedServiceProp: isInjectedServiceProp,
  // isEmberRoute: isEmberRoute,
};

// Private

function isLocalModule(callee, element) {
  return (utils.isIdentifier(callee) && callee.name === element) ||
    (utils.isIdentifier(callee.object) && callee.object.name === element);
}

function isEmberModule(callee, element, module) {
  memberExp = utils.isMemberExpression(callee.object) ? callee.object : callee;

  return isLocalModule(memberExp, module) &&
    utils.isIdentifier(memberExp.property) &&
    memberExp.property.name === element;
}

// Public

function isModule(node, element, module) {
  module = module || 'Ember';

  return utils.isCallExpression(node) &&
    (isLocalModule(node.callee, element) || isEmberModule(node.callee, element, module));
}

function isDSModel(node) {
  return isModule(node, 'Model', 'DS');
}

function isEmberComponent(node) {
  return isModule(node, 'Component');
}

function isEmberController(node) {
  return isModule(node, 'Controller');
}

function isInjectedServiceProp(node) {
  var name = 'service';
  var calleeNode = node.callee;

  return utils.isCallExpression(node) &&
    (
      utils.isIdentifier(calleeNode) &&
      calleeNode.name === name
    ) ||
    (
      utils.isMemberExpression(calleeNode) &&
      utils.isIdentifier(calleeNode.property) &&
      calleeNode.property.name === name
    );
}

// function isEmberRoute(node) {
//   return isModule(node, 'Route');
// }
