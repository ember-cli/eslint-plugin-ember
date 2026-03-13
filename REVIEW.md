# Extract Rule PRs - Systematic Review

> Comparing each PR against its ember-template-lint counterpart in `/Users/johanrd/fremby/ember-template-lint-main`.
> Goal: in gjs/gts projects, these rules must behave equivalently so ember-template-lint is no longer needed.

## Overview

| PR | Rule | Status | Key Issues |
|----|------|--------|------------|
| **Batch 1** | | | |
| #2477 | template-no-link-to-positional-params | **NEEDS WORK** | Unnecessary `<LinkTo>` handler (can false-positive on `class={{...}}`); static error message loses migration advice |
| #2475 | template-no-invalid-role | **NEEDS WORK** | **Bug:** missing `.toLowerCase()` on role values — `role="Button"` falsely flagged; ~19 elements missing from semantic set |
| #2474 | template-no-invalid-meta | **NEEDS WORK** | New `charset` validation not in original (enhancement, not extraction); test gaps around charset logic |
| #2473 | template-no-invalid-link-title | **NEEDS WORK** | Single generic message loses "both attribute and argument" context; missing strict-mode guard for `LinkTo` |
| #2472 | template-no-invalid-link-text | **NEEDS WORK** | Nested element traversal differs from original; doc self-reference bug |
| #2471 | template-no-invalid-aria-attributes | **NEEDS WORK** | Generic error messages lose type-specific guidance; stricter numeric validation (improvement) |
| **Batch 2** | | | |
| #2470 | template-no-input-block | **PASS** | Minor message text difference (cosmetic) |
| #2469 | template-no-implicit-this | **NEEDS WORK** | `isControlFlowParam` wrongly skips flagging ambiguous params; missing RegExp allow; incomplete block param detection; missing default allow entries |
| #2468 | template-no-extra-mut-helper-argument | **PASS** | Clean extraction, identical behavior |
| #2467 | template-no-dynamic-subexpression-invocations | **NEEDS WORK** | Flags body-context `this.*` mustaches not flagged by original; generic error message loses context-specific guidance |
| #2465 | template-linebreak-style | **PASS** | Minor: missing `true` (consistency) mode and editorconfig integration; adds fixer (improvement) |
| #2464 | template-eol-last | **PASS** | Minor: missing `editorconfig` config option |
| **Batch 3** | | | |
| #2462 | template-block-indentation | **NEEDS WORK** | Missing `validateBlockStart`; no `columnOffset` handling |
| #2461 | template-attribute-indentation | **NEEDS WORK** | Missing `validateClosingTag`; `processElements` defaults differ |
| #2460 | template-no-curly-component-invocation | **NEEDS WORK** | `noImplicitThis` accepted in schema but never used; multi-part paths not handled |
| #2459 | template-no-class-bindings | **PASS** | Slightly stricter (catches non-`@` attrs too) — reasonable enhancement |
| #2457 | template-no-bare-yield | **NEEDS WORK** | Fundamentally different semantics from `no-yield-only` |
| #2456 | template-no-at-ember-render-modifiers | **NEEDS WORK** (minor) | Misleading error message recommends the very modifiers being banned |
| **Batch 4** | | | |
| #2455 | template-no-args-paths | **NEEDS WORK** | No `isLocal` check (false positives on block params named `args`); generic error message |
| #2454 | template-no-ambiguous-glimmer-paths | **NEEDS WORK** | Dramatically narrower than `no-implicit-this`; only dotted paths in mustaches; no `allow` config |
| #2453 | template-no-action-on-submit-button | **PASS** | Solid implementation, correct logic, good test coverage |
| #2452 | template-modifier-name-case | **NEEDS WORK** | `dasherize` produces leading dashes for capitalized names; unused broken `messageId` |
| #2451 | template-deprecated-render-helper | **NEEDS WORK** (minor) | No fix/suggestion behavior (original auto-fixes); slight message differences |
| #2450 | template-deprecated-inline-view-helper | **NEEDS WORK** | No `isLocal` check for block params named `view`; no fix; possible double-reporting |
| **Batch 5** | | | |
| #2441 | template-no-inline-linkto | **NEEDS WORK** | Scope expanded beyond original (adds `<LinkTo>` angle bracket checks); missing autofix |
| #2439 | template-no-index-component-invocation | **PASS** | Minor: verify `.value` vs `.original` for string literals |
| #2438 | template-no-html-comments | **NEEDS WORK** | `originallyFrom.name` bug (says `eslint-plugin-ember` instead of `ember-template-lint`); different detection approach |
| #2436 | template-no-form-action | **NEEDS WORK** | **No ember-template-lint counterpart exists**; questionable rule semantics |
| #2435 | template-no-forbidden-elements | **NEEDS WORK** | Missing object config form `{ forbidden: [...] }`; missing `head.hbs` exception |
| #2432 | template-no-extra-mut-helpers (Draft) | **CRITICAL** | **Rule logic is inverted** — flags correct `(mut value)` usage instead of `(mut a b)` |
| **Batch 6** | | | |
| #2427 | template-no-duplicate-landmark-elements | **NEEDS WORK** | Missing dialog/popover scoping; incomplete block scoping (only `if`/`unless`) |
| #2426 | template-no-duplicate-id | **NEEDS WORK** | Missing ancestor yield block resolution; potential false positives for block-param IDs |
| #2418 | template-no-down-event-binding (Draft) | **CRITICAL** | Wrong event set (missing `pointerdown`, incorrectly added `touchstart`); missing `action` modifier handling |
| #2413 | template-no-builtin-form-components (Draft) | **PASS** | Simple, correct port |
| #2409 | template-no-bare-strings | **NEEDS WORK** | Complex rule (371 lines in original); needs manual verification of full implementation |

