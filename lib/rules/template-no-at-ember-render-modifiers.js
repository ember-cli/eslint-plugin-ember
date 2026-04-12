// Map of `@ember/render-modifiers` sub-path → canonical kebab-case modifier name.
// Default-imported names are user-chosen, so we track local names to canonical.
const RENDER_MODIFIER_IMPORT_PATHS = {
  '@ember/render-modifiers/modifiers/did-insert': 'did-insert',
  '@ember/render-modifiers/modifiers/did-update': 'did-update',
  '@ember/render-modifiers/modifiers/will-destroy': 'will-destroy',
};

const KEBAB_NAMES = new Set(['did-insert', 'did-update', 'will-destroy']);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of @ember/render-modifiers',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-at-ember-render-modifiers.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noRenderModifier:
        'Do not use the `{{modifier}}` modifier. This modifier was intended to ease migration to Octane and not for long-term side-effects. Instead, either refactor to use data derivation patterns for a performance boost, or refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-at-ember-render-modifiers.js',
      docs: 'docs/rule/no-at-ember-render-modifiers.md',
      tests: 'test/unit/rules/no-at-ember-render-modifiers-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // local import name → canonical kebab name. Only populated in GJS/GTS.
    const importedModifiers = new Map();

    function isRenderModifier(name) {
      if (isStrictMode) {
        return importedModifiers.has(name);
      }
      // HBS: resolver-resolved by canonical kebab name
      return KEBAB_NAMES.has(name);
    }

    function canonicalName(name) {
      return importedModifiers.get(name) || name;
    }

    return {
      ImportDeclaration(node) {
        if (!isStrictMode) {
          return;
        }
        const canonical = RENDER_MODIFIER_IMPORT_PATHS[node.source.value];
        if (!canonical) {
          return;
        }
        // Default import (`import didInsert from '...'`) is the supported form
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier') {
            importedModifiers.set(specifier.local.name, canonical);
          }
        }
      },

      GlimmerElementNode(node) {
        if (!node.modifiers) {
          return;
        }

        for (const modifier of node.modifiers) {
          if (modifier.path?.type !== 'GlimmerPathExpression') {
            continue;
          }
          const name = modifier.path.original;
          if (isRenderModifier(name)) {
            context.report({
              node: modifier,
              messageId: 'noRenderModifier',
              data: { modifier: canonicalName(name) },
            });
          }
        }
      },
    };
  },
};
