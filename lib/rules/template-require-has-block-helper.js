const TRANSFORMATIONS = {
  hasBlock: 'has-block',
  hasBlockParams: 'has-block-params',
};

function getErrorMessage(name) {
  return `\`${name}\` is deprecated. Use the \`${TRANSFORMATIONS[name]}\` helper instead.`;
}

function shouldWrapInSubExpression(node) {
  const parent = node.parent;

  if (!parent) {
    return false;
  }

  if (parent.type === 'GlimmerBlockStatement') {
    return true;
  }

  if (
    (parent.type === 'GlimmerMustacheStatement' || parent.type === 'GlimmerSubExpression') &&
    parent.path !== node
  ) {
    return true;
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require (has-block) helper usage instead of hasBlock property',
      category: 'Best Practices',
      fixable: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-has-block-helper.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-has-block-helper.js',
      docs: 'docs/rule/require-has-block-helper.md',
      tests: 'test/unit/rules/require-has-block-helper-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    // Returns true if the identifier resolves to a JS binding. In GJS/GTS a
    // user can legitimately `import { hasBlock } from 'somewhere'`; rewriting
    // their reference to the `has-block` keyword would change semantics.
    // Note: `node` here is the GlimmerPathExpression itself (this visitor is
    // on PathExpression directly, not a wrapping MustacheStatement), so we
    // read `node.original` rather than `node.path.original`.
    function isJsScopeVariable(node) {
      if (!sourceCode || !node.original) {
        return false;
      }
      const name = node.original;
      try {
        let scope = sourceCode.getScope(node);
        while (scope) {
          if (scope.variables.some((v) => v.name === name)) {
            return true;
          }
          scope = scope.upper;
        }
      } catch {
        // sourceCode.getScope may not be available in .hbs-only mode; ignore.
      }
      return false;
    }

    return {
      GlimmerPathExpression(node) {
        const replacement = TRANSFORMATIONS[node.original];

        if (replacement && !isJsScopeVariable(node)) {
          context.report({
            node,
            message: getErrorMessage(node.original),
            fix(fixer) {
              return fixer.replaceTextRange(
                node.range,
                shouldWrapInSubExpression(node) ? `(${replacement})` : replacement
              );
            },
          });
        }
      },
    };
  },
};
