# Post-merge review of extracted template-lint rules

Line-by-line comparison against the original [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) source at commit [`f43c6f1`](https://github.com/ember-template-lint/ember-template-lint/tree/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b) (v7.9.3). Each section documents a discrepancy found in the extraction and the fix applied. All branches have passing tests.

---

## Post-merge review of #2381 (`template-no-log`)

Missing scope tracking for block parameters causes false positives when `log` is a block param name (e.g., `{{#each this.logs as |log|}}{{log}}{{/each}}`). The original checks [`this.isLocal(node)`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-log.js#L7) before reporting. Fix adds a `localScopes` stack with `GlimmerBlockStatement`/`GlimmerElementNode` enter/exit pairs, matching the pattern already used in `template-no-dynamic-subexpression-invocations`.

---

## Post-merge review of #2395 (`template-link-href-attributes`)

Missing exception for `<a>` elements with both `role` and `aria-disabled` attributes, causing false positives on accessible patterns like `<a role="link" aria-disabled="true">`. The original skips reporting when both are present — see [`link-href-attributes.js` lines 27–29](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/link-href-attributes.js#L27-L29).

---

## Post-merge review of #2396 (`template-link-rel-noopener`)

Two issues. (1) Detection regex uses bare `/noopener/` which matches substrings. The original uses a [whitespace-bounded regex](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/link-rel-noopener.js#L24). Fix uses `/(?:^|\s)noopener(?:\s|$)/`. (2) Fixer always inserts a new `rel` attribute even when one already exists, producing duplicate attributes. The [original's fixer](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/link-rel-noopener.js#L99-L102) strips existing `noopener`/`noreferrer` and re-adds them in canonical order. Fix now does the same.

---

## Post-merge review of #2408 (`template-no-autofocus-attribute`)

Missing `MustacheStatement` visitor. The original handles both [`ElementNode`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-autofocus-attribute.js#L21-L26) and [`MustacheStatement`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-autofocus-attribute.js#L28-L32) (for `{{input autofocus=true}}`). The extraction only had `ElementNode`, so `{{input autofocus=true}}` and `{{component "input" autofocus=true}}` silently passed.

---

## Post-merge review of #2414 (`template-no-capital-arguments`)

Three missing features. The original has both a [`PathExpression`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-capital-arguments.js#L19-L33) and an [`AttrNode`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-capital-arguments.js#L34-L46) visitor, plus a [`RESERVED` set](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-capital-arguments.js#L9) and [`AllowedPrefix` regex](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-capital-arguments.js#L8). The extraction was missing: (1) `AttrNode` visitor — `<Foo @Name="bar" />` wasn't caught, (2) reserved argument detection (`@arguments`, `@args`, `@block`, `@else`), (3) underscore-prefix detection (`@_Name`).

---

## Post-merge review of #2423 (`template-no-action`)

Two bugs. (1) Missing [`ElementModifierStatement` visitor](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-action.js#L46-L48) — `<button {{action "submit"}}>` silently passed. (2) The original's [`MustacheStatement` visitor](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-action.js#L40-L42) reports `{{action}}` everywhere including attribute position (`<input onclick={{action "foo"}}>`), but the extraction incorrectly walked parents to skip `GlimmerAttrNode`.

---

## Post-merge review of #2424 (`template-no-action-modifiers`)

Missing allowlist configuration. The original supports an [`allowlist` config](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-action-modifiers.js#L17-L19) (passed as an array, e.g., `['button']`) that skips reporting when the parent element's tag is in the list — see the [allowlist guard](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-action-modifiers.js#L48). The extraction had `schema: []` with no config support.

---

## Post-merge review of #2429 (`template-no-element-event-actions`)

Over-reporting due to erroneous `ConcatStatement` check. The original only checks [`node.value.type === 'MustacheStatement'`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-element-event-actions.js#L61). The extraction also checked `GlimmerConcatStatement`.

---

## Post-merge review of #2442 (`template-no-inline-styles`)

The original's `allowDynamicStyles` exemption only checks [`style.value.type === 'MustacheStatement'`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-inline-styles.js#L62). The extraction incorrectly also exempted `GlimmerConcatStatement` (e.g., `style="{{foo}} bar"`), which the original flags as invalid. Also fixes the same ConcatStatement issue in `template-no-element-event-actions`.

---

## Post-merge review of #2469 (`template-no-implicit-this`)

Missing `welcome-page` and `rootURL` in built-ins. The original includes [`ARGLESS_DEFAULT_BLUEPRINT`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-implicit-this.js#L48-L51) containing these in its allow list. Also fixes the ConcatStatement issue in `template-no-element-event-actions`.

---

## Post-merge review of #2471 (`template-no-invalid-aria-attributes`)

Error messages don't match original's [`createInvalidAttributeTypeErrorMessage`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-aria-attributes.js#L11-L38). Specifically: (1) `boolean` type produced `"a boolean (true or false)"` but the original's [default case](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-aria-attributes.js#L36) produces `"a boolean."`. (2) [`id`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-aria-attributes.js#L30) and [`idlist`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-aria-attributes.js#L27) have no trailing period in the original, but the extraction's message template added one.

---

## Post-merge review of #2475 (`template-no-invalid-role`)

Three issues. (1) Missing roles (`associationlistitemkey`, `associationlistitemvalue`, `cell`) in `VALID_ROLES`. (2) `SEMANTIC_ELEMENTS` set doesn't match the original's [`ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-role.js#L16-L102). (3) Missing `.toLowerCase()` for the [`VALID_ROLES.has()` check](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-role.js#L272).

**Intentional improvement over original:** The `presentation`/`none` check also uses `.toLowerCase()`, while the [original is case-sensitive there](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-invalid-role.js#L263). The original has an internal inconsistency: the validity check uses `.toLowerCase()` but the presentation/none check does not, meaning `role="NONE"` on a `<button>` silently passes. Per the [WAI-ARIA 1.2 spec](https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles): *"Case-sensitivity of the comparison inherits from the case-sensitivity of the host language"* — and HTML is case-insensitive.

---

## Post-merge review of #2477 (`template-no-link-to-positional-params`)

Incorrect `GlimmerElementNode` handler. The original only handles [`MustacheStatement`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-link-to-positional-params.js#L9) and [`BlockStatement`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-link-to-positional-params.js#L13) (curly-brace `{{link-to}}`). The extraction added a `GlimmerElementNode` handler that tries to detect positional params on `<LinkTo>` angle-bracket invocations using a heuristic with no basis in the original.

---

## Post-merge review of #2484 (`template-no-nested-interactive`)

Config option name mismatch. The original uses [`ignoreUsemapAttribute`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-nested-interactive.js#L166). The extraction renamed it to `ignoreUsemap`. Fix accepts both names for migration compatibility.

---

## Post-merge review of #2490 (`template-no-outlet-outside-routes`)

Missing `BlockStatement` handler. The original registers both [`MustacheStatement` and `BlockStatement`](https://github.com/ember-template-lint/ember-template-lint/blob/f43c6f11fdf8fc8ecb51ba04cea0f367b1af544b/lib/rules/no-outlet-outside-routes.js#L26-L28) for `_checkForOutlet`. The extraction only had `GlimmerMustacheStatement`, so `{{#outlet}}content{{/outlet}}` in non-route templates silently passed.

---

## Notes

- **Overlapping fix:** #2429, #2442, and #2469 all contain the same `template-no-element-event-actions` ConcatStatement removal. They will conflict — merge #2442 first (bundles both rules' fixes + tests) and rebase the others.
- 14 branches faithfully reproduce the original ember-template-lint behavior; #2475 intentionally improves one case-sensitivity inconsistency backed by the WAI-ARIA spec.