---

## Critical Issues (must fix before merge)

### #2432 — template-no-extra-mut-helpers: Inverted logic
The ember-template-lint `no-extra-mut-helper-argument` flags `(mut attr extraArg)` (too many arguments). The PR flags `(mut this.value)` (one argument = correct usage). **The condition is backwards.** Should check `params.length > 1`, not `params.length === 1`.

### #2418 — template-no-down-event-binding: Wrong event set
- **Missing:** `pointerdown`, `onpointerdown` (the whole point of the original rule name `no-pointer-down-event-binding`)
- **Incorrectly added:** `touchstart` (not in original)
- Missing `{{action}}` modifier handling
- Missing case-insensitive matching
- Error message recommends wrong alternatives

### #2457 — template-no-bare-yield: Different rule entirely
- ember-template-lint `no-yield-only` only flags when `{{yield}}` is the **only content** in the entire template
- PR flags **any** `{{yield}}` without parameters regardless of context
- `<div>{{yield}}</div>` would pass in ember-template-lint but fail in the PR

### #2475 — template-no-invalid-role: Missing case-insensitive role matching
Role values are case-insensitive per the ARIA spec. The PR checks `VALID_ROLES.has(role)` without `.toLowerCase()`. This means `role="Button"` or `role="NAVIGATION"` will be falsely flagged as invalid. The original correctly lowercases before lookup.

### #2477 — template-no-link-to-positional-params: Unnecessary `<LinkTo>` handler
Angle-bracket `<LinkTo>` never supported positional params — you write `<LinkTo @route="about">`. The original deliberately does NOT check `<LinkTo>`. The PR's `GlimmerElementNode` handler checks non-`@` attrs with dynamic values, which could false-positive on `class={{...}}`, `id={{...}}`, `data-test={{...}}`, etc.

### #2436 — template-no-form-action: No counterpart
No corresponding rule exists in ember-template-lint. The HTML `action` attribute on `<form>` is standard HTML, not an Ember concern. Should not be presented as an "extraction."

---

## Detailed Reviews

---

### PR #2477 — template-no-link-to-positional-params
**ember-template-lint rule:** `no-link-to-positional-params` | **Status: NEEDS WORK**

Detects deprecated positional parameter usage in `{{link-to}}` / `{{#link-to}}`.

