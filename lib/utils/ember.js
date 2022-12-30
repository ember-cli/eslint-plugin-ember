'use strict';

const path = require('path');
const utils = require('./utils');
const importUtils = require('./import');
const types = require('./types');
const assert = require('assert');
const decoratorUtils = require('../utils/decorators');
const { getNodeOrNodeFromVariable } = require('../utils/utils');
const kebabCase = require('lodash.kebabcase');

module.exports = {
  isDSModel,
  isModule,
  isModuleByFilePath,
  isMirageDirectory,
  isMirageConfig,
  isTestFile,

  isEmberCoreModule,
  isAnyEmberCoreModule,
  isEmberComponent,
  isGlimmerComponent,
  isEmberController,
  isEmberMixin,
  isEmberRoute,
  isEmberService,
  isEmberArrayProxy,
  isEmberObjectProxy,
  isEmberObject,
  isEmberHelper,
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
  isGlimmerComponentLifecycleHook,

  isRoute,
  isRouteDefaultProp,

  isControllerDefaultProp,
  parseDependentKeys,
  unwrapBraceExpressions,
  hasDuplicateDependentKeys,

  isExtendObject,
  isReopenObject,
  isReopenClassObject,

  isEmberObjectImplementingUnknownProperty,

  isObserverDecorator,

  convertServiceNameToKebabCase,
};

// Private
const CORE_MODULE_IMPORT_PATHS = {
  Component: '@ember/component',
  GlimmerComponent: '@glimmer/component',
  Controller: '@ember/controller',
  Mixin: '@ember/object/mixin',
  Route: '@ember/routing/route',
  Service: '@ember/service',
  ArrayProxy: '@ember/array/proxy',
  ObjectProxy: '@ember/object/proxy',
  EmberObject: '@ember/object',
  Helper: '@ember/component/helper',
};

