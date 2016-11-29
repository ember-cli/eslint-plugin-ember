var utils = require('./utils');

module.exports = {
  isDSModel: isDSModel,
  isModule: isModule,

  isEmberComponent: isEmberComponent,
  isEmberController: isEmberController,
  isEmberRoute: isEmberRoute,

  isSingleLineFn: isSingleLineFn,
  isMultiLineFn: isMultiLineFn,
  isFunctionExpression: isFunctionExpression,

  getModuleProperties: getModuleProperties,

  isInjectedServiceProp: isInjectedServiceProp,
  isObserverProp: isObserverProp,
  isObjectProp: isObjectProp,
  isArrayProp: isArrayProp,
  isComputedProp: isComputedProp,
  isCustomProp: isCustomProp,
  isActionsProp: isActionsProp,
  isModelProp: isModelProp,

  isRelation: isRelation,

  isComponentLifecycleHookName: isComponentLifecycleHookName,
  isComponentLifecycleHook: isComponentLifecycleHook,
  isComponentCustomFunction: isComponentCustomFunction,

  isRouteMethod: isRouteMethod,
  isRouteDefaultMethod: isRouteDefaultMethod,
  isRouteCustomFunction: isRouteCustomFunction,
  isRouteProperty: isRouteProperty,
  isRouteDefaultProp: isRouteDefaultProp,

  isControllerProperty: isControllerProperty,
  isControllerDefaultProp: isControllerDefaultProp,
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

function isComputedProp(node) {
  return isModule(node, 'computed');
}

function isCustomProp(property) {
  var value = property.value;
  var isCustomObjectProp = utils.isObjectExpression(property.value) && property.key.name !== 'actions';

  return utils.isLiteral(value) ||
      utils.isIdentifier(value) ||
      utils.isArrayExpression(value) ||
      isCustomObjectProp;
}

function isModelProp(property) {
  return property.key.name === 'model' && utils.isFunctionExpression(property.value);
}

function isActionsProp(property) {
  return property.key.name === 'actions' && utils.isObjectExpression(property.value);
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

function isComponentLifecycleHook(property) {
  return isFunctionExpression(property.value) &&
    isComponentLifecycleHookName(property.key.name);
}

function isComponentCustomFunction(property) {
  return isFunctionExpression(property.value) &&
    !isComponentLifecycleHookName(property.key.name);
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

function isRouteDefaultMethod(property) {
  return isFunctionExpression(property.value) &&
    isRouteMethod(property.key.name);
}

function isRouteCustomFunction(property) {
  return isFunctionExpression(property.value) &&
    !isRouteMethod(property.key.name);
}

function isRouteProperty(name) {
  return [
    'actions',
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

function isRouteDefaultProp(property) {
  return isRouteProperty(property.key.name) &&
    property.key.name !== 'actions';
}

function isControllerProperty(name) {
  return [
    'actions',
    'concatenatedProperties',
    'isDestroyed',
    'isDestroying',
    'mergedProperties',
    'model',
    'queryParams',
    'target',
  ].indexOf(name) > -1;
}

function isControllerDefaultProp(property) {
  return isControllerProperty(property.key.name) &&
    property.key.name !== 'actions';
}

function getModuleProperties(module) {
  var firstObjectExpressionNode = utils.findNodes(module.arguments, 'ObjectExpression')[0];
  return firstObjectExpressionNode ? firstObjectExpressionNode.properties : [];
}

function isSingleLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) === 1 &&
    !isObserverProp(property.value) &&
    !utils.isCallWithFunctionExpression(property.value);
}

function isMultiLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) > 1 &&
    !isObserverProp(property.value) &&
    !utils.isCallWithFunctionExpression(property.value);
}

function isFunctionExpression(property) {
  return utils.isFunctionExpression(property) ||
    utils.isCallWithFunctionExpression(property);
}

function isRelation(property) {
  var relationAttrs = ['hasMany', 'belongsTo'];
  var result = false;

  relationAttrs.forEach(function(relation) {
    if (isModule(property.value, relation, 'DS')) {
      result = true;
    }
  });

  return result;
}