**Issues:**
1. **Unnecessary `<LinkTo>` handler:** Angle-bracket `<LinkTo>` never supported positional params. The original deliberately omits this check. The PR's heuristic (`!attr.name.startsWith('@') && attr.value.type !== 'GlimmerTextNode'`) could false-positive on legitimate HTML attributes like `class={{dynamicClass}}`. **Remove the `GlimmerElementNode` handler entirely.**
2. **Static error message:** Original dynamically includes which named arguments to use (`@route`, `@model`/`@models`, `@query`) and advises using block form. PR uses a single generic string.
3. **Misleading docs:** Example shows `<LinkTo "posts.post" @model={{this.post}}>` as incorrect — but this isn't valid Ember syntax. Angle-bracket components can't receive positional string params.
4. **Zero tests for `<LinkTo>` code path** — ~30 lines of rule code are untested.

---

### PR #2475 — template-no-invalid-role
**ember-template-lint rule:** `no-invalid-role` | **Status: NEEDS WORK**

Validates ARIA roles and flags `presentation`/`none` on semantic elements.

**Issues:**
1. **Bug: Missing `.toLowerCase()`:** ARIA role values are case-insensitive per spec. PR checks `VALID_ROLES.has(role)` without lowercasing. `role="Button"` is falsely flagged.
2. **~19 elements missing from `SEMANTIC_ELEMENTS`:** `audio`, `video`, `iframe`, `embed`, `area`, `br`, `source`, `track`, `wbr`, `object`, `param`, `map`, `applet`, `dir`, `menuitem`, `noembed`, `rb`, `rtc`, `tt` — all present in original but absent from PR.
3. **Elements added not in original:** `address`, `article`, `aside`, `footer`, `h1`-`h6`, `header`, `hgroup`, `nav`, `section` — reasonable additions but behavioral divergence.
4. **Empty/whitespace role silently ignored:** PR trims + skips empty roles; original would flag `role="  "` as invalid.
5. **Check order reversed with early return:** Invalid-role reports first then returns, preventing the presentation check from ever firing on the same node. Original runs both checks independently.

---

### PR #2474 — template-no-invalid-meta
**ember-template-lint rule:** `no-invalid-meta` | **Status: NEEDS WORK**

Validates `<meta>` elements (content requirements, viewport, refresh).

**Issues:**
1. **New `invalidCharset` check:** Validates `<meta charset="...">` must be `utf-8`. This does not exist in ember-template-lint. Should be documented as an enhancement, not a straight extraction.
2. **`hasIdentifier` includes `hasHttpEquiv`:** Original keeps these separate (`hasIdentifier || hasHttpEquiv`). Functionally equivalent but semantically misleading.
3. **Edge case: `parseInt("", 10)` → `NaN`:** Empty `content=""` with `http-equiv="refresh"` silently passes. Should probably be flagged.
4. **Test gaps:** Missing tests for `charset` + other attrs combos, multiple errors on single element, boundary value `delay=72000`, charset in HBS mode.

---

### PR #2473 — template-no-invalid-link-title
**ember-template-lint rule:** `no-invalid-link-title` | **Status: NEEDS WORK**

Disallows title attributes that duplicate link text.

**Issues:**
1. **Single generic message:** Original has distinct messages for "both attribute and argument" vs "redundant title". PR uses one message for all cases — confusing for `<LinkTo @title="foo" title="bar">`.
2. **Missing strict-mode guard:** Original skips `LinkTo` in strict mode (`this.isStrictMode`). PR always checks it. Could produce false positives in GJS `<template>` context.
3. **Dual-title early return:** PR returns after reporting dual-title, never checking if the title also duplicates link text. Original can report both errors.
4. **Missing tests:** Empty `title` on `<LinkTo>`, empty `@title`, title-as-substring-of-text.

---

### PR #2472 — template-no-invalid-link-text
**ember-template-lint rule:** `no-invalid-link-text` | **Status: NEEDS WORK**

Disallows generic link text ("click here", "more info", "read more", "more").

**Issues:**
1. **Nested element traversal:** PR recursively traverses child elements (e.g., `<a><span>click here</span></a>`). Original only checks direct `TextNode` children. This is a behavioral difference — arguably better but should be tested and documented.
2. **Doc self-reference bug:** References section links to itself instead of the ember-template-lint rule.
3. **Missing tests:** `allowEmptyLinks` in GJS mode, standalone `"more"` test, `aria-label` with disallowed value on `<LinkTo>`, nested element content.

