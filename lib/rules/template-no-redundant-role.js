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

// Mapping of roles to their corresponding HTML elements
// From https://www.w3.org/TR/html-aria/
const ROLE_TO_ELEMENTS = {
  article: ['article'],
  banner: ['header'],
  button: ['button'],
  cell: ['td'],
  checkbox: ['input'],
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
      recommended: true,
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-role.md',
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
          roleValue = roleAttr.value.chars || '';
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
              const sourceCode = context.getSourceCode();
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
