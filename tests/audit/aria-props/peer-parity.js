// Audit fixture — translated test cases from peer plugins to measure
// behavioral parity of `ember/template-no-invalid-aria-attributes` against
// jsx-a11y/aria-props, vuejs-accessibility/aria-props, angular-eslint/valid-aria,
// and lit-a11y/aria-attrs.
//
// These tests are NOT part of the main suite and do not run in CI. They encode
// the CURRENT behavior of our rule so that running this file reports pass.
// Each divergence from an upstream plugin is annotated as "DIVERGENCE —".
//
// Scope notes:
//   - jsx-a11y/aria-props, vue-a11y/aria-props, lit-a11y/aria-attrs only
//     validate ARIA attribute NAMES (typo detection). Value validation lives
//     in sibling rules (jsx-a11y/aria-proptypes, lit-a11y/aria-attr-valid-value).
//   - angular-eslint/valid-aria validates BOTH names and values in a single
//     rule, same shape as our `template-no-invalid-aria-attributes`.
//   - Our rule validates both names AND values per aria-query, mirroring
//     ember-template-lint's upstream `no-invalid-aria-attributes`.
//
// Source files (context/ checkouts):
//   - eslint-plugin-jsx-a11y-main/__tests__/src/rules/aria-props-test.js
//   - eslint-plugin-vuejs-accessibility-main/src/rules/__tests__/aria-props.test.ts
//   - angular-eslint-main/packages/eslint-plugin-template/tests/rules/valid-aria/{spec,cases}.ts
//   - eslint-plugin-lit-a11y/tests/lib/rules/aria-attrs.js

'use strict';

