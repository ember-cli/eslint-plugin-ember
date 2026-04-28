const { roles } = require('aria-query');
const { LANDMARK_ROLES } = require('../utils/landmark-roles');

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
// dynamic `multiple` or `size` value blocks a decision. Callers should skip
// flagging on 'unknown' to avoid false positives.
function getSelectImplicitRole(node) {
  const attrs = node.attributes || [];
  const multipleAttr = attrs.find((a) => a.name === 'multiple');
  if (multipleAttr) {
    // Valueless `multiple` or static string value — statically present.
    if (!multipleAttr.value || multipleAttr.value.type === 'GlimmerTextNode') {
      return 'listbox';
    }
    // Dynamic `multiple={{...}}` — Ember omits bound boolean attributes at
    // runtime when the value is falsy, so we can't tell statically whether
    // the implicit role is combobox or listbox.
    return 'unknown';
  }
  const sizeAttr = attrs.find((a) => a.name === 'size');
  if (sizeAttr) {
    // Valueless `size` (e.g. `<select size>`) — per HTML boolean-attr
    // semantics the attribute value is an empty string, which Number()
    // parses as 0. Per HTML's default size (>1 → listbox), 0 leaves the
    // implicit role as combobox. Treat the same as the static-0 case.
    if (!sizeAttr.value) {
      return 'combobox';
    }
    if (sizeAttr.value.type !== 'GlimmerTextNode') {
      // Dynamic `size={{...}}` / concat — can't tell whether the runtime
      // value is >1 or not, so bail out instead of risking a false positive.
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
  // `region` is intentionally NOT mapped to `<section>` here. `<section>`
  // only gets the `region` landmark role when it has an accessible name
  // (aria-label / aria-labelledby / title); without one it has role
  // `generic`. A static linter cannot verify accessible-name presence.
  // Spec: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/HTML5.html
  // See #2694 where the same reasoning was applied to template-no-nested-landmark.
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
          // attribute is a space-separated fallback list. Per WAI-ARIA §4.1,
          // UAs walk tokens for the first role they RECOGNISE — unknown
          // leading tokens are skipped, subsequent tokens are author-provided
          // fallbacks. `role="xxyxyz button"` resolves to `button`;
          // `role="tab button"` resolves to `tab` (recognised first, even
          // though no implicit mapping — this rule then has nothing to flag).
          const tokens = (roleAttr.value.chars || '').trim().toLowerCase().split(/\s+/u);
          const firstRecognised = tokens.find((t) => t && roles.has(t));
          if (!firstRecognised) {
            return;
          }
          roleValue = firstRecognised;
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
          // Role is recognised by ARIA but has no implicit-element mapping
          // in this table — nothing can be redundant.
          return;
        }

        // <select>'s implicit role depends on attributes (HTML-AAM):
        //   - default (no `multiple`, `size` absent or <= 1) → "combobox"
        //   - `multiple` or `size` > 1                        → "listbox"
        // A role attribute is only redundant when it matches the element's
        // computed implicit role. Guard both combobox and listbox against
        // the opposite configuration, and bail when `size` is dynamic
        // ('unknown') rather than risk a false positive.
        if (node.tag === 'select' && (roleValue === 'combobox' || roleValue === 'listbox')) {
          const implicit = getSelectImplicitRole(node);
          if (implicit !== roleValue) {
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
