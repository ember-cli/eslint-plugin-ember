'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');

const ROOT_PATH_TRIM_REGEX = /\/{2,}/g;

function buildErrorMessage(opts) {
  const { leftRoute, rightRoute } = opts;
  return `Route ${buildRouteErrorInfo(leftRoute)} is shadowing route ${buildRouteErrorInfo(
    rightRoute
  )}`;
}

function buildSourceLocationString(routeInfo) {
  return `${routeInfo.source.loc.start.line}L:${routeInfo.source.loc.start.column}C`;
}

function buildRouteErrorInfo(routeInfo) {
  return `"${routeInfo.name}" (${routeInfo.fullPath}, ${buildSourceLocationString(routeInfo)})`;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce no route path definition shadowing',
      category: 'Routes',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-shadow-route-definition.md',
    },
    fixable: null,
    schema: [],
  },

  buildErrorMessage,

  create(context) {
    if (ember.isTestFile(context.getFilename())) {
      // This rule does not apply to test files.
      return {};
    }

    const routeMap = new Map();

    return {
      CallExpression(node) {
        if (!ember.isRoute(node)) {
          return;
        }
        const routeInfo = getRouteInfo(node);
        if (
          routeMap.has(routeInfo.route.fullPathWithGenericParams) &&
          !routeMap.has(routeInfo.parent.fullPathWithGenericParams)
        ) {
          const existingRouteInfo = routeMap.get(routeInfo.route.fullPathWithGenericParams);
          context.report({
            node,
            message: buildErrorMessage({
              leftRoute: {
                name: routeInfo.route.name,
                fullPath: routeInfo.route.fullPath,
                source: routeInfo.route.source,
              },
              rightRoute: {
                name: existingRouteInfo.route.name,
                fullPath: existingRouteInfo.route.fullPath,
                source: existingRouteInfo.route.source,
              },
            }),
          });
          return;
        }

        routeMap.set(routeInfo.route.fullPathWithGenericParams, routeInfo);
      },
    };
  },
};

function getRouteInfo(node) {
  const routeName = node.arguments[0].value;
  let basePath = getRouteBasePath(node);
  const parentRoutes = getParentRoutesPaths(node);

  // If top-level route, prepend "/" to indicate that.
  if (parentRoutes.length === 0 && !basePath.startsWith('/')) {
    basePath = `/${basePath}`;
  }

  // We replace "////post/something" -> "/post/something".
  // As that what nesting of / configured routes means for Ember router.
  const parentRoutesFullPath = trimRootLevelNestedRoutes(parentRoutes.join(''));
  const fullPath = `${parentRoutesFullPath}${basePath}`;

  return {
    route: {
      name: routeName,
      basePath,
      fullPath,
      fullPathWithGenericParams: convertPathToGenericForMatching(fullPath),
      source: {
        loc: node.loc,
      },
    },
    parent: {
      fullPath: parentRoutesFullPath,
      fullPathWithGenericParams: convertPathToGenericForMatching(parentRoutesFullPath),
    },
  };
}

function getRouteBasePath(node) {
  let routePath = node.arguments[0].value;

  if (hasPathProperty(node)) {
    const pathOptionNode = getPropertyByKeyName(node.arguments[1], 'path');
    const pathValue = pathOptionNode.value.value;
    if (pathValue) {
      routePath = pathValue;
    }
  }
  return routePath;
}

function getParentRoutesPaths(node) {
  const parentNode = node.parent;
  let stack = [];
  if (parentNode) {
    if (ember.isRoute(parentNode)) {
      stack.push(getRouteBasePath(parentNode));
    }
    stack = [...stack, ...getParentRoutesPaths(parentNode)];
  }
  return stack;
}

function hasPathProperty(node) {
  return (
    types.isObjectExpression(node.arguments[1]) && hasPropertyWithKeyName(node.arguments[1], 'path')
  );
}

function hasPropertyWithKeyName(objectExpression, keyName) {
  return getPropertyByKeyName(objectExpression, keyName) !== undefined;
}

function getPropertyByKeyName(objectExpression, keyName) {
  return objectExpression.properties.find(
    (property) =>
      types.isProperty(property) &&
      types.isIdentifier(property.key) &&
      property.key.name === keyName
  );
}

function trimRootLevelNestedRoutes(routesPath) {
  return routesPath.replace(ROOT_PATH_TRIM_REGEX, '/');
}

function convertPathToGenericForMatching(sourcePath) {
  return sourcePath
    .split('/')
    .map((chunk) => {
      const mappedValue = chunk.trim();
      if (mappedValue.startsWith(':')) {
        return ':generic-param-for-matching';
      }
      if (mappedValue.startsWith('*')) {
        return '*generic-wildcard-for-matching';
      }
      return mappedValue;
    })
    .join('/');
}
