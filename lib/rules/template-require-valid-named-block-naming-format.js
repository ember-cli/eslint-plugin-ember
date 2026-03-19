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

function getStringQuote(text) {
  return text.startsWith("'") ? "'" : '"';
}

function isHasBlockNode(node) {
  return node.path?.original === 'has-block' || node.path?.original === 'has-block-params';
}

function isYieldNode(node) {
  return node.path?.original === 'yield';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require valid named block naming format',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-valid-named-block-naming-format.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [{ type: 'boolean' }, { type: 'string', enum: ['camelCase', 'kebab-case'] }],
      },
    ],
    messages: {
      invalidFormat:
        'Named blocks are required to use the "{{format}}" naming format. Please change "{{actual}}" to "{{expected}}".',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-valid-named-block-naming-format.js',
      docs: 'docs/rule/require-valid-named-block-naming-format.md',
      tests: 'test/unit/rules/require-valid-named-block-naming-format-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const config = parseConfig(context.options[0]);

    if (config === false) {
      return {};
    }

    const formatMethod = FORMAT_METHOD[config];

    function checkNamedBlockName(name, node) {
      const expectedName = formatMethod(name);

      if (name !== expectedName) {
        const quote = getStringQuote(sourceCode.getText(node));

        context.report({
          node,
          messageId: 'invalidFormat',
          data: {
            format: config,
            actual: name,
            expected: expectedName,
          },
          fix(fixer) {
            return fixer.replaceText(node, `${quote}${expectedName}${quote}`);
          },
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        if (isYieldNode(node) && node.hash?.pairs) {
          const toPair = node.hash.pairs.find((pair) => pair.key === 'to');
          if (toPair?.value?.type === 'GlimmerStringLiteral') {
            checkNamedBlockName(toPair.value.value, toPair.value);
          }
        }

        if (isHasBlockNode(node) && node.params?.[0]) {
          if (node.params[0].type === 'GlimmerStringLiteral') {
            checkNamedBlockName(node.params[0].value, node.params[0]);
          }
        }
      },

      GlimmerSubExpression(node) {
        if (isHasBlockNode(node) && node.params?.[0]) {
          if (node.params[0].type === 'GlimmerStringLiteral') {
            checkNamedBlockName(node.params[0].value, node.params[0]);
          }
        }
      },
    };
  },
};
