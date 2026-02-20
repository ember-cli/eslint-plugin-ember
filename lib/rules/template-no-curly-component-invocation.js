/* eslint-disable eslint-plugin/prefer-placeholders */
const BUILT_INS = new Set([
  'action',
  'array',
  'component',
  'concat',
  'debugger',
  'each',
  'each-in',
  'fn',
  'get',
  'hasBlock',
  'has-block',
  'has-block-params',
  'hash',
  'if',
  'input',
  'let',
  'link-to',
  'loc',
  'log',
  'mount',
  'mut',
  'on',
  'outlet',
  'partial',
  'query-params',
  'textarea',
  'unbound',
  'unique-id',
  'unless',
  'with',
  '-in-element',
  'in-element',
  'app-version',
  'rootURL',
]);

const ALWAYS_CURLY = new Set(['yield']);

function transformTagName(name) {
  // Convert kebab-case to PascalCase for angle bracket syntax
  const parts = name.split('/');
  return parts
    .map((part) => {
      return part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
    })
    .join('::');
}

function parseConfig(config) {
  const defaults = {
    allow: [],
    disallow: [],
    requireDash: false,
    noImplicitThis: true,
  };

  if (config === true) {
    return defaults;
  }

  return { ...defaults, ...config };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow curly component invocation, use angle bracket syntax instead',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-curly-component-invocation.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
          },
          disallow: {
            type: 'array',
            items: { type: 'string' },
          },
          requireDash: {
            type: 'boolean',
          },
          noImplicitThis: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {},
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    function shouldCheckComponent(pathOriginal) {
      // Check if in allow list
      if (config.allow.includes(pathOriginal)) {
        return false;
      }

      // Check if in disallow list - always report these
      if (config.disallow.includes(pathOriginal)) {
        return true;
      }

      // Always curly - don't report
      if (ALWAYS_CURLY.has(pathOriginal)) {
        return false;
      }

      // Built-in helpers - don't report
      if (BUILT_INS.has(pathOriginal)) {
        return false;
      }

      // If it looks like a component (has dash or slash), flag it
      if (pathOriginal.includes('-') || pathOriginal.includes('/')) {
        return true;
      }

      return false;
    }

    return {
      GlimmerMustacheStatement(node) {
        if (!node.path || node.path.type !== 'GlimmerPathExpression') {
          return;
        }

        const pathOriginal = node.path.original;

        // Skip if has positional params or hash arguments (can't be converted to angle brackets)
        if (
          (node.params && node.params.length > 0) ||
          (node.hash && node.hash.pairs && node.hash.pairs.length > 0)
        ) {
          return;
        }

        if (shouldCheckComponent(pathOriginal)) {
          const angleBracketName = transformTagName(pathOriginal);
          context.report({
            node,
            message: `You are using the component {{${pathOriginal}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${pathOriginal}'] }\`.`,
          });
        }
      },

      GlimmerBlockStatement(node) {
        if (!node.path || node.path.type !== 'GlimmerPathExpression') {
          return;
        }

        const pathOriginal = node.path.original;

        // Skip if has positional params or hash arguments
        if (
          (node.params && node.params.length > 0) ||
          (node.hash && node.hash.pairs && node.hash.pairs.length > 0)
        ) {
          return;
        }

        if (shouldCheckComponent(pathOriginal)) {
          const angleBracketName = transformTagName(pathOriginal);
          context.report({
            node,
            message: `You are using the component {{#${pathOriginal}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${pathOriginal}'] }\`.`,
          });
        }
      },
    };
  },
};
/* eslint-enable eslint-plugin/prefer-placeholders */
