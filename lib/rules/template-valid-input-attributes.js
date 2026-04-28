'use strict';

const { isNativeElement } = require('../utils/is-native-element');

// Data table ported from html-validate input-attributes (MIT), Copyright 2017 David Sveningsson.
// https://html-validate.org/rules/input-attributes.html
const RESTRICTED = new Map([
  ['accept', new Set(['file'])],
  ['alt', new Set(['image'])],
  ['capture', new Set(['file'])],
  ['checked', new Set(['checkbox', 'radio'])],
  ['dirname', new Set(['text', 'search'])],
  ['height', new Set(['image'])],
  [
    'list',
    new Set([
      'text',
      'search',
      'url',
      'tel',
      'email',
      'date',
      'month',
      'week',
      'time',
      'datetime-local',
      'number',
      'range',
      'color',
    ]),
  ],
  ['max', new Set(['date', 'month', 'week', 'time', 'datetime-local', 'number', 'range'])],
  ['maxlength', new Set(['text', 'search', 'url', 'tel', 'email', 'password'])],
  ['min', new Set(['date', 'month', 'week', 'time', 'datetime-local', 'number', 'range'])],
  ['minlength', new Set(['text', 'search', 'url', 'tel', 'email', 'password'])],
  ['multiple', new Set(['email', 'file'])],
  ['pattern', new Set(['text', 'search', 'url', 'tel', 'email', 'password'])],
  ['placeholder', new Set(['text', 'search', 'url', 'tel', 'email', 'password', 'number'])],
  [
    'readonly',
    new Set([
      'text',
      'search',
      'url',
      'tel',
      'email',
      'password',
      'date',
      'month',
      'week',
      'time',
      'datetime-local',
      'number',
    ]),
  ],
  [
    'required',
    new Set([
      'text',
      'search',
      'url',
      'tel',
      'email',
      'password',
      'date',
      'month',
      'week',
      'time',
      'datetime-local',
      'number',
      'checkbox',
      'radio',
      'file',
    ]),
  ],
  ['size', new Set(['text', 'search', 'url', 'tel', 'email', 'password'])],
  ['src', new Set(['image'])],
  ['step', new Set(['date', 'month', 'week', 'time', 'datetime-local', 'number', 'range'])],
  ['width', new Set(['image'])],
]);

// Input types defined by the HTML spec. Per the spec, an <input> element with a
// missing, empty, or unknown `type` attribute falls back to the Text state, so
// we normalize to 'text' before validating attribute compatibility.
// https://html.spec.whatwg.org/multipage/input.html#attr-input-type
const KNOWN_INPUT_TYPES = new Set([
  'hidden',
  'text',
  'search',
  'tel',
  'url',
  'email',
  'password',
  'date',
  'month',
  'week',
  'time',
  'datetime-local',
  'number',
  'range',
  'color',
  'checkbox',
  'radio',
  'file',
  'submit',
  'image',
  'reset',
  'button',
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow input attributes that are incompatible with the declared type',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-valid-input-attributes.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      incompatible: 'Attribute `{{attr}}` is not allowed on `<input type="{{type}}">`',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'input') {
          return;
        }
        if (!isNativeElement(node, sourceCode)) {
          return;
        }
        // Per HTML §4.10.5, an <input> with missing, valueless, empty, or
        // unknown `type` falls back to the Text state. Only a DYNAMIC type
        // (mustache/concat with a non-literal path) is opaque to static
        // analysis — skip those. Each branch resolves directly to a known
        // type or to the spec-default 'text', avoiding an intermediate
        // sentinel.
        const typeAttr = node.attributes?.find((a) => a.name === 'type');
        let type;
        if (!typeAttr || !typeAttr.value) {
          // Missing attribute OR valueless `<input type />` — Text state.
          type = 'text';
        } else if (typeAttr.value.type === 'GlimmerTextNode') {
          const raw = typeAttr.value.chars.trim().toLowerCase();
          type = KNOWN_INPUT_TYPES.has(raw) ? raw : 'text';
        } else if (
          typeAttr.value.type === 'GlimmerMustacheStatement' &&
          typeAttr.value.path?.type === 'GlimmerStringLiteral'
        ) {
          const raw = typeAttr.value.path.value.trim().toLowerCase();
          type = KNOWN_INPUT_TYPES.has(raw) ? raw : 'text';
        } else {
          // Dynamic value — can't statically determine; skip.
          return;
        }

        for (const attr of node.attributes || []) {
          const validTypes = RESTRICTED.get(attr.name.toLowerCase());
          if (!validTypes) {
            continue;
          }
          if (validTypes.has(type)) {
            continue;
          }
          context.report({
            node: attr,
            messageId: 'incompatible',
            data: { attr: attr.name, type },
          });
        }
      },
    };
  },
};
