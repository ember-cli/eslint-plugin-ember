'use strict';

// Logic adapted from html-validate (MIT), Copyright 2017 David Sveningsson.
//
// Grammar-only validation. We check token identity, order, and combinations
// that the HTML spec MUSTs (single field name, token order, contact-tokens
// paired with contact-group field names, disallowed input types). We do NOT
// port html-validate's field-name-to-input-type control-group cross-check
// (e.g. flagging `current-password` on `type="text"`). Rationale: the HTML
// spec describes the autofill field name control groups descriptively — it
// does not prohibit mismatched pairings with a MUST/MUST NOT. UA and
// password-manager behavior varies, so the combination is a grammar-valid
// author choice whose UA-visibility is a UX question, not a spec violation.
// Two peers (jsx-a11y, lit-a11y) also omit the check by delegating to
// axe-core's `autocomplete-valid`, which corroborates the decision but is
// not its justification.

const FIELD_NAMES_NO_CONTACT = new Set([
  'name',
  'honorific-prefix',
  'given-name',
  'additional-name',
  'family-name',
  'honorific-suffix',
  'nickname',
  'username',
  'new-password',
  'current-password',
  'one-time-code',
  'organization-title',
  'organization',
  'street-address',
  'address-line1',
  'address-line2',
  'address-line3',
  'address-level4',
  'address-level3',
  'address-level2',
  'address-level1',
  'country',
  'country-name',
  'postal-code',
  'cc-name',
  'cc-given-name',
  'cc-additional-name',
  'cc-family-name',
  'cc-number',
  'cc-exp',
  'cc-exp-month',
  'cc-exp-year',
  'cc-csc',
  'cc-type',
  'transaction-currency',
  'transaction-amount',
  'language',
  'bday',
  'bday-day',
  'bday-month',
  'bday-year',
  'sex',
  'url',
  'photo',
]);

const FIELD_NAMES_WITH_CONTACT = new Set([
  'tel',
  'tel-country-code',
  'tel-national',
  'tel-area-code',
  'tel-local',
  'tel-local-prefix',
  'tel-local-suffix',
  'tel-extension',
  'email',
  'impp',
]);

const DISALLOWED_INPUT_TYPES = new Set([
  'checkbox',
  'radio',
  'file',
  'submit',
  'image',
  'reset',
  'button',
]);

const EXPECTED_ORDER = ['section', 'hint', 'contact', 'field1', 'field2', 'webauthn'];
const CONTACT_TOKENS = new Set(['home', 'work', 'mobile', 'fax', 'pager']);

function classifyToken(token) {
  // Per the HTML autofill spec, `section-*` requires at least one character
  // after the hyphen (the identifier). Bare `section-` is not a valid token.
  if (/^section-.+/.test(token)) {
    return 'section';
  }
  if (token === 'shipping' || token === 'billing') {
    return 'hint';
  }
  if (FIELD_NAMES_NO_CONTACT.has(token)) {
    return 'field1';
  }
  if (FIELD_NAMES_WITH_CONTACT.has(token)) {
    return 'field2';
  }
  if (CONTACT_TOKENS.has(token)) {
    return 'contact';
  }
  if (token === 'webauthn') {
    return 'webauthn';
  }
  return null;
}

function findAttr(node, name) {
  return node.attributes?.find((a) => a.name === name);
}

function getStaticAttrString(node, name) {
  const attr = findAttr(node, name);
  if (!attr || !attr.value || attr.value.type !== 'GlimmerTextNode') {
    return null;
  }
  return attr.value.chars;
}

function getInputType(node) {
  const t = getStaticAttrString(node, 'type');
  if (t === null) {
    return node.tag === 'input' ? 'text' : null;
  }
  return t.toLowerCase();
}

