function isUnless(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unless';
}

function isIf(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'if';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require simple conditions in unless blocks',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-simple-unless.md',
      templateMode: 'both',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowlist: { type: 'array', items: { type: 'string' } },
          denylist: { type: 'array', items: { type: 'string' } },
          maxHelpers: { type: 'integer' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      followingElseBlock: 'Using an `else` block with `unless` should be avoided.',
      asElseUnlessBlock: 'Using an `else unless` block should be avoided.',
      withHelper: '{{message}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/simple-unless.js',
      docs: 'docs/rule/simple-unless.md',
      tests: 'test/unit/rules/simple-unless-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowlist = options.allowlist || [];
    const denylist = options.denylist || [];
    const maxHelpers = options.maxHelpers === undefined ? 1 : options.maxHelpers;
    const sourceCode = context.getSourceCode();

    function isElseUnlessBlock(node) {
      if (!node) {
        return false;
      }
      if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unless') {
        const text = sourceCode.getText(node);
        return text.startsWith('{{else ');
      }
      return false;
    }

    function checkWithHelper(node) {
      let helperCount = 0;
      let nextParams = node.params || [];

      do {
        const currentParams = nextParams;
        nextParams = [];

        for (const param of currentParams) {
          if (param.type === 'GlimmerSubExpression') {
            helperCount++;
            const helperName = param.path?.original || '';

            if (maxHelpers > -1 && helperCount > maxHelpers) {
              context.report({
                node: param,
                messageId: 'withHelper',
                data: {
                  message: `Using {{unless}} in combination with other helpers should be avoided. MaxHelpers: ${maxHelpers}`,
                },
              });
              return;
            }

            if (allowlist.length > 0 && !allowlist.includes(helperName)) {
              context.report({
                node: param,
                messageId: 'withHelper',
                data: {
                  message: `Using {{unless}} in combination with other helpers should be avoided. Allowed helper${allowlist.length > 1 ? 's' : ''}: ${allowlist}`,
                },
              });
              return;
            }

            if (denylist.length > 0 && denylist.includes(helperName)) {
              context.report({
                node: param,
                messageId: 'withHelper',
                data: {
                  message: `Using {{unless}} in combination with other helpers should be avoided. Restricted helper${denylist.length > 1 ? 's' : ''}: ${denylist}`,
                },
              });
              return;
            }

            if (param.params) {
              nextParams.push(...param.params);
            }
          }
        }
      } while (nextParams.some((p) => p.type === 'GlimmerSubExpression'));
    }

    return {
      GlimmerMustacheStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unless') {
          if (node.params?.[0]?.path) {
            checkWithHelper(node);
          }
        }
      },

      GlimmerBlockStatement(node) {
        const nodeInverse = node.inverse;

        if (nodeInverse && nodeInverse.body?.length > 0) {
          if (isUnless(node)) {
            // Check for {{#unless}}...{{else if}}
            if (nodeInverse.body[0] && isIf(nodeInverse.body[0])) {
              context.report({
                node: node.program || node,
                messageId: 'followingElseBlock',
              });
            } else {
              // {{#unless}}...{{else}}
              context.report({
                node: node.program || node,
                messageId: 'followingElseBlock',
              });
            }
          } else if (isElseUnlessBlock(nodeInverse.body[0])) {
            // {{#if}}...{{else unless}}
            context.report({
              node: nodeInverse.body[0],
              messageId: 'asElseUnlessBlock',
            });
          }
        } else if (isUnless(node) && node.params?.[0]?.path) {
          checkWithHelper(node);
        }
      },
    };
  },
};
