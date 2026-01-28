/**
 * @fileoverview Require explicit this for property access in templates
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require explicit `this` in property access',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-implicit-this.md',
    },
    schema: [],
    messages: {
      noImplicitThis:
        'Ambiguous path "{{path}}" is not allowed. Use "@{{path}}" if it is a named argument or "this.{{path}}" if it is a property on the component.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerPathExpression(node) {
        const path = node.original;

        // Skip if path starts with @ (named arg) or this. (explicit)
        if (path.startsWith('@') || path.startsWith('this.')) {
          return;
        }

        // Skip built-in helpers and keywords
        const builtIns = [
          'yield',
          'outlet',
          'has-block',
          'has-block-params',
          'if',
          'unless',
          'each',
          'let',
          'with',
          'each-in',
          'concat',
          'get',
          'array',
          'hash',
          'log',
          'debugger',
          'component',
          'helper',
          'modifier',
          'mount',
        ];
        if (builtIns.includes(path)) {
          return;
        }

        // Skip if it's a helper with a dash (likely a helper call)
        if (path.includes('-')) {
          return;
        }

        // Skip single identifiers that look like helpers in MustacheStatement
        if (node.parent && node.parent.type === 'GlimmerMustacheStatement') {
          // If it's the path of a mustache with params, it's likely a helper
          if (node.parent.params && node.parent.params.length > 0) {
            return;
          }
          // If it has hash pairs, it's likely a helper
          if (node.parent.hash && node.parent.hash.pairs && node.parent.hash.pairs.length > 0) {
            return;
          }
        }

        // Skip paths that are part of block params
        if (node.parent && node.parent.type === 'GlimmerBlockStatement') {
          const blockParams = node.parent.program?.blockParams || [];
          if (blockParams.includes(path.split('.')[0])) {
            return;
          }
        }

        // Report ambiguous paths that should use this. or @
        if (!path.includes('.') || !path.startsWith('this.')) {
          const firstPart = path.split('.')[0];

          // Skip if it looks like a component (PascalCase)
          if (firstPart[0] === firstPart[0].toUpperCase()) {
            return;
          }

          context.report({
            node,
            messageId: 'noImplicitThis',
            data: { path },
          });
        }
      },
    };
  },
};
