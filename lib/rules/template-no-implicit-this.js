// Built-in helpers and keywords
const BUILT_INS = new Set([
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
]);

// Control-flow built-ins whose params should not be flagged
const CONTROL_FLOW_HELPERS = new Set([
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
]);

function isMustacheCalleeWithArgs(node) {
  const parent = node.parent;
  if (parent.path !== node) {
    return false;
  }
  if (parent.params && parent.params.length > 0) {
    return true;
  }
  return Boolean(parent.hash && parent.hash.pairs && parent.hash.pairs.length > 0);
}

function isControlFlowParam(node) {
  const callee = node.parent.path?.original;
  return CONTROL_FLOW_HELPERS.has(callee) && node.parent.params?.includes(node);
}

function isBlockParamPath(node, path) {
  const blockParams = node.parent.program?.blockParams || [];
  return blockParams.includes(path.split('.')[0]);
}

/** @type {import('eslint').Rule.RuleModule} */
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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-implicit-this.js',
      docs: 'docs/rule/no-implicit-this.md',
      tests: 'test/unit/rules/no-implicit-this-test.js',
    },
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
        if (BUILT_INS.has(path)) {
          return;
        }

        // Skip single identifiers that are the callee of a helper-like MustacheStatement
        if (node.parent && node.parent.type === 'GlimmerMustacheStatement') {
          if (isMustacheCalleeWithArgs(node)) {
            return;
          }
          if (isControlFlowParam(node)) {
            return;
          }
        }

        // Skip paths that are part of block params
        if (node.parent && node.parent.type === 'GlimmerBlockStatement') {
          if (isBlockParamPath(node, path)) {
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
