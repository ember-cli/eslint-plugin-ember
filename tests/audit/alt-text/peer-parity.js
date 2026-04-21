// Audit fixture — peer-plugin parity for `ember/template-require-valid-alt-text`.
// See docs/audit-a11y-behavior.md for the summary of divergences.
//
// Source files:
//   - context/eslint-plugin-jsx-a11y-main/__tests__/src/rules/alt-text-test.js
//   - context/eslint-plugin-vuejs-accessibility-main/src/rules/__tests__/alt-text.test.ts
//   - context/eslint-plugin-lit-a11y/tests/lib/rules/alt-text.js

'use strict';

const rule = require('../../../lib/rules/template-require-valid-alt-text');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('audit:alt-text (gts)', rule, {
  valid: [
    // === Upstream parity (valid in jsx-a11y + ours) ===
    '<template><img alt="foo" /></template>',
    '<template><img alt="" /></template>',
    '<template><img alt=" " /></template>',
    '<template><img alt="" role="presentation" /></template>',
    '<template><img alt="" role="none" /></template>',
    // DIVERGENCE — moved to invalid below:
    // '<template><img alt="this is lit..." role="presentation" /></template>',
    '<template><img alt={{@dynamicAlt}} /></template>',
    // object with label/children
    '<template><object aria-label="foo" /></template>',
    '<template><object aria-labelledby="id1" /></template>',
    '<template><object>Foo</object></template>',
    '<template><object title="An object" /></template>',
    // area with label
    '<template><area aria-label="foo" /></template>',
    '<template><area aria-labelledby="id1" /></template>',
    '<template><area alt="foo" /></template>',
    // input[type=image]
    '<template><input type="image" alt="foo" /></template>',
    '<template><input type="image" aria-label="foo" /></template>',
    '<template><input type="image" aria-labelledby="id1" /></template>',

    // === DIVERGENCE — aria-label/aria-labelledby on <img> without alt ===
    // jsx-a11y: VALID — `<img aria-label="foo" />` is accepted.
    // vue-a11y: VALID — same.
    // Our rule: INVALID — requires `alt` attribute on <img>, full stop.
    // Spec reading: the HTML spec mandates alt on <img>. WAI-ARIA accepts
    // aria-label/aria-labelledby as alternative accessible-name sources. The
    // two specs disagree; we side with HTML-strict.
    // No valid test here — we flag; see invalid section.

    // === Edge cases we handle ===
    // alt === src (we flag)
    // numeric alt (we flag)
    // redundant words (we flag)
  ],
  invalid: [
    // === Upstream parity (invalid in jsx-a11y + ours) ===
    {
      code: '<template><img /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><input type="image" /></template>',
      output: null,
      errors: [{ messageId: 'inputImage' }],
    },
    {
      code: '<template><object /></template>',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<template><area /></template>',
      output: null,
      errors: [{ messageId: 'areaMissing' }],
    },

    // === DIVERGENCE — <img aria-label> without alt ===
    // jsx-a11y: VALID. Ours: INVALID (imgMissing).
    // Behavior captured here; potential false positive per WAI-ARIA.
    {
      code: '<template><img aria-label="foo" /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img aria-labelledby="id1" /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },

    // === DIVERGENCE — non-empty alt with role=presentation on img ===
    // jsx-a11y: VALID — accepts `<img alt="this is lit..." role="presentation" />`.
    // Ours: INVALID — imgRolePresentation. We're spec-strict: if role is
    //   "none"/"presentation", the image is decorative and alt should be empty.
    {
      code: '<template><img alt="this is lit..." role="presentation" /></template>',
      output: null,
      errors: [{ messageId: 'imgRolePresentation' }],
    },

    // === Parity — empty-string aria-label/aria-labelledby ===
    // jsx-a11y / vuejs-accessibility flag empty-string fallbacks on the
    //   "accessible-name-required" elements (<object>, <area>, <input
    //   type=image>). Our rule now reuses the existing messageIds.
    {
      code: '<template><object aria-label="" /></template>',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<template><object aria-labelledby="" /></template>',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<template><area aria-label="" /></template>',
      output: null,
      errors: [{ messageId: 'areaMissing' }],
    },
    {
      code: '<template><area aria-labelledby="" /></template>',
      output: null,
      errors: [{ messageId: 'areaMissing' }],
    },
    {
      code: '<template><input type="image" aria-label="" /></template>',
      output: null,
      errors: [{ messageId: 'inputImage' }],
    },
    {
      code: '<template><input type="image" aria-labelledby="" /></template>',
      output: null,
      errors: [{ messageId: 'inputImage' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('audit:alt-text (hbs)', rule, {
  valid: [
    '<img alt="foo" />',
    '<img alt="" />',
    '<img alt="" role="presentation" />',
    '<object aria-label="foo" />',
    '<area aria-label="foo" />',
    '<input type="image" aria-label="foo" />',
  ],
  invalid: [
    {
      code: '<img />',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<input type="image" />',
      output: null,
      errors: [{ messageId: 'inputImage' }],
    },
    {
      code: '<object />',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<area />',
      output: null,
      errors: [{ messageId: 'areaMissing' }],
    },
    // DIVERGENCE captured — we flag img-with-aria-label (jsx-a11y/vue-a11y don't)
    {
      code: '<img aria-label="foo" />',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    // Parity — empty-string label on accessible-name-required elements.
    {
      code: '<object aria-label="" />',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
  ],
});
