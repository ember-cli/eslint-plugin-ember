'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');

const ROOT_PATH_TRIM_REGEX = /\/{2,}/g;
const SOURCE_PATH_VALUE_TYPE = {
  DYNAMIC: 'dynamic',
  STATIC: 'static',
};
const URL_CHUNK_SEPARATOR = '/';

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
  return `"${routeInfo.name}" ("${routeInfo.fullPath}", ${buildSourceLocationString(routeInfo)})`;
}

function isNestedRouteWithSamePath(routeInfo) {
  return routeInfo.parent.fullPathWithGenericParams === routeInfo.route.fullPathWithGenericParams;
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
      recommended: true,
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
        if (!isValidRouteInfo(routeInfo)) {
          return;
        }

        if (
          routeMap.has(routeInfo.route.fullPathWithGenericParams) &&
          !isNestedRouteWithSamePath(routeInfo)
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
        if (!routeMap.has(routeInfo.route.fullPathWithGenericParams)) {
          routeMap.set(routeInfo.route.fullPathWithGenericParams, routeInfo);
        }
      },
    };
  },
};

function getRouteInfo(node) {
  const basePath = getRouteBasePath(node);
  if (basePath.normalizedPath === null) {
    return null;
  }

  const parentRoutes = getParentRoutesPaths(node);
  const notSupportedParentRoutePathArguments = parentRoutes.find((routePathInfo) => {
    return routePathInfo.normalizedPath === null;
  });

  if (notSupportedParentRoutePathArguments) {
    return null;
  }

  const routeName = getRouteName(node).stringValue;

  // We replace "////post/something" -> "/post/something".
  // As that what nesting of / configured routes means for Ember router.
  return {
    route: {
      name: routeName,
      basePath,
      fullPath: trimRootLevelNestedRoutes(`${convertPathForDisplay([...parentRoutes, basePath])}`),
      fullPathWithGenericParams: trimRootLevelNestedRoutes(
        convertPathToGenericForMatching([...parentRoutes, basePath])
      ),
      source: {
        loc: node.loc,
      },
    },
    parent: {
      fullPath: trimRootLevelNestedRoutes(convertPathForDisplay(parentRoutes)),
      fullPathWithGenericParams: trimRootLevelNestedRoutes(
        convertPathToGenericForMatching(parentRoutes)
      ),
    },
  };
}

function getRouteBasePath(node) {
  let routePathInfo = getRouteName(node);
  if (hasPathProperty(node)) {
    const pathOptionNode = getPropertyByKeyName(node.arguments[1], 'path');
    routePathInfo = getNodeValue(pathOptionNode.value);
  }

  let path = routePathInfo.stringValue;
  if (isString(path) && !path.startsWith(URL_CHUNK_SEPARATOR)) {
    path = `/${routePathInfo.stringValue.trim()}`;
  }
  return {
    type: routePathInfo.type,
    normalizedPath: path,
    rawPath: routePathInfo.stringValue,
  };
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
  return routesPath.replace(ROOT_PATH_TRIM_REGEX, URL_CHUNK_SEPARATOR);
}

function convertPathToGenericForMatching(routePathInfos) {
  return routePathInfos
    .map((routePathInfo) => {
      const convertedPathForMatchingChunks = routePathInfo.normalizedPath
        .split(URL_CHUNK_SEPARATOR)
        .map((pathChunk) => {
          if (routePathInfo.type === SOURCE_PATH_VALUE_TYPE.STATIC) {
            if (pathChunk.startsWith(':')) {
              return ':generic-param-for-matching';
            }
            if (pathChunk.startsWith('*')) {
              return '*generic-wildcard-for-matching';
            }
          }
          if (routePathInfo.type === SOURCE_PATH_VALUE_TYPE.DYNAMIC) {
            return `variable:${pathChunk}`;
          }
          return pathChunk;
        });
      return convertedPathForMatchingChunks.join(URL_CHUNK_SEPARATOR);
    })
    .join('');
}

function convertPathForDisplay(routePathInfos) {
  return routePathInfos
    .map((routePathInfo) => {
      return routePathInfo.rawPath;
    })
    .join('');
}

function getRouteName(node) {
  const [firstArgument] = node.arguments;
  return getNodeValue(firstArgument);
}

function getNodeValue(node) {
  if (types.isIdentifier(node)) {
    return {
      type: SOURCE_PATH_VALUE_TYPE.DYNAMIC,
      stringValue: node.name,
    };
  }
  if (types.isLiteral(node)) {
    return {
      type: SOURCE_PATH_VALUE_TYPE.STATIC,
      stringValue: String(node.value),
    };
  }
  return {
    type: null,
    stringValue: null,
  };
}

function isString(value) {
  return typeof value === 'string';
}

function isValidRouteInfo(routeInfo) {
  return routeInfo !== null;
}