---

### PR #2471 — template-no-invalid-aria-attributes
**ember-template-lint rule:** `no-invalid-aria-attributes` | **Status: NEEDS WORK**

Validates ARIA attribute names and value types using `aria-query`.

**Issues:**
1. **Generic error messages:** Original provides type-specific messages (e.g., "must be a boolean or the string 'mixed'", "must be an integer"). PR uses `"Invalid value for ARIA attribute aria-checked."` — less actionable.
2. **Stricter numeric validation (improvement):** PR uses `Number()` instead of `parseInt` — `"50px"` correctly rejected. Also distinguishes `integer` vs `number` types. These are improvements over the original.
3. **`string` type accepts booleans:** PR accepts `aria-label="true"`, original rejects it. Minor difference.
4. **Reports all errors per element:** Original stops after first invalid attribute. PR reports all. Better for ESLint UX.
5. **Missing tests:** `aria-hidden` without value, empty string values, decimal for `number` type, negative integers.

---

### PR #2453 — template-no-action-on-submit-button
**ember-template-lint rule:** `no-input-block` | **Status: PASS**

Disallows block usage of `{{input}}` helper. Simple rule, correctly ported.

- **Error message:** Minor cosmetic difference — PR omits `{{}}` around "input" in message text. Acceptable.
- **Schema/fix/test coverage:** All match. No configuration, no fix, good coverage.

---

### PR #2469 — template-no-implicit-this
**ember-template-lint rule:** `no-implicit-this` | **Status: NEEDS WORK**

Requires explicit `this.` or `@` prefix for property access in templates.

**Issues:**
1. **`isControlFlowParam` wrongly skips flagging:** `{{if ambiguousPath "yes"}}` — `ambiguousPath` should be flagged (ember-template-lint flags it) but the PR skips it via `isControlFlowParam`.
2. **Missing default allow entries:** ember-template-lint always includes `welcome-page` and `rootURL` in the allow list.
3. **No RegExp support in `allow`:** ember-template-lint supports both strings and RegExp values. PR only allows strings.
4. **Incomplete block param detection:** `isBlockParamPath` only checks direct parent, not ancestor scopes.
5. **Missing SubExpression/ElementModifierStatement callee handling:** Callees of sub-expressions like `(some-helper ...)` could be incorrectly flagged.
6. **Shorter error message:** Omits guidance about angle bracket invocation and rule configuration.

---

### PR #2468 — template-no-extra-mut-helper-argument
**ember-template-lint rule:** `no-extra-mut-helper-argument` | **Status: PASS**

Disallows passing more than one argument to `mut`. Simple rule, correctly ported.

- Error message identical.
- Minor style note: uses inline `message` instead of `messageId`. Functional but inconsistent with other PRs.

---

### PR #2467 — template-no-dynamic-subexpression-invocations
**ember-template-lint rule:** `no-dynamic-subexpression-invocations` | **Status: NEEDS WORK**

Disallows dynamic helper/modifier invocations with dynamic callee paths.

**Issues:**
1. **Behavioral extension:** `{{this.formatter this.data}}` in body context is flagged by PR but NOT by ember-template-lint (original only flags attr-position mustaches with dynamic callees).
2. **Generic error message:** Original gives context-specific messages (e.g., "You must use the `fn` helper" for attr-position). PR uses one generic message.
3. **Local scope tracking diverges:** PR implements own `localScopes` stack vs ember-template-lint's `this.scope.isLocal()`.

---

### PR #2465 — template-linebreak-style
**ember-template-lint rule:** `linebreak-style` | **Status: PASS**

Enforces consistent linebreaks (LF vs CRLF).

- **Improvement:** PR adds a fixer (ember-template-lint has none).
- **Minor gaps:** Missing `true` (auto-detect consistency) mode. Missing editorconfig `end_of_line` integration.

---

### PR #2464 — template-eol-last
**ember-template-lint rule:** `eol-last` | **Status: PASS**

Requires or disallows newline at end of template.

- Error messages identical.
- Fix behavior equivalent.
- Correctly skips gjs/gts embedded templates.
- **Minor gap:** Missing `editorconfig` option (`insert_final_newline`).