function isClassicEmberCoreModule(node, module, filePath) {
  const isExtended = isExtendObject(node);
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
    return types.isIdentifier(calleeNode) && calleeNode.name === type;
  } else if (
    (types.isClassPropertyOrPropertyDefinition(node) || types.isMethodDefinition(node)) &&
    node.decorators
  ) {
    return node.decorators.some((decorator) => {
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

function isModule(node, element, moduleName = 'Ember') {
  if (types.isIdentifier(node)) {
    return isLocalModule(node, element) || isEmberModule(node, element, moduleName);
  }

  if (types.isCallExpression(node)) {
    return isLocalModule(node.callee, element) || isEmberModule(node.callee, element, moduleName);
  }

  return false;
}

function isDSModel(node, filePath) {
  const isExtended = isExtendObject(node);
  let isModuleByPath = false;

  if (filePath && isExtended) {
    isModuleByPath = isModuleByFilePath(filePath, 'model');
  }

  return isModule(node, 'Model', 'DS') || isModuleByPath;
}

function isModuleByFilePath(filePath, module) {
  const expectedFileNameJs = `${module}.js`;
  const expectedFileNameTs = `${module}.ts`;
  const expectedFolderName = `${module}s`;

  const normalized = path.normalize(filePath);
  const actualFolders = path.dirname(normalized).split(path.sep);
  const actualFileName = path.basename(normalized);

  /* Check both folder and filename to support both classic and POD's structure */
  return (
    actualFileName === expectedFileNameJs ||
    actualFileName === expectedFileNameTs ||
    actualFolders.includes(expectedFolderName)
  );
}

function isTestFile(fileName) {
  return fileName.endsWith('-test.js') || fileName.endsWith('-test.ts');
}

function isMirageDirectory(fileName) {
  const pathParts = path.normalize(fileName).split(path.sep);
  return pathParts.includes('mirage');
}

function isMirageConfig(fileName) {
  return path.normalize(fileName).endsWith(path.join('mirage', 'config.js'));
}

// Some third-party libraries have an `extend` function and we want to avoid mistaking this for an extended Ember object.
// TODO: ideally, this would check the actual name that these libraries are imported under, but there's a lot of plumbing needed for that.
const COMMON_JQUERY_NAMES = ['$', 'jQuery']; // https://api.jquery.com/jquery.extend/
const COMMON_LODASH_NAMES = ['_', 'lodash']; // https://lodash.com/docs/4.17.15#assignIn
const THIRD_PARTY_LIBRARIES_WITH_EXTEND = new Set([...COMMON_JQUERY_NAMES, ...COMMON_LODASH_NAMES]);

function isExtendObject(node) {
  // Check for:
  // * foo.extend();
  // * foo['extend']();
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    ((node.callee.property.type === 'Identifier' && node.callee.property.name === 'extend') ||
      (node.callee.property.type === 'Literal' && node.callee.property.value === 'extend')) &&
    !(
      node.callee.object.type === 'Identifier' &&
      THIRD_PARTY_LIBRARIES_WITH_EXTEND.has(node.callee.object.name)
    )
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
  } else if (types.isClassDeclaration(node) || node.type === 'ClassExpression') {
    // native classes
    if (
      // class Foo extends Component
      !node.superClass ||
      // class Foo extends Component.extend(SomeMixin)
      !(
        types.isIdentifier(node.superClass) ||
        (types.isCallExpression(node.superClass) &&
          types.isMemberExpression(node.superClass.callee) &&
          types.isIdentifier(node.superClass.callee.property) &&
          node.superClass.callee.property.name === 'extend')
      )
    ) {
      return false;
    }

    const superClass = types.isIdentifier(node.superClass)
      ? node.superClass
      : node.superClass.callee.object;

    const superClassImportPath = importUtils.getSourceModuleNameForIdentifier(context, superClass);

    if (superClassImportPath === CORE_MODULE_IMPORT_PATHS[moduleName]) {
      return true;
    }
  } else {
    assert(
      false,
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration`/`ClassExpression` (native class)'
    );
  }
  return false;
}

function isAnyEmberCoreModule(context, node) {
  return (
    isEmberComponent(context, node) ||
    isGlimmerComponent(context, node) ||
    isEmberController(context, node) ||
    isEmberMixin(context, node) ||
    isEmberRoute(context, node) ||
    isEmberService(context, node) ||
    isEmberArrayProxy(context, node) ||
    isEmberObjectProxy(context, node) ||
    isEmberObject(context, node) ||
    isEmberHelper(context, node)
  );
}

function isEmberComponent(context, node) {
  return isEmberCoreModule(context, node, 'Component');
}

function isGlimmerComponent(context, node) {
  return isEmberCoreModule(context, node, 'GlimmerComponent');
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

function isEmberObject(context, node) {
  return isEmberCoreModule(context, node, 'EmberObject');
}

function isEmberHelper(context, node) {
  return isEmberCoreModule(context, node, 'Helper');
}

function isEmberProxy(context, node) {
  return isEmberArrayProxy(context, node) || isEmberObjectProxy(context, node);
}

/**
 * Checks if a node is a service injection. Looks for:
 * * service()
 * * Ember.inject.service()
 * @param {node} node
 * @param {string} importedEmberName name that `Ember` is imported under
 * @param {string} importedInjectName name that `inject` is imported under
 * @returns
 */
function isInjectedServiceProp(node, importedEmberName, importedInjectName) {
  return (
    isPropOfType(node, importedInjectName) ||
    (types.isProperty(node) &&
      types.isCallExpression(node.value) &&
      types.isMemberExpression(node.value.callee) &&
      types.isMemberExpression(node.value.callee.object) &&
      types.isIdentifier(node.value.callee.object.object) &&
      node.value.callee.object.object.name === importedEmberName &&
      types.isIdentifier(node.value.callee.object.property) &&
      node.value.callee.object.property.name === 'inject' &&
      types.isIdentifier(node.value.callee.property) &&
      node.value.callee.property.name === 'service')
  );
}

/**
 * Checks if a node is a controller injection. Looks for:
 * * controller()
 * * Ember.inject.controller()
 * @param {node} node
 * @param {string} importedEmberName name that `Ember` is imported under
 * @param {string} importedControllerName name that `controller` is imported under
 * @returns
 */
function isInjectedControllerProp(node, importedEmberName, importedControllerName) {
  return (
    isPropOfType(node, importedControllerName) ||
    (types.isProperty(node) &&
      types.isCallExpression(node.value) &&
      types.isMemberExpression(node.value.callee) &&
      types.isMemberExpression(node.value.callee.object) &&
      types.isIdentifier(node.value.callee.object.object) &&
      node.value.callee.object.object.name === importedEmberName &&
      types.isIdentifier(node.value.callee.object.property) &&
      node.value.callee.object.property.name === 'inject' &&
      types.isIdentifier(node.value.callee.property) &&
      node.value.callee.property.name === 'controller')
  );
}

/**
 * Checks if a node is an observer prop. Looks for:
 * * observer()
 * * Ember.observer()
 * @param {node} node
 * @param {string} importedEmberName name that `Ember` is imported under
 * @param {string} importedObserverName name that `observer` is imported under
 * @returns
 */
function isObserverProp(node, importedEmberName, importedObserverName) {
  return (
    isPropOfType(node, importedObserverName) ||
    (types.isProperty(node) &&
      types.isCallExpression(node.value) &&
      types.isMemberExpression(node.value.callee) &&
      types.isIdentifier(node.value.callee.object) &&
      node.value.callee.object.name === importedEmberName &&
      types.isIdentifier(node.value.callee.property) &&
      types.isIdentifier(node.value.callee.property) &&
      node.value.callee.property.name === 'observer')
  );
}

const allowedMemberExpNames = new Set(['volatile', 'readOnly', 'property', 'meta']);
/**
 * Checks if a node is a computed property.
 * @param {node} node
 * @param {string} importedEmberName name that `Ember` is imported under
 * @param {string} importedComputedName name that `computed` is imported under
 * @param {object} options
 * @param {boolean} options.includeSuffix whether to consider something like computed().volatile() as a computed property
 * @param {boolean} options.includeMacro whether to consider something like computed.and() as a computed property
 */
function isComputedProp(
  node,
  importedEmberName,
  importedComputedName,
  { includeSuffix, includeMacro } = {}
) {
  return (
    // computed
    (types.isIdentifier(node) && node.name === importedComputedName) ||
    // computed()
    (types.isCallExpression(node) &&
      types.isIdentifier(node.callee) &&
      node.callee.name === importedComputedName) ||
    // Ember.computed()
    (types.isCallExpression(node) &&
      types.isMemberExpression(node.callee) &&
      types.isIdentifier(node.callee.object) &&
      node.callee.object.name === importedEmberName &&
      types.isIdentifier(node.callee.property) &&
      node.callee.property.name === 'computed') ||
    // Ember.computed().volatile() or computed().volatile()
    (includeSuffix &&
      types.isCallExpression(node) &&
      types.isMemberExpression(node.callee) &&
      types.isIdentifier(node.callee.property) &&
      allowedMemberExpNames.has(node.callee.property.name) &&
      isComputedProp(node.callee.object, importedEmberName, importedComputedName)) ||
    (includeMacro && isComputedPropMacro(node, importedEmberName, importedComputedName))
  );
}

/**
 * Checks if a node is a computed property macro such as: computed.and()
 * @param {node} node
 * @param {string} importedEmberName name that `Ember` is imported under
 * @param {string} importedComputedName name that `computed` is imported under
 */
function isComputedPropMacro(node, importedEmberName, importedComputedName) {
  return (
    // computed.someMacro()
    (types.isCallExpression(node) &&
      types.isMemberExpression(node.callee) &&
      types.isIdentifier(node.callee.object) &&
      node.callee.object.name === importedComputedName &&
      types.isIdentifier(node.callee.property)) ||
    // Ember.computed.someMacro()
    (types.isCallExpression(node) &&
      types.isMemberExpression(node.callee) &&
      types.isMemberExpression(node.callee.object) &&
      types.isIdentifier(node.callee.object.object) &&
      node.callee.object.object.name === importedEmberName &&
      types.isIdentifier(node.callee.object.property) &&
      node.callee.object.property.name === 'computed')
  );
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
    types.isTemplateLiteral(value) ||
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
  return (
    types.isIdentifier(property.key) &&
    property.key.name === 'actions' &&
    types.isObjectExpression(property.value)
  );
}

function isComponentLifecycleHookName(name) {
  return [
    'didDestroyElement',
    'didInsertElement',
    'didReceiveAttrs',
    'didRender',
    'didUpdate',
    'didUpdateAttrs',
    'willClearRender',
    'willDestroy',
    'willDestroyElement',
    'willInsertElement',
    'willRender',
    'willUpdate',
  ].includes(name);
}

function isGlimmerComponentLifecycleHookName(name) {
  return ['willDestroy'].includes(name);
}

function isComponentLifecycleHook(property) {
  return isFunctionExpression(property.value) && isComponentLifecycleHookName(property.key.name);
}

function isGlimmerComponentLifecycleHook(property) {
  return (
    isFunctionExpression(property.value) && isGlimmerComponentLifecycleHookName(property.key.name)
  );
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
  return [
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
  ].includes(name);
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
  ].includes(name);
}

function isRouteDefaultProp(property) {
  return (
    types.isProperty(property) &&
    types.isIdentifier(property.key) &&
    isRouteProperty(property.key.name) &&
    property.key.name !== 'actions'
  );
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
  ].includes(name);
}

function isControllerDefaultProp(property) {
  return (
    types.isProperty(property) &&
    types.isIdentifier(property.key) &&
    isControllerProperty(property.key.name) &&
    property.key.name !== 'actions'
  );
}

function getModuleProperties(moduleNode, scopeManager) {
  return moduleNode.arguments.flatMap((arg) => {
    const resultingNode = getNodeOrNodeFromVariable(arg, scopeManager);
    return resultingNode && resultingNode.type === 'ObjectExpression'
      ? resultingNode.properties
      : [];
  });
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

function isSingleLineFn(property, importedEmberName, importedObserverName) {
  return (
    (types.isMethodDefinition(property) && utils.getSize(property) === 1) ||
    (property.value &&
      types.isCallExpression(property.value) &&
      utils.getSize(property.value) === 1 &&
      !isObserverProp(property, importedEmberName, importedObserverName) &&
      (isComputedProp(property.value, importedEmberName, 'computed', { includeSuffix: true }) ||
        !types.isCallWithFunctionExpression(property.value)))
  );
}

function isMultiLineFn(property, importedEmberName, importedObserverName) {
  return (
    (types.isMethodDefinition(property) && utils.getSize(property) > 1) ||
    (property.value &&
      types.isCallExpression(property.value) &&
      utils.getSize(property.value) > 1 &&
      !isObserverProp(property, importedEmberName, importedObserverName) &&
      (isComputedProp(property.value, importedEmberName, 'computed', { includeSuffix: true }) ||
        !types.isCallWithFunctionExpression(property.value)))
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

  return relationAttrs.some((relation) => {
    return (
      (property.value && isModule(property.value, relation, 'DS')) ||
      decoratorUtils.isClassPropertyOrPropertyDefinitionWithDecorator(property, relation)
    );
  });
}

/**
 * Checks whether a computed property has duplicate dependent keys.
 *
 * @param  {CallExpression} callExp Given call expression
 * @return {Boolean}        Flag whether dependent keys present.
 */
function hasDuplicateDependentKeys(callExp, importedEmberName, importedComputedName) {
  if (!isComputedProp(callExp, importedEmberName, importedComputedName)) {
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
    callExp.arguments.length === 0 &&
    types.isMemberExpression(callExp.callee) &&
    types.isCallExpression(callExp.callee.object);

  const args = isMemberExpCallExp ? callExp.callee.object.arguments : callExp.arguments;

  const dependentKeys = args.filter((arg) => types.isLiteral(arg)).map((literal) => literal.value);

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

  const unwrappedExpressions = dependentKeys.map((key) => {
    if (typeof key !== 'string' || !braceExpressionRegexp.test(key)) {
      return key;
    }

    const braceExpansionPart = key.match(braceExpressionRegexp)[0];
    const prefix = key.replace(braceExpansionPart, '');
    const properties = braceExpansionPart.replace('{', '').replace('}', '').split(',');

    return properties.map((property) => `${prefix}${property}`);
  });

  return unwrappedExpressions.flat();
}

function isEmberObjectImplementingUnknownProperty(node, scopeManager) {
  if (types.isCallExpression(node)) {
    if (!isExtendObject(node) && !isReopenObject(node)) {
      return false;
    }
    // Classic class.
    const properties = getModuleProperties(node, scopeManager);
    return properties.some(
      (property) => types.isIdentifier(property.key) && property.key.name === 'unknownProperty'
    );
  } else if (types.isClassDeclaration(node)) {
    // Native class.
    return node.body.body.some(
      (n) =>
        types.isMethodDefinition(n) && types.isIdentifier(n.key) && n.key.name === 'unknownProperty'
    );
  } else {
    assert(
      false,
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration` (native class)'
    );
  }
  return false;
}

function isObserverDecorator(node, importedObservesName) {
  assert(types.isDecorator(node), 'Should only call this function on a Decorator');
  return (
    types.isDecorator(node) &&
    types.isCallExpression(node.expression) &&
    types.isIdentifier(node.expression.callee) &&
    node.expression.callee.name === importedObservesName
  );
}

function convertServiceNameToKebabCase(serviceName) {
  return serviceName.split('/').map(kebabCase).join('/'); // splitting is used to avoid converting folder/ to folder-
}
