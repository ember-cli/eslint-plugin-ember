const FIRST_OBJECT_PROP_NAME = 'firstObject';
const LAST_OBJECT_PROP_NAME = 'lastObject';

const ERROR_MESSAGES = {
  LAST_OBJECT: 'Array prototype extension property lastObject usage is disallowed.',
  FIRST_OBJECT:
    "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead, e.g. `(get @list '0')`.",
};

/**
 * Check if the path should be allowed. `@firstObject.test`, `@lastObject`, and
 * `this.firstObject` are allowed (they are property names, not extensions).
 */
function isAllowed(originalStr, matchedStr) {
  // allow `@firstObject.test`, `@lastObject`
  if (originalStr.startsWith(`@${matchedStr}`)) {
    return true;
  }

  const originalParts = originalStr.split('.');
  const matchStrIndex = originalParts.indexOf(matchedStr);

  // if not found
  if (matchStrIndex === -1) {
    return true;
  }
  // allow this.firstObject (direct property, not extension)
  return !matchStrIndex || originalParts[matchStrIndex - 1] === 'this';
}

/**
 * Check if current node is a `get` helper and its string literal contains matchedStr.
 * For example `{{get this 'list.firstObject'}}` returns true,
 * but `{{get this 'firstObject'}}` returns false (that's a direct property).
 */
function isGetHelperWithMatchedLiteral(node, matchedStr) {
  if (node.original !== 'get') {
    return false;
  }

  const parent = node.parent;
  if (
    parent &&
    (parent.type === 'GlimmerMustacheStatement' || parent.type === 'GlimmerSubExpression') &&
    parent.params &&
    parent.params[1] &&
    parent.params[1].type === 'GlimmerStringLiteral'
  ) {
    const literal = parent.params[1].value || parent.params[1].original;
    const parts = literal.split('.');
    const matchStrIndex = parts.indexOf(matchedStr);

    // matchedStr is found and not the `{{get this 'firstObject'}}` case
    return (
      matchStrIndex !== -1 &&
      !(matchStrIndex === 0 && parent.params[0] && parent.params[0].original === 'this')
    );
  }
  return false;
}

/**
 * Build a `get` helper call string from a path containing `firstObject`.
 * e.g. "this.items.firstObject" => { target: "this.items", key: "0" }
 * e.g. "this.items.firstObject.name" => { target: "this.items", key: "0.name" }
 */
function buildGetHelperParts(originalPath) {
  const parts = originalPath.split('.');
  const firstObjectIndex = parts.indexOf(FIRST_OBJECT_PROP_NAME);
  const target = parts.slice(0, firstObjectIndex).join('.');
  const afterParts = ['0', ...parts.slice(firstObjectIndex + 1)];
  const key = afterParts.join('.');
  return { target, key };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of Ember Array prototype extensions',
      category: 'Best Practices',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-array-prototype-extensions.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      lastObject: ERROR_MESSAGES.LAST_OBJECT,
      firstObject: ERROR_MESSAGES.FIRST_OBJECT,
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerPathExpression(node) {
        if (!node.original) {
          return;
        }

        // Handle lastObject — no fixer available
        if (
          !isAllowed(node.original, LAST_OBJECT_PROP_NAME) ||
          isGetHelperWithMatchedLiteral(node, LAST_OBJECT_PROP_NAME)
        ) {
          context.report({
            node,
            messageId: 'lastObject',
          });
        }

        // Handle firstObject — with autofix
        const isGetWithFirstObject = isGetHelperWithMatchedLiteral(node, FIRST_OBJECT_PROP_NAME);

        if (!isAllowed(node.original, FIRST_OBJECT_PROP_NAME) || isGetWithFirstObject) {
          context.report({
            node,
            messageId: 'firstObject',
            fix(fixer) {
              const parent = node.parent;

              // Case 1: get helper with firstObject in string literal
              // e.g. {{get @list "items.firstObject"}} => {{get @list "items.0"}}
              if (isGetWithFirstObject) {
                const literalNode = parent.params[1];
                const literalText = sourceCode.getText(literalNode);
                // Detect quote character used in source
                const quote = literalText[0];
                const literalValue = literalNode.value || literalNode.original;
                const newValue = literalValue
                  .split('.')
                  .map((part) => (part === FIRST_OBJECT_PROP_NAME ? '0' : part))
                  .join('.');
                return fixer.replaceText(literalNode, `${quote}${newValue}${quote}`);
              }

              // Case 2: PathExpression is the path of a MustacheStatement
              // e.g. {{this.items.firstObject}} => {{get this.items "0"}}
              // e.g. {{this.items.firstObject.name}} => {{get this.items "0.name"}}
              if (parent && parent.type === 'GlimmerMustacheStatement' && parent.path === node) {
                const { target, key } = buildGetHelperParts(node.original);
                const newText = `{{get ${target} "${key}"}}`;
                return fixer.replaceText(parent, newText);
              }

              // Case 3: PathExpression used as a subexpression argument or other context
              // e.g. {{helper this.items.firstObject}} => {{helper (get this.items "0")}}
              if (parent) {
                const { target, key } = buildGetHelperParts(node.original);
                const newText = `(get ${target} "${key}")`;
                return fixer.replaceText(node, newText);
              }

              return null;
            },
          });
        }
      },
    };
  },
};
