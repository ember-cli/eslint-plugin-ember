'use strict';

const emberSourceVersion = require('../utils/ember-source-version');

//------------------------------------------------------------------------------
// Keyword mappings
//------------------------------------------------------------------------------

// Template keywords built into ember-source >= 7.1 (RFCs 997/998/999/1000)
// and the legacy imports they supersede. `named` maps imported names to
// keywords, `default` maps the module's default export.
const KEYWORDS_BY_MODULE = {
  'ember-truth-helpers': {
    named: {
      eq: 'eq',
      notEq: 'neq',
      not: 'not',
      and: 'and',
      or: 'or',
      gt: 'gt',
      gte: 'gte',
      lt: 'lt',
      lte: 'lte',
    },
  },
  'ember-truth-helpers/helpers/eq': { default: 'eq' },
  'ember-truth-helpers/helpers/not-eq': { default: 'neq' },
  'ember-truth-helpers/helpers/not': { default: 'not' },
  'ember-truth-helpers/helpers/and': { default: 'and' },
  'ember-truth-helpers/helpers/or': { default: 'or' },
  'ember-truth-helpers/helpers/gt': { default: 'gt' },
  'ember-truth-helpers/helpers/gte': { default: 'gte' },
  'ember-truth-helpers/helpers/lt': { default: 'lt' },
  'ember-truth-helpers/helpers/lte': { default: 'lte' },
  '@ember/helper': {
    named: { array: 'array', hash: 'hash', fn: 'fn' },
  },
  'ember-element-helper': {
    named: { element: 'element' },
    default: 'element',
  },
  'ember-element-helper/helpers/element': { default: 'element' },
  '@ember/modifier': {
    named: { on: 'on' },
  },
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getKeywordForSpecifier(specifier, moduleEntry) {
  // Type-only specifiers (gts) have no runtime binding to replace.
  if (specifier.importKind === 'type') {
    return null;
  }

  if (specifier.type === 'ImportDefaultSpecifier') {
    return moduleEntry.default || null;
  }

  if (specifier.type === 'ImportSpecifier') {
    const importedName = specifier.imported.name || specifier.imported.value;
    if (importedName === 'default') {
      return moduleEntry.default || null;
    }
    return (moduleEntry.named && moduleEntry.named[importedName]) || null;
  }

  return null;
}

function buildImportStatement(node, remainingSpecifiers, sourceCode) {
  const defaultSpecifier = remainingSpecifiers.find((s) => s.type === 'ImportDefaultSpecifier');
  const namespaceSpecifier = remainingSpecifiers.find((s) => s.type === 'ImportNamespaceSpecifier');
  const namedSpecifiers = remainingSpecifiers.filter((s) => s.type === 'ImportSpecifier');

  const parts = [];

  if (defaultSpecifier) {
    parts.push(sourceCode.getText(defaultSpecifier));
  }

  if (namespaceSpecifier) {
    parts.push(sourceCode.getText(namespaceSpecifier));
  }

  if (namedSpecifiers.length > 0) {
    parts.push(`{ ${namedSpecifiers.map((s) => sourceCode.getText(s)).join(', ')} }`);
  }

  return `import ${parts.join(', ')} from ${sourceCode.getText(node.source)};`;
}

function consumeTrailingNewline(text, end) {
  let i = end;
  while (i < text.length && (text[i] === ' ' || text[i] === '\t')) {
    i += 1;
  }

  if (text[i] === '\r') {
    i += 1;
  }

  if (text[i] === '\n') {
    i += 1;
  }

  return i;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow importing helpers and modifiers that are built-in template keywords in Ember 7.1+',
      category: 'Deprecations',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-legacy-helper-imports.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      legacyImport:
        "Use built-in template keywords instead of importing them from '{{source}}'. They are available without an import since Ember 7.1.",
    },
  },

  create(context) {
    // These helpers/modifiers are only available as built-in keywords in Ember 7.1+.
    if (!emberSourceVersion.isEmberSourceVersionAtLeast(7, 1)) {
      return {};
    }

    const sourceCode = context.sourceCode;

    function removeDeclaration(fixer, node) {
      return fixer.removeRange([
        node.range[0],
        consumeTrailingNewline(sourceCode.text, node.range[1]),
      ]);
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const moduleEntry = KEYWORDS_BY_MODULE[source];

        if (!moduleEntry || node.importKind === 'type') {
          return;
        }

        // Side-effect imports of the standalone legacy packages serve no
        // purpose once the keywords are built in. (`@ember/helper` and
        // `@ember/modifier` still have non-superseded exports, so bare
        // imports of those are left alone.)
        if (node.specifiers.length === 0) {
          if (source.startsWith('@ember/')) {
            return;
          }

          context.report({
            node,
            messageId: 'legacyImport',
            data: { source },
            fix: (fixer) => removeDeclaration(fixer, node),
          });
          return;
        }

        const mapped = node.specifiers
          .map((specifier) => ({
            specifier,
            keyword: getKeywordForSpecifier(specifier, moduleEntry),
          }))
          .filter(({ keyword }) => keyword);

        // Only report imports that actually bind a superseded helper/modifier
        // (e.g. `import { helper } from '@ember/helper'` is fine).
        if (mapped.length === 0) {
          return;
        }

        context.report({
          node,
          messageId: 'legacyImport',
          data: { source },
          fix(fixer) {
            const moduleScope = sourceCode.getScope(node);
            const fixes = [];
            const removedSpecifiers = new Set();

            for (const { specifier, keyword } of mapped) {
              const variable = moduleScope.set.get(specifier.local.name);
              if (!variable) {
                return null;
              }

              for (const reference of variable.references) {
                // Built-in keywords only exist inside `<template>` tags.
                // Template references use Glimmer nodes (`VarHead`,
                // `ElementNodePart`); a plain `Identifier` reference means
                // the binding is used in JavaScript code, where removing
                // the import would break it.
                if (reference.identifier.type === 'Identifier') {
                  return null;
                }

                if (keyword !== specifier.local.name) {
                  // Renamed usages must resolve to the keyword, so bail if
                  // any binding named like the keyword shadows it at the
                  // usage site.
                  for (let scope = reference.from; scope; scope = scope.upper) {
                    if (scope.set.has(keyword)) {
                      return null;
                    }
                    if (scope.type === 'module') {
                      break;
                    }
                  }

                  fixes.push(fixer.replaceText(reference.identifier, keyword));
                }
              }

              removedSpecifiers.add(specifier);
            }

            const remainingSpecifiers = node.specifiers.filter((s) => !removedSpecifiers.has(s));

            if (remainingSpecifiers.length === 0) {
              fixes.push(removeDeclaration(fixer, node));
            } else {
              fixes.push(
                fixer.replaceText(node, buildImportStatement(node, remainingSpecifiers, sourceCode))
              );
            }

            return fixes;
          },
        });
      },
    };
  },
};
