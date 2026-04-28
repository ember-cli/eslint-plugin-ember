# Glimmer attribute rendering behavior

Reference for rule authors. Most template lint rules need to answer: "given an attribute written as `attr={{X}}` or `attr="{{X}}"` or `attr="value"`, what does it actually do at runtime?" The answer is **non-obvious and attribute-specific**, and several common mental models are wrong. This doc captures empirically-verified Glimmer rendering behavior so rule classification logic matches reality instead of intuition.

> **Read this before writing or modifying any rule that inspects attribute values via `GlimmerBooleanLiteral`, `GlimmerStringLiteral`, `GlimmerConcatStatement`, or `GlimmerTextNode`.**

## TL;DR — the lint-truth table

For static analysis, "is the attribute present at runtime?" reduces to:

| Source form                                                     | Present at runtime?  |
| --------------------------------------------------------------- | -------------------- |
| `attr` (valueless)                                              | **YES**              |
| `attr=""`                                                       | **YES**              |
| `attr="any-static-text"`                                        | **YES**              |
| `attr={{false}}`                                                | **NO**               |
| `attr={{null}}`                                                 | **NO**               |
| `attr={{undefined}}`                                            | **NO**               |
| `attr={{true}}`                                                 | **YES**              |
| `attr={{"any-string"}}` (incl. `"false"` and `"true"`)          | **YES**              |
| `attr={{number}}`                                               | **YES**              |
| `attr={{this.dynamic}}`                                         | UNKNOWN at lint time |
| `attr="{{anything}}"` (concat single mustache, any inner value) | **YES**              |
| `attr="text{{anything}}"` (concat with text + mustache)         | **YES**              |

Note especially the surprising rows:

- `attr={{"false"}}` — bare-mustache string `"false"` is JS-truthy → attribute present, value `"false"`.
- `attr="{{false}}"` — concat-form _always_ sets the IDL property to truthy, regardless of the literal value inside, even when HTML serialization shows nothing. (Verified against `<video muted="{{false}}">` → `videoEl.muted === true`.)

Common bug: rules treating `attr="{{false}}"` or `attr={{"false"}}` as "falsy" because the literal `false`/`"false"` is in the source. Both render to a present attribute at runtime.

## HTML serialization is not the source of truth

Two layers:

1. **HTML serialization** (`element.outerHTML`) — what the browser's serialized HTML shows.
2. **IDL property** (e.g. `videoEl.muted`) — the live runtime state.

They can disagree, especially for **non-reflecting boolean HTML attributes** like `muted`, `autoplay`, `controls`, `loop` on media elements. The IDL property gets set by Glimmer, but the HTML serialization doesn't reflect it back.

For accessibility and UX rules, the **IDL property / runtime state is what matters**, not the HTML string. A `<video muted={{true}}>` plays muted even though `outerHTML` doesn't show `muted`.

## Verified rendering tables

