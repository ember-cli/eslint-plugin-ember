/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow args.foo paths in templates, use @foo instead',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-args-paths.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      argsPath:
        'Component templates should avoid "{{path}}" usage, try "@{{replacement}}" instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-args-paths.js',
      docs: 'docs/rule/no-args-paths.md',
      tests: 'test/unit/rules/no-args-paths-test.js',
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

      GlimmerPathExpression(node) {
        const path = node.original;

        // @args.foo is a valid named argument — skip paths starting with @
        if (node.head?.type === 'AtHead') {
          return;
        }

        if (!path?.startsWith('args.') && !path?.startsWith('this.args.')) {
          return;
        }

        // Skip when 'args' is a block param in the current scope
        if (isLocal('args')) {
          return;
        }

        const replacement = path.replace(/^(this\.)?args\./, '');

        context.report({
          node,
          messageId: 'argsPath',
          data: { path, replacement },
          fix(fixer) {
            return fixer.replaceText(node, `@${replacement}`);
          },
        });
      },
    };
  },
};
