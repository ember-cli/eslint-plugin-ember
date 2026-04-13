const tags = require('language-tags');

const DEFAULT_CONFIG = {
  validateValues: true,
};

function isValidLangTag(value) {
  if (!value || !value.trim()) {
    return false;
  }
  return tags(value.trim()).valid();
}

function parseConfig(config) {
  if (config === true || config === undefined) {
    return DEFAULT_CONFIG;
  }

  if (config && typeof config === 'object') {
    return {
      validateValues:
        'validateValues' in config ? config.validateValues : DEFAULT_CONFIG.validateValues,
    };
  }

  return DEFAULT_CONFIG;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require lang attribute on html element',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-lang-attribute.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        anyOf: [
          { type: 'boolean', enum: [true] },
          {
            type: 'object',
            properties: {
              validateValues: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      invalid: 'The `<html>` element must have the `lang` attribute with a valid value',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-lang-attribute.js',
      docs: 'docs/rule/require-lang-attribute.md',
      tests: 'test/unit/rules/require-lang-attribute-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'html') {
          return;
        }

        const langAttr = node.attributes?.find((a) => a.name === 'lang');
        if (!langAttr) {
          context.report({ node, messageId: 'invalid' });
          return;
        }

        if (!langAttr.value) {
          context.report({ node, messageId: 'invalid' });
          return;
        }

        if (langAttr.value.type === 'GlimmerTextNode') {
          const value = langAttr.value.chars;

          if (!value || !value.trim()) {
            context.report({ node, messageId: 'invalid' });
          } else if (config.validateValues && !isValidLangTag(value)) {
            context.report({ node, messageId: 'invalid' });
          }
        }
      },
    };
  },
};
