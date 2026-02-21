// ARIA attribute type definitions per WAI-ARIA spec
const ARIA_ATTRIBUTE_TYPES = {
  'aria-activedescendant': { type: 'id' },
  'aria-atomic': { type: 'boolean' },
  'aria-autocomplete': { type: 'token', values: ['inline', 'list', 'both', 'none'] },
  'aria-busy': { type: 'boolean' },
  'aria-checked': { type: 'tristate', allowundefined: true },
  'aria-colcount': { type: 'integer' },
  'aria-colindex': { type: 'integer' },
  'aria-colspan': { type: 'integer' },
  'aria-controls': { type: 'idlist' },
  'aria-current': {
    type: 'token',
    values: ['page', 'step', 'location', 'date', 'time', 'true', 'false'],
  },
  'aria-describedby': { type: 'idlist' },
  'aria-details': { type: 'id' },
  'aria-disabled': { type: 'boolean' },
  'aria-dropeffect': {
    type: 'tokenlist',
    values: ['copy', 'execute', 'link', 'move', 'none', 'popup'],
  },
  'aria-errormessage': { type: 'id' },
  'aria-expanded': { type: 'boolean', allowundefined: true },
  'aria-flowto': { type: 'idlist' },
  'aria-grabbed': { type: 'boolean', allowundefined: true },
  'aria-haspopup': {
    type: 'token',
    values: ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
  },
  'aria-hidden': { type: 'boolean', allowundefined: true },
  'aria-invalid': { type: 'token', values: ['grammar', 'false', 'spelling', 'true'] },
  'aria-keyshortcuts': { type: 'string' },
  'aria-label': { type: 'string' },
  'aria-labelledby': { type: 'idlist' },
  'aria-level': { type: 'integer' },
  'aria-live': { type: 'token', values: ['assertive', 'off', 'polite'] },
  'aria-modal': { type: 'boolean' },
  'aria-multiline': { type: 'boolean' },
  'aria-multiselectable': { type: 'boolean' },
  'aria-orientation': { type: 'token', values: ['horizontal', 'vertical', 'undefined'] },
  'aria-owns': { type: 'idlist' },
  'aria-placeholder': { type: 'string' },
  'aria-posinset': { type: 'integer' },
  'aria-pressed': { type: 'tristate', allowundefined: true },
  'aria-readonly': { type: 'boolean' },
  'aria-relevant': { type: 'tokenlist', values: ['additions', 'all', 'removals', 'text'] },
  'aria-required': { type: 'boolean' },
  'aria-roledescription': { type: 'string' },
  'aria-rowcount': { type: 'integer' },
  'aria-rowindex': { type: 'integer' },
  'aria-rowspan': { type: 'integer' },
  'aria-selected': { type: 'boolean', allowundefined: true },
  'aria-setsize': { type: 'integer' },
  'aria-sort': { type: 'token', values: ['ascending', 'descending', 'none', 'other'] },
  'aria-valuemax': { type: 'number' },
  'aria-valuemin': { type: 'number' },
  'aria-valuenow': { type: 'number' },
  'aria-valuetext': { type: 'string' },
};

const validAriaAttributes = new Set(Object.keys(ARIA_ATTRIBUTE_TYPES));

function isBoolean(value) {
  return value === 'true' || value === 'false';
}

function isNumeric(value) {
  if (typeof value !== 'string' || value === '') return false;
  return !Number.isNaN(Number(value));
}

function isValidAriaValue(attrName, value) {
  const attrDef = ARIA_ATTRIBUTE_TYPES[attrName];
  if (!attrDef) return true;

  if (value === 'undefined') {
    return !!attrDef.allowundefined;
  }

  switch (attrDef.type) {
    case 'boolean':
      return isBoolean(value);
    case 'tristate':
      return isBoolean(value) || value === 'mixed';
    case 'string':
      return typeof value === 'string';
    case 'id':
      return typeof value === 'string' && !isBoolean(value);
    case 'idlist':
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => token.length > 0 && !isBoolean(token))
      );
    case 'integer':
      return /^-?\d+$/.test(value);
    case 'number':
      return isNumeric(value) && !isBoolean(value);
    case 'token':
      return attrDef.values.includes(value);
    case 'tokenlist':
      return value.split(' ').every((token) => attrDef.values.includes(token.toLowerCase()));
    default:
      return true;
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid aria-* attributes',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-aria-attributes.md',
    },
    schema: [],
    messages: {
      noInvalidAriaAttribute: 'Invalid ARIA attribute: {{attribute}}',
      invalidAriaAttributeValue:
        'Invalid value for ARIA attribute {{attribute}}.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (!node.name.startsWith('aria-')) {
          return;
        }

        // Check for unknown ARIA attribute
        if (!validAriaAttributes.has(node.name)) {
          context.report({
            node,
            messageId: 'noInvalidAriaAttribute',
            data: { attribute: node.name },
          });
          return;
        }

        // Skip value validation for dynamic values (MustacheStatement, ConcatStatement)
        if (
          !node.value ||
          node.value.type === 'GlimmerMustacheStatement' ||
          node.value.type === 'GlimmerConcatStatement'
        ) {
          return;
        }

        // Validate value for text node values
        if (node.value.type === 'GlimmerTextNode') {
          const value = node.value.chars;
          if (!isValidAriaValue(node.name, value)) {
            context.report({
              node,
              messageId: 'invalidAriaAttributeValue',
              data: { attribute: node.name },
            });
          }
        }
      },
    };
  },
};
