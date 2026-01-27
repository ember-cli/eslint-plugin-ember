// Form `method` attribute keywords:
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method
const VALID_FORM_METHODS = ['POST', 'GET', 'DIALOG'];

const DEFAULT_CONFIG = {
  allowedMethods: VALID_FORM_METHODS,
};

function parseConfig(config) {
  if (config === false || config === undefined) {
    return false;
  }

  if (config === true) {
    return DEFAULT_CONFIG;
  }

  if (typeof config === 'object' && Array.isArray(config.allowedMethods)) {
    const allowedMethods = config.allowedMethods.map((m) => String(m).toUpperCase());

    // Check if all methods are valid
    const hasAllValid = allowedMethods.every((m) => VALID_FORM_METHODS.includes(m));

    if (hasAllValid) {
      return { allowedMethods };
    }
  }

  return false;
}

function makeErrorMessage(methods) {
  return `All \`<form>\` elements should have \`method\` attribute with value of \`${methods.join(',')}\``;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require form method attribute',
      category: 'Best Practices',
      recommended: false,
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-form-method.md',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          {
            type: 'object',
            properties: {
              allowedMethods: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {},
  },

  create(context) {
    // If no options provided, use defaults
    let config = context.options[0];
    config = config ? parseConfig(config) : DEFAULT_CONFIG;

    if (config === false) {
      return {};
    }

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'form') {
          return;
        }

        const methodAttribute = node.attributes.find((attr) => attr.name === 'method');

        if (!methodAttribute) {
          context.report({
            node,
            message: makeErrorMessage(config.allowedMethods),
          });
          return;
        }

        // Check if it's a text value
        if (methodAttribute.value && methodAttribute.value.type === 'GlimmerTextNode') {
          const methodValue = methodAttribute.value.chars.toUpperCase();

          if (!config.allowedMethods.includes(methodValue)) {
            context.report({
              node,
              message: makeErrorMessage(config.allowedMethods),
            });
          }
        }
        // If it's a dynamic value (like {{foo}}), don't report
      },
    };
  },
};