---

### PR #2462 — template-block-indentation
**ember-template-lint rule:** `block-indentation` | **Status: NEEDS WORK**

Enforces consistent block indentation.

**Issues:**
1. **Missing `validateBlockStart`:** Top-level block/element indentation relative to template root is not validated.
2. **No `columnOffset` handling:** ember-template-lint adjusts for embedded template offsets. PR does not, which could cause issues in certain nesting scenarios.
3. **Missing `sourceDoesNotMatchNode` guard:** Safety check against false positives is absent.

Configuration, error messages, and test coverage are otherwise equivalent.

---

### PR #2461 — template-attribute-indentation
**ember-template-lint rule:** `attribute-indentation` | **Status: NEEDS WORK**

Enforces proper attribute indentation on multi-line invocations.

**Issues:**
1. **Missing `validateClosingTag`:** Misaligned `</div>` closing tags won't be caught.
2. **`processElements` defaults to `true`:** ember-template-lint requires explicit opt-in. PR default could cause unexpected errors during migration.
3. **Missing close-brace validation for paramless blocks with block params.**



### PR #2459 — template-no-class-bindings
**ember-template-lint rule:** `no-class-bindings` | **Status: PASS**

Disallows `classBinding`/`classNameBindings` arguments.

- Slightly stricter than original (also catches non-`@` prefixed attrs on angle bracket components). Reasonable enhancement.
- Good test coverage of all 4 forbidden patterns.

---

### PR #2457 — template-no-bare-yield
**ember-template-lint rule:** `no-yield-only` | **Status: NEEDS WORK** (critical semantic mismatch)

