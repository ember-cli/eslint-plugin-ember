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

function escapeRegExp(string) {
  return string.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in if/unless',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-negated-condition.md',
      templateMode: 'both',
    },
    fixable: 'code',
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
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-negated-condition.js',
      docs: 'docs/rule/no-negated-condition.md',
      tests: 'test/unit/rules/no-negated-condition-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const simplifyHelpers = options.simplifyHelpers === undefined ? true : options.simplifyHelpers;
    const sourceCode = context.getSourceCode();

    /**
     * Get the source text for the inner condition of a (not ...) sub-expression,
     * with the nested helper optionally inverted.
     */
    function getUnwrappedConditionText(notExpr, invertHelper) {
      const inner = notExpr.params[0];
      if (invertHelper && inner.path?.type === 'GlimmerPathExpression') {
        const helperName = inner.path.original;
        const inverted = HELPER_INVERSIONS[helperName];
        if (inverted !== undefined) {
          if (inverted === null) {
            if (inner.params.length > 1) {
              // (not (not c1 c2)) -> (or c1 c2)
              const paramsText = inner.params.map((p) => sourceCode.getText(p)).join(' ');
              return `(or ${paramsText})`;
            }
            // (not (not x)) -> just x
            return sourceCode.getText(inner.params[0]);
          }
          // (not (eq a b)) -> (not-eq a b)
          const innerText = sourceCode.getText(inner);
          return innerText.replace(`(${helperName} `, `(${inverted} `);
        }
      }
      return sourceCode.getText(inner);
    }

    /**
     * Build a fix function for block statements.
     */
    function buildBlockFix(node, messageId) {
      return function fix(fixer) {
        const fullText = sourceCode.getText(node);
        const keyword = node.path.original;
        const notExpr = node.params[0];

        if (messageId === 'negatedHelper') {
          const conditionText = getUnwrappedConditionText(notExpr, true);
          const newText = fullText.replace(sourceCode.getText(notExpr), conditionText);
          return fixer.replaceText(node, newText);
        }

        if (messageId === 'flipIf') {
          // {{#if (not x)}}A{{else}}B{{/if}} -> {{#if x}}B{{else}}A{{/if}}
          const conditionText = getUnwrappedConditionText(notExpr, false);
          const programBody = node.program.body.map((n) => sourceCode.getText(n)).join('');
          const inverseBody = node.inverse.body.map((n) => sourceCode.getText(n)).join('');

          return fixer.replaceText(
            node,
            `{{#${keyword} ${conditionText}}}${inverseBody}{{else}}${programBody}{{/${keyword}}}`
          );
        }

        if (messageId === 'useIf' || messageId === 'useUnless') {
          const newKeyword = keyword === 'unless' ? 'if' : 'unless';
          const conditionText = getUnwrappedConditionText(notExpr, false);
          const notExprText = escapeRegExp(sourceCode.getText(notExpr));
          const newText = fullText
            .replace(
              new RegExp(`^\\{\\{#${keyword} ${notExprText}`),
              `{{#${newKeyword} ${conditionText}`
            )
            .replace(new RegExp(`\\{\\{/${keyword}\\}\\}$`), `{{/${newKeyword}}}`);
          return fixer.replaceText(node, newText);
        }

        return null;
      };
    }

    /**
     * Build a fix function for inline (mustache/subexpression) statements.
     */
    function buildInlineFix(node, messageId) {
      return function fix(fixer) {
        const fullText = sourceCode.getText(node);
        const keyword = node.path.original;
        const notExpr = node.params[0];

        if (messageId === 'negatedHelper') {
          const conditionText = getUnwrappedConditionText(notExpr, true);
          const newText = fullText.replace(sourceCode.getText(notExpr), conditionText);
          return fixer.replaceText(node, newText);
        }

        if (messageId === 'flipIf') {
          const conditionText = getUnwrappedConditionText(notExpr, false);
          const param1Text = sourceCode.getText(node.params[1]);
          const param2Text = sourceCode.getText(node.params[2]);
          const isSubExpr = node.type === 'GlimmerSubExpression';
          const open = isSubExpr ? '(' : '{{';
          const close = isSubExpr ? ')' : '}}';
          return fixer.replaceText(
            node,
            `${open}${keyword} ${conditionText} ${param2Text} ${param1Text}${close}`
          );
        }

        if (messageId === 'useIf' || messageId === 'useUnless') {
          const newKeyword = keyword === 'unless' ? 'if' : 'unless';
          const conditionText = getUnwrappedConditionText(notExpr, false);
          const isSubExpr = node.type === 'GlimmerSubExpression';
          const open = isSubExpr ? '(' : '{{';
          const close = isSubExpr ? ')' : '}}';
          const remainingParams = node.params
            .slice(1)
            .map((p) => sourceCode.getText(p))
            .join(' ');
          return fixer.replaceText(
            node,
            `${open}${newKeyword} ${conditionText} ${remainingParams}${close}`
          );
        }

        return null;
      };
    }

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
          context.report({
            node: node.params[0],
            messageId: 'negatedHelper',
            fix: buildBlockFix(node, 'negatedHelper'),
          });
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
      const isIfElseBlock =
        node.type === 'GlimmerBlockStatement' && node.inverse?.body?.length > 0;
      const isIfElseInline = node.type !== 'GlimmerBlockStatement' && node.params?.length === 3;
      const shouldFlip = isIfElseBlock || isIfElseInline;

      let messageId;
      if (hasFixableHelper && simplifyHelpers) {
        messageId = 'negatedHelper';
      } else if (shouldFlip && nodeIsIf) {
        messageId = 'flipIf';
      } else if (nodeIsUnless) {
        messageId = 'useIf';
      } else {
        messageId = 'useUnless';
      }

      const isBlock = node.type === 'GlimmerBlockStatement';
      context.report({
        node: notExpr,
        messageId,
        fix: isBlock ? buildBlockFix(node, messageId) : buildInlineFix(node, messageId),
      });
    }

    return {
      GlimmerBlockStatement: checkNode,
      GlimmerMustacheStatement: checkNode,
      GlimmerSubExpression: checkNode,
    };
  },
};
