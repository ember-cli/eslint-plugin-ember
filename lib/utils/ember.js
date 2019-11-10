'use strict';

const utils = require('./utils');
const types = require('./types');
const assert = require('assert');

module.exports = {
  isDSModel,
  isModule,
  isModuleByFilePath,
  isTestFile,

  isEmberCoreModule,
  isEmberComponent,
  isEmberController,
  isEmberMixin,
  isEmberRoute,
  isEmberService,
  isEmberArrayProxy,
  isEmberObjectProxy,
  isEmberProxy,

  isSingleLineFn,
  isMultiLineFn,
  isFunctionExpression,

  getModuleProperties,
  getEmberImportAliasName,

  isInjectedServiceProp,
  isInjectedControllerProp,
  isObserverProp,
  isObjectProp,
  isArrayProp,
  isComputedProp,
  isCustomProp,
  isActionsProp,
  isRouteLifecycleHook,

  isRelation,

  isComponentLifecycleHook,

  isRoute,
  isRouteDefaultProp,

  isControllerDefaultProp,
  parseDependentKeys,
  unwrapBraceExpressions,
  hasDuplicateDependentKeys,

  isEmberObject,

  isReopenObject,
  isReopenClassObject,

  isEmberObjectImplementingUnknownProperty,

  isObserverDecorator,
};

// Private
const CORE_MODULE_IMPORT_PATHS = {
  Component: '@ember/component',
  Controller: '@ember/controller',
  Mixin: '@ember/object/mixin',
  Route: '@ember/routing/route',
  Service: '@ember/service',
  ArrayProxy: '@ember/array/proxy',
  ObjectProxy: '@ember/object/proxy',
};

function isClassicEmberCoreModule(node, module, filePath) {
  const isExtended = isEmberObject(node);
  let isModuleByPath;

  if (filePath) {
    isModuleByPath = isModuleByFilePath(filePath, module.toLowerCase()) && isExtended;
  }

  return isModule(node, module) || isModuleByPath;
}

function isLocalModule(callee, element) {
  return (
    (types.isIdentifier(callee) && callee.name === element) ||
    (types.isIdentifier(callee.object) && callee.object.name === element)
  );
}

function isEmberModule(callee, element, module) {
  const memberExp = types.isMemberExpression(callee.object) ? callee.object : callee;

  return (
    isLocalModule(memberExp, module) &&
    types.isIdentifier(memberExp.property) &&
    memberExp.property.name === element
  );
}

function isPropOfType(node, type) {
  if (types.isProperty(node) && types.isCallExpression(node.value)) {
    const calleeNode = node.value.callee;
    return (
      (types.isIdentifier(calleeNode) && calleeNode.name === type) ||
      (types.isMemberExpression(calleeNode) &&
        types.isIdentifier(calleeNode.property) &&
        calleeNode.property.name === type)
    );
  } else if ((types.isClassProperty(node) || types.isMethodDefinition(node)) && node.decorators) {
    return node.decorators.some(decorator => {
      const expression = decorator.expression;
      return (
        (types.isIdentifier(expression) && expression.name === type) ||
        (types.isCallExpression(expression) && expression.callee.name === type)
      );
    });
  }
  return false;
}

// Public

function isModule(node, element, module) {
  const moduleName = module || 'Ember';

  return (
    types.isCallExpression(node) &&
    (isLocalModule(node.callee, element) || isEmberModule(node.callee, element, moduleName))
  );
}

function isDSModel(node, filePath) {
  const isExtended = isEmberObject(node);
  let isModuleByPath = false;

  if (filePath && isExtended) {
    isModuleByPath = isModuleByFilePath(filePath, 'model');
  }

  return isModule(node, 'Model', 'DS') || isModuleByPath;
}

function isModuleByFilePath(filePath, module) {
  const fileName = `${module}.js`;
  const folderName = `${module}s`;

  /* Check both folder and filename to support both classic and POD's structure */
  return filePath.indexOf(fileName) > -1 || filePath.indexOf(folderName) > -1;
}

function isTestFile(fileName) {
  return fileName.endsWith('-test.js');
}

function isEmberObject(node) {
  return (
    node.callee.property &&
    (node.callee.property.name === 'extend' || node.callee.property.value === 'extend')
  );
}

function isReopenClassObject(node) {
  return node.callee.property && node.callee.property.name === 'reopenClass';
}

function isReopenObject(node) {
  return node.callee.property && node.callee.property.name === 'reopen';
}