const rule = require('../../../lib/rules/template-no-invalid-aria-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:aria-props (gts)', rule, {
  valid: [
    // === Upstream parity: base cases (valid in all peers and us) ===
    // jsx-a11y: `<div />`, `<div></div>` — no aria attribute at all.
    '<template><div /></template>',
    '<template><div></div></template>',

    // jsx-a11y: `<div aria="wee"></div>` — attribute name does not start
    // with `aria-` (it's literally `aria`), so it is ignored.
    '<template><div aria="wee"></div></template>',

    // jsx-a11y: `<div abcARIAdef="true"></div>` — does not start with aria-.
    '<template><div abcARIAdef="true"></div></template>',

    // jsx-a11y: `<div fooaria-foobar="true"></div>` — does not start with aria-
    // (our check is startsWith('aria-')), so skipped.
    '<template><div fooaria-foobar="true"></div></template>',
    '<template><div fooaria-hidden="true"></div></template>',

    // jsx-a11y: `<Bar baz />` — capitalized component tag, attribute is not
    // aria-*. We also skip.
    '<template><Bar @baz={{true}} /></template>',

    // jsx-a11y: `<input type="text" aria-errormessage="foobar" />`.
    // aria-errormessage is valid per aria-query; we don't validate that the
    // referenced ID exists, matching jsx-a11y.
    '<template><input type="text" aria-errormessage="foobar" /></template>',

    // jsx-a11y basicValidityTests — a sample of known aria-* attributes used
    // with a placeholder string value. jsx-a11y generates one per ARIA attr
    // from aria-query; we sample rather than enumerating all of them.
    '<template><div aria-label="foobar" /></template>',
    '<template><div aria-labelledby="foobar" /></template>',
    '<template><div aria-describedby="foobar" /></template>',
    '<template><div aria-hidden="true" /></template>',
    '<template><div aria-disabled="false" /></template>',
    '<template><div aria-live="polite" /></template>',
    '<template><div aria-atomic="true" /></template>',
    '<template><div aria-busy="true" /></template>',
    '<template><div aria-controls="foobar" /></template>',
    '<template><div aria-current="page" /></template>',
    '<template><div aria-details="foobar" /></template>',
    '<template><div aria-dropeffect="copy" /></template>',
    '<template><div aria-flowto="foobar" /></template>',
    '<template><div aria-grabbed="true" /></template>',
    '<template><div aria-keyshortcuts="Ctrl+K" /></template>',
    '<template><div aria-owns="foobar" /></template>',
    '<template><div aria-relevant="text" /></template>',
    '<template><div aria-roledescription="widget" /></template>',

    // vue-a11y: `<input aria-labelledby='address' />`.
    '<template><input aria-labelledby="address" /></template>',

    // lit-a11y: `html\`<div aria-labelledby='foo'></div>\``.
    '<template><div aria-labelledby="foo"></div></template>',

    // === angular-eslint parity — valid name cases ===
    // Angular: `<input aria-labelledby="Text">`.
    '<template><input aria-labelledby="Text" /></template>',

    // Angular: `<div ariaselected="0"></div>` — attribute does not start with
    // `aria-` (no hyphen after `aria`), so it is ignored. Same for us.
    '<template><div ariaselected="0"></div></template>',

    // Angular: `<button [variant]="variant">Text</button>` — not an aria-*
    // attribute; our rule does not apply.
    '<template><button variant={{this.variant}}>Text</button></template>',

    // Angular: valid value cases — our rule accepts the same values.
    '<template><div aria-expanded="true">aria-expanded</div></template>',
    '<template><div aria-haspopup="menu">aria-haspopup</div></template>',
    '<template><table aria-rowcount="-1"></table></template>',
    '<template><div aria-relevant="additions">additions</div></template>',
    '<template><div aria-checked="false">checked</div></template>',
    '<template><div role="slider" aria-valuemin="1"></div></template>',
    '<template><div aria-checked="mixed">checked</div></template>',
    '<template><div aria-pressed="mixed">checked</div></template>',

    // Angular: `aria-placeholder="Placeholder"` alone is valid.
    '<template><input aria-placeholder="Placeholder" /></template>',

    // === DIVERGENCE — `aria-orientation="undefined"` ===
    // Angular: VALID. aria-query defines aria-orientation as a token type with
    // values ["vertical", "undefined", "horizontal"], so `"undefined"` is a
    // legitimate token value.
    // Our rule: INVALID. Our rule short-circuits on `value === 'undefined'` by
    // checking `attrDef.allowundefined` before consulting the token list, and
    // aria-orientation does not set `allowundefined`. This is a latent bug in
    // our rule; captured in the invalid block below to reflect current behavior.

    // Dynamic values — peers and we all skip value validation when the value
    // is an expression. Angular uses `[attr.aria-*]`, we use `{{...}}`.
    '<template><textarea aria-readonly={{this.readonly}} /></template>',
    '<template><div aria-pressed={{undefined}}>aria-pressed</div></template>',
    '<template><input aria-rowcount={{2}} /></template>',
    '<template><div role="slider" aria-valuemin={{1}}></div></template>',
    '<template><div aria-checked={{this.test}} aria-hidden={{this.hiddenFlag}}></div></template>',
    '<template><div aria-invalid={{if this.hasError "grammar" "spelling"}}></div></template>',

    // === DIVERGENCE — Angular: `<div aria-="text">` is VALID ===
    // Angular's valid-aria does not flag `aria-` (the bare `aria-` prefix with
    // nothing after). jsx-a11y FLAGS it (invalid case below). Our rule: also
    // FLAGS it, because aria-query does not know `aria-`. See invalid section
    // for where we align with jsx-a11y against Angular here.

    // === Parity — custom elements (hyphenated tags) skipped ===
    // Angular's valid-aria skips tags with a hyphen because their a11y
    //   contract depends on the component's shadow-DOM-mapped role, which
    //   ESLint cannot introspect. Our rule now skips the check when the
    //   tag name matches the custom-element pattern (lowercase + hyphen).
    '<template><app-custom aria-x="text">Text</app-custom></template>',
    '<template><app-test aria-expanded="notABoolean"></app-test></template>',
    // jsx-a11y does NOT skip custom elements (no equivalent concept in JSX);
    //   it would flag both of the above.
  ],

  invalid: [
    // === Upstream parity: invalid aria-* NAMES ===
    // jsx-a11y: `<div aria-="foobar" />`.
    {
      code: '<template><div aria-="foobar" /></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-' } }],
    },
    // jsx-a11y: `<div aria-labeledby="foobar" />` (common typo: missing "l").
    {
      code: '<template><div aria-labeledby="foobar" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-labeledby' },
        },
      ],
    },
    // jsx-a11y: `<div aria-skldjfaria-klajsd="foobar" />` — random gibberish.
    {
      code: '<template><div aria-skldjfaria-klajsd="foobar" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-skldjfaria-klajsd' },
        },
      ],
    },

    // vue-a11y: `<input aria-test='address' />`.
    {
      code: '<template><input aria-test="address" /></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-test' } }],
    },

    // lit-a11y: `html\`<div aria-foo=''></div>\``.
    {
      code: '<template><div aria-foo=""></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-foo' } }],
    },

    // angular-eslint: three typos in one template (aria-roledescriptio,
    // aria-labelby, aria-requiredIf). We split them into one case each.
    {
      code: '<template><div aria-roledescriptio="text">Text</div></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-roledescriptio' },
        },
      ],
    },
    {
      code: '<template><input aria-labelby="label" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-labelby' },
        },
      ],
    },
    // DIVERGENCE — Angular lower-cases via parser before matching aria-query,
    // so it reports `aria-requiredIf` as unknown. Our rule uses the raw
    // attribute name; `aria-requiredIf` is not in aria-query, so we also flag.
    // Outcome matches; the message just echoes the raw name.
    {
      code: '<template><input aria-requiredIf={{this.required}} /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-requiredIf' },
        },
      ],
    },

    // angular-eslint: `<INPUT [aria-labelby]="label">` — uppercase tag.
    // We process all tags the same; our rule flags. Parity.
    {
      code: '<template><INPUT aria-labelby={{this.label}} /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-labelby' },
        },
      ],
    },

    // === Upstream parity: invalid aria-* VALUES (Angular only) ===
    // jsx-a11y/lit-a11y/vue-a11y's aria-props rule does NOT validate values;
    // that's aria-proptypes / aria-attr-valid-value. angular-eslint's
    // valid-aria does validate values, and our rule matches its behavior.

    // Angular: `aria-expanded="notABoolean"` (boolean type).
    {
      code: '<template><div aria-expanded="notABoolean">notABoolean</div></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-expanded',
            expectedType: 'a boolean.',
          },
        },
      ],
    },

    // Angular: `aria-haspopup="notAToken"` (token type).
    {
      code: '<template><div aria-haspopup="notAToken">notAToken</div></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-haspopup',
            expectedType:
              'a single token from the following: false, true, menu, listbox, tree, grid, dialog.',
          },
        },
      ],
    },

    // Angular: `aria-relevant="notATokenList"` (tokenlist type).
    {
      code: '<template><div aria-relevant="notATokenList">notATokenList</div></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-relevant',
            expectedType:
              'a list of one or more tokens from the following: additions, all, removals, text.',
          },
        },
      ],
    },

    // Angular: `aria-checked="notATristate"` (tristate type).
    {
      code: '<template><div aria-checked="notATristate">notATristate</div></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-checked',
            expectedType: 'a boolean or the string "mixed".',
          },
        },
      ],
    },

    // === DIVERGENCE — integer/number/placeholder validation on static strings ===
    // Angular's test for `[attr.aria-rowcount]="{ a: 2 }"` is about a
    // dynamic expression that evaluates to a non-integer. In our rule,
    // dynamic values ({{...}}) are always skipped, so the analogous template
    // would pass. BUT we DO flag static non-integer strings. So we translate
    // Angular's intent to a static-value form here to capture our coverage.
    {
      code: '<template><input aria-rowcount="notAnInteger" /></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: { attribute: 'aria-rowcount', expectedType: 'an integer.' },
        },
      ],
    },
    {
      code: '<template><div role="slider" aria-valuemin="notANumber"></div></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: { attribute: 'aria-valuemin', expectedType: 'a number.' },
        },
      ],
    },
    // DIVERGENCE — Angular flags `[attr.aria-placeholder]="4"` (non-string
    // expression on a string-typed attribute). In HBS, a static integer
    // literal written as the attribute value is just the string "4", which
    // IS a valid string → we do NOT flag. This reflects a genuine behavior
    // difference driven by HBS semantics (all static attr values are strings).
    // We instead express Angular's intent with a static boolean-as-string,
    // which our `string` type check also rejects via !isBoolean(value).
    {
      code: '<template><input aria-placeholder="true" /></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: { attribute: 'aria-placeholder', expectedType: 'a string.' },
        },
      ],
    },

    // DIVERGENCE — aria-orientation="undefined" (see valid block for rationale).
    // This is a latent bug in our rule, not intentional strictness, but we
    // record current behavior here.
    {
      code: '<template><input aria-orientation="undefined" /></template>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-orientation',
            expectedType: 'a single token from the following: vertical, undefined, horizontal.',
          },
        },
      ],
    },

  ],
});

