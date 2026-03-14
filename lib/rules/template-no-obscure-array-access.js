const DIGIT_REGEXP = /^\[?\d+]?$/;

/**
 * Extract the target path and string key from a path with numeric segments.
 * E.g. "this.list.0.name" → ["this.list", "0.name"]
 * E.g. "this.list.[0]" → ["this.list", "0"]
 * E.g. "@foo.0.bar" → ["@foo", "0.bar"]
 *
 * @param {string} original The original path string
 * @returns {[string, string]} A tuple of [targetPath, stringKey]
 */
function getHelperParams(original) {
  const parts = original.split('.');
  const firstDigitIndex = parts.findIndex((part) => DIGIT_REGEXP.test(part));

  if (firstDigitIndex === -1) {
    return null;
  }

  const targetPath = parts.slice(0, firstDigitIndex).join('.');
  // Strip brackets from digit segments: [0] → 0
  const keyParts = parts.slice(firstDigitIndex).map((part) => part.replace(/^\[(\d+)]$/, '$1'));
  const stringKey = keyParts.join('.');

  return [targetPath, stringKey];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obscure array access patterns like `objectPath.@each.property`',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-obscure-array-access.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noObscureArrayAccess:
        'Unexpected obscure array access pattern "{{path}}". Use computed properties or helpers instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-obscure-array-access.js',
      docs: 'docs/rule/no-obscure-array-access.md',
      tests: 'test/unit/rules/no-obscure-array-access-test.js',
    },
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        const path = node.original;
        const sourcePath = context.sourceCode.getText(node);
        // Check for @each or [] in paths — these are structural and not autofixable
        if (path && (path.includes('.@each.') || path.includes('.[].'))) {
          context.report({
            node,
            messageId: 'noObscureArrayAccess',
            data: { path: sourcePath },
          });
          return;
        }
        // Check for numeric path segments (e.g., foo.0.bar) or bracket notation (e.g., foo.[0])
        if (node.tail && node.tail.some((segment) => /^\d+$/.test(segment))) {
          const params = getHelperParams(path);
          context.report({
            node,
            messageId: 'noObscureArrayAccess',
            data: { path: sourcePath },
            fix: params ? buildFix(context, node, params) : undefined,
          });
        }
      },
    };
  },
};

/**
 * Build a fix function for a numeric path expression.
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @param {import('estree').Node} node The GlimmerPathExpression node
 * @param {[string, string]} params The [targetPath, stringKey] tuple
 * @returns {(fixer: import('eslint').Rule.RuleFixer) => import('eslint').Rule.Fix}
 */
function buildFix(context, node, params) {
  const [target, key] = params;
  const parent = node.parent;

  // Case 1: PathExpression is the path of a MustacheStatement (e.g., {{this.list.0.name}})
  // Replace the entire mustache inner content with: get target "key"
  if (
    parent &&
    parent.type === 'GlimmerMustacheStatement' &&
    parent.path === node &&
    parent.params.length === 0 &&
    (!parent.hash || parent.hash.pairs.length === 0)
  ) {
    return (fixer) => {
      // The mustache is {{path}} — replace just the path portion
      // The source text of the MustacheStatement includes {{ and }}
      const mustacheSource = context.sourceCode.getText(parent);
      const isTriple = mustacheSource.startsWith('{{{');
      const openLen = isTriple ? 3 : 2;
      const closeLen = isTriple ? 3 : 2;
      const innerStart = parent.range[0] + openLen;
      const innerEnd = parent.range[1] - closeLen;

      return fixer.replaceTextRange([innerStart, innerEnd], `get ${target} "${key}"`);
    };
  }

  // Case 2: PathExpression is a param or hash value or any other context
  // Wrap with (get target "key")
  return (fixer) => {
    return fixer.replaceText(node, `(get ${target} "${key}")`);
  };
}
