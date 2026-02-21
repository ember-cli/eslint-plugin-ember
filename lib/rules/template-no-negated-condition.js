const ERROR_MESSAGE_FLIP_IF =
  'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.';
const ERROR_MESSAGE_USE_IF = 'Change `unless (not condition)` to `if condition`.';
const ERROR_MESSAGE_USE_UNLESS = 'Change `if (not condition)` to `unless condition`.';
const ERROR_MESSAGE_NEGATED_HELPER = 'Simplify unnecessary negation of helper.';

const INVERTIBLE_HELPERS = new Set(['not', 'eq', 'not-eq', 'gt', 'gte', 'lt', 'lte']);

const HELPER_INVERSIONS = {
  not: null, // special case
  eq: 'not-eq',
  'not-eq': 'eq',
  gt: 'lte',
  gte: 'lt',
  lt: 'gte',
  lte: 'gt',
};

function isIf(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'if';
}

function isUnless(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unless';
}

function hasNotHelper(node) {
  return (
    node.params?.length > 0 &&
    node.params[0].type === 'GlimmerSubExpression' &&
    node.params[0].path?.type === 'GlimmerPathExpression' &&
    node.params[0].path.original === 'not'
  );
}

function hasNestedFixableHelper(node) {
  const inner = node.params[0]?.params?.[0];
  return (
    inner &&
    inner.path?.type === 'GlimmerPathExpression' &&
    INVERTIBLE_HELPERS.has(inner.path.original)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in if/unless',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-negated-condition.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          simplifyHelpers: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      flipIf: ERROR_MESSAGE_FLIP_IF,
      useIf: ERROR_MESSAGE_USE_IF,
      useUnless: ERROR_MESSAGE_USE_UNLESS,
      negatedHelper: ERROR_MESSAGE_NEGATED_HELPER,
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const options = context.options[0] || {};
    const simplifyHelpers = options.simplifyHelpers === undefined ? true : options.simplifyHelpers;
    const sourceCode = context.getSourceCode();

    // eslint-disable-next-line complexity
    function checkNode(node) {
      const nodeIsIf = isIf(node);
      const nodeIsUnless = isUnless(node);

      if (!nodeIsIf && !nodeIsUnless) {
        return;
      }

      // Skip `{{else if ...}}` / `{{else unless ...}}` chains for the outer check,
      // unless they have a fixable negated helper inside
      if (node.type === 'GlimmerBlockStatement') {
        const text = sourceCode.getText(node);
        if (text.startsWith('{{else ')) {
          if (!simplifyHelpers || !hasNotHelper(node) || !hasNestedFixableHelper(node)) {
            return;
          }
          context.report({ node: node.params[0], messageId: 'useUnless' });
          return;
        }

        // Ignore `if ... else if ...` (chained) to avoid forcing negation
        if (
          node.inverse?.body?.length > 0 &&
          node.inverse.body[0].type === 'GlimmerBlockStatement' &&
          nodeIsIf &&
          isIf(node.inverse.body[0])
        ) {
          return;
        }
      }

      if (!hasNotHelper(node)) {
        return;
      }

      const notExpr = node.params[0];
      const hasFixableHelper = hasNestedFixableHelper(node);

      // If it's `if (not (someHelper ...))` and we can't simplify the helper,
      // don't suggest converting to `unless` (simple-unless rule would reject it)
      if (
        nodeIsIf &&
        notExpr.params?.[0]?.type === 'GlimmerSubExpression' &&
        (!simplifyHelpers || !hasFixableHelper)
      ) {
        return;
      }

      // (not a b c) with multiple params — can't simply remove negation
      if (notExpr.params?.length > 1) {
        return;
      }

      // Determine message
      const isIfElseBlock = node.type === 'GlimmerBlockStatement' && node.inverse?.body?.length > 0;
      const isIfElseInline = node.type !== 'GlimmerBlockStatement' && node.params?.length === 3;
      const shouldFlip = isIfElseBlock || isIfElseInline;

      const messageId = 'useUnless';

      context.report({
        node: notExpr,
        messageId,
      });
    }

    return {
      GlimmerBlockStatement: checkNode,
      GlimmerMustacheStatement: checkNode,
      GlimmerSubExpression: checkNode,
    };
  },
};