// === DIVERGENCE — Angular: `<div aria-="text">` is VALID in Angular ===
// Isolated so the intent is clear. jsx-a11y flags `aria-` as invalid (we
// align with jsx-a11y); Angular does not (we diverge from Angular).
// AUDIT-SKIP: Angular-only divergence; already covered in the invalid block
// above as the jsx-a11y-parity case. No additional ruleTester.run needed.

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:aria-props (hbs)', rule, {
  valid: [
    // Base cases.
    '<div></div>',
    '<div aria="wee"></div>',
    '<div abcARIAdef="true"></div>',
    '<div fooaria-hidden="true"></div>',

    // Known aria-* attribute names (sample).
    '<div aria-label="foobar" />',
    '<div aria-labelledby="foo bar"></div>',
    '<input aria-errormessage="foobar" />',
    '<div aria-hidden="true" />',
    '<div aria-busy="false" />',
    '<div aria-current="page" />',

    // Known-good value types.
    '<div aria-expanded="true">Text</div>',
    '<div aria-haspopup="dialog">Text</div>',
    '<div aria-relevant="additions text">Text</div>',
    '<div aria-checked="mixed">Text</div>',
    '<table aria-rowcount="-1"></table>',

    // Dynamic values — value validation is skipped.
    '<div aria-expanded={{this.expanded}}></div>',
    '<div aria-hidden={{true}}></div>',
    '<div aria-label="{{@foo}} bar"></div>',

    // `aria-` is not in aria-query (jsx-a11y flags; Angular doesn't; we flag).
    // Captured in invalid block below.

    // `ariaselected` (no hyphen) — we skip.
    '<div ariaselected="0"></div>',

    // Parity — custom elements (hyphenated tags) are skipped.
    '<app-custom aria-x="text">Text</app-custom>',
    '<app-test aria-expanded="notABoolean"></app-test>',
  ],
  invalid: [
    // jsx-a11y + vue-a11y + lit-a11y + Angular: unknown aria-* names.
    {
      code: '<div aria-labeledby="foobar" />',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-labeledby' },
        },
      ],
    },
    {
      code: '<input aria-test="address" />',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-test' } }],
    },
    {
      code: '<div aria-foo=""></div>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-foo' } }],
    },
    {
      code: '<div aria-="foobar" />',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-' } }],
    },
    {
      code: '<div aria-roledescriptio="text">Text</div>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: 'aria-roledescriptio' },
        },
      ],
    },

    // Angular-parity value validation (we match).
    {
      code: '<div aria-expanded="notABoolean">Text</div>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: { attribute: 'aria-expanded', expectedType: 'a boolean.' },
        },
      ],
    },
    {
      code: '<div aria-haspopup="notAToken">Text</div>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-haspopup',
            expectedType:
              'a single token from the following: false, true, menu, listbox, tree, grid, dialog.',
          },
        },
      ],
    },
    {
      code: '<div aria-checked="notATristate">Text</div>',
      output: null,
      errors: [
        {
          messageId: 'invalidAriaAttributeValue',
          data: {
            attribute: 'aria-checked',
            expectedType: 'a boolean or the string "mixed".',
          },
        },
      ],
    },
  ],
});
