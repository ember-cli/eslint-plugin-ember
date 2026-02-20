const DEFAULT_MAX_LENGTH = 200;
const DEFAULT_MIN_LENGTH = 5;

const DEFAULT_CONFIG = {
  max: DEFAULT_MAX_LENGTH,
  min: DEFAULT_MIN_LENGTH,
};

function isValidConfigObjectFormat(config) {
  for (const key of Object.keys(config)) {
    const value = config[key];

    if (key !== 'min' && key !== 'max') {
      return false;
    }

    if (!Number.isInteger(value)) {
      return false;
    }
  }

  return true;
}

function parseConfig(config) {
  const configType = typeof config;

  switch (configType) {
    case 'boolean': {
      return config ? DEFAULT_CONFIG : {};
    }
    case 'object': {
      if (config === null) {
        break;
      }

      if (isValidConfigObjectFormat(config)) {
        return config;
      }
      break;
    }
    case 'undefined': {
      return {};
    }
    // No default
  }

  throw new Error(
    'The ember/template-template-length rule accepts: boolean, or object with integer "min" and/or "max" keys.'
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce template size constraints',
      category: 'Stylistic Issues',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-template-length.md',
    },
    schema: [
      {
        oneOf: [
          { type: 'boolean' },
          {
            type: 'object',
            properties: {
              min: { type: 'integer' },
              max: { type: 'integer' },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      tooLong: 'Template length of {{length}} exceeds {{max}}',
      tooShort: 'Template length of {{length}} is smaller than {{min}}',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    if (!config.min && !config.max) {
      return {};
    }

    return {
      'GlimmerTemplate:exit'(node) {
        const length = node.loc.end.line - node.loc.start.line + 1;

        if (config.max && length > config.max) {
          context.report({
            node,
            messageId: 'tooLong',
            data: { length, max: config.max },
          });
        } else if (config.min && length < config.min) {
          context.report({
            node,
            messageId: 'tooShort',
            data: { length, min: config.min },
          });
        }
      },
    };
  },
};
