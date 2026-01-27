const fixMap = {
  acceptCharset: 'accept-charset',
  srcSet: 'srcset',
  accessKey: 'accesskey',
  allowFullScreen: 'allowfullscreen',
  allowTransparency: 'allowtransparency',
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  autoPlay: 'autoplay',
  cellPadding: 'cellpadding',
  cellSpacing: 'cellspacing',
  charSet: 'charset',
  className: 'class',
  contentEditable: 'contenteditable',
  contextMenu: 'contextmenu',
  crossOrigin: 'crossorigin',
  dateTime: 'datetime',
  encType: 'enctype',
  formAction: 'formaction',
  formEncType: 'formenctype',
  formMethod: 'formmethod',
  formNoValidate: 'formnovalidate',
  formTarget: 'formtarget',
  frameBorder: 'frameborder',
  httpEquiv: 'http-equiv',
  inputMode: 'inputmode',
  keyType: 'keytype',
  noValidate: 'novalidate',
  marginHeight: 'marginheight',
  marginWidth: 'marginwidth',
  maxLength: 'maxlength',
  minLength: 'minlength',
  radioGroup: 'radiogroup',
  readOnly: 'readonly',
  rowSpan: 'rowspan',
  colSpan: 'colspan',
  spellCheck: 'spellcheck',
  srcDoc: 'srcdoc',
  tabIndex: 'tabindex',
  useMap: 'usemap',
};

const camelCaseAttributes = Object.keys(fixMap);

function getMessage(name) {
  if (name === 'className') {
    return `Attribute, ${name}, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.`;
  }

  return `Incorrect html attribute name detected - "${name}", is probably unintended. Attributes in HTML are kebeb case.`;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow JSX-style camelCase attributes',
      category: 'Possible Errors',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-jsx-attributes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {},
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        const key = node.name;
        const isJSXProbably = camelCaseAttributes.includes(key);

        if (!isJSXProbably) {
          return;
        }

        context.report({
          node,
          message: getMessage(key),
          fix: fixMap[key]
            ? (fixer) => {
                const sourceCode = context.getSourceCode();
                const text = sourceCode.getText(node);
                const valueMatch = text.match(/^[^=]+(=.*)?$/);
                const value = valueMatch && valueMatch[1] ? valueMatch[1] : '';
                return fixer.replaceText(node, `${fixMap[key]}${value}`);
              }
            : null,
        });
      },
    };
  },
};
