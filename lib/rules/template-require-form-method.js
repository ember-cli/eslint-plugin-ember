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

  // Invalid configuration (e.g. unknown method in allowedMethods). Throw a
  // descriptive error to surface the problem to the user, matching upstream
  // ember-template-lint (which throws instead of silently disabling).
  throw new Error(
    'template-require-form-method: invalid configuration. Expected one of:\n' +
      '  * boolean - `true` to enable / `false` to disable\n' +
      '  * object -- An object with the following keys:\n' +
      `    * \`allowedMethods\` -- An array of allowed form \`method\` attribute values of \`${VALID_FORM_METHODS}\`\n` +
      `Received: ${JSON.stringify(config)}`
  );
}

function makeErrorMessage(methods) {
  return `All \`<form>\` elements should have \`method\` attribute with value of \`${methods.join(',')}\``;
}

function getFixedMethod(config) {
  return config.allowedMethods[0];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require form method attribute',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-form-method.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { type: 'boolean' },
          {
            type: 'object',
            properties: {
              allowedMethods: {
                type: 'array',
                items: {
                  // Accept any string so case-insensitive values like "get"
                  // still pass schema validation; parseConfig normalizes to
                  // upper-case and throws on values not in VALID_FORM_METHODS.
                  type: 'string',
                },
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      invalidMethod: '{{message}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-form-method.js',
      docs: 'docs/rule/require-form-method.md',
      tests: 'test/unit/rules/require-form-method-test.js',
    },
  },

  create(context) {
    // Match upstream ember-template-lint: when no options are provided,
    // parseConfig(undefined) returns false and the rule is disabled. This
    // rule must be enabled explicitly via `true` or an `allowedMethods`
    // object.
    const rawOption = context.options[0];
    const config = parseConfig(rawOption);

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
            messageId: 'invalidMethod',
            data: {
              message: makeErrorMessage(config.allowedMethods),
            },
            fix(fixer) {
              return fixer.insertTextAfterRange(
                [node.parts.at(-1).range[1], node.parts.at(-1).range[1]],
                ` method="${getFixedMethod(config)}"`
              );
            },
          });
          return;
        }

        // Check if it's a text value
        if (methodAttribute.value && methodAttribute.value.type === 'GlimmerTextNode') {
          const methodValue = methodAttribute.value.chars.toUpperCase();

          if (!config.allowedMethods.includes(methodValue)) {
            context.report({
              node,
              messageId: 'invalidMethod',
              data: {
                message: makeErrorMessage(config.allowedMethods),
              },
              fix(fixer) {
                return fixer.replaceTextRange(
                  methodAttribute.value.range,
                  `"${getFixedMethod(config)}"`
                );
              },
            });
          }
        }
        // If it's a dynamic value (like {{foo}}), don't report
      },
    };
  },
};
