function isInAttrPosition(node) {
  let p = node.parent;
  while (p) {
    if (p.type === 'GlimmerAttrNode') {
      return true;
    }
    if (p.type === 'GlimmerConcatStatement') {
      p = p.parent;
      continue;
    }
    if (
      p.type === 'GlimmerElementNode' ||
      p.type === 'GlimmerTemplate' ||
      p.type === 'GlimmerBlockStatement' ||
      p.type === 'GlimmerBlock'
    ) {
      return false;
    }
    p = p.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow dynamic subexpression invocations',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-dynamic-subexpression-invocations.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noDynamicSubexpressionInvocations:
        'Do not use dynamic helper invocations. Use explicit helper names instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-dynamic-subexpression-invocations.js',
      docs: 'docs/rule/no-dynamic-subexpression-invocations.md',
      tests: 'test/unit/rules/no-dynamic-subexpression-invocations-test.js',
    },
  },

  create(context) {
    const localScopes = [];

    function pushLocals(params) {
      localScopes.push(new Set(params || []));
    }

    function popLocals() {
      localScopes.pop();
    }

    function isLocal(name) {
      for (const scope of localScopes) {
        if (scope.has(name)) {
          return true;
        }
      }
      return false;
    }

    function isDynamicPath(path) {
      if (!path || path.type !== 'GlimmerPathExpression') {
        return false;
      }
      if (path.head?.type === 'AtHead') {
        return true;
      }
      if (path.head?.type === 'ThisHead') {
        return true;
      }
      if (path.original && path.original.includes('.')) {
        return true;
      }
      if (path.original && isLocal(path.original)) {
        return true;
      }
      return false;
    }

    return {
      GlimmerBlockStatement(node) {
        if (node.program && node.program.blockParams) {
          pushLocals(node.program.blockParams);
        }
      },
      'GlimmerBlockStatement:exit'(node) {
        if (node.program && node.program.blockParams) {
          popLocals();
        }
      },

      GlimmerElementNode(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          pushLocals(node.blockParams);
        }
      },
      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popLocals();
        }
      },

      GlimmerSubExpression(node) {
        if (node.path && node.path.type === 'GlimmerPathExpression' && isDynamicPath(node.path)) {
          context.report({
            node,
            messageId: 'noDynamicSubexpressionInvocations',
          });
        }
      },

      GlimmerElementModifierStatement(node) {
        if (node.path && node.path.type === 'GlimmerPathExpression' && isDynamicPath(node.path)) {
          context.report({
            node,
            messageId: 'noDynamicSubexpressionInvocations',
          });
        }
      },

      GlimmerMustacheStatement(node) {
        if (node.path && node.path.type === 'GlimmerPathExpression') {
          const inAttr = isInAttrPosition(node);
          const hasArgs =
            (node.params && node.params.length > 0) ||
            (node.hash && node.hash.pairs && node.hash.pairs.length > 0);

          if (inAttr && isDynamicPath(node.path) && hasArgs) {
            // In attribute context, flag dynamic paths with arguments
            context.report({
              node,
              messageId: 'noDynamicSubexpressionInvocations',
            });
            return;
          }

          if (!inAttr && hasArgs) {
            // In body context, only flag this.* paths (not @args)
            if (node.path.head?.type === 'ThisHead') {
              context.report({
                node,
                messageId: 'noDynamicSubexpressionInvocations',
              });
            }
          }
        }
      },
    };
  },
};