function tokenize(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

// Enforce multiplicity/mutual-exclusion rules per HTML §4.10.19.9. The
// autofill grammar permits at most one token from each of:
//   - `section-*` prefix
//   - hint group (`shipping` XOR `billing` — both map to `kind: 'hint'`)
//   - contact modifier (`home` | `work` | `mobile` | `fax` | `pager`)
//   - `webauthn`
// Returns `{ messageId, data }` on the first violation found, or `null`.
function checkMultiplicity(order) {
  const counts = { section: 0, hint: 0, contact: 0, webauthn: 0 };
  const contactTokens = [];
  for (const { tok, kind } of order) {
    if (kind === 'section' || kind === 'hint' || kind === 'webauthn') {
      counts[kind]++;
    } else if (kind === 'contact') {
      counts.contact++;
      contactTokens.push(tok);
    }
  }
  if (counts.section > 1) {
    return { messageId: 'duplicateSection', data: {} };
  }
  if (counts.hint > 1) {
    return { messageId: 'duplicateHint', data: {} };
  }
  if (counts.contact > 1) {
    // Report the second contact token (authors usually fix the one that came
    // "extra"; the first is the intended one).
    return { messageId: 'duplicateContact', data: { token: contactTokens[1] } };
  }
  if (counts.webauthn > 1) {
    return { messageId: 'duplicateWebauthn', data: {} };
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require autocomplete attribute values to match the HTML autofill grammar',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-valid-autocomplete.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      formValue: '`<form autocomplete>` can only be `"on"` or `"off"` (got `"{{value}}"`)',
      hiddenOnOff: '`<input type="hidden">` cannot use the autocomplete value `"{{value}}"`',
      disallowedType: '`autocomplete` cannot be used on `<input type="{{type}}">`',
      onOffCombine: '`"{{value}}"` cannot be combined with other autocomplete tokens',
      invalidToken: '`"{{token}}"` is not a valid autocomplete token or field name',
      missingField: '`autocomplete` attribute is missing a field name',
      multipleFields: 'autocomplete attribute must contain exactly one field name',
      contactMismatch: '`"{{contact}}"` cannot be combined with field name `"{{field}}"`',
      order: '`"{{second}}"` must appear before `"{{first}}"` in autocomplete',
      duplicateSection: 'autocomplete can contain at most one `section-*` token',
      duplicateHint:
        '`"shipping"` and `"billing"` are mutually exclusive and each may appear at most once',
      duplicateContact:
        '`"{{token}}"` cannot be combined with another contact modifier — autocomplete allows at most one of `home`, `work`, `mobile`, `fax`, `pager`',
      duplicateWebauthn: '`"webauthn"` may appear at most once in autocomplete',
    },
  },

  create(context) {
    function report(attr, messageId, data) {
      context.report({ node: attr, messageId, data });
    }

    function validateControl(node, attr, value) {
      const type = getInputType(node) ?? 'text';

      if (node.tag === 'input' && DISALLOWED_INPUT_TYPES.has(type)) {
        report(attr, 'disallowedType', { type });
        return;
      }

      const tokens = tokenize(value);
      // Empty or whitespace-only autocomplete is an authoring mistake — the
      // attribute communicates nothing and isn't a valid value per HTML
      // §4.10.19. Flag via `missingField` since the remedy is to add a
      // field name (or remove the attribute entirely).
      if (tokens.length === 0) {
        report(attr, 'missingField', {});
        return;
      }

      const onOffIdx = tokens.findIndex((t) => t === 'on' || t === 'off');
      if (onOffIdx !== -1) {
        const token = tokens[onOffIdx];
        if (tokens.length > 1) {
          report(attr, 'onOffCombine', { value: token });
        }
        if (node.tag === 'input' && type === 'hidden') {
          report(attr, 'hiddenOnOff', { value: token });
        }
        return;
      }

      const order = [];
      for (const tok of tokens) {
        const kind = classifyToken(tok);
        if (!kind) {
          report(attr, 'invalidToken', { token: tok });
          return;
        }
        order.push({ tok, kind });
      }

      // Multiplicity constraints — each non-field token class may appear at
      // most once, and `shipping`/`billing` are mutually exclusive.
      const multiplicityError = checkMultiplicity(order);
      if (multiplicityError) {
        report(attr, multiplicityError.messageId, multiplicityError.data);
        return;
      }

      // Field presence.
      const fieldIndices = order
        .map((o, i) => (o.kind === 'field1' || o.kind === 'field2' ? i : -1))
        .filter((i) => i !== -1);

      if (fieldIndices.length === 0) {
        report(attr, 'missingField', {});
        return;
      }
      if (fieldIndices.length > 1) {
        report(attr, 'multipleFields', {});
        return;
      }

      // Contact can only pair with field2.
      const fieldIdx = fieldIndices[0];
      const field = order[fieldIdx];
      const contactIdx = order.findIndex((o) => o.kind === 'contact');
      if (contactIdx !== -1 && field.kind === 'field1') {
        report(attr, 'contactMismatch', { contact: order[contactIdx].tok, field: field.tok });
        return;
      }

      // Order validation.
      const expectedIdx = order.map((o) => EXPECTED_ORDER.indexOf(o.kind));
      for (let i = 0; i < expectedIdx.length - 1; i++) {
        if (expectedIdx[i] > expectedIdx[i + 1]) {
          report(attr, 'order', { first: order[i].tok, second: order[i + 1].tok });
          return;
        }
      }

      // Deliberately NOT validating field-name-vs-input-type compatibility
      // (e.g. `current-password` on `<input type="text">`). axe-core doesn't
      // check this either, and the HTML autofill mapping has enough
      // real-world variance that flagging here would over-trigger.
    }

    function validateForm(node, attr, value) {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === 'on' || trimmed === 'off') {
        return;
      }
      report(attr, 'formValue', { value: trimmed });
    }

    return {
      GlimmerElementNode(node) {
        const attr = findAttr(node, 'autocomplete');
        if (!attr) {
          return;
        }
        if (attr.value && attr.value.type !== 'GlimmerTextNode') {
          return;
        }
        const value = attr.value ? attr.value.chars : '';
        // Empty/whitespace values drop through to validateForm/validateControl
        // — `<form autocomplete="">` flags as a non-on/off value, and
        // `<input autocomplete="">` flags as a missing field name. Both are
        // authoring mistakes the rule should surface.

        if (node.tag === 'form') {
          validateForm(node, attr, value);
          return;
        }
        if (node.tag === 'input' || node.tag === 'textarea' || node.tag === 'select') {
          validateControl(node, attr, value);
        }
      },
    };
  },
};
