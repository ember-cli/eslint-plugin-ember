'use strict';

// ts.SymbolFlags.Alias = 2097152 (1 << 21).
// Hardcoded to avoid adding a direct `typescript` dependency. This value has
// been stable since TypeScript was open-sourced (~2014) but is not formally
// guaranteed. If it ever changes, this rule will need to require the user's
// installed TypeScript and read ts.SymbolFlags.Alias at runtime.
const TS_ALIAS_FLAG = 2_097_152;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated Glimmer components, helpers, and modifiers in templates',
      category: 'Ember Octane',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-deprecated.md',
    },
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
      return displayParts ? displayParts.map((p) => p.text).join('') : '';
    }

    function searchForDeprecationInAliasesChain(symbol, checkAliasedSymbol) {
      // eslint-disable-next-line no-bitwise
      if (!symbol || !(symbol.flags & TS_ALIAS_FLAG)) {
        return checkAliasedSymbol ? getJsDocDeprecation(symbol) : undefined;
      }
      const targetSymbol = checker.getAliasedSymbol(symbol);
      let current = symbol;
      // eslint-disable-next-line no-bitwise
      while (current.flags & TS_ALIAS_FLAG) {
        const reason = getJsDocDeprecation(current);
        if (reason !== undefined) {
          return reason;
        }
        const immediateAliasedSymbol =
          current.getDeclarations() && checker.getImmediateAliasedSymbol(current);
        if (!immediateAliasedSymbol) {
          break;
        }
        current = immediateAliasedSymbol;
        if (checkAliasedSymbol && current === targetSymbol) {
          return getJsDocDeprecation(current);
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
      if (reason === undefined) {
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
