'use strict';

var ember = require('./ember');

module.exports = {
  determinePropertyType,
  reportUnorderedProperties: reportUnorderedProperties
};

function determinePropertyType(node, parentType) {
  if (ember.isInjectedServiceProp(node.value)) {
    return 'service';
  }

  if (parentType === 'component') {
    if (ember.isCustomProp(node)) {
      return 'property';
    } else if (ember.isSingleLineFn(node)) {
      return 'single-line-function';
    } else if (ember.isMultiLineFn(node)) {
      return 'multi-line-function';
    } else if (ember.isObserverProp(node.value)) {
      return 'observer';
    } else if (ember.isComponentLifecycleHook(node)) {
      return 'lifecycle-hook';
    }
  }

  if (parentType === 'controller') {
    if (ember.isControllerDefaultProp(node)) {
      return 'default-property';
    } else if (ember.isCustomProp(node)) {
      return 'property';
    } else if (ember.isSingleLineFn(node)) {
      return 'single-line-function';
    } else if (ember.isMultiLineFn(node)) {
      return 'multi-line-function';
    } else if (ember.isObserverProp(node.value)) {
      return 'observer';
    }
  }

  if (parentType === 'model') {
    if (ember.isModule(node.value, 'attr', 'DS')) {
      return 'attribute';
    } else if (ember.isRelation(node)) {
      return 'relationship';
    } else if (ember.isSingleLineFn(node)) {
      return 'single-line-function';
    } else if (ember.isMultiLineFn(node)) {
      return 'multi-line-function';
    } else {
      return 'other';
    }
  }

  if (parentType === 'route') {
    if (ember.isRouteDefaultProp(node)) {
      return 'default-property';
    } else if (ember.isCustomProp(node)) {
      return 'property';
    } else if (ember.isModelProp(node)) {
      return 'model';
    } else if (ember.isRouteDefaultMethod(node)) {
      return 'lifecycle-hook';
    }
  }

  if (parentType !== 'model' && ember.isActionsProp(node)) {
    return 'actions';
  }

  if (ember.isFunctionExpression(node.value)) {
    return 'method';
  }

  return 'unknown';
}

function reportUnorderedProperties(node, context, toPropertyInfo) {
  var maxOrder = -1;
  var firstPropertyOfType = {};

  ember.getModuleProperties(node).forEach(function(property) {
    var info = toPropertyInfo(property);

    // check if this property should be moved further upwards
    if (info.order < maxOrder) {

      // look for correct position to insert this property
      for (var i = info.order + 1; i <= maxOrder; i++) {
        var firstPropertyOfNextType = firstPropertyOfType[i];
        if (firstPropertyOfNextType) {
          break;
        }
      }

      var typeName = info.name;
      var nextTypeName = firstPropertyOfNextType.name;
      var nextSourceLine = firstPropertyOfNextType.node.loc.start.line;

      context.report(property,
        `The ${typeName} should be above the ${nextTypeName} on line ${nextSourceLine}`);

    } else {
      maxOrder = info.order;

      if (!(info.order in firstPropertyOfType)) {
        firstPropertyOfType[info.order] = info;
      }
    }
  });
}
