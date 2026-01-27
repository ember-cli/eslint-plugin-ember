/* eslint-disable complexity, eslint-plugin/prefer-placeholders, unicorn/explicit-length-check */
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow index component invocations',
      category: 'Best Practices',
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-index-component-invocation.md',
    },
    fixable: null,
    schema: [],
    messages: {},
  },

  create(context) {
    function lintIndexUsage(node) {
      // Handle angle bracket components: <Foo::Index />
      if (node.type === 'GlimmerElementNode') {
        if (node.tag && node.tag.endsWith('::Index')) {
          const invocation = `<${node.tag}`;
          const replacement = `<${node.tag.replace('::Index', '')}`;

          context.report({
            node,
            message: `Replace \`${invocation} ...\` to \`${replacement} ...\``,
          });
        }
        return;
      }

      // Handle mustache and block statements: {{foo/index}} or {{#foo/index}}
      if (node.type === 'GlimmerMustacheStatement' || node.type === 'GlimmerBlockStatement') {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original &&
          node.path.original.endsWith('/index')
        ) {
          const invocationPrefix = node.type === 'GlimmerBlockStatement' ? '{{#' : '{{';
          const invocation = `${invocationPrefix}${node.path.original}`;
          const replacement = `${invocationPrefix}${node.path.original.replace('/index', '')}`;

          context.report({
            node: node.path,
            message: `Replace \`${invocation} ...\` to \`${replacement} ...\``,
          });
          return;
        }
      }

      // Handle component helper: {{component "foo/index"}} or (component "foo/index")
      if (
        node.type === 'GlimmerMustacheStatement' ||
        node.type === 'GlimmerBlockStatement' ||
        node.type === 'GlimmerSubExpression'
      ) {
        const prefix =
          node.type === 'GlimmerMustacheStatement'
            ? '{{'
            : node.type === 'GlimmerBlockStatement'
              ? '{{#'
              : '(';

        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'GlimmerStringLiteral'
        ) {
          const componentName = node.params[0].value;

          if (componentName.endsWith('/index')) {
            const invocation = `${prefix}component "${componentName}"`;
            const replacement = `${prefix}component "${componentName.replace('/index', '')}"`;

            context.report({
              node: node.params[0],
              message: `Replace \`${invocation} ...\` to \`${replacement} ...\``,
            });
          }
        }
      }
    }

    return {
      GlimmerElementNode: lintIndexUsage,
      GlimmerMustacheStatement: lintIndexUsage,
      GlimmerBlockStatement: lintIndexUsage,
      GlimmerSubExpression: lintIndexUsage,
    };
  },
};
/* eslint-enable complexity, eslint-plugin/prefer-placeholders, unicorn/explicit-length-check */
