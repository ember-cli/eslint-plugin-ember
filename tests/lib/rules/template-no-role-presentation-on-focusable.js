'use strict';

const rule = require('../../../lib/rules/template-no-role-presentation-on-focusable');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-role-presentation-on-focusable', rule, {
  valid: [
    // Presentation role on non-focusable elements — fine.
    '<template><div role="presentation"></div></template>',
    '<template><span role="none" class="spacer"></span></template>',
    '<template><div role="presentation" aria-hidden="true"></div></template>',

    // Focusable elements without presentation role — fine.
    '<template><button>Click me</button></template>',
    '<template><a href="/x">Link</a></template>',
    '<template><input type="text" /></template>',

    // <input type="hidden"> isn't focusable.
    '<template><input type="hidden" role="presentation" /></template>',

    // <datalist> is a hidden data provider (display:none in UA stylesheets);
    // its options surface inside the associated input's UA popup, not on the
    // datalist element itself — it's not a focusable area.
    '<template><datalist role="presentation"></datalist></template>',

    // <details> itself is not a focusable area per HTML §6.6.3 — its first
    // <summary> child is the disclosure focus target. role="presentation" on
    // the details element does not trigger the spec's conflict resolution.
    '<template><details role="presentation"><summary>Title</summary></details></template>',

    // <option> is not its own focusable area; focus stays on the host <select>.
    '<template><option role="presentation">Foo</option></template>',

    // <a> without href isn't focusable.
    '<template><a role="presentation">Not a link</a></template>',

    // <audio>/<video> without `controls` aren't focusable — no keyboard UI.
    '<template><video role="presentation"></video></template>',
    '<template><audio role="presentation"></audio></template>',

    // Components — rule skips (isComponentInvocation).
    '<template><CustomBtn role="presentation" /></template>',
    '<template><@slot role="presentation" /></template>',
    '<template><this.widget role="presentation" /></template>',
    '<template><foo.bar role="presentation" /></template>',

    // No role at all.
    '<template><button></button></template>',

    // <label> is HTML interactive content but NOT keyboard-focusable by default
    // (clicks forward to the associated control; the label itself isn't in the
    // tab order). role="presentation" on it is fine.
    '<template><label role="presentation">Name</label></template>',

    // Per WAI-ARIA role-fallback semantics, when multiple whitespace-separated
    // role tokens are present, user agents use the FIRST valid token; later
    // tokens are author-provided fallbacks. So `role="button presentation"`
    // resolves to "button" — the element is a button, not presentational, and
    // is NOT flagged.
    '<template><div role="button presentation" tabindex="0">Click</div></template>',

    // Disabled form controls are not keyboard-focusable (HTML §4.10.18.5).
    '<template><button disabled role="presentation">Click</button></template>',
    '<template><input type="text" disabled role="presentation" /></template>',

    // Non-focusable wrapper with role="presentation" around a focusable child —
    // the rule only checks the element that carries the role, not its subtree.
    // WAI-ARIA 1.2 §4.6 says role=presentation suppresses only the host
    // element's implicit role and does NOT cascade to descendants.
    // (vuejs-accessibility flags these because its rule recurses into descendants;
    // that descent is not spec-mandated for role=presentation.)
    '<template><div role="presentation"><button>Submit</button></div></template>',
    '<template><div role="presentation"><a href="#">Link</a></div></template>',
    '<template><div role="presentation"><span tabindex="0">Focusable</span></div></template>',
  ],
  invalid: [
    {
      code: '<template><button role="presentation">Click</button></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<template><button role="none">Click</button></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<template><a href="/x" role="presentation">Link</a></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<template><input type="text" role="presentation" /></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // Non-interactive element made focusable via tabindex.
    {
      code: '<template><div tabindex="0" role="presentation"></div></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<template><div tabindex="-1" role="none"></div></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // tabindex="-1" makes an element a programmatic focus target per HTML §6.6.3
    // ("focusable but not sequentially focusable") — focus() works and the
    // element remains in the a11y tree, so WAI-ARIA's Presentational Roles
    // Conflict Resolution kicks in and the UA exposes the implicit role anyway.
    // Rule flags the author-side anti-pattern. jsx-a11y / vue-a11y exempt
    // tabindex="-1"; we follow the spec.
    {
      code: '<template><button tabindex="-1" role="presentation">Press</button></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // <video controls> / <audio controls> — focusable per HTML-AAM / browser
    // reality (keyboard-operable transport controls), so role="presentation"
    // on them is a semantic conflict.
    {
      code: '<template><video controls role="presentation"></video></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<template><audio controls role="none"></audio></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // <area href> — same conditional-interactive rule as <a href>.
    {
      code: '<template><area href="/x" role="presentation" /></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // contenteditable — valueless form (`<div contenteditable>`).
    {
      code: '<template><div contenteditable role="presentation">Editable</div></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // contenteditable — mustache boolean `{{true}}`.
    {
      code: '<template><div contenteditable={{true}} role="presentation">Editable</div></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    // contenteditable — mustache string `{{"true"}}`.
    {
      code: '<template><div contenteditable={{"true"}} role="presentation">Editable</div></template>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-role-presentation-on-focusable', rule, {
  valid: [
    '<div role="presentation"></div>',
    '<input type="hidden" role="presentation" />',
    '<CustomBtn role="presentation" />',
    // <video> / <audio> without controls aren't focusable.
    '<video role="presentation"></video>',
  ],
  invalid: [
    {
      code: '<button role="presentation">Click</button>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<div tabindex="0" role="none"></div>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
    {
      code: '<video controls role="presentation"></video>',
      output: null,
      errors: [{ messageId: 'invalidPresentation' }],
    },
  ],
});
