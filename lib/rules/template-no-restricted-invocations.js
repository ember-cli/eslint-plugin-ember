/* eslint-disable unicorn/consistent-function-scoping, unicorn/prefer-switch, curly */
const COMPONENT_HELPER_NAME = 'component';

function dasherize(str) {
  return str
    .split('::')
    .map((segment) =>
      segment
        .replaceAll(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
    )
    .join('/');
}

function parseConfig(config) {
  // If config is not provided, disable the rule
  if (config === false || config === undefined) {
    return false;
  }

  // If it's true, use empty array
  if (config === true) {
    return [];
  }

  // If it's an array, validate it
  if (Array.isArray(config)) {
    return config;
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow certain components, helpers or modifiers from being used',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-restricted-invocations.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          {
            type: 'array',
            items: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  type: 'object',
                  properties: {
                    names: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    message: {
                      type: 'string',
                    },
                  },
                  required: ['names', 'message'],
                  additionalProperties: false,
                },
              ],
            },
          },
        ],
      },
    ],
    messages: {},
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-restricted-invocations.js',
      docs: 'docs/rule/no-restricted-invocations.md',
      tests: 'test/unit/rules/no-restricted-invocations-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    if (config === false) {
      return {};
    }

    // Track block params in a scope stack so yielded names are not flagged.
    const blockParamScopes = [];

    function pushBlockParams(params) {
      blockParamScopes.push(new Set(params || []));
    }

    function popBlockParams() {
      blockParamScopes.pop();
    }

    function isBlockParam(name) {
      for (const scope of blockParamScopes) {
        if (scope.has(name)) {
          return true;
        }
      }
      return false;
    }

    function isRestricted(name) {
      for (const item of config) {
        if (typeof item === 'string') {
          if (item === name) {
            return { restricted: true, message: null };
          }
        } else if (item.names && item.names.includes(name)) {
          return { restricted: true, message: item.message };
        }
      }
      return { restricted: false };
    }

    function getComponentOrHelperName(node) {
      if (node.type === 'GlimmerElementNode') {
        // Convert angle-bracket names to kebab-case
        return dasherize(node.tag);
      }

      if (node.type === 'GlimmerMustacheStatement' || node.type === 'GlimmerBlockStatement') {
        // Check if it's the component helper
        if (node.path.original === COMPONENT_HELPER_NAME && node.params && node.params[0]) {
          // component helper with first param
          if (node.params[0].type === 'GlimmerStringLiteral') {
            return node.params[0].value;
          }
        }
        return node.path.original;
      }

      if (node.type === 'GlimmerModifierStatement') {
        return node.path.original;
      }

      if (node.type === 'GlimmerSubExpression') {
        if (node.path.original === COMPONENT_HELPER_NAME && node.params && node.params[0]) {
          if (node.params[0].type === 'GlimmerStringLiteral') {
            return node.params[0].value;
          }
        }
        return node.path.original;
      }

      return null;
    }

    function getNodeName(node) {
      switch (node.type) {
        case 'GlimmerElementNode': {
          return `<${node.tag} />`;
        }
        case 'GlimmerMustacheStatement': {
          if (
            node.path.original === COMPONENT_HELPER_NAME &&
            node.params?.[0]?.type === 'GlimmerStringLiteral'
          ) {
            return `{{component "${node.params[0].value}"}}`;
          }
          return `{{${node.path.original}}}`;
        }
        case 'GlimmerBlockStatement': {
          if (
            node.path.original === COMPONENT_HELPER_NAME &&
            node.params?.[0]?.type === 'GlimmerStringLiteral'
          ) {
            return `{{#component "${node.params[0].value}"}}`;
          }
          return `{{#${node.path.original}}}`;
        }
        case 'GlimmerModifierStatement': {
          return `{{${node.path.original}}}`;
        }
        case 'GlimmerSubExpression': {
          if (
            node.path.original === COMPONENT_HELPER_NAME &&
            node.params?.[0]?.type === 'GlimmerStringLiteral'
          ) {
            return `(component "${node.params[0].value}")`;
          }
          return `(${node.path.original})`;
        }
        // No default
      }
      return '';
    }

    return {
      GlimmerElementNode(node) {
        // For element nodes, check the raw tag against block params before dasherizing.
        if (node.tag && isBlockParam(node.tag)) {
          // Track block params from element nodes (e.g. <Foo as |bar|>).
          if (node.blockParams && node.blockParams.length > 0) {
            pushBlockParams(node.blockParams);
          }
          return;
        }

        const name = getComponentOrHelperName(node);
        if (name && !isBlockParam(name)) {
          const result = isRestricted(name);
          if (result.restricted) {
            context.report({
              node,
              message:
                result.message ||
                `Cannot use disallowed helper, component or modifier '${getNodeName(node)}'`,
            });
          }
        }

        // Track block params from element nodes (e.g. <Foo as |bar|>).
        if (node.blockParams && node.blockParams.length > 0) {
          pushBlockParams(node.blockParams);
        }

        // Check modifiers on the element
        if (node.modifiers) {
          for (const modifier of node.modifiers) {
            const modName =
              modifier.path &&
              modifier.path.type === 'GlimmerPathExpression' &&
              modifier.path.original;
            if (!modName) continue;
            if (isBlockParam(modName)) continue;

            const modResult = isRestricted(modName);
            if (modResult.restricted) {
              context.report({
                node: modifier,
                message:
                  modResult.message ||
                  `Cannot use disallowed helper, component or modifier '{{${modName}}}'`,
              });
            }
          }
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popBlockParams();
        }
      },

      GlimmerMustacheStatement(node) {
        const name = getComponentOrHelperName(node);
        if (!name) {
          return;
        }
        if (isBlockParam(name)) {
          return;
        }

        const result = isRestricted(name);
        if (result.restricted) {
          context.report({
            node,
            message:
              result.message ||
              `Cannot use disallowed helper, component or modifier '${getNodeName(node)}'`,
          });
        }
      },

      GlimmerBlockStatement(node) {
        const name = getComponentOrHelperName(node);
        if (name && !isBlockParam(name)) {
          const result = isRestricted(name);
          if (result.restricted) {
            context.report({
              node,
              message:
                result.message ||
                `Cannot use disallowed helper, component or modifier '${getNodeName(node)}'`,
            });
          }
        }

        // Track block params (e.g. {{#each items as |item|}}).
        if (node.program && node.program.blockParams) {
          pushBlockParams(node.program.blockParams);
        }
      },

      'GlimmerBlockStatement:exit'(node) {
        if (node.program && node.program.blockParams) {
          popBlockParams();
        }
      },

      GlimmerModifierStatement(node) {
        const name = getComponentOrHelperName(node);
        if (!name) {
          return;
        }
        if (isBlockParam(name)) {
          return;
        }

        const result = isRestricted(name);
        if (result.restricted) {
          context.report({
            node,
            message:
              result.message || `Cannot use disallowed helper, component or modifier '{{${name}}}'`,
          });
        }
      },

      GlimmerSubExpression(node) {
        const name = getComponentOrHelperName(node);
        if (!name) {
          return;
        }
        if (isBlockParam(name)) {
          return;
        }

        const result = isRestricted(name);
        if (result.restricted) {
          context.report({
            node,
            message:
              result.message ||
              `Cannot use disallowed helper, component or modifier '${getNodeName(node)}'`,
          });
        }
      },
    };
  },
};
/* eslint-enable unicorn/consistent-function-scoping, unicorn/prefer-switch, curly */
