'use strict';

/**
 * Resolve the TypeScript type of Glimmer path expressions (`this.foo.bar`,
 * `@foo`, `foo`) in gjs/gts templates.
 *
 * Returns `null` when no type information is available. Otherwise returns
 * `{ visitors, getPathType }`: `visitors` must be merged into the rule's
 * visitors (they track the enclosing class), and `getPathType(path)` returns
 * the path's `ts.Type`, or `undefined` when it can't be resolved (block
 * params, unknown properties, template-only components, ...).
 */
function createGlimmerPathTypeResolver(context) {
  const sourceCode = context.sourceCode;
  const services = sourceCode.parserServices;
  if (!services?.program || !services.esTreeNodeToTSNodeMap) {
    return null;
  }

  const checker = services.program.getTypeChecker();
  const classStack = [];

  function getClassInstanceType() {
    const tsClass = services.esTreeNodeToTSNodeMap.get(classStack.at(-1));
    if (!tsClass) {
      return undefined;
    }
    // Class declarations resolve to the instance type, class expressions to
    // the constructor type.
    const type = checker.getTypeAtLocation(tsClass);
    return type.getConstructSignatures()[0]?.getReturnType() ?? type;
  }

  function getPropertyType(type, name) {
    const symbol = type?.getProperty(name);
    const location = services.esTreeNodeToTSNodeMap.get(classStack.at(-1) ?? sourceCode.ast);
    return symbol && checker.getTypeOfSymbolAtLocation(symbol, location);
  }

  function getHeadType(path) {
    switch (path.head.type) {
      case 'ThisHead': {
        return getClassInstanceType();
      }
      case 'AtHead': {
        const argsType = getPropertyType(getClassInstanceType(), 'args');
        return getPropertyType(argsType, path.head.name.slice(1));
      }
      case 'VarHead': {
        const ref = sourceCode
          .getScope(path)
          .references.find((reference) => reference.identifier === path.head);
        const tsNode = services.esTreeNodeToTSNodeMap.get(ref?.resolved?.defs[0]?.name);
        return tsNode && checker.getTypeAtLocation(tsNode);
      }
      default: {
        return undefined;
      }
    }
  }

  function getPathType(path) {
    try {
      return path.tail.reduce(getPropertyType, getHeadType(path));
    } catch {
      return undefined;
    }
  }

  const pushClass = (node) => classStack.push(node);
  const popClass = () => classStack.pop();

  return {
    visitors: {
      ClassDeclaration: pushClass,
      ClassExpression: pushClass,
      'ClassDeclaration:exit': popClass,
      'ClassExpression:exit': popClass,
    },
    getPathType,
  };
}

module.exports = { createGlimmerPathTypeResolver };
