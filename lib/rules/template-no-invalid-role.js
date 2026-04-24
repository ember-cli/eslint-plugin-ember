const { roles } = require('aria-query');

// Valid ARIA roles = concrete (non-abstract) entries from aria-query, plus the
// WAI-ARIA 1.3 draft roles that aria-query 5.3.2 doesn't yet ship. The
// ARIA 1.2 base roles, DPUB-ARIA (doc-*), and Graphics-ARIA (graphics-*) all
// come from aria-query. `associationlist*`, `comment`, and `suggestion` are in
// the current ARIA 1.3 editor's draft (https://w3c.github.io/aria/) but not
// yet in aria-query, so they're listed here until the next aria-query release
// adds them.
const ARIA_13_DRAFT_ROLES = [
  'associationlist',
  'associationlistitemkey',
  'associationlistitemvalue',
  'comment',
  'suggestion',
];
const VALID_ROLES = new Set([
  ...[...roles.keys()].filter((role) => !roles.get(role).abstract),
  ...ARIA_13_DRAFT_ROLES,
]);

// Elements with semantic meaning that should not be given role="presentation" or role="none"
// List from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const SEMANTIC_ELEMENTS = new Set([
  'a',
  'abbr',
  'applet',
  'area',
  'audio',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'button',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'dir',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'form',
  'hr',
  'i',
  'iframe',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meter',
  'noembed',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'select',
  'small',
  'source',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'track',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid ARIA roles',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-role.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          catchNonexistentRoles: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: "Invalid ARIA role '{{role}}'. Must be a valid ARIA role.",
      presentationOnSemantic:
        'The role "{{role}}" should not be used on the semantic element <{{tag}}>.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-invalid-role.js',
      docs: 'docs/rule/no-invalid-role.md',
      tests: 'test/unit/rules/no-invalid-role-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const catchNonexistentRoles = options.catchNonexistentRoles !== false; // default true

    return {
      GlimmerElementNode(node) {
        const roleAttr = node.attributes?.find((a) => a.name === 'role');
        if (!roleAttr || roleAttr.value?.type !== 'GlimmerTextNode') {
          return;
        }

        const raw = roleAttr.value.chars.trim();
        if (!raw) {
          return;
        }

        // ARIA role attribute is a whitespace-separated list of tokens
        // (role-fallback pattern per ARIA 1.2 §5.4). Validate each token.
        // Keep the original casing alongside the normalized (lowercase) form
        // so reported-back tokens preserve author intent — the validation
        // is case-insensitive, the ERROR MESSAGE isn't.
        const rawTokens = raw.split(/\s+/u);
        const tokens = rawTokens.map((t) => t.toLowerCase());

        if (catchNonexistentRoles) {
          const invalidIdx = tokens.findIndex((token) => !VALID_ROLES.has(token));
          if (invalidIdx !== -1) {
            context.report({
              node: roleAttr,
              messageId: 'invalid',
              data: { role: rawTokens[invalidIdx] },
            });
            return;
          }
        }

        // Flag presentation/none only when it's the FIRST recognised role per
        // WAI-ARIA §4.1 fallback semantics — UAs walk the token list and use
        // the first role they recognise; subsequent tokens are author-provided
        // fallbacks that never take effect if the first is recognised. So
        // `role="button presentation"` resolves to `button` at runtime and
        // should NOT flag. `role="xxyxyz presentation"` resolves to
        // `presentation` (unknown tokens are skipped) and SHOULD flag on a
        // semantic element. Case-insensitivity inherits from HTML per §4.1:
        // https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
        const firstRecognisedRole = tokens.find((t) => VALID_ROLES.has(t));
        if (
          (firstRecognisedRole === 'presentation' || firstRecognisedRole === 'none') &&
          SEMANTIC_ELEMENTS.has(node.tag)
        ) {
          context.report({
            node: roleAttr,
            messageId: 'presentationOnSemantic',
            data: { role: firstRecognisedRole, tag: node.tag },
          });
        }
      },
    };
  },
};
