const VALID_ROLES = new Set([
  'alert',
  'alertdialog',
  'application',
  'article',
  'associationlist',
  'associationlistitemkey',
  'associationlistitemvalue',
  'banner',
  'blockquote',
  'button',
  'caption',
  'cell',
  'checkbox',
  'code',
  'columnheader',
  'combobox',
  'comment',
  'complementary',
  'contentinfo',
  'definition',
  'deletion',
  'dialog',
  'directory',
  'document',
  'emphasis',
  'feed',
  'figure',
  'form',
  'generic',
  'grid',
  'gridcell',
  'group',
  'heading',
  'img',
  'insertion',
  'link',
  'list',
  'listbox',
  'listitem',
  'log',
  'main',
  'mark',
  'marquee',
  'math',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'meter',
  'navigation',
  'none',
  'note',
  'option',
  'paragraph',
  'presentation',
  'progressbar',
  'radio',
  'radiogroup',
  'region',
  'row',
  'rowgroup',
  'rowheader',
  'scrollbar',
  'search',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'status',
  'strong',
  'subscript',
  'suggestion',
  'superscript',
  'switch',
  'tab',
  'table',
  'tablist',
  'tabpanel',
  'term',
  'textbox',
  'time',
  'timer',
  'toolbar',
  'tooltip',
  'tree',
  'treegrid',
  'treeitem',
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

        const role = roleAttr.value.chars.trim();
        if (!role) {
          return;
        }

        const roleLower = role.toLowerCase();

        // Check for nonexistent roles
        if (catchNonexistentRoles && !VALID_ROLES.has(roleLower)) {
          context.report({
            node: roleAttr,
            messageId: 'invalid',
            data: { role },
          });
          return;
        }

        // Check for presentation/none role on semantic elements (case-insensitive per WAI-ARIA 1.2:
        // "Case-sensitivity of the comparison inherits from the case-sensitivity of the host language"
        // and HTML is case-insensitive — https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles)
        if (
          (roleLower === 'presentation' || roleLower === 'none') &&
          SEMANTIC_ELEMENTS.has(node.tag)
        ) {
          context.report({
            node: roleAttr,
            messageId: 'presentationOnSemantic',
            data: { role, tag: node.tag },
          });
        }
      },
    };
  },
};
