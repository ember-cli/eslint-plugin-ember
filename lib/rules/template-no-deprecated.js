'use strict';

const tsutils = require('ts-api-utils');
const ts = require('typescript');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated Glimmer components, helpers, and modifiers in templates',
      category: 'Ember Octane',
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-deprecated.md',
    },
    requiresTypeChecking: true,
    schema: [],
    messages: {
      deprecated: '`{{name}}` is deprecated.',
      deprecatedWithReason: '`{{name}}` is deprecated. {{reason}}',
    },
  },

  create(context) {
    const services = context.sourceCode.parserServices ?? context.parserServices;
    if (!services?.program) {
      return {};
    }

    const checker = services.program.getTypeChecker();
    const sourceCode = context.sourceCode;

    function getJsDocDeprecation(symbol) {
      let jsDocTags;
      try {
        jsDocTags = symbol?.getJsDocTags(checker);
      } catch {
        // workaround for https://github.com/microsoft/TypeScript/issues/60024
        return undefined;
      }
      const tag = jsDocTags?.find((t) => t.name === 'deprecated');
      if (!tag) {
        return undefined;
      }
      const displayParts = tag.text;
      return displayParts ? ts.displayPartsToString(displayParts) : '';
    }

    function searchForDeprecationInAliasesChain(symbol, checkAliasedSymbol) {
      if (!symbol || !tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)) {
        return checkAliasedSymbol ? getJsDocDeprecation(symbol) : undefined;
      }
      const targetSymbol = checker.getAliasedSymbol(symbol);
      while (tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)) {
        const reason = getJsDocDeprecation(symbol);
        if (reason != null) {
          return reason;
        }
        const immediateAliasedSymbol =
          symbol.getDeclarations() && checker.getImmediateAliasedSymbol(symbol);
        if (!immediateAliasedSymbol) {
          break;
        }
        symbol = immediateAliasedSymbol;
        if (checkAliasedSymbol && symbol === targetSymbol) {
          return getJsDocDeprecation(symbol);
        }
      }
      return undefined;
    }

    function checkDeprecatedIdentifier(identifierNode, scope) {
      const ref = scope.references.find((v) => v.identifier === identifierNode);
      const variable = ref?.resolved;
      const def = variable?.defs[0];

      if (!def || def.type !== 'ImportBinding') {
        return;
      }

      const tsNode = services.esTreeNodeToTSNodeMap.get(def.node);
      if (!tsNode) {
        return;
      }

      // ImportClause and ImportSpecifier require .name for getSymbolAtLocation
      const tsIdentifier = tsNode.name ?? tsNode;
      const symbol = checker.getSymbolAtLocation(tsIdentifier);
      if (!symbol) {
        return;
      }

      const reason = searchForDeprecationInAliasesChain(symbol, true);
      if (reason == null) {
        return;
      }

      if (reason === '') {
        context.report({
          node: identifierNode,
          messageId: 'deprecated',
          data: { name: identifierNode.name },
        });
      } else {
        context.report({
          node: identifierNode,
          messageId: 'deprecatedWithReason',
          data: { name: identifierNode.name, reason },
        });
      }
    }

    return {
      GlimmerPathExpression(node) {
        checkDeprecatedIdentifier(node.head, sourceCode.getScope(node));
      },

      GlimmerElementNode(node) {
        // GlimmerElementNode is in its own scope; get the outer scope
        const scope = sourceCode.getScope(node.parent);
        checkDeprecatedIdentifier(node.parts[0], scope);
      },
    };
  },
};
