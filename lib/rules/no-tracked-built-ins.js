'use strict';

//------------------------------------------------------------------------------
// Mapping from tracked-built-ins exports to @ember/reactive exports
//------------------------------------------------------------------------------

const TRACKED_BUILT_INS_MAPPING = {
  TrackedArray: 'trackedArray',
  TrackedObject: 'trackedObject',
  TrackedMap: 'trackedMap',
  TrackedWeakMap: 'trackedWeakMap',
  TrackedSet: 'trackedSet',
  TrackedWeakSet: 'trackedWeakSet',
};

const TRACKED_BUILT_INS_MODULE = 'tracked-built-ins';
const EMBER_REACTIVE_MODULE = '@ember/reactive';

const ERROR_MESSAGE_IMPORT = 'Use imports from `@ember/reactive` instead of `tracked-built-ins`.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `@ember/reactive` imports instead of `tracked-built-ins`',
      category: 'Ember Octane',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-tracked-built-ins.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      import: ERROR_MESSAGE_IMPORT,
      newExpression:
        'Use `{{newName}}(...)` instead of `new {{oldName}}(...)`. The `@ember/reactive` utilities do not use `new`.',
    },
  },

  ERROR_MESSAGE_IMPORT,

  create(context) {
    // Track which imported identifiers map to tracked-built-ins classes
    // so we can fix `new TrackedArray(...)` → `trackedArray(...)`
    const trackedIdentifiers = new Map();

    return {
      ImportDeclaration(node) {
        if (node.source.value !== TRACKED_BUILT_INS_MODULE) {
          return;
        }

        context.report({
          node,
          messageId: 'import',
          fix(fixer) {
            const specifiers = node.specifiers;

            // Only autofix named imports we know how to map
            const namedSpecifiers = specifiers.filter(
              (s) => s.type === 'ImportSpecifier' && s.imported.name in TRACKED_BUILT_INS_MAPPING
            );

            // If there's a default import or unknown named imports, we can't fully autofix
            const hasDefault = specifiers.some((s) => s.type === 'ImportDefaultSpecifier');
            const unknownNamed = specifiers.filter(
              (s) => s.type === 'ImportSpecifier' && !(s.imported.name in TRACKED_BUILT_INS_MAPPING)
            );

            if (hasDefault || unknownNamed.length > 0 || namedSpecifiers.length === 0) {
              return null;
            }

            const newSpecifiers = namedSpecifiers.map((s) => {
              const newName = TRACKED_BUILT_INS_MAPPING[s.imported.name];
              if (s.local.name !== s.imported.name) {
                // Has alias: `import { TrackedArray as TA }` → `import { trackedArray as TA }`
                return `${newName} as ${s.local.name}`;
              }
              return newName;
            });

            const newImport = `import { ${newSpecifiers.join(', ')} } from '${EMBER_REACTIVE_MODULE}';`;
            return fixer.replaceText(node, newImport);
          },
        });

        // Register the local names for NewExpression tracking
        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.name in TRACKED_BUILT_INS_MAPPING
          ) {
            const isAliased = specifier.local.name !== specifier.imported.name;
            trackedIdentifiers.set(specifier.local.name, {
              newName: TRACKED_BUILT_INS_MAPPING[specifier.imported.name],
              isAliased,
            });
          }
        }
      },

      NewExpression(node) {
        if (node.callee.type === 'Identifier' && trackedIdentifiers.has(node.callee.name)) {
          const oldName = node.callee.name;
          const { newName, isAliased } = trackedIdentifiers.get(oldName);

          context.report({
            node,
            messageId: 'newExpression',
            data: { oldName, newName },
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const newKeyword = sourceCode.getFirstToken(node);
              const calleeToken = sourceCode.getTokenAfter(newKeyword);
              const fixes = [
                // Remove the `new` keyword and any whitespace up to the callee
                fixer.removeRange([newKeyword.range[0], calleeToken.range[0]]),
              ];
              // Only rename the callee if it's not aliased
              if (!isAliased) {
                fixes.push(fixer.replaceText(node.callee, newName));
              }
              return fixes;
            },
          });
        }
      },
    };
  },
};
