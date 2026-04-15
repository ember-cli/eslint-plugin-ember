/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline {{view}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-deprecated-inline-view-helper.md',
      templateMode: 'loose',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecated:
        'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/deprecated-inline-view-helper.js',
      docs: 'docs/rule/deprecated-inline-view-helper.md',
      tests: 'test/unit/rules/deprecated-inline-view-helper-test.js',
    },
  },

  create(context) {
    const isStrictMode = context.filename.endsWith('.gjs') || context.filename.endsWith('.gts');
    if (isStrictMode) {
      return {};
    }

    const sourceCode = context.sourceCode;

    // Track block param names to avoid false positives on locals like:
    //   {{#each items as |view|}} {{view.name}} {{/each}}
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

    function isViewPath(pathNode) {
      return (
        pathNode &&
        pathNode.type === 'GlimmerPathExpression' &&
        pathNode.original &&
        pathNode.original.startsWith('view.') &&
        pathNode.head?.type !== 'ThisHead' &&
        pathNode.head?.type !== 'AtHead' &&
        !isLocal('view')
      );
    }

    function checkHashForViewPaths(node) {
      if (node.hash && node.hash.pairs) {
        // Skip {{yield}} invocations — yield hash pairs are not view references
        const isYield =
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'yield' &&
          node.path.head?.type !== 'ThisHead' &&
          node.path.head?.type !== 'AtHead';
        if (isYield) {
          return false;
        }

        for (const pair of node.hash.pairs) {
          // Skip hash pairs with key "to" (e.g., {{yield to="inverse"}})
          if (pair.key === 'to') {
            continue;
          }
          if (isViewPath(pair.value)) {
            const strippedValue = pair.value.original.replace('view.', '');
            context.report({
              node,
              messageId: 'deprecated',
              fix(fixer) {
                return fixer.replaceText(pair.value, strippedValue);
              },
            });
            return true;
          }
        }
      }
      return false;
    }

    function checkForView(node) {
      if (node.path && node.path.type === 'GlimmerPathExpression') {
        // Check for {{view ...}} with params or hash pairs
        if (node.path.original === 'view' && !isLocal('view')) {
          if (node.params && node.params.length > 0) {
            // {{view 'component-name'}} with a single string param is fixable
            const firstParam = node.params[0];
            const isFixable =
              node.params.length === 1 && firstParam.type === 'GlimmerStringLiteral';
            context.report({
              node,
              messageId: 'deprecated',
              fix: isFixable ? (fixer) => fixer.replaceText(node, `{{${firstParam.value}}}`) : null,
            });
            return;
          }
          if (node.hash && node.hash.pairs && node.hash.pairs.length > 0) {
            context.report({
              node,
              messageId: 'deprecated',
            });
            return;
          }
        }
        // Check for {{view.something}} paths
        if (isViewPath(node.path)) {
          const strippedPath = node.path.original.replace('view.', '');
          context.report({
            node,
            messageId: 'deprecated',
            fix(fixer) {
              return fixer.replaceText(node.path, strippedPath);
            },
          });
          return;
        }
      }
      // Check hash values for view.* references
      checkHashForViewPaths(node);
    }

    return {
      GlimmerBlockStatement(node) {
        // Push this block's params into scope so children can detect locals,
        // but check the block's own path/hash first (params aren't in scope yet
        // for the block's own arguments in real Handlebars semantics).
        checkForView(node);
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
        // Check element attributes for view.* references (e.g., <div class={{view.something}}>)
        if (node.attributes) {
          for (const attr of node.attributes) {
            if (
              attr.value &&
              attr.value.type === 'GlimmerMustacheStatement' &&
              isViewPath(attr.value.path)
            ) {
              const strippedValue = attr.value.path.original.replace('view.', '');
              context.report({
                node: attr.value,
                messageId: 'deprecated',
                fix(fixer) {
                  return fixer.replaceText(attr.value.path, strippedValue);
                },
              });
            }
          }
        }

        if (node.blockParams && node.blockParams.length > 0) {
          pushLocals(node.blockParams);
        }
      },
      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popLocals();
        }
      },

      GlimmerMustacheStatement(node) {
        // Skip mustache statements that are element attribute values;
        // those are handled by the GlimmerElementNode visitor instead.
        if (node.parent && node.parent.type === 'GlimmerAttrNode') {
          return;
        }
        checkForView(node);
      },
    };
  },
};
