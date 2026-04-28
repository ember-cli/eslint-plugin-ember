'use strict';

const rule = require('../../../lib/rules/template-no-aria-hidden-on-focusable');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-aria-hidden-on-focusable', rule, {
  valid: [
    // aria-hidden on non-focusable elements — fine.
    '<template><div aria-hidden="true"></div></template>',
    '<template><span aria-hidden="true">decorative</span></template>',
    '<template><img src="/x.png" alt="" aria-hidden="true" /></template>',

    // Focusable elements without aria-hidden — fine.
    '<template><button>Click me</button></template>',
    '<template><a href="/x">Link</a></template>',
    '<template><input type="text" /></template>',

    // aria-hidden="false" — explicit opt-out. Not flagged.
    '<template><button aria-hidden="false">Click me</button></template>',

    // Valueless / empty aria-hidden resolves to default `undefined` per
    // WAI-ARIA 1.2 §6.6 — not hidden, not flagged even on focusable hosts.
    '<template><button aria-hidden>Click me</button></template>',
    '<template><button aria-hidden="">Click me</button></template>',
    '<template><button aria-hidden={{false}}>Click me</button></template>',

    // <input type="hidden"> isn't focusable, so aria-hidden on it is fine.
    '<template><input type="hidden" aria-hidden="true" /></template>',
    // Mustache string literal — statically resolvable to "hidden".
    '<template><input type={{"hidden"}} aria-hidden="true" /></template>',

    // <a> without href isn't focusable by default.
    '<template><a aria-hidden="true">Not a link</a></template>',

    // <label> is HTML interactive content but NOT keyboard-focusable by default
    // (clicks forward to the associated control; the label itself isn't in the
    // tab order). So aria-hidden on it is fine.
    '<template><label aria-hidden="true">Name</label></template>',

    // Disabled form controls are removed from the tab order (HTML §4.10.18.5),
    // so they're not keyboard-focusable and aria-hidden on them isn't a trap.
    '<template><button disabled aria-hidden="true">Click me</button></template>',
    '<template><input disabled aria-hidden="true" /></template>',

    // Components — we don't know if they render a focusable element.
    '<template><CustomBtn aria-hidden="true" /></template>',

    // <audio> / <video> without `controls` are not interactive — no focusable UI.
    '<template><video aria-hidden="true"></video></template>',
    '<template><audio aria-hidden="true"></audio></template>',
    '<template><div aria-hidden="true"><video></video></div></template>',
    '<template><div aria-hidden="true"><audio></audio></div></template>',

    // Descendant-focusable check — valid cases.
    // No focusable descendant.
    '<template><div aria-hidden="true"><span>Just text</span></div></template>',
    // Component descendants are opaque — conservatively not flagged.
    '<template><div aria-hidden="true"><Button>X</Button></div></template>',
    // No focusable descendants (alt-less img is decorative, not focusable).
    '<template><div aria-hidden="true"><img alt="static" /></div></template>',
    // <input type="hidden"> is non-focusable per isFocusable.
    '<template><div aria-hidden="true"><input type="hidden" /></div></template>',
    // Event modifiers (`{{on "click" ...}}`) do not make an element focusable —
    // only tabindex / inherent native focusability does.
    '<template><div {{on "click" this.handler}} aria-hidden="true"></div></template>',

    // Dynamic mustache descendants are not inspected.
    '<template><div aria-hidden="true">{{this.label}}</div></template>',
    // `@arg`-prefixed tag is opaque.
    '<template><div aria-hidden="true"><@thing /></div></template>',
    // `this.`-prefixed tag is opaque.
    '<template><div aria-hidden="true"><this.Item /></div></template>',
  ],
  invalid: [
    // Native interactive elements.
    {
      code: '<template><button aria-hidden="true">Trapped</button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><a href="/x" aria-hidden="true">Link</a></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><input type="text" aria-hidden="true" /></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><select aria-hidden="true"><option /></select></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><textarea aria-hidden="true"></textarea></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },

    // Non-interactive element made focusable via tabindex.
    {
      code: '<template><div tabindex="0" aria-hidden="true"></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      // tabindex="-1" still makes it programmatically focusable — still flag.
      code: '<template><div tabindex="-1" aria-hidden="true"></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // DIVERGENCE from jsx-a11y + vue-a11y: both accept button[tabindex="-1"][aria-hidden="true"]
    // reasoning that tabindex="-1" removes the element from the tab order.
    // Our rule treats tabindex="-1" as still programmatically focusable (reachable via
    // .focus() and click), so aria-hidden on it still creates an AT-invisibility mismatch.
    {
      code: '<template><button aria-hidden="true" tabindex="-1"></button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },

    // Mustache-boolean + case-variant aria-hidden = true — truthy per spec.
    {
      code: '<template><button aria-hidden={{true}}></button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // GlimmerConcatStatement form. Per docs/glimmer-attribute-behavior.md,
    // `aria-hidden="{{true}}"` renders as `aria-hidden="true"`.
    {
      code: '<template><button aria-hidden="{{true}}"></button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // disabled={{false}} is the bare-mustache boolean-false case — Glimmer
    // omits the attribute at runtime, so the button stays focusable and
    // aria-hidden="true" traps it. (`disabled="{{false}}"` and
    // `disabled={{"false"}}` would NOT omit; those keep the button disabled.)
    {
      code: '<template><button aria-hidden="true" disabled={{false}}>click</button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><button aria-hidden="TRUE"></button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      // Whitespace-padded "true" is still a truthy aria-hidden per enumerated-
      // attribute normalization (trim + case-insensitive).
      code: '<template><button aria-hidden=" true "></button></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },

    // Descendant-focusable check. Per WAI-ARIA 1.2 §aria-hidden
    // "may receive focus" — focusable descendants are keyboard-reachable
    // under an aria-hidden ancestor, creating a keyboard trap.
    {
      // Classic modal-backdrop trap.
      code: '<template><div aria-hidden="true"><button>Close</button></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      // Deeper descendant.
      code: '<template><div aria-hidden="true"><span><button>Deep</button></span></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      code: '<template><div aria-hidden="true"><a href="/x">Link</a></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      code: '<template><div aria-hidden="true"><input /></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      // Depth check — focusable descendant two levels deep.
      code: '<template><section aria-hidden="true"><div><textarea></textarea></div></section></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      // tabindex on a descendant makes it focusable.
      code: '<template><div aria-hidden="true"><span tabindex="0">x</span></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    // DIVERGENCE from vue-a11y: it considers tabindex="-1" on a descendant as "escaped from
    // tab order = not focusable". Our isFocusable treats any tabindex (including "-1") as
    // programmatically focusable, so the ancestor aria-hidden still creates a trap.
    {
      code: '<template><div aria-hidden="true"><button tabindex="-1">Trapped</button></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      code: '<template><div aria-hidden="true"><a href="#" tabindex="-1">Link</a></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },

    // <audio controls> / <video controls> expose focusable UI; flag directly.
    {
      code: '<template><video controls aria-hidden="true"></video></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<template><audio controls aria-hidden="true"></audio></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // <audio controls> / <video controls> as focusable descendants of an
    // aria-hidden ancestor.
    {
      code: '<template><div aria-hidden="true"><video controls></video></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      code: '<template><div aria-hidden="true"><audio controls></audio></div></template>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-aria-hidden-on-focusable', rule, {
  valid: [
    '<div aria-hidden="true"></div>',
    '<button>Click me</button>',
    '<input type="hidden" aria-hidden="true" />',
    // Mustache string literal — statically resolvable to "hidden".
    '<input type={{"hidden"}} aria-hidden="true" />',
    '<CustomBtn aria-hidden="true" />',
    // Descendant-focusable — non-focusable child.
    '<div aria-hidden="true"><span>Just text</span></div>',
    // Component descendant is opaque.
    '<div aria-hidden="true"><Button>X</Button></div>',
  ],
  invalid: [
    {
      code: '<button aria-hidden="true">Trapped</button>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    {
      code: '<div tabindex="0" aria-hidden="true"></div>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // Descendant-focusable check.
    {
      code: '<div aria-hidden="true"><button>Close</button></div>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    {
      code: '<section aria-hidden="true"><div><a href="/x">Link</a></div></section>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
    // <audio controls> / <video controls> — directly focusable.
    {
      code: '<video controls aria-hidden="true"></video>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnFocusable' }],
    },
    // <audio controls> / <video controls> — focusable descendant.
    {
      code: '<div aria-hidden="true"><audio controls></audio></div>',
      output: null,
      errors: [{ messageId: 'noAriaHiddenOnAncestorOfFocusable' }],
    },
  ],
});
