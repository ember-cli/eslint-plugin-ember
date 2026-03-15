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

function isExplicitThisPath(pathOriginal) {
  return (
    pathOriginal === 'this' || pathOriginal.startsWith('this.') || pathOriginal.startsWith('@')
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow curly component invocation, use angle bracket syntax instead',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-curly-component-invocation.md',
      templateMode: 'loose',
    },
    fixable: 'code',
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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-curly-component-invocation.js',
      docs: 'docs/rule/no-curly-component-invocation.md',
      tests: 'test/unit/rules/no-curly-component-invocation-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);
    const sourceCode = context.sourceCode;

    /**
     * Build a fix function for block statement curly→angle bracket conversion.
     * Matches ember-template-lint's fixForBlockNode behavior.
     */
    function buildBlockFix(node, angleBracketName) {
      return function fix(fixer) {
        // Convert hash pairs to @key attributes
        const attrs = (node.hash?.pairs ?? []).map((pair) => {
          const valueText = sourceCode.getText(pair.value);
          if (pair.value.type === 'GlimmerStringLiteral') {
            return `@${pair.key}="${pair.value.value}"`;
          }
          return `@${pair.key}={{${valueText}}}`;
        });

        // Get block params
        const blockParams = node.program?.blockParams ?? [];
        const blockParamsStr = blockParams.length > 0 ? ` as |${blockParams.join(' ')}|` : '';

        // Get body content
        const bodyText = node.program?.body
          ? node.program.body.map((n) => sourceCode.getText(n)).join('')
          : '';

        const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
        return fixer.replaceText(
          node,
          `<${angleBracketName}${attrStr}${blockParamsStr}>${bodyText}</${angleBracketName}>`
        );
      };
    }

    // Stack of block-param name arrays, one entry per active GlimmerBlockStatement or GlimmerElementNode.
    const blockParamStack = [];
    let insideAttrNode = false;

    function isLocalVar(name) {
      return blockParamStack.some((params) => params.includes(name));
    }

    function reportMustache(node, pathOriginal) {
      const angleBracketName = transformTagName(pathOriginal);
      context.report({
        node,
        message: `You are using the component {{${pathOriginal}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${pathOriginal}'] }\`.`,
      });
    }

    function checkMustacheWithNamedArgs(node, pathOriginal, explicitThis) {
      // {{foo.bar bar=baz}} - multi-part path (not this./@ prefix) with named args
      if (!explicitThis && pathOriginal.includes('.')) {
        reportMustache(node, pathOriginal);
        return;
      }

      if (config.allow.includes(pathOriginal)) {
        return;
      }

      // input/textarea with hash pairs are always reported
      if (['input', 'textarea'].includes(pathOriginal)) {
        reportMustache(node, pathOriginal);
        return;
      }

      // requireDash: skip single-word names without a dash
      if (config.requireDash && !pathOriginal.includes('-')) {
        return;
      }

      // Built-in helpers with hash pairs are not reported
      if (BUILT_INS.has(pathOriginal)) {
        return;
      }

      reportMustache(node, pathOriginal);
    }

    function checkMustacheWithoutNamedArgs(node, pathOriginal, explicitThis, local) {
      // {{foo.bar}} - multi-part path (not this./@ prefix), no named args
      if (!explicitThis && pathOriginal.includes('.')) {
        if (config.noImplicitThis && !local) {
          reportMustache(node, pathOriginal);
        }
        return;
      }

      // Explicit this.foo or @foo paths are never flagged as component invocations
      if (explicitThis) {
        return;
      }

      if (config.allow.includes(pathOriginal)) {
        return;
      }

      if (config.disallow.includes(pathOriginal) && !local) {
        reportMustache(node, pathOriginal);
        return;
      }

      if (BUILT_INS.has(pathOriginal)) {
        return;
      }

      // {{foo-bar}} or {{nested/component}}
      if (pathOriginal.includes('-') || pathOriginal.includes('/')) {
        reportMustache(node, pathOriginal);
        return;
      }

      // {{foo}} - plain single-word name, flag when noImplicitThis is enabled
      if (config.noImplicitThis && !local) {
        reportMustache(node, pathOriginal);
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        // <Foo @bar={{baz}} /> — mustache as an attribute value; not a component invocation
        if (insideAttrNode) {
          return;
        }

        if (!node.path || node.path.type !== 'GlimmerPathExpression') {
          return;
        }

        const pathOriginal = node.path.original;

        // Special case: link-to is always reported regardless of params
        if (pathOriginal === 'link-to') {
          reportMustache(node, pathOriginal);
          return;
        }

        // Skip if has positional params (angle bracket syntax doesn't support positional params)
        if (node.params && node.params.length > 0) {
          return;
        }

        if (ALWAYS_CURLY.has(pathOriginal)) {
          return;
        }

        const explicitThis = isExplicitThisPath(pathOriginal);
        const firstPart = pathOriginal.split('.')[0];
        const local = isLocalVar(firstPart);

        const hasNamedArguments = node.hash && node.hash.pairs && node.hash.pairs.length > 0;

        if (hasNamedArguments) {
          checkMustacheWithNamedArgs(node, pathOriginal, explicitThis);
        } else {
          checkMustacheWithoutNamedArgs(node, pathOriginal, explicitThis, local);
        }
      },

      GlimmerBlockStatement(node) {
        // Always push block params so nested mustaches can check scope.
        blockParamStack.push(node.program?.blockParams ?? []);

        if (node.inverse) {
          // {{#foo}}bar{{else}}baz{{/foo}}
          return;
        }

        if (!node.path || node.path.type !== 'GlimmerPathExpression') {
          return;
        }

        const pathOriginal = node.path.original;

        // Special case: link-to is always reported regardless of params
        if (pathOriginal === 'link-to') {
          const angleBracketName = transformTagName(pathOriginal);
          context.report({
            node,
            message: `You are using the component {{#${pathOriginal}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${pathOriginal}'] }\`.`,
          });
          return;
        }

        // Skip if has positional params
        if (node.params && node.params.length > 0) {
          return;
        }

        if (config.allow.includes(pathOriginal)) {
          return;
        }

        const angleBracketName = transformTagName(pathOriginal);
        context.report({
          node,
          message: `You are using the component {{#${pathOriginal}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${pathOriginal}'] }\`.`,
          fix: buildBlockFix(node, angleBracketName),
        });
      },

      'GlimmerBlockStatement:exit'() {
        blockParamStack.pop();
      },

      GlimmerElementNode(node) {
        blockParamStack.push(node.blockParams ?? []);
      },

      'GlimmerElementNode:exit'() {
        blockParamStack.pop();
      },

      GlimmerAttrNode() {
        insideAttrNode = true;
      },

      'GlimmerAttrNode:exit'() {
        insideAttrNode = false;
      },
    };
  },
};
/* eslint-enable eslint-plugin/prefer-placeholders */
