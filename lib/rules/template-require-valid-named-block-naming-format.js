const FORMAT = {
  CAMEL_CASE: 'camelCase',
  KEBAB_CASE: 'kebab-case',
};

function camelize(str) {
  return str
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

function dasherize(str) {
  return str.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
}

const FORMAT_METHOD = {
  [FORMAT.CAMEL_CASE]: camelize,
  [FORMAT.KEBAB_CASE]: dasherize,
};

const DEFAULT_FORMAT = FORMAT.CAMEL_CASE;

function parseConfig(config) {
  if (config === false) {
    return false;
  }

  if (config === undefined || config === true) {
    return DEFAULT_FORMAT;
  }

  const formats = Object.values(FORMAT);
  if (typeof config === 'string' && formats.includes(config)) {
    return config;
  }

  return DEFAULT_FORMAT;
}

function createErrorMessage(format, actual, expected) {
  return `Named block should be in ${format} format. Change "${actual}" to "${expected}".`;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require valid named block naming format',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-valid-named-block-naming-format.md',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['camelCase', 'kebab-case'],
          },
        ],
      },
    ],
    messages: {},
  },

  create(context) {
    let config = context.options[0];
    config = parseConfig(config);

    if (config === false) {
      return {};
    }

    const formatMethod = FORMAT_METHOD[config];

    function checkNamedBlockName(name, node) {
      const expectedName = formatMethod(name);

      if (name !== expectedName) {
        context.report({
          node,
          message: createErrorMessage(config, name, expectedName),
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        const path = node.path.original;

        // Check yield with 'to' hash
        if (path === 'yield' && node.hash && node.hash.pairs) {
          const toPair = node.hash.pairs.find((pair) => pair.key === 'to');
          if (toPair && toPair.value && toPair.value.type === 'GlimmerStringLiteral') {
            checkNamedBlockName(toPair.value.value, toPair.value);
          }
        }

        // Check has-block with first param as string
        if (
          (path === 'has-block' || path === 'has-block-params') &&
          node.params &&
          node.params[0]
        ) {
          if (node.params[0].type === 'GlimmerStringLiteral') {
            checkNamedBlockName(node.params[0].value, node.params[0]);
          }
        }
      },

      GlimmerSubExpression(node) {
        const path = node.path.original;

        // Check has-block in subexpressions
        if (
          (path === 'has-block' || path === 'has-block-params') &&
          node.params &&
          node.params[0]
        ) {
          if (node.params[0].type === 'GlimmerStringLiteral') {
            checkNamedBlockName(node.params[0].value, node.params[0]);
          }
        }
      },
    };
  },
};