All rows below were verified by rendering in an Ember dev app and inspecting both `outerHTML` and (for boolean attrs) the IDL property in devtools. See [§ Reproduction template](#reproduction-template) at the end to re-verify if you suspect drift.

### Table 1: bare-mustache `attr={{X}}`

| `X`                             | HTML serialization                                                                                                               | IDL property (boolean attrs)                                   | Lint-truth                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------- |
| `false`                         | omitted                                                                                                                          | false                                                          | **FALSY**                             |
| `null`                          | omitted                                                                                                                          | false (assumed)                                                | **FALSY**                             |
| `undefined`                     | omitted                                                                                                                          | false (assumed)                                                | **FALSY**                             |
| `true`                          | reflecting attrs (`disabled` on `<input>`, `aria-hidden` on `<div>`): `attr=""`. Non-reflecting (`muted` on `<video>`): omitted. | **true**                                                       | **TRUTHY**                            |
| `"any-string"`                  | `attr="any-string"`                                                                                                              | true (string truthy)                                           | **TRUTHY**                            |
| `""` (empty string)             | `attr=""`                                                                                                                        | unverified — could be falsy IDL given JS empty-string-is-falsy | **TRUTHY** by HTML attribute presence |
| number (e.g. `0`, `-1`)         | `attr="<number>"` (e.g. `attr="0"`)                                                                                              | unverified                                                     | **TRUTHY** by HTML attribute presence |
| dynamic path (e.g. `this.flag`) | depends on runtime value                                                                                                         | depends                                                        | **UNKNOWN** at lint time              |

### Table 2: concat-mustache `attr="…{{X}}…"`

| Form                  | HTML serialization (boolean attrs)              | HTML serialization (string/ARIA attrs) | IDL property (boolean attrs)    | Lint-truth                                                                               |
| --------------------- | ----------------------------------------------- | -------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `"{{true}}"`          | reflecting: `attr=""`. Non-reflecting: omitted. | `attr="true"`                          | **true**                        | **TRUTHY**                                                                               |
| `"{{false}}"`         | reflecting: `attr=""`. Non-reflecting: omitted. | `attr="false"`                         | **true**                        | **TRUTHY**                                                                               |
| `"{{'true'}}"`        | reflecting: `attr=""`. Non-reflecting: omitted. | `attr="true"`                          | true (assumed)                  | **TRUTHY**                                                                               |
| `"{{'false'}}"`       | reflecting: `attr=""`. Non-reflecting: omitted. | `attr="false"`                         | true (assumed)                  | **TRUTHY**                                                                               |
| `"text{{X}}"` (any X) | non-reflecting: omitted (verified for `muted`)  | `attr="text<stringified-X>"`           | true (assumed)                  | **TRUTHY**                                                                               |
| `"{{this.dynamic}}"`  | depends                                         | depends                                | true (per the pattern; assumed) | **TRUTHY** at runtime, but rule may want to treat as UNKNOWN if it cares about the value |

**Concat is always truthy at runtime, regardless of the literal value inside.** This is the most surprising finding and the source of most classification bugs. Glimmer's concat handling appears to set the IDL property based on attribute _presence in the source_, not on the literal value evaluating to true.

### Table 3: static text attributes

| Form                  | HTML                  | Lint-truth                 |
| --------------------- | --------------------- | -------------------------- |
| `attr` (valueless)    | `attr=""`             | **TRUTHY**                 |
| `attr=""`             | `attr=""`             | **TRUTHY**                 |
| `attr="literal text"` | `attr="literal text"` | **TRUTHY** with that value |

For HTML boolean attributes (`muted`, `disabled`, `hidden`, etc.), HTML semantics treat any presence — including `attr="false"` — as the boolean being ON. This is HTML's rule, not Glimmer's.

## Per-attribute notes

**Reflecting boolean HTML attributes** (`disabled`, `hidden`, `readonly`, `required`, `multiple`, `selected`, `checked`, etc.):

- IDL property reflects to HTML attribute. Setting `el.disabled = true` adds `disabled=""`.
- Concat form like `disabled="{{false}}"` keeps the attribute as `disabled=""` in HTML serialization (because IDL is set true, and reflection writes it back).

**Non-reflecting boolean HTML attributes** on media elements (`muted`, `autoplay`, `controls`, `loop`):

- IDL property exists but does _not_ reflect to HTML serialization. Setting `videoEl.muted = true` does _not_ add `muted=""` to outerHTML.
- HTML inspector misleads you here. **Always check the IDL property to know runtime state.**

**ARIA / string attributes** (`aria-hidden`, `aria-label`, `role`, etc.):

- No IDL property — HTML attribute is the ground truth.
- Value matters, not just presence: `aria-hidden="false"` means _visible_; `aria-hidden="true"` means _hidden_. Rules need to check the value, not just presence.
- Bare `attr={{true}}` renders as `attr=""` (empty string value) — _contested_ in ARIA semantics. Different tools treat valueless/empty `aria-hidden` differently. See `template-no-invalid-interactive` doc.

**Numeric attributes** (`tabindex`, `colspan`, etc.):

- Always render the literal value in HTML.
- Both bare and concat forms preserve the numeric value as a string (e.g. `tabindex={{0}}` → `tabindex="0"`).
- Rules checking value (e.g. positive vs. zero/negative tabindex) should extract the literal value from the AST, not just check presence.

## Reproduction template

If you suspect Glimmer behavior has changed, paste the following into a template in any Ember dev app and inspect the rendered output. Each input is preceded by an HTML comment showing the source form; the rendered HTML appears immediately after.

```hbs
{{! A. <video> + muted (boolean HTML, non-reflecting) }}
<!-- <video muted></video>: -->
<video muted></video>
<!-- <video muted=""></video>: -->
<video muted=''></video>
<!-- <video muted="true"></video>: -->
<video muted='true'></video>
<!-- <video muted="false"></video>: -->
<video muted='false'></video>
<!-- <video muted={{true}}></video>: -->
<video muted={{true}}></video>
<!-- <video muted={{false}}></video>: -->
<video muted={{false}}></video>
<!-- <video muted={{"true"}}></video>: -->
<video muted={{'true'}}></video>
<!-- <video muted={{"false"}}></video>: -->
<video muted={{'false'}}></video>
<!-- <video muted={{null}}></video>: -->
<video muted={{null}}></video>
<!-- <video muted={{undefined}}></video>: -->
<video muted={{undefined}}></video>
<!-- <video muted={{""}}></video>: -->
<video muted={{''}}></video>
<!-- <video muted="{{true}}"></video>: -->
<video muted='{{true}}'></video>
<!-- <video muted="{{false}}"></video>: -->
<video muted='{{false}}'></video>
<!-- <video muted="{{'true'}}"></video>: -->
<video muted='{{"true"}}'></video>
<!-- <video muted="{{'false'}}"></video>: -->
<video muted='{{"false"}}'></video>
<!-- <video muted="x{{true}}"></video>: -->
<video muted='x{{true}}'></video>
<!-- <video muted="x{{false}}"></video>: -->
<video muted='x{{false}}'></video>

{{! B. <div> + aria-hidden (ARIA string, no IDL property) }}
<!-- <div aria-hidden></div>: -->
<div aria-hidden></div>
<!-- <div aria-hidden=""></div>: -->
<div aria-hidden=''></div>
<!-- <div aria-hidden="true"></div>: -->
<div aria-hidden='true'></div>
<!-- <div aria-hidden="false"></div>: -->
<div aria-hidden='false'></div>
<!-- <div aria-hidden={{true}}></div>: -->
<div aria-hidden={{true}}></div>
<!-- <div aria-hidden={{false}}></div>: -->
<div aria-hidden={{false}}></div>
<!-- <div aria-hidden={{"true"}}></div>: -->
<div aria-hidden={{'true'}}></div>
<!-- <div aria-hidden={{"false"}}></div>: -->
<div aria-hidden={{'false'}}></div>
<!-- <div aria-hidden={{null}}></div>: -->
<div aria-hidden={{null}}></div>
<!-- <div aria-hidden={{undefined}}></div>: -->
<div aria-hidden={{undefined}}></div>
<!-- <div aria-hidden={{""}}></div>: -->
<div aria-hidden={{''}}></div>
<!-- <div aria-hidden="{{true}}"></div>: -->
<div aria-hidden='{{true}}'></div>
<!-- <div aria-hidden="{{false}}"></div>: -->
<div aria-hidden='{{false}}'></div>
<!-- <div aria-hidden="{{'true'}}"></div>: -->
<div aria-hidden='{{"true"}}'></div>
<!-- <div aria-hidden="{{'false'}}"></div>: -->
<div aria-hidden='{{"false"}}'></div>

{{! C. <input> + disabled (boolean HTML, reflecting) }}
<!-- <input disabled />: -->
<input disabled />
<!-- <input disabled={{true}} />: -->
<input disabled={{true}} />
<!-- <input disabled={{false}} />: -->
<input disabled={{false}} />
<!-- <input disabled={{"false"}} />: -->
<input disabled={{'false'}} />
<!-- <input disabled="{{false}}" />: -->
<input disabled='{{false}}' />

{{! D. <div> + tabindex (numeric) }}
<!-- <div tabindex={{0}}></div>: -->
<div tabindex={{0}}></div>
<!-- <div tabindex={{-1}}></div>: -->
<div tabindex={{-1}}></div>
<!-- <div tabindex="{{0}}"></div>: -->
<div tabindex='{{0}}'></div>
<!-- <div tabindex={{"0"}}></div>: -->
<div tabindex={{'0'}}></div>

{{! E. IDL property check for non-reflecting boolean attrs }}
<video id='t1' muted={{true}}></video>
<video id='t2' muted='{{true}}'></video>
<video id='t3' muted='{{false}}'></video>
<video id='t4'></video>
{{! Then in devtools console:
       document.getElementById('t1').muted  // expected: true
       document.getElementById('t2').muted  // expected: true
       document.getElementById('t3').muted  // expected: true (the surprising one)
       document.getElementById('t4').muted  // expected: false (no attr → default)
}}
```

## Open questions / unverified

- **Bare `{{0}}`, `{{""}}`, `{{NaN}}` IDL property** — JS-falsy literal values in bare mustache. The HTML serialization keeps the attribute (e.g. `attr="0"`), but whether the IDL property is set to true (matching presence) or false (matching JS-falsy) is unverified. Rules should treat as TRUTHY for now (HTML presence), and revisit if a counter-example surfaces.
- **Concat with dynamic path** (e.g. `attr="{{this.flag}}"`) — assumed truthy by analogy to literal-concat behavior, but not directly verified. Rules that care about the value (not just presence) should treat concat-with-dynamic as UNKNOWN.
- **`{{false}}` followed by static text in concat** (e.g. `attr="{{false}}-suffix"`) — verified for boolean attrs only (`muted`); behavior on string/ARIA attrs not directly tested but assumed to follow the "concat always renders for string attrs" pattern.

## How to extend this doc

When you discover a new edge case:

1. Render the source form in an Ember dev app and capture both `outerHTML` and (where relevant) the IDL property.
2. Add a row to the appropriate table above with verified-only data. Mark assumptions explicitly with "(assumed)" or "(unverified)".
3. Cite the date and Ember/Glimmer version of the verification in the commit message.
4. If the new finding contradicts an existing rule's classification, open an issue or PR fixing the rule and link this doc.

## Verification metadata

- **Date verified:** 2026-04-28
- **Ember/Glimmer version:** _TODO — fill in `ember-source` version from the dev app where t1–t4 were tested._
- **Verified by:** [@johanrd](https://github.com/johanrd) (rendering app, devtools inspection)
- **Methodology:** rendered template fragments, inspected `outerHTML` for HTML serialization and JS property access for IDL state

## Related

- The Glimmer VM source for attribute rendering: <https://github.com/glimmerjs/glimmer-vm>
- HTML spec on boolean attributes and reflection: <https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes>
- ARIA `aria-hidden` semantics: <https://www.w3.org/TR/wai-aria-1.2/#aria-hidden>