See [Critical Issues](#critical-issues-must-fix-before-merge) above. The PR flags any `{{yield}}` without params. The original only flags templates whose **entire content** is just `{{yield}}`.

---

### PR #2456 — template-no-at-ember-render-modifiers
**ember-template-lint rule:** `no-at-ember-render-modifiers` | **Status: NEEDS WORK** (minor)

Disallows `did-insert`, `did-update`, `will-destroy` modifiers.

**Issue:** Error message says *"Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead"* — recommending the very modifiers being banned. ember-template-lint correctly says to use a custom modifier via `ember-modifier`.



### PR #2450 — template-deprecated-inline-view-helper
**ember-template-lint rule:** `deprecated-inline-view-helper` | **Status: NEEDS WORK**

Disallows deprecated inline `{{view}}` helper and `view.*` paths.

**Issues:**
1. **No `isLocal` check:** `{{#each items as |view|}}{{view.name}}{{/each}}` would be falsely flagged.
2. **Missing dedup guard:** No `_processedByInlineViewHelper` equivalent — same node could be reported twice (once from element visitor, once from mustache visitor).
3. **No autofix:** Original provides fix suggestions (removing `view.` prefix).

---

### PR #2441 — template-no-inline-linkto
**ember-template-lint rule:** `inline-link-to` | **Status: NEEDS WORK**

**Issues:**
1. **Scope expanded beyond original:** PR also checks angle bracket `<LinkTo />` with empty children — ember-template-lint only checks curly `{{link-to ...}}`.
2. **Missing autofix:** Original converts inline to block form.
3. **Message differs.**

---

### PR #2439 — template-no-index-component-invocation
**ember-template-lint rule:** `no-index-component-invocation` | **Status: PASS**

Disallows explicit `/index` or `::Index` suffix on component invocations.

- All 4 node types covered (element, mustache, block, sub-expression).
- Dynamic error messages match.
- Good test coverage including nested namespaces and false positives.
- **Minor:** Verify `.value` vs `.original` property for string literal params.

---

### PR #2438 — template-no-html-comments
**ember-template-lint rule:** `no-html-comments` | **Status: NEEDS WORK**

**Issues:**
1. **`originallyFrom.name` bug:** Set to `'eslint-plugin-ember'` instead of `'ember-template-lint'`.
2. **Different detection mechanism:** Uses `sourceCode.getAllComments()` + raw source check instead of `CommentStatement` visitor. Reasonable for ESLint but different approach.
3. **Missing config comment filtering:** ember-template-lint skips `<!-- template-lint-disable -->` comments. Less relevant for ESLint context but worth noting.
4. **Message differs:** `"HTML comment detected"` → `"HTML comments should not be used in templates..."`.

---

### PR #2436 — template-no-form-action
**No ember-template-lint counterpart** | **Status: NEEDS WORK**

See [Critical Issues](#critical-issues-must-fix-before-merge). No corresponding rule exists. The HTML `action` attribute on `<form>` is standard HTML. This is a new rule, not an extraction.

---

### PR #2432 — template-no-extra-mut-helpers (Draft)
**ember-template-lint rule:** `no-extra-mut-helper-argument` | **Status: CRITICAL**

See [Critical Issues](#critical-issues-must-fix-before-merge). Logic is inverted — flags correct single-argument usage instead of incorrect multi-argument usage.

---

### PR #2427 — template-no-duplicate-landmark-elements
**ember-template-lint rule:** `no-duplicate-landmark-elements` | **Status: NEEDS WORK**

**Issues:**
1. **Missing dialog/popover scoping:** Landmarks inside `<dialog>` or `[popover]` elements should be treated as separate scope.
2. **Incomplete block scoping:** Only `if`/`unless` blocks get scope treatment; `each`, `let`, component blocks do not.
3. **Added `section` element** (not in original — `<section>` → `region` role).
4. **Different reporting approach:** Batch analysis at `Program:exit` vs eager per-element reporting.

---

### PR #2426 — template-no-duplicate-id
**ember-template-lint rule:** `no-duplicate-id` | **Status: NEEDS WORK**

**Issues:**
1. **Missing ancestor yield block resolution:** ember-template-lint's `getMustacheValue` differentiates `{{inputProperties.id}}` across different `<MyComponent>` invocations. PR uses `sourceCode.getText()` which would produce identical strings → false positives.
2. **Extra `conditionalReportedDuplicates` logic** not in original — may suppress valid reports.

---


### PR #2418 — template-no-down-event-binding (Draft)
**ember-template-lint rule:** `no-pointer-down-event-binding` | **Status: CRITICAL**

See [Critical Issues](#critical-issues-must-fix-before-merge). Wrong event set, missing modifier handling, wrong error message.

---

### PR #2413 — template-no-builtin-form-components (Draft)
**ember-template-lint rule:** `no-builtin-form-components` | **Status: PASS**

Simple rule checking `<Input>` and `<Textarea>`. Error messages identical. No configuration. Both gjs and hbs tested.

---

### PR #2419 — template-no-duplicate-attributes
**ember-template-lint rule:** `no-duplicate-attributes` | **Status: PASS**

Clean port. All 4 node types covered (element, mustache, block, sub-expression). More efficient `Map`-based algorithm vs original's O(n^2). Fix uses ESLint's `fixer.removeRange` correctly. Good test coverage.

---

### PR #2409 — template-no-bare-strings
**ember-template-lint rule:** `no-bare-strings` | **Status: NEEDS WORK**

Complex rule (371 lines in ember-template-lint). Areas requiring manual verification:
- `isStrictMode` handling for `Input`/`Textarea` built-in component attributes
- `page-title`/`if`/`unless`/`concat` helper string checking
- Default allowlist completeness (67 entries in original)
- `elementAttributes` and `globalAttributes` handling
- Object and array config forms

---

## Statistics

| Status | Count |
|--------|-------|
| **PASS** | 9 |
| **NEEDS WORK** | 23 |
| **CRITICAL** | 4 |
| **Total** | 36 |

## Loose-Mode-Only Rules (irrelevant for .gts/.gjs)

Some of the 36 PRs extract rules that only apply to loose-mode (classic `.hbs`) templates and are **irrelevant for strict-mode `.gjs`/`.gts` files**. In strict mode, the Glimmer compiler enforces these constraints at compile time, or the patterns simply cannot occur.

### Explicitly `templateMode: 'loose'` in the PR branches

Verified by checking the actual PR branch code:

| PR | Rule | Why loose-only |
|----|------|---------------|
| #2469 | template-no-implicit-this | Strict mode enforces explicit `this`/`@` at parser level. ember-template-lint also returns early when `isStrictMode`. |
| #2460 | template-no-curly-component-invocation | Curly component invocation is impossible in strict mode |
| #2459 | template-no-class-bindings | `classBinding`/`classNameBindings` are a loose-mode-only API |
| #2470 | template-no-input-block | Block `{{input}}` is a loose-mode-only built-in |
| #2468 | template-no-extra-mut-helper-argument | `mut` helper is a loose-mode-only helper |

### Explicitly `templateMode: 'both'` in the PR branches

These are confirmed as applying to both loose and strict mode:

`template-no-at-ember-render-modifiers`, `template-no-bare-yield`, `template-no-dynamic-subexpression-invocations`, `template-eol-last`, `template-linebreak-style`, `template-block-indentation`, `template-attribute-indentation`

### Conceptually loose-only (not explicitly marked but pattern can't occur in strict mode)

| PR | Rule | Why irrelevant in strict mode |
|----|------|-------------------------------|
| #2451 | template-deprecated-render-helper | `{{render}}` helper does not exist in strict mode |
| #2450 | template-deprecated-inline-view-helper | `{{view}}` helper does not exist in strict mode |
| #2441 | template-no-inline-linkto | Curly `{{link-to}}` syntax — in GJS you use `<LinkTo>` |
| #2477 | template-no-link-to-positional-params | Positional params only possible with curly `{{link-to}}` |
| #2454 | template-no-ambiguous-glimmer-paths | Docs say HBS only; strict mode enforces explicit paths |
| #2432 | template-no-extra-mut-helpers (Draft) | Docs say HBS Only; `mut` doesn't exist in strict mode |

### Rules with `isStrictMode` guards in ember-template-lint

These ember-template-lint rules have `isStrictMode` guards that affect behavior in GJS/GTS context. The extract PRs should replicate these guards:

| Rule | Guard behavior |
|------|---------------|
| `no-implicit-this` | Returns early (disables itself) when `isStrictMode` |
| `no-invalid-link-title` | Skips `LinkTo` checks when `isStrictMode` |
| `no-invalid-link-text` | Skips `LinkTo` checks when `isStrictMode` |
| `no-bare-strings` | Excludes `Input`/`Textarea` built-in component attributes when `isStrictMode` |
| `block-indentation` | Adjusts standalone validation when `isStrictMode && isEmbedded` |
| `eol-last` | Disables when `isEmbedded` (GJS templates are embedded) |

**Impact on the extract PRs:** PRs #2473 and #2472 are missing these `isStrictMode` guards, which could cause false positives in GJS/GTS files. PR #2464 (eol-last) correctly handles this by skipping templates starting with `<template>`. PR #2409 (no-bare-strings) needs verification that strict-mode attribute handling is correct.

### Summary

Of the 36 extract rule PRs, **~11 are loose-mode only** (5 explicitly + 6 conceptually) and do not contribute to the goal of replacing ember-template-lint for GJS/GTS projects. The remaining **~25 rules are relevant for GJS/GTS** and are the ones that matter for eliminating the ember-template-lint dependency.

---

## Common Patterns Across PRs

1. **Missing `isLocal` / block param checks** — PRs #2469, #2455, #2450 all fail to detect when a path refers to a block parameter, causing false positives.
2. **Missing autofix** — Several ember-template-lint rules provide autofixes that are not ported: #2441, #2450, #2451, #2452 (partial).
3. **Error message divergence** — Many PRs use shorter/generic messages losing actionable guidance from the originals (#2469, #2467, #2471, #2473, #2477).
4. **Configuration gaps** — Several PRs don't support all config forms (RegExp in allow lists, object configs, editorconfig integration).
5. **Scope expansion** — Some PRs flag cases the original doesn't (#2441, #2457, #2467, #2477), which would cause unexpected errors for projects migrating from ember-template-lint.
6. **Case sensitivity bugs** — #2475 missing `.toLowerCase()` on role values; #2418 missing case-insensitive event matching.
7. **Strict-mode guards missing** — #2473, #2472 don't implement `isStrictMode` checks that the originals use to skip `LinkTo` in strict (GJS) context.
