/**
 * Returns true when the attribute value is statically known to be falsy
 * (i.e. the developer has written `autofocus="false"`, `autofocus={{false}}`,
 * or `autofocus={{"false"}}`). These forms are aligned with jsx-a11y's
 * `no-autofocus` rule, which reads the attribute value via `getPropValue` and
 * skips reporting when the value is falsy (e.g. `<div autoFocus={false} />`).
 *
 * Valueless attributes (`<input autofocus>`) are TRUTHY per the HTML spec
 * (boolean attribute present == "on") and must still be flagged.
 */
function isExplicitlyFalsy(value) {
  if (!value) {
    // No value property at all — treat as bare boolean attribute (truthy).
    return false;
  }

  if (value.type === 'GlimmerTextNode') {
    // `autofocus="false"` → chars === "false". Bare `autofocus` has chars === "".
    return value.chars === 'false';
  }

  if (value.type === 'GlimmerMustacheStatement') {
    const expr = value.path;
    if (!expr) {
      return false;
    }
    // `autofocus={{false}}` → BooleanLiteral(false).
    if (expr.type === 'GlimmerBooleanLiteral' && expr.value === false) {
      return true;
    }
    // `autofocus={{"false"}}` → StringLiteral("false").
    if (expr.type === 'GlimmerStringLiteral' && expr.value === 'false') {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when the given GlimmerElementNode is a `<dialog>` element
 * or is nested (at any depth) inside a `<dialog>` element. Per MDN,
 * autofocus on (or within) a dialog is recommended because a dialog should
 * focus its initial element when opened.
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
function isInsideDialog(node) {
  if (node.type === 'GlimmerElementNode' && node.tag === 'dialog') {
    return true;
  }
  let ancestor = node.parent;
  while (ancestor) {
    if (ancestor.type === 'GlimmerElementNode' && ancestor.tag === 'dialog') {
      return true;
    }
    ancestor = ancestor.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow autofocus attribute',
      category: 'Accessibility',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-autofocus-attribute.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAutofocus:
        'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-autofocus-attribute.js',
      docs: 'docs/rule/no-autofocus-attribute.md',
      tests: 'test/unit/rules/no-autofocus-attribute-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const autofocusAttr = node.attributes?.find((attr) => attr.name === 'autofocus');

        if (!autofocusAttr) {
          return;
        }

        // jsx-a11y parity: `autofocus="false"` / `={{false}}` / `={{"false"}}`
        // explicitly opt out and should not be flagged.
        if (isExplicitlyFalsy(autofocusAttr.value)) {
          return;
        }

        // MDN dialog exception: autofocus on a <dialog> or inside a <dialog>
        // is recommended behavior, not an accessibility defect.
        if (isInsideDialog(node)) {
          return;
        }

        context.report({
          node: autofocusAttr,
          messageId: 'noAutofocus',
          fix(fixer) {
            const sourceCode = context.sourceCode;
            const text = sourceCode.getText();
            const attrStart = autofocusAttr.range[0];
            const attrEnd = autofocusAttr.range[1];

            let removeStart = attrStart;
            while (removeStart > 0 && /\s/.test(text[removeStart - 1])) {
              removeStart--;
            }

            return fixer.removeRange([removeStart, attrEnd]);
          },
        });
      },

      GlimmerMustacheStatement(node) {
        if (!node.hash || !node.hash.pairs) {
          return;
        }
        const autofocusPair = node.hash.pairs.find((pair) => pair.key === 'autofocus');
        if (!autofocusPair) {
          return;
        }

        // Value-aware check for component/helper invocations such as
        // `{{input autofocus=false}}` or `{{input autofocus="false"}}`.
        const pairValue = autofocusPair.value;
        if (pairValue) {
          if (pairValue.type === 'GlimmerBooleanLiteral' && pairValue.value === false) {
            return;
          }
          if (pairValue.type === 'GlimmerStringLiteral' && pairValue.value === 'false') {
            return;
          }
        }

        context.report({
          node: autofocusPair,
          messageId: 'noAutofocus',
        });
      },
    };
  },
};
