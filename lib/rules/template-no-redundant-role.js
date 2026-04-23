const DEFAULT_CONFIG = {
  checkAllHTMLElements: true,
};

function parseConfig(config) {
  if (config === true) {
    return DEFAULT_CONFIG;
  }
  return { ...DEFAULT_CONFIG, ...config };
}

function createErrorMessageLandmarkElement(element, role) {
  return `Use of redundant or invalid role: ${role} on <${element}> detected. If a landmark element is used, any role provided will either be redundant or incorrect.`;
}

function createErrorMessageAnyElement(element, role) {
  return `Use of redundant or invalid role: ${role} on <${element}> detected.`;
}

// https://www.w3.org/TR/html-aria/#docconformance
const LANDMARK_ROLES = new Set([
  'banner',
  'main',
  'complementary',
  'search',
  'form',
  'navigation',
  'contentinfo',
]);

const ALLOWED_ELEMENT_ROLES = [
  { name: 'nav', role: 'navigation' },
  { name: 'form', role: 'search' },
  { name: 'ol', role: 'list' },
  { name: 'ul', role: 'list' },
  { name: 'a', role: 'link' },
  { name: 'input', role: 'combobox' },
];

// Per HTML-AAM, <select> maps to "combobox" only when neither `multiple` nor
// `size > 1` is set; otherwise it maps to "listbox". Mirrors jsx-a11y's
// src/util/implicitRoles/select.js.
//
// Returns 'combobox' / 'listbox' for static cases, or 'unknown' when a
// dynamic `size` value blocks a decision. Callers should skip flagging on
// 'unknown' to avoid false positives.
function getSelectImplicitRole(node) {
  const attrs = node.attributes || [];
  const hasMultiple = attrs.some((a) => a.name === 'multiple');
  if (hasMultiple) {
    return 'listbox';
  }
  const sizeAttr = attrs.find((a) => a.name === 'size');
  if (sizeAttr) {
    if (!sizeAttr.value || sizeAttr.value.type !== 'GlimmerTextNode') {
      // Dynamic `size` — can't tell whether implicit role is combobox or
      // listbox, so bail out instead of risking a false positive.
      return 'unknown';
    }
    const sizeValue = Number(sizeAttr.value.chars);
    if (Number.isFinite(sizeValue) && sizeValue > 1) {
      return 'listbox';
    }
  }
  return 'combobox';
}

// Mapping of roles to their corresponding HTML elements
// From https://www.w3.org/TR/html-aria/
const ROLE_TO_ELEMENTS = {
  article: ['article'],
  banner: ['header'],
  button: ['button'],
  cell: ['td'],
  checkbox: ['input'],
  // <select> is a combobox by default per HTML-AAM (section 4). When
  // `multiple` is present or `size > 1`, it maps to "listbox" instead;
  // that case is handled at the call site via getSelectImplicitRole.
  combobox: ['select'],
  columnheader: ['th'],
  complementary: ['aside'],
  contentinfo: ['footer'],
  definition: ['dd'],
  dialog: ['dialog'],
  document: ['body'],
  figure: ['figure'],
  form: ['form'],
  grid: ['table'],
  gridcell: ['td'],
  group: ['details', 'fieldset', 'optgroup'],
  heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  img: ['img'],
  link: ['a'],
  list: ['ol', 'ul'],
  listbox: ['select'],
  listitem: ['li'],
  main: ['main'],
  navigation: ['nav'],
  option: ['option'],
  radio: ['input'],
  region: ['section'],
  row: ['tr'],
  rowgroup: ['tbody', 'tfoot', 'thead'],
  rowheader: ['th'],
  search: ['search'],
  searchbox: ['input'],
  separator: ['hr'],
  slider: ['input'],
  spinbutton: ['input'],
  status: ['output'],
  table: ['table'],
  term: ['dfn', 'dt'],
  textbox: ['input', 'textarea'],
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow redundant role attributes',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-role.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          checkAllHTMLElements: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {},
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-redundant-role.js',
      docs: 'docs/rule/no-redundant-role.md',
      tests: 'test/unit/rules/no-redundant-role-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    return {
      GlimmerElementNode(node) {
        const roleAttr = node.attributes?.find((attr) => attr.name === 'role');

        if (!roleAttr) {
          return;
        }

        let roleValue;
        if (roleAttr.value && roleAttr.value.type === 'GlimmerTextNode') {
          // ARIA role tokens are compared ASCII-case-insensitively, and the
          // attribute is a space-separated fallback list — only the first
          // supported token is honored as the effective role.
          const firstToken = (roleAttr.value.chars || '').trim().toLowerCase().split(/\s+/u)[0];
          if (!firstToken) {
            return;
          }
          roleValue = firstToken;
        } else {
          // Skip dynamic role values
          return;
        }

        const isLandmarkRole = LANDMARK_ROLES.has(roleValue);
        if (!config.checkAllHTMLElements && !isLandmarkRole) {
          return;
        }

        const elementsWithRole = ROLE_TO_ELEMENTS[roleValue];
        if (!elementsWithRole) {
          return;
        }

        // <select role="combobox"> is only redundant when <select>'s implicit
        // role actually is "combobox" (no `multiple`, and `size` absent or <= 1).
        // Otherwise the implicit role is "listbox", so the explicit "combobox"
        // is not redundant and this rule should not flag it. When `size` is
        // dynamic we bail ('unknown') rather than risk a false positive.
        if (node.tag === 'select' && roleValue === 'combobox') {
          const implicit = getSelectImplicitRole(node);
          if (implicit !== 'combobox') {
            return;
          }
        }

        const isRedundant =
          elementsWithRole.includes(node.tag) &&
          !ALLOWED_ELEMENT_ROLES.some((e) => e.name === node.tag && e.role === roleValue);

        if (isRedundant) {
          const errorMessage = isLandmarkRole
            ? createErrorMessageLandmarkElement(node.tag, roleValue)
            : createErrorMessageAnyElement(node.tag, roleValue);

          context.report({
            node,
            message: errorMessage,
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const elementText = sourceCode.getText(node);
              const roleAttrText = sourceCode.getText(roleAttr);

              // Find the role attribute in the element text and remove it along with preceding space
              const roleAttrPattern = new RegExp(
                `\\s+${roleAttrText.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&')}`
              );
              const fixedText = elementText.replace(roleAttrPattern, '');

              return fixer.replaceText(node, fixedText);
            },
          });
        }
      },
    };
  },
};
