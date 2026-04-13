// Built-in helpers and keywords
const BUILT_INS = new Set([
  'yield',
  'outlet',
  'has-block',
  'has-block-params',
  'hasBlock',
  'hasBlockParams',
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
  'input',
  'textarea',
  'query-params',
  'unique-id',
  // arg-less components/helpers from the default ember-cli blueprint
  'welcome-page',
  'rootURL',
]);

// Node types that have a `path` property pointing to a callee PathExpression
const CALLEE_PARENT_TYPES = new Set([
  'GlimmerMustacheStatement',
  'GlimmerSubExpression',
  'GlimmerBlockStatement',
  'GlimmerElementModifierStatement',
]);

// Callees are always valid for SubExpression/Block/Modifier; for Mustache,
// only when the mustache has args (bare {{foo}} is still ambiguous).
function isCalleePosition(node) {
  const parent = node.parent;
  if (!parent || !CALLEE_PARENT_TYPES.has(parent.type) || parent.path !== node) {
    return false;
  }
  if (parent.type !== 'GlimmerMustacheStatement') {
    return true;
  }
  const hasParams = parent.params && parent.params.length > 0;
  const hasHash = parent.hash && parent.hash.pairs && parent.hash.pairs.length > 0;
  return hasParams || hasHash;
}

// Returns true if the path root resolves to a JS binding (import, const,
// param, etc.). Walks scope.variables by name so it catches Glimmer built-in
// names (e.g. log, outlet) that don't surface in scope.references.
function isJsScopeVariable(node, sourceCode) {
  if (!sourceCode || !node.original) {
    return false;
  }
  const name = node.original.split('.')[0];
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

// Walks ancestors collecting block params from GlimmerBlockStatement nodes.
function isLocalBlockParam(node, pathRoot) {
  let current = node.parent;
  while (current) {
    // GlimmerBlockStatement nodes carry block params in program.blockParams
    if (current.type === 'GlimmerBlockStatement') {
      const blockParams = current.program?.blockParams || current.blockParams || [];
      if (blockParams.includes(pathRoot)) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require explicit `this` in property access',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-implicit-this.md',
      templateMode: 'loose',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noImplicitThis:
        'Ambiguous path "{{path}}" is not allowed. Use "@{{path}}" if it is a named argument or "this.{{path}}" if it is a property on the component.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-implicit-this.js',
      docs: 'docs/rule/no-implicit-this.md',
      tests: 'test/unit/rules/no-implicit-this-test.js',
    },
  },

  create(context) {
    const allowList = context.options[0]?.allow || [];
    const sourceCode = context.sourceCode;

    return {
      GlimmerPathExpression(node) {
        const path = node.original;

        // Skip if path starts with @ (named arg) or this. (explicit)
        if (path.startsWith('@') || path.startsWith('this.') || path === 'this') {
          return;
        }

        // Skip built-in helpers and keywords
        if (BUILT_INS.has(path)) {
          return;
        }

        // Skip paths matching the allow list (exact match only)
        if (allowList.includes(path)) {
          return;
        }

        // Skip if it looks like a component (PascalCase)
        const firstPart = path.split('.')[0];
        if (firstPart[0] === firstPart[0].toUpperCase()) {
          return;
        }

        // Skip callees of call-like expressions (SubExpression, BlockStatement,
        // ElementModifierStatement always; MustacheStatement only with args)
        if (isCalleePosition(node)) {
          return;
        }

        // Skip paths whose root is a JS scope binding (import/const/param) —
        // this is how GJS/GTS references external helpers, components, values.
        if (isJsScopeVariable(node, sourceCode)) {
          return;
        }

        // Skip paths whose root is an in-scope block param
        if (isLocalBlockParam(node, firstPart)) {
          return;
        }

        context.report({
          node,
          messageId: 'noImplicitThis',
          data: { path },
        });
      },
    };
  },
};