function isEmberCoreModule(context, node, moduleName) {
  if (types.isCallExpression(node)) {
    // "classic" class pattern
    return isClassicEmberCoreModule(node, moduleName, context.getFilename());
  } else if (types.isClassDeclaration(node)) {
    // native classes
    if (!node.superClass) {
      return false;
    }
    const superClassImportPath = utils.getSourceModuleNameForIdentifier(context, node.superClass);

    if (superClassImportPath === CORE_MODULE_IMPORT_PATHS[moduleName]) {
      return true;
    }
  } else {
    assert(
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration` (native class)'
    );
  }
  return false;
}

function isEmberComponent(context, node) {
  return isEmberCoreModule(context, node, 'Component');
}

function isEmberController(context, node) {
  return isEmberCoreModule(context, node, 'Controller');
}

function isEmberMixin(context, node) {
  return isEmberCoreModule(context, node, 'Mixin');
}

function isEmberRoute(context, node) {
  return isEmberCoreModule(context, node, 'Route');
}

function isEmberService(context, node) {
  return isEmberCoreModule(context, node, 'Service');
}

function isEmberArrayProxy(context, node) {
  return isEmberCoreModule(context, node, 'ArrayProxy');
}

function isEmberObjectProxy(context, node) {
  return isEmberCoreModule(context, node, 'ObjectProxy');
}

function isEmberProxy(context, node) {
  return isEmberArrayProxy(context, node) || isEmberObjectProxy(context, node);
}

function isInjectedServiceProp(node) {
  return isPropOfType(node, 'service') || isPropOfType(node, 'inject');
}

function isInjectedControllerProp(node) {
  return isPropOfType(node, 'controller');
}

function isObserverProp(node) {
  return isPropOfType(node, 'observer');
}

function isComputedProp(node) {
  const allowedMemberExpNames = ['volatile', 'readOnly', 'property', 'meta'];
  if (types.isMemberExpression(node.callee) && types.isCallExpression(node.callee.object)) {
    return (
      isModule(node.callee.object, 'computed') &&
      types.isIdentifier(node.callee.property) &&
      allowedMemberExpNames.indexOf(node.callee.property.name) > -1
    );
  }
  return isModule(node, 'computed');
}

function isArrayProp(node) {
  if (types.isNewExpression(node.value)) {
    const parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'A';
  }

  return types.isArrayExpression(node.value);
}

function isObjectProp(node) {
  if (types.isNewExpression(node.value)) {
    const parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'Object';
  }

  return types.isObjectExpression(node.value);
}

function isCustomProp(property) {
  const value = property.value;
  if (!value) {
    return false;
  }
  const isCustomObjectProp = types.isObjectExpression(value) && property.key.name !== 'actions';

  return (
    types.isLiteral(value) ||
    types.isIdentifier(value) ||
    types.isArrayExpression(value) ||
    types.isUnaryExpression(value) ||
    isCustomObjectProp ||
    types.isConditionalExpression(value) ||
    types.isTaggedTemplateExpression(value)
  );
}

function isRouteLifecycleHook(property) {
  return isFunctionExpression(property.value) && isRouteLifecycleHookName(property.key.name);
}

function isActionsProp(property) {
  return property.key.name === 'actions' && types.isObjectExpression(property.value);
}

function isComponentLifecycleHookName(name) {
  return (
    [
      'didReceiveAttrs',
      'willRender',
      'willInsertElement',
      'didInsertElement',
      'didRender',
      'didUpdateAttrs',
      'willUpdate',
      'didUpdate',
      'willDestroyElement',
      'willClearRender',
      'didDestroyElement',
    ].indexOf(name) > -1
  );
}

function isComponentLifecycleHook(property) {
  return isFunctionExpression(property.value) && isComponentLifecycleHookName(property.key.name);
}

function isRoute(node) {
  return (
    types.isMemberExpression(node.callee) &&
    types.isThisExpression(node.callee.object) &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === 'route'
  );
}

function isRouteLifecycleHookName(name) {
  return (
    [
      'activate',
      'afterModel',
      'beforeModel',
      'deactivate',
      'model',
      'redirect',
      'renderTemplate',
      'resetController',
      'serialize',
      'setupController',
    ].indexOf(name) > -1
  );
}

function isRouteProperty(name) {
  return (
    [
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
    ].indexOf(name) > -1
  );
}

function isRouteDefaultProp(property) {
  return isRouteProperty(property.key.name) && property.key.name !== 'actions';
}

function isControllerProperty(name) {
  return (
    [
      'actions',
      'concatenatedProperties',
      'isDestroyed',
      'isDestroying',
      'mergedProperties',
      'model',
      'queryParams',
      'target',
    ].indexOf(name) > -1
  );
}

function isControllerDefaultProp(property) {
  return isControllerProperty(property.key.name) && property.key.name !== 'actions';
}

function getModuleProperties(module) {
  const firstObjectExpressionNode = utils.findNodes(module.arguments, 'ObjectExpression')[0];
  return firstObjectExpressionNode ? firstObjectExpressionNode.properties : [];
}

/**
 * Get alias name of default ember import.
 *
 * @param  {ImportDeclaration} importDeclaration node to parse
 * @return {String}            import name
 */
function getEmberImportAliasName(importDeclaration) {
  if (!importDeclaration.source) {
    return null;
  }
  if (importDeclaration.source.value !== 'ember') {
    return null;
  }
  return importDeclaration.specifiers[0].local.name;
}

function isSingleLineFn(property) {
  return (
    (types.isMethodDefinition(property) && utils.getSize(property) === 1) ||
    (property.value &&
      types.isCallExpression(property.value) &&
      utils.getSize(property.value) === 1 &&
      !isObserverProp(property) &&
      (isComputedProp(property.value) || !types.isCallWithFunctionExpression(property.value)))
  );
}

function isMultiLineFn(property) {
  return (
    (types.isMethodDefinition(property) && utils.getSize(property) > 1) ||
    (property.value &&
      types.isCallExpression(property.value) &&
      utils.getSize(property.value) > 1 &&
      !isObserverProp(property) &&
      (isComputedProp(property.value) || !types.isCallWithFunctionExpression(property.value)))
  );
}

function isFunctionExpression(property) {
  return (
    types.isFunctionExpression(property) ||
    types.isArrowFunctionExpression(property) ||
    types.isCallWithFunctionExpression(property)
  );
}

function isRelation(property) {
  const relationAttrs = ['hasMany', 'belongsTo'];

  return relationAttrs.some(relation => {
    return (
      (property.value && isModule(property.value, relation, 'DS')) ||
      types.isClassPropertyWithDecorator(property, relation)
    );
  });
}

/**
 * Checks whether a computed property has duplicate dependent keys.
 *
 * @param  {CallExpression} callExp Given call expression
 * @return {Boolean}        Flag whether dependent keys present.
 */
function hasDuplicateDependentKeys(callExp) {
  if (!isComputedProp(callExp)) {
    return false;
  }

  const dependentKeys = parseDependentKeys(callExp);
  const uniqueKeys = dependentKeys.filter((val, index, self) => self.indexOf(val) === index);

  return uniqueKeys.length !== dependentKeys.length;
}

/**
 * Parses dependent keys from call expression and returns them in an array.
 *
 * It also unwraps the expressions, so that `model.{foo,bar}` becomes `model.foo, model.bar`.
 *
 * @param  {CallExpression} callExp CallExpression to examine
 * @return {String[]}       Array of unwrapped dependent keys
 */
function parseDependentKeys(callExp) {
  // Check whether we have a MemberExpression, eg. computed(...).volatile()
  const isMemberExpCallExp =
    !callExp.arguments.length &&
    types.isMemberExpression(callExp.callee) &&
    types.isCallExpression(callExp.callee.object);

  const args = isMemberExpCallExp ? callExp.callee.object.arguments : callExp.arguments;

  const dependentKeys = args.filter(arg => types.isLiteral(arg)).map(literal => literal.value);

  return unwrapBraceExpressions(dependentKeys);
}

/**
 * Unwraps brace expressions.
 *
 * @param  {String[]} dependentKeys array of strings containing unprocessed dependent keys.
 * @return {String[]} Array of unwrapped dependent keys
 */
function unwrapBraceExpressions(dependentKeys) {
  const braceExpressionRegexp = /{.+}/g;

  const unwrappedExpressions = dependentKeys.map(key => {
    if (typeof key !== 'string' || !braceExpressionRegexp.test(key)) {
      return key;
    }

    const braceExpansionPart = key.match(braceExpressionRegexp)[0];
    const prefix = key.replace(braceExpansionPart, '');
    const properties = braceExpansionPart
      .replace('{', '')
      .replace('}', '')
      .split(',');

    return properties.map(property => `${prefix}${property}`);
  });

  return unwrappedExpressions.reduce((acc, cur) => acc.concat(cur), []);
}

function isEmberObjectImplementingUnknownProperty(node) {
  if (types.isCallExpression(node)) {
    if (!isEmberObject(node) && !isReopenObject(node)) {
      return false;
    }
    // Classic class.
    const properties = getModuleProperties(node);
    return properties.some(
      property => types.isIdentifier(property.key) && property.key.name === 'unknownProperty'
    );
  } else if (types.isClassDeclaration(node)) {
    // Native class.
    return node.body.body.some(
      n =>
        types.isMethodDefinition(n) && types.isIdentifier(n.key) && n.key.name === 'unknownProperty'
    );
  } else {
    assert(
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration` (native class)'
    );
  }
  return false;
}

function isObserverDecorator(node) {
  assert(types.isDecorator(node), 'Should only call this function on a Decorator');
  return (
    types.isDecorator(node) &&
    types.isCallExpression(node.expression) &&
    types.isIdentifier(node.expression.callee) &&
    node.expression.callee.name === 'observes'
  );
}
