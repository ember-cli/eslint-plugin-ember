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
    fixable: 'code',
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
    const sourceCode = context.sourceCode;

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

    /**
     * Build a fixer for the _withHelper case.
     * Converts `unless` to `if` and wraps the first param with `(not ...)`.
     * Special-cases when the first param is already `(not ...)`:
     *   - single arg: `unless (not x)` → `if x`
     *   - multiple args: `unless (not x y)` → `if (or x y)`
     */
    function buildWithHelperFix(node) {
      return function fix(fixer) {
        const nodeText = sourceCode.getText(node);
        const firstParam = node.params[0];
        const firstParamText = sourceCode.getText(firstParam);

        // Replace 'unless' with 'if' in the keyword
        let newText = nodeText.replace(/^({{#?)unless/, '$1if');

        if (firstParam.type === 'GlimmerSubExpression' && firstParam.path?.original === 'not') {
          // Special case: first param is (not ...)
          if (firstParam.params.length > 1) {
            // (not x y) → (or x y)
            const innerParamsText = firstParam.params.map((p) => sourceCode.getText(p)).join(' ');
            newText = newText.replace(firstParamText, `(or ${innerParamsText})`);
          } else {
            // (not x) → x — unwrap the not
            const innerText = sourceCode.getText(firstParam.params[0]);
            newText = newText.replace(firstParamText, innerText);
          }
        } else {
          // Wrap with (not ...)
          newText = newText.replace(firstParamText, `(not ${firstParamText})`);
        }

        // Also fix the closing tag for block statements
        if (node.type === 'GlimmerBlockStatement') {
          newText = newText.replace(/{{\/unless}}$/, '{{/if}}');
        }

        return fixer.replaceText(node, newText);
      };
    }

    /**
     * Build a fixer for the _followingElseBlock case (simple else, no else-if).
     * Swaps body/inverse and changes unless→if.
     */
    function buildFollowingElseBlockFix(node) {
      return function fix(fixer) {
        const programStart = node.program.range[0];
        const bodyText = sourceCode.text.slice(programStart, node.program.range[1]);
        const inverseText = sourceCode.text.slice(node.inverse.range[0], node.inverse.range[1]);
        const openingTag = sourceCode.text
          .slice(node.range[0], programStart)
          .replace(/^({{#)unless/, '$1if');
        // Result shape: {{#if cond}}inverse{{else}}body{{/if}}
        return fixer.replaceText(node, `${openingTag}${inverseText}{{else}}${bodyText}{{/if}}`);
      };
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
                fix: buildWithHelperFix(node),
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
                fix: buildWithHelperFix(node),
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
                fix: buildWithHelperFix(node),
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
              // Not fixable (ETL: _followingElseIfBlock, isFixable=false)
              context.report({
                node: node.program || node,
                messageId: 'followingElseBlock',
              });
            } else {
              // {{#unless}}...{{else}} — fixable
              context.report({
                node: node.program || node,
                messageId: 'followingElseBlock',
                fix: buildFollowingElseBlockFix(node),
              });
            }
          } else if (isElseUnlessBlock(nodeInverse.body[0])) {
            // {{#if}}...{{else unless}} — not fixable (ETL: isFixable=false)
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
