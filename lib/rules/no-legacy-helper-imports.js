'use strict';

const emberSourceVersion = require('../utils/ember-source-version');

const ERROR_MESSAGE =
  'Use built-in Ember keywords instead of importing helpers/modifiers from legacy packages';

const REMOVE_IMPORT = Symbol('REMOVE_IMPORT');

const RULES_BY_MODULE = {
  'ember-truth-helpers': {
    eq: { action: REMOVE_IMPORT },
    notEq: { action: REMOVE_IMPORT, renameTo: 'neq' },
    not: { action: REMOVE_IMPORT },
    and: { action: REMOVE_IMPORT },
    or: { action: REMOVE_IMPORT },
    gt: { action: REMOVE_IMPORT },
    gte: { action: REMOVE_IMPORT },
    lt: { action: REMOVE_IMPORT },
    lte: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/not-eq': {
    default: { action: REMOVE_IMPORT, renameTo: 'neq' },
  },
  'ember-truth-helpers/helpers/not': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/eq': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/and': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/or': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/gt': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/gte': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/lt': {
    default: { action: REMOVE_IMPORT },
  },
  'ember-truth-helpers/helpers/lte': {
    default: { action: REMOVE_IMPORT },
  },
  '@ember/helper': {
    array: { action: REMOVE_IMPORT },
    hash: { action: REMOVE_IMPORT },
    fn: { action: REMOVE_IMPORT },
  },
  'ember-element-helper': {
    element: { action: REMOVE_IMPORT },
    default: { action: REMOVE_IMPORT, renameTo: 'element' },
  },
  'ember-element-helper/helpers/element': {
    default: { action: REMOVE_IMPORT },
  },
  '@ember/modifier': {
    on: { action: REMOVE_IMPORT },
  },
};

function getImportedName(specifier) {
  if (specifier.type === 'ImportDefaultSpecifier') {
    return 'default';
  }

  if (specifier.type === 'ImportSpecifier') {
    return specifier.imported.name;
  }

  return null;
}

function getCanonicalName(specifier, source) {
  if (specifier.type === 'ImportSpecifier') {
    return specifier.imported.name;
  }

  if (specifier.type === 'ImportDefaultSpecifier') {
    const match = source.match(/\/(?:helpers|modifiers)\/([^/]+)$/);
    return match ? match[1] : null;
  }

  return null;
}

function buildImportStatement(remainingSpecifiers, sourceText) {
  const defaultSpecifier = remainingSpecifiers.find((s) => s.type === 'ImportDefaultSpecifier');
  const namespaceSpecifier = remainingSpecifiers.find((s) => s.type === 'ImportNamespaceSpecifier');
  const namedSpecifiers = remainingSpecifiers.filter((s) => s.type === 'ImportSpecifier');

  const parts = [];

  if (defaultSpecifier) {
    parts.push(defaultSpecifier.local.name);
  }

  if (namespaceSpecifier) {
    parts.push(`* as ${namespaceSpecifier.local.name}`);
  }

  if (namedSpecifiers.length > 0) {
    const named = namedSpecifiers.map((s) => {
      if (s.imported.name === s.local.name) {
        return s.imported.name;
      }

      return `${s.imported.name} as ${s.local.name}`;
    });

    parts.push(`{ ${named.join(', ')} }`);
  }

  return `import ${parts.join(', ')} from ${sourceText};`;
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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow legacy helper/modifier imports superseded by Ember built-ins',
      category: 'Deprecations',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-legacy-helper-imports.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    // These helpers/modifiers are available as built-ins in Ember 7.1+.
    if (!emberSourceVersion.isEmberSourceVersionAtLeast(7, 1)) {
      return {};
    }

    const sourceCode = context.sourceCode;

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const rulesForModule = RULES_BY_MODULE[source];

        if (!rulesForModule) {
          return;
        }

        context.report({
          node,
          message: ERROR_MESSAGE,
          fix(fixer) {
            const moduleScope = sourceCode.getScope(node).variableScope;

            if (node.specifiers.length === 0) {
              return fixer.removeRange([
                node.range[0],
                consumeTrailingNewline(sourceCode.text, node.range[1]),
              ]);
            }

            const removedSpecifiers = new Set();
            const renameRequests = [];

            for (const specifier of node.specifiers) {
              const importedName = getImportedName(specifier);
              const entry = importedName && rulesForModule[importedName];

              if (!entry || entry.action !== REMOVE_IMPORT) {
                return null;
              }

              removedSpecifiers.add(specifier);

              const renameTo = entry.renameTo || getCanonicalName(specifier, source);
              if (renameTo && renameTo !== specifier.local.name) {
                renameRequests.push({ from: specifier.local.name, to: renameTo });
              }
            }

            const removedLocals = new Set([...removedSpecifiers].map((s) => s.local.name));
            const renameTargets = new Set();

            for (const request of renameRequests) {
              if (renameTargets.has(request.to)) {
                return null;
              }

              renameTargets.add(request.to);

              if (!removedLocals.has(request.to) && moduleScope.set.has(request.to)) {
                return null;
              }
            }

            const fixes = [];

            const remainingSpecifiers = node.specifiers.filter((s) => !removedSpecifiers.has(s));
            if (remainingSpecifiers.length === 0) {
              fixes.push(
                fixer.removeRange([
                  node.range[0],
                  consumeTrailingNewline(sourceCode.text, node.range[1]),
                ])
              );
            } else {
              fixes.push(
                fixer.replaceText(
                  node,
                  buildImportStatement(remainingSpecifiers, sourceCode.getText(node.source))
                )
              );
            }

            for (const request of renameRequests) {
              const variable = moduleScope.set.get(request.from);
              if (!variable) {
                return null;
              }

              for (const reference of variable.references) {
                fixes.push(fixer.replaceText(reference.identifier, request.to));
              }
            }

            return fixes;
          },
        });
      },
    };
  },
};
