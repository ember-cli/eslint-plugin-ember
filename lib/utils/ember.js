'use strict';

const utils = require('./utils');

module.exports = {
  isDSModel,
  isModule,
  isModuleByFilePath,

  isEmberCoreModule,
  isEmberComponent,
  isEmberController,
  isEmberRoute,

  isSingleLineFn,
  isMultiLineFn,
  isFunctionExpression,

  getModuleProperties,

  isInjectedServiceProp,
  isObserverProp,
  isObjectProp,
  isArrayProp,
  isComputedProp,
  isCustomProp,
  isActionsProp,
  isModelProp,

  isRelation,

  isComponentLifecycleHookName,
  isComponentLifecycleHook,
  isComponentCustomFunction,

  isRoute,
  isRouteMethod,
  isRouteDefaultMethod,
  isRouteCustomFunction,
  isRouteProperty,
  isRouteDefaultProp,

  isControllerProperty,
  isControllerDefaultProp,
};

// Private

function isLocalModule(callee, element) {
  return (utils.isIdentifier(callee) && callee.name === element) ||
    (utils.isIdentifier(callee.object) && callee.object.name === element);
}

function isEmberModule(callee, element, module) {
  const memberExp = utils.isMemberExpression(callee.object) ? callee.object : callee;

  return isLocalModule(memberExp, module) &&
    utils.isIdentifier(memberExp.property) &&
    memberExp.property.name === element;
}

function isPropOfType(node, type) {
  const calleeNode = node.callee;

  return utils.isCallExpression(node) &&
    (
      (
        utils.isIdentifier(calleeNode) &&
        calleeNode.name === type
      ) ||
      (
        utils.isMemberExpression(calleeNode) &&
        utils.isIdentifier(calleeNode.property) &&
        calleeNode.property.name === type
      )
    );
}

// Public

function isModule(node, element, module) {
  const moduleName = module || 'Ember';

  return utils.isCallExpression(node) &&
    (isLocalModule(node.callee, element) || isEmberModule(node.callee, element, moduleName));
}

function isDSModel(node) {
  return isModule(node, 'Model', 'DS');
}

function isModuleByFilePath(filePath, module) {
  const fileName = `${module}.js`;
  const folderName = `${module}s`;

  /* Check both folder and filename to support both classic and POD's structure */
  return filePath.indexOf(fileName) > -1 || filePath.indexOf(folderName) > -1;
}

function isEmberCoreModule(node, module, filePath) {
  const isExtended = node.callee.property ? node.callee.property.name === 'extend' : false;
  let isModuleByPath;

  if (filePath) {
    isModuleByPath = isModuleByFilePath(filePath, module.toLowerCase()) && isExtended;
  }

  return isModule(node, module) || isModuleByPath;
}

function isEmberComponent(node, filePath) {
  return isEmberCoreModule(node, 'Component', filePath);
}

function isEmberController(node, filePath) {
  return isEmberCoreModule(node, 'Controller', filePath);
}

function isEmberRoute(node, filePath) {
  return isEmberCoreModule(node, 'Route', filePath);
}

function isInjectedServiceProp(node) {
  return isPropOfType(node, 'service');
}

function isObserverProp(node) {
  return isPropOfType(node, 'observer');
}

function isComputedProp(node) {
  const allowedMemberExpNames = ['volatile', 'readOnly', 'property', 'meta'];
  if (utils.isMemberExpression(node.callee) && utils.isCallExpression(node.callee.object)) {
    return isModule(node.callee.object, 'computed') &&
      utils.isIdentifier(node.callee.property) &&
      allowedMemberExpNames.indexOf(node.callee.property.name) > -1;
  }
  return isModule(node, 'computed');
}

function isArrayProp(node) {
  if (utils.isNewExpression(node.value)) {
    const parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'A';
  }

  return utils.isArrayExpression(node.value);
}

function isObjectProp(node) {
  if (utils.isNewExpression(node.value)) {
    const parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'Object';
  }

  return utils.isObjectExpression(node.value);
}

function isCustomProp(property) {
  const value = property.value;
  const isCustomObjectProp = utils.isObjectExpression(value) && property.key.name !== 'actions';

  return utils.isLiteral(value) ||
    utils.isIdentifier(value) ||
    utils.isArrayExpression(value) ||
    utils.isUnaryExpression(value) ||
    isCustomObjectProp ||
    utils.isConditionalExpression(value) ||
    utils.isTaggedTemplateExpression(value);
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

function isRoute(node) {
  return utils.isMemberExpression(node.callee) &&
    utils.isThisExpression(node.callee.object) &&
    utils.isIdentifier(node.callee.property) &&
    node.callee.property.name === 'route';
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
  const firstObjectExpressionNode = utils.findNodes(module.arguments, 'ObjectExpression')[0];
  return firstObjectExpressionNode ? firstObjectExpressionNode.properties : [];
}

function isSingleLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) === 1 &&
    !isObserverProp(property.value) &&
    (
      isComputedProp(property.value) ||
      !utils.isCallWithFunctionExpression(property.value)
    );
}

function isMultiLineFn(property) {
  return utils.isCallExpression(property.value) &&
    utils.getSize(property.value) > 1 &&
    !isObserverProp(property.value) &&
    (
      isComputedProp(property.value) ||
      !utils.isCallWithFunctionExpression(property.value)
    );
}

function isFunctionExpression(property) {
  return utils.isFunctionExpression(property) ||
    utils.isArrowFunctionExpression(property) ||
    utils.isCallWithFunctionExpression(property);
}

function isRelation(property) {
  const relationAttrs = ['hasMany', 'belongsTo'];
  let result = false;

  relationAttrs.forEach((relation) => {
    if (isModule(property.value, relation, 'DS')) {
      result = true;
    }
  });

  return result;
}
