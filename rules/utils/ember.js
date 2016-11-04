var utils = require('./utils');

module.exports = {
  isDSModel: isDSModel,
  isModule: isModule,
  isEmberComponent: isEmberComponent,
  isEmberController: isEmberController,
  isEmberRoute: isEmberRoute,
  isInjectedServiceProp: isInjectedServiceProp,
  isObserverProp: isObserverProp,
  isObjectProp: isObjectProp,
  isArrayProp: isArrayProp,
  isCustomProp: isCustomProp,
  isComponentLifecycleHookName: isComponentLifecycleHookName,
  isRouteMethod: isRouteMethod,
  isRouteProperty: isRouteProperty,
  getModuleProperties: getModuleProperties,
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

function isPropOfType(node, type) {
  var calleeNode = node.callee;

  return utils.isCallExpression(node) &&
    (
      utils.isIdentifier(calleeNode) &&
      calleeNode.name === type
    ) ||
    (
      utils.isMemberExpression(calleeNode) &&
      utils.isIdentifier(calleeNode.property) &&
      calleeNode.property.name === type
    );
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

function isEmberRoute(node) {
  return isModule(node, 'Route');
}

function isInjectedServiceProp(node) {
  return isPropOfType(node, 'service');
}

function isObserverProp(node) {
  return isPropOfType(node, 'observer');
}

function isArrayProp(node) {
  if (utils.isNewExpression(node.value)) {
    var parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'A';
  }

  return utils.isArrayExpression(node.value);
}

function isObjectProp(node) {
  if (utils.isNewExpression(node.value)) {
    var parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'Object';
  }

  return utils.isObjectExpression(node.value);
}

function isCustomProp(property) {
  var value = property.value;
  var isCustomObjectProp = utils.isObjectExpression(property.value) && property.key.name !== 'actions';

  return utils.isLiteral(value) ||
      utils.isIdentifier(value) ||
      utils.isArrayExpression(value) ||
      isCustomObjectProp;
}

function isComponentLifecycleHookName(name) {
  return [
    'init',
    'didReceiveAttrs',
    'willRender',
    'didInsertElement',
    'didRender',
    'didUpdateAttrs',
    'willUpdate',
    'didUpdate',
    'willDestroyElement',
    'willClearRender',
    'didDestroyElement',
  ].indexOf(name) > -1;
}

function isRouteMethod(name) {
    return [
      'activate',
      'addObserver',
      'afterModel',
      'beforeModel',
      'cacheFor',
      'controllerFor',
      'create',
      'deactivate',
      'decrementProperty',
      'destroy',
      'disconnectOutlet',
      'extend',
      'get',
      'getProperties',
      'getWithDefault',
      'has',
      'incrementProperty',
      'init',
      'intermediateTransitionTo',
      'model',
      'modelFor',
      'notifyPropertyChange',
      'off',
      'on',
      'one',
      'paramsFor',
      'redirect',
      'refresh',
      'removeObserver',
      'render',
      'renderTemplate',
      'reopen',
      'reopenClass',
      'replaceWith',
      'resetController',
      'send',
      'serialize',
      'set',
      'setProperties',
      'setupController',
      'toString',
      'toggleProperty',
      'transitionTo',
      'trigger',
      'willDestroy',
    ].indexOf(name) > -1;
}

function isRouteProperty(name) {
  return [
    'concatenatedProperties',
    'controller',
    'controllerName',
    'isDestroyed',
    'isDestroying',
    'mergedProperties',
    'queryParams',
    'routeName',
    'templateName',
  ].indexOf(name) > -1;
}

function getModuleProperties(module) {
  return utils.findNodes(module.arguments, 'ObjectExpression')[0].properties;
}
