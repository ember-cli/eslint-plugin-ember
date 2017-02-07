'use strict';

var ember = require('./ember');

module.exports = {
  determinePropertyType,
  reportUnorderedProperties: reportUnorderedProperties
};

const NAMES = {
  'service': 'service injection',
  'default-property': 'default property',
  'property': 'property',
  'single-line-function': 'single-line function',
  'multi-line-function': 'multi-line function',
  'observer': 'observer',
  'model': 'model hook',
  'lifecycle-hook': 'lifecycle hook',
  'actions': 'actions hash',
  'method': 'custom method',
  'unknown': 'unknown property type',
  'attribute': 'attribute',
  'relationship': 'relationship',
};

function determinePropertyType(node, parentType) {
  if (ember.isInjectedServiceProp(node.value)) {
    return 'service';
  }

  if (parentType === 'component') {
    if (ember.isComponentLifecycleHook(node)) {
      return 'lifecycle-hook';
    }
  }

  if (parentType === 'controller') {
    if (ember.isControllerDefaultProp(node)) {
      return 'default-property';
    }
  }

  if (parentType === 'model') {
    if (ember.isModule(node.value, 'attr', 'DS')) {
      return 'attribute';
    } else if (ember.isRelation(node)) {
      return 'relationship';
    }
  }

  if (parentType === 'route') {
    if (ember.isRouteDefaultProp(node)) {
      return 'default-property';
    } else if (ember.isModelProp(node)) {
      return 'model';
    } else if (ember.isRouteDefaultMethod(node)) {
      return 'lifecycle-hook';
    }
  }

  if (ember.isObserverProp(node.value)) {
    return 'observer';
  }

  if (parentType !== 'model' && ember.isActionsProp(node)) {
    return 'actions';
  }

  if (ember.isSingleLineFn(node)) {
    return 'single-line-function';
  }

  if (ember.isMultiLineFn(node)) {
    return 'multi-line-function';
  }

  if (ember.isCustomProp(node)) {
    return 'property';
  }

  if (ember.isFunctionExpression(node.value)) {
    return 'method';
  }

  return 'unknown';
}

function getOrder(ORDER, type) {
  for (var i = 0, len = ORDER.length; i < len; i++) {
    let value = ORDER[i];
    if (typeof value === 'string') {
      if (value === type) {
        return i;
      }
    } else {
      var index = value.indexOf(type);
      if (index !== -1) {
        return i;
      }
    }
  }

  return ORDER.length;
}

function getName(type) {
  return NAMES[type];
}

function reportUnorderedProperties(node, context, parentType, ORDER) {
  var maxOrder = -1;
  var firstPropertyOfType = {};

  ember.getModuleProperties(node).forEach(function(property) {
    var type = determinePropertyType(property, parentType);
    let order = getOrder(ORDER, type);

    var info = {
      node: property,
      type,
    };

    // check if this property should be moved further upwards
    if (order < maxOrder) {

      // look for correct position to insert this property
      for (var i = order + 1; i <= maxOrder; i++) {
        var firstPropertyOfNextType = firstPropertyOfType[i];
        if (firstPropertyOfNextType) {
          break;
        }
      }

      var typeName = getName(info.type);
      var nextTypeName = getName(firstPropertyOfNextType.type);
      var nextSourceLine = firstPropertyOfNextType.node.loc.start.line;

      context.report(property,
        `The ${typeName} should be above the ${nextTypeName} on line ${nextSourceLine}`);

    } else {
      maxOrder = order;

      if (!(order in firstPropertyOfType)) {
        firstPropertyOfType[order] = info;
      }
    }
  });
}
