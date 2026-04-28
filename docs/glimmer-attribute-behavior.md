# Glimmer attribute rendering behavior

Reference for rule authors. Most template lint rules need to answer: "given an attribute written as `attr={{X}}` or `attr="{{X}}"` or `attr="value"`, what does it actually do at runtime?" The answer is non-obvious — Glimmer's bare-mustache and concat-mustache forms coerce values differently per attribute kind, HTML serialization can disagree with the live IDL property, and several intuitive mental models are wrong.

This doc captures empirically-verified rendering behavior. Every cell in every table below comes from rendering the template under [§ To reproduce the reference table](#to-reproduce-the-reference-table) in an Ember dev app and inspecting `outerHTML` plus the relevant IDL property in devtools. **No extrapolation.** If a form isn't in a table, it hasn't been verified — extend the reproduction template and add the row.

> Read this before writing or modifying any rule that inspects attribute values via `GlimmerBooleanLiteral`, `GlimmerStringLiteral`, `GlimmerConcatStatement`, or `GlimmerTextNode`.

## Reference table

Five per-attribute tables, one per representative attribute kind. IDs (`m1`–`m19`, `h1`–`h15`, `d1`–`d10`, `t1`–`t7`, `i1`–`i5`) cross-reference the reproduction template below.

### `<video>` + `muted` — boolean HTML attribute, non-reflecting

`muted` is an HTML boolean attribute on `<video>`. The IDL `videoEl.muted` is the **live** muted state (independent of the content attribute); `videoEl.defaultMuted` is what reflects. At media-load time the user agent sets `muted` from `defaultMuted`. The "IDL muted" column below is read **before media load**, so for cases where only the HTML attribute is set, IDL muted reads false at that snapshot but becomes true once the media loads. The "At play time" column derives the value the rule cares about: is the audio actually muted when autoplay starts?

| ID  | Source                                     | outerHTML                       | IDL `muted` (preload) | hasAttr | At play time                                                  |
| --- | ------------------------------------------ | ------------------------------- | --------------------- | ------- | ------------------------------------------------------------- |
| m1  | `<video muted></video>`                    | `<video muted=""></video>`      | `false`               | `true`  | **muted ON** (defaultMuted via attr)                          |
| m2  | `<video muted=""></video>`                 | `<video muted=""></video>`      | `false`               | `true`  | **muted ON**                                                  |
| m3  | `<video muted="true"></video>`             | `<video muted="true"></video>`  | `false`               | `true`  | **muted ON**                                                  |
| m4  | `<video muted="false"></video>`            | `<video muted="false"></video>` | `false`               | `true`  | **muted ON** (HTML boolean-attr presence)                     |
| m5  | `<video muted={{true}}></video>`           | `<video></video>`               | `true`                | `false` | **muted ON** (IDL set directly)                               |
| m6  | `<video muted={{false}}></video>`          | `<video></video>`               | `false`               | `false` | **muted OFF**                                                 |
| m7  | `<video muted={{"true"}}></video>`         | `<video muted="true"></video>`  | `false`               | `true`  | **muted ON**                                                  |
| m8  | `<video muted={{"false"}}></video>`        | `<video muted="false"></video>` | `false`               | `true`  | **muted ON** (HTML boolean-attr presence)                     |
| m9  | `<video muted={{null}}></video>`           | `<video></video>`               | `false`               | `false` | **muted OFF**                                                 |
| m10 | `<video muted={{undefined}}></video>`      | `<video></video>`               | `false`               | `false` | **muted OFF**                                                 |
| m11 | `<video muted={{""}}></video>`             | `<video muted=""></video>`      | `false`               | `true`  | **muted ON**                                                  |
| m12 | `<video muted={{0}}></video>`              | `<video></video>`               | `false`               | `false` | **muted OFF**                                                 |
| m13 | `<video muted="{{true}}"></video>`         | `<video></video>`               | `true`                | `false` | **muted ON** (concat sets IDL true)                           |
| m14 | `<video muted="{{false}}"></video>`        | `<video></video>`               | `true`                | `false` | **muted ON** (concat sets IDL true regardless of inner value) |
| m15 | `<video muted="{{'true'}}"></video>`       | `<video></video>`               | `true`                | `false` | **muted ON**                                                  |
| m16 | `<video muted="{{'false'}}"></video>`      | `<video></video>`               | `true`                | `false` | **muted ON**                                                  |
| m17 | `<video muted="x{{true}}"></video>`        | `<video></video>`               | `true`                | `false` | **muted ON**                                                  |
| m18 | `<video muted="x{{false}}"></video>`       | `<video></video>`               | `true`                | `false` | **muted ON**                                                  |
| m19 | `<video muted="{{false}}-suffix"></video>` | `<video></video>`               | `true`                | `false` | **muted ON**                                                  |

**Lint truth for `muted`:** OFF iff the source is bare `{{false}}` / `{{null}}` / `{{undefined}}` / `{{0}}`. Every other form is ON at play time — including the surprising ones (any concat regardless of literal value; bare string `"false"`).

### `<input>` + `disabled` — boolean HTML attribute, reflecting

Same boolean-coercion behavior as `muted` for the bare-mustache form, but `disabled` reflects: when the IDL `disabled` is set, the HTML attribute appears as `disabled=""`.

| ID  | Source                             | outerHTML                  | IDL `disabled` | hasAttr | At runtime                             |
| --- | ---------------------------------- | -------------------------- | -------------- | ------- | -------------------------------------- |
| d1  | `<input disabled />`               | `<input disabled="">`      | `true`         | `true`  | **disabled ON**                        |
| d2  | `<input disabled={{true}} />`      | `<input disabled="">`      | `true`         | `true`  | **disabled ON**                        |
| d3  | `<input disabled={{false}} />`     | `<input>`                  | `false`        | `false` | **disabled OFF**                       |
| d4  | `<input disabled={{"false"}} />`   | `<input disabled="false">` | `true`         | `true`  | **disabled ON**                        |
| d5  | `<input disabled={{"true"}} />`    | `<input disabled="true">`  | `true`         | `true`  | **disabled ON**                        |
| d6  | `<input disabled={{null}} />`      | `<input>`                  | `false`        | `false` | **disabled OFF**                       |
| d7  | `<input disabled="{{false}}" />`   | `<input disabled="">`      | `true`         | `true`  | **disabled ON** (concat sets IDL true) |
| d8  | `<input disabled="{{true}}" />`    | `<input disabled="">`      | `true`         | `true`  | **disabled ON**                        |
| d9  | `<input disabled="{{'false'}}" />` | `<input disabled="">`      | `true`         | `true`  | **disabled ON**                        |
| d10 | `<input disabled="x{{true}}" />`   | `<input disabled="">`      | `true`         | `true`  | **disabled ON**                        |

**Lint truth for `disabled`:** identical falsy-set as `muted` — bare `{{false}}` / `{{null}}` (and by inference `{{undefined}}` / `{{0}}`, not yet tested for this attribute). Every other form is ON. The HTML serialization differs from `muted` (because `disabled` reflects), but the boolean lint truth is the same.

### `<div>` + `aria-hidden` — ARIA string attribute

ARIA attributes are string-valued, but Glimmer's bare-mustache form applies the same falsy-coercion as for boolean HTML attributes (omit on `false`/`null`/`undefined`). Bare-string and concat forms render the value literally — concat does **not** coerce to a boolean here. The "At runtime (per ARIA spec)" column derives whether the element is hidden from assistive tech: `aria-hidden="true"` is hidden; `aria-hidden="false"` is visible; `aria-hidden=""` reads as **visible** because it's an invalid enumerated value and falls back to the default state ("undefined" per [WAI-ARIA 1.2 §6.6 aria-hidden](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden) — "The default value is undefined, which means the element is not hidden from the accessibility API").

| ID  | Source                                  | outerHTML                         | IDL `ariaHidden` | hasAttr | At runtime (ARIA)                                              |
| --- | --------------------------------------- | --------------------------------- | ---------------- | ------- | -------------------------------------------------------------- |
| h1  | `<div aria-hidden></div>`               | `<div aria-hidden=""></div>`      | `""`             | `true`  | **visible** (empty value falls back to default per spec)       |
| h2  | `<div aria-hidden=""></div>`            | `<div aria-hidden=""></div>`      | `""`             | `true`  | **visible** (invalid empty → default)                          |
| h3  | `<div aria-hidden="true"></div>`        | `<div aria-hidden="true"></div>`  | `"true"`         | `true`  | **hidden**                                                     |
| h4  | `<div aria-hidden="false"></div>`       | `<div aria-hidden="false"></div>` | `"false"`        | `true`  | **visible**                                                    |
| h5  | `<div aria-hidden={{true}}></div>`      | `<div aria-hidden=""></div>`      | `""`             | `true`  | **visible** (rendered empty — see Glimmer-coercion note below) |
| h6  | `<div aria-hidden={{false}}></div>`     | `<div></div>`                     | `null`           | `false` | **visible** (default — attribute omitted)                      |
| h7  | `<div aria-hidden={{"true"}}></div>`    | `<div aria-hidden="true"></div>`  | `"true"`         | `true`  | **hidden**                                                     |
| h8  | `<div aria-hidden={{"false"}}></div>`   | `<div aria-hidden="false"></div>` | `"false"`        | `true`  | **visible**                                                    |
| h9  | `<div aria-hidden={{null}}></div>`      | `<div></div>`                     | `null`           | `false` | **visible**                                                    |
| h10 | `<div aria-hidden={{undefined}}></div>` | `<div></div>`                     | `null`           | `false` | **visible**                                                    |
| h11 | `<div aria-hidden={{""}}></div>`        | `<div aria-hidden=""></div>`      | `""`             | `true`  | **visible** (invalid empty → default)                          |
| h12 | `<div aria-hidden="{{true}}"></div>`    | `<div aria-hidden="true"></div>`  | `"true"`         | `true`  | **hidden**                                                     |
| h13 | `<div aria-hidden="{{false}}"></div>`   | `<div aria-hidden="false"></div>` | `"false"`        | `true`  | **visible**                                                    |
| h14 | `<div aria-hidden="{{'true'}}"></div>`  | `<div aria-hidden="true"></div>`  | `"true"`         | `true`  | **hidden**                                                     |
| h15 | `<div aria-hidden="{{'false'}}"></div>` | `<div aria-hidden="false"></div>` | `"false"`        | `true`  | **visible**                                                    |

**Lint truth for `aria-hidden`:** the rule depends on the value, not just presence. Notable differences from boolean attrs: bare `{{true}}` renders as `aria-hidden=""` (per ARIA §6.6 → visible, NOT hidden); concat `="{{false}}"` renders as `aria-hidden="false"` (visible — _not_ IDL-coerced like boolean attrs).

> **Glimmer coercion note (h5):** `<div aria-hidden={{true}}>` renders `aria-hidden=""`, not `aria-hidden="true"`. Glimmer appears to apply its boolean-HTML-attribute coercion (`true` → present-with-empty-value) to ARIA attributes, where the spec wants the literal string `"true"`. Per ARIA §6.6 the rendered empty value is invalid and falls back to the default, so the element is **visible** — opposite of what the author wrote. Rules that interpret `{{true}}` as author-intent-to-hide are making an explicit policy choice against the spec verdict; if you take that choice, document it and don't conflate it with the spec-true `h7`/`h12`/`h14` cases.

#### Verifying the "visible" verdict empirically

The "At runtime (ARIA)" column above is derived from the spec. To verify what your browser + AT actually do for each row, the cleanest empirical path is the **DevTools Accessibility panel**:

1. Render the section-B fragment from the reproduction template (each `h*` element gets a stable id).
2. Open DevTools → Accessibility tab (Chrome: Elements panel sidebar; Firefox: separate "Accessibility" tab).
3. Select each `h*` element. The panel shows whether it's exposed to AT:
   - **Exposed** with a computed role → element is in the accessibility tree → "visible".
   - **"Ignored"** with reason "aria-hidden=true" → element removed from AT tree → "hidden".
4. Confirm h1, h2, h5, h11 are exposed (matching spec), and h3, h7, h12, h14 are ignored due to aria-hidden.

A scriptable approximation that doesn't require the DevTools panel — implements the spec's aria-hidden rule directly in JS:

```js
function isAriaHiddenPerSpec(el) {
  for (let cur = el; cur instanceof Element; cur = cur.parentElement) {
    // Per WAI-ARIA §6.6: only the literal string "true" hides; everything
    // else (including "" / "false" / missing) leaves the element visible.
    if (cur.getAttribute('aria-hidden') === 'true') return true;
  }
  return false;
}

for (let i = 1; i <= 15; i++) {
  const id = `h${i}`;
  const el = document.getElementById(id);
  if (!el) continue;
  console.log(
    `${id} attrValue=${JSON.stringify(el.getAttribute('aria-hidden'))} hidden=${isAriaHiddenPerSpec(el)}`
  );
}
```

This encodes the spec rule rather than introspecting browser-internal AX tree state, but for the simple aria-hidden cases here the two converge — modern Chrome / Firefox / Safari all implement §6.6 as written. If a browser diverges (e.g. treats empty value as hidden), the DevTools panel check above will surface it.

### `<div>` + `tabindex` — numeric attribute

Falsy-coercion (`false`/`null`) omits, like boolean attrs. Numeric and string-numeric values render the literal. IDL `tabIndex` returns `-1` when no attribute is set (the default for non-focusable elements), so `hasAttr` is the cleaner signal for "tabindex is set" than checking `tabIndex`.

| ID  | Source                           | outerHTML                   | IDL `tabIndex` | hasAttr | Effective   |
| --- | -------------------------------- | --------------------------- | -------------- | ------- | ----------- |
| t1  | `<div tabindex={{0}}></div>`     | `<div tabindex="0"></div>`  | `0`            | `true`  | tabindex 0  |
| t2  | `<div tabindex={{-1}}></div>`    | `<div tabindex="-1"></div>` | `-1`           | `true`  | tabindex -1 |
| t3  | `<div tabindex={{1}}></div>`     | `<div tabindex="1"></div>`  | `1`            | `true`  | tabindex 1  |
| t4  | `<div tabindex="{{0}}"></div>`   | `<div tabindex="0"></div>`  | `0`            | `true`  | tabindex 0  |
| t5  | `<div tabindex={{"0"}}></div>`   | `<div tabindex="0"></div>`  | `0`            | `true`  | tabindex 0  |
| t6  | `<div tabindex={{false}}></div>` | `<div></div>`               | `-1` (default) | `false` | not set     |
| t7  | `<div tabindex={{null}}></div>`  | `<div></div>`               | `-1` (default) | `false` | not set     |

**Lint truth for `tabindex`:** rules that care about the value should extract the literal from the AST (the value is preserved as-written across all bare and concat literal forms). Rules that care about presence should check that the source is not bare `{{false}}` / `{{null}}` (and by inference `{{undefined}}`, not tested).

### `<input>` + `autocomplete` — string attribute (not boolean-coerced)

A regular string attribute. Glimmer's bare-mustache **does not** apply falsy-coercion here — `autocomplete={{false}}` renders as `autocomplete="false"` (kept). This is the key difference from boolean HTML attrs and from `aria-*`. The IDL `el.autocomplete` canonicalizes the attribute value (returns `""` for invalid tokens), so it differs from `getAttribute('autocomplete')` for non-spec values.

| ID  | Source                               | outerHTML                      | IDL `autocomplete`   | hasAttr | attrValue |
| --- | ------------------------------------ | ------------------------------ | -------------------- | ------- | --------- |
| i1  | `<input autocomplete="off" />`       | `<input autocomplete="off">`   | `"off"`              | `true`  | `"off"`   |
| i2  | `<input autocomplete={{"off"}} />`   | `<input autocomplete="off">`   | `"off"`              | `true`  | `"off"`   |
| i3  | `<input autocomplete="{{'off'}}" />` | `<input autocomplete="off">`   | `"off"`              | `true`  | `"off"`   |
| i4  | `<input autocomplete={{false}} />`   | `<input autocomplete="false">` | `""` (canonicalized) | `true`  | `"false"` |
| i5  | `<input autocomplete="{{false}}" />` | `<input autocomplete="false">` | `""` (canonicalized) | `true`  | `"false"` |

**Lint truth for `autocomplete`:** rules should check `getAttribute('autocomplete')` (or its AST equivalent) against the spec's valid token list, not the IDL property. The bare-mustache `{{false}}` form will give a literal `"false"` value — almost certainly an authoring bug worth flagging.

### Cross-attribute observations

- **Glimmer's bare-mustache "boolean coercion" list.** For `muted` (HTML boolean), `disabled` (HTML boolean), `aria-hidden` (ARIA string), and `tabindex` (numeric), bare `{{false}}` / `{{null}}` / `{{undefined}}` (and `{{0}}` for `muted`) cause the attribute to be **omitted**. For `autocomplete` (plain string), bare `{{false}}` renders as `autocomplete="false"`. So Glimmer applies boolean-coercion to a known set — at minimum HTML boolean attrs, ARIA attrs, and numeric attrs. Plain string attrs do not get coerced.
- **Bare-mustache string literals never coerce.** `attr={{"false"}}`, `attr={{"true"}}`, `attr={{""}}` always render as `attr="<the-string>"` for every attribute kind tested. The literal `"false"` is JS-truthy and gets passed through.
- **Bare-mustache numeric `0` is in the falsy set for `muted`.** Verified for `muted` (`{{0}}` → omitted). Not yet tested for `disabled` / `aria-hidden` / `autocomplete`.
- **Concat-mustache forks by attribute kind.** For HTML boolean attrs (`muted`, `disabled`), any concat — including `"{{false}}"`, `"{{'false'}}"`, `"x{{false}}"` — sets the IDL property to `true`, regardless of the literal value inside. For ARIA / string attrs (`aria-hidden`, `autocomplete`), concat renders the stringified value as the attribute value (no boolean coercion); `aria-hidden="{{false}}"` becomes `aria-hidden="false"` (visible).
- **Concat is never falsy.** Across all attribute kinds tested, no concat form produces an absent attribute. Rules treating `attr="{{false}}"` as "off" are wrong for boolean attrs (it's IDL-true) and wrong for string attrs (the rendered value is `"false"`, attribute present).

## Reading attribute values in rules

Rule authors who classify attribute values must consume the reference table above through one of these AST shapes — each maps to a known rendering verdict:

| AST shape                                                                                                                                                                      | Source examples                                               | Verdict                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attr.value === null` (no value)                                                                                                                                               | `<input disabled />`                                          | Attribute is **present** with empty value (rendered as `attr=""`) — see d1, h1                                                                                                                                                                                       |
| `attr.value.type === 'GlimmerTextNode'`                                                                                                                                        | `attr="literal text"`                                         | Attribute is **present** with the literal `chars` string — see m1–m4, h2–h4, d1, t-static, i1                                                                                                                                                                        |
| `attr.value.type === 'GlimmerMustacheStatement'` with `path.type === 'GlimmerBooleanLiteral'` and `path.value === true`                                                        | `attr={{true}}`                                               | **Reflecting boolean attrs**: present (e.g., `disabled=""`). **Non-reflecting boolean attrs** (`muted`, `autoplay`, etc.): IDL property set true, HTML attribute omitted. **ARIA string attrs**: present as `attr=""`. **Numeric attrs**: untested. — see m5, d2, h5 |
| `attr.value.type === 'GlimmerMustacheStatement'` with `path.type === 'GlimmerBooleanLiteral'` and `path.value === false` (or `GlimmerNullLiteral` / `GlimmerUndefinedLiteral`) | `attr={{false}}` / `{{null}}` / `{{undefined}}`               | Attribute is **omitted** at runtime — see m6, m9, m10, d3, d6, h6, h9, h10, t6, t7. **Exception:** plain string attrs (e.g., `autocomplete`) do _not_ falsy-coerce; bare `{{false}}` renders as `attr="false"` (i4).                                                 |
| `attr.value.type === 'GlimmerMustacheStatement'` with `path.type === 'GlimmerStringLiteral'`                                                                                   | `attr={{"value"}}`                                            | Attribute is **present** with the literal `path.value` string — see m7, m8, h7, h8, d4, d5, i2                                                                                                                                                                       |
| `attr.value.type === 'GlimmerMustacheStatement'` with `path.type === 'GlimmerNumberLiteral'` (verified for `tabindex` only)                                                    | `attr={{0}}`                                                  | **Numeric attrs**: present with stringified number (t1, t2, t3). **`muted={{0}}` is in the falsy-omit set** (m12); not yet tested for other kinds.                                                                                                                   |
| `attr.value.type === 'GlimmerMustacheStatement'` with dynamic path                                                                                                             | `attr={{this.x}}`                                             | **Unknown** at lint time.                                                                                                                                                                                                                                            |
| `attr.value.type === 'GlimmerConcatStatement'` with all-literal parts                                                                                                          | `attr="{{X}}"` (single literal-mustache) / `attr="text{{X}}"` | **Boolean HTML attrs** (`muted`, `disabled`, etc.): IDL true regardless of inner literal — m13–m19, d7–d10. **ARIA / string attrs** (`aria-hidden`, `autocomplete`): renders the stringified value literally — h12–h15, i3, i5.                                      |
| `attr.value.type === 'GlimmerConcatStatement'` with any dynamic part                                                                                                           | `attr="{{this.x}}"` / `attr="x{{this.y}}"`                    | **Concat is never falsy** — present at runtime, but the value is generally **unknown** at lint time.                                                                                                                                                                 |

### Common mistakes to avoid

1. **Don't use `findAttr(node, 'foo')` (AST-presence) as a proxy for "attribute set at runtime."** It's wrong for bare `{{false}}` / `{{null}}` / `{{undefined}}` on boolean-coerced attrs (m6/m9/m10/d3/d6/h6/h9/h10/t6/t7) — those forms still create an `AttrNode` in the AST but are omitted at runtime.
2. **Don't lump `BooleanLiteral(false)` with `StringLiteral("false")`.** Bare `{{"false"}}` is a JS-truthy string; it renders the literal `"false"` value (i4, h8, d4, m8). Treating them together as "off" is the most common audit footgun in this codebase.
3. **Don't treat single-mustache concat as the inner literal.** `attr="{{X}}"` is **never** falsy. For boolean HTML attrs the IDL property is set true regardless of `X`'s literal value (m14 verified: `<video muted="{{false}}">` → `videoEl.muted === true`). For ARIA/string attrs the rendered HTML is the stringified value (h13: `aria-hidden="{{false}}"` → `aria-hidden="false"`, visible per ARIA spec).
4. **Don't apply boolean-coercion to plain string attrs.** `autocomplete`, `name`, `id`, `for`, `href`, `role`, `type`, `method`, `lang`, `title`, `alt` etc. do **not** falsy-coerce. Bare `{{false}}` on these renders the literal `"false"`. Plain-string attrs are documented under `i1`–`i5`; the falsy-coercion list (cross-attribute observations) covers HTML boolean attrs, ARIA attrs, and numeric attrs only.
5. **`role` is plain string, not ARIA-coerced.** Despite living in the ARIA family conceptually, `role` is a plain string DOM attribute — bare `role={{false}}` renders `role="false"` (analogous to i4), not omitted.
6. **`{{true}}` for `aria-hidden` (h5) renders `aria-hidden=""` — visible per [ARIA §6.6](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden) (invalid empty value falls back to the default), _not_ `aria-hidden="true"`.** Glimmer's boolean-HTML-attr coercion produces the empty value where the spec wants the literal string `"true"`. Rules that interpret author-intent (`{{true}}` → "hide") are making an explicit policy choice against the spec verdict; document it and don't conflate h5 with h7 / h12 / h14 (which render the literal `"true"` and are spec-hidden).

### Recommended pattern

The shared utility [`lib/utils/glimmer-attr-presence.js`](../lib/utils/glimmer-attr-presence.js) encodes the verdict table once. Rule authors should consume it rather than re-implementing the AST walk:

```js
const { classifyAttribute } = require('../utils/glimmer-attr-presence');

const attr = node.attributes?.find((a) => a.name === 'aria-hidden');
const { presence, value } = classifyAttribute(attr);
// presence: 'absent' | 'present' | 'unknown'
// value:    string | null
//
// kind is inferred from attr.name (boolean / aria / numeric / plain-string).
// Override with options.kind when needed: classifyAttribute(attr, { kind: 'aria' }).

if (presence === 'present' && value === 'true') {
  // hidden — covers h3, h7, h12, h14 in one branch.
}
```

The utility maps every row in the reference table above to a single `(presence, value)` pair, including the surprising cases (`{{"false"}}` is JS-truthy, `aria-hidden={{true}}` renders empty per h5, concat is never falsy, etc.). Cite the doc row IDs from code comments where you call it so reviewers can confirm the lint truth without re-reading the AST.

## To reproduce the reference table

Every cell above was populated by rendering the template below in an Ember dev app and running the bundled JS console snippet to print each test case's `outerHTML` and IDL state. To re-verify (or extend with new attributes):

1. Paste sections A–E into a template in your Ember dev app.
2. Render in the browser, open devtools.
3. Paste the JS snippet (after the template) into the console.
4. Compare the printed output against the tables above.
5. If anything diverges, update the changed cell, cite the new `ember-source` version in the commit, and note the change.

```hbs
{{! A. <video> + muted (boolean HTML, non-reflecting) }}
<video id='m1' muted></video>
<video id='m2' muted=''></video>
<video id='m3' muted='true'></video>
<video id='m4' muted='false'></video>
<video id='m5' muted={{true}}></video>
<video id='m6' muted={{false}}></video>
<video id='m7' muted={{'true'}}></video>
<video id='m8' muted={{'false'}}></video>
<video id='m9' muted={{null}}></video>
<video id='m10' muted={{undefined}}></video>
<video id='m11' muted={{''}}></video>
<video id='m12' muted={{0}}></video>
<video id='m13' muted='{{true}}'></video>
<video id='m14' muted='{{false}}'></video>
<video id='m15' muted='{{"true"}}'></video>
<video id='m16' muted='{{"false"}}'></video>
<video id='m17' muted='x{{true}}'></video>
<video id='m18' muted='x{{false}}'></video>
<video id='m19' muted='{{false}}-suffix'></video>

{{! B. <div> + aria-hidden (ARIA string) }}
<div id='h1' aria-hidden></div>
<div id='h2' aria-hidden=''></div>
<div id='h3' aria-hidden='true'></div>
<div id='h4' aria-hidden='false'></div>
<div id='h5' aria-hidden={{true}}></div>
<div id='h6' aria-hidden={{false}}></div>
<div id='h7' aria-hidden={{'true'}}></div>
<div id='h8' aria-hidden={{'false'}}></div>
<div id='h9' aria-hidden={{null}}></div>
<div id='h10' aria-hidden={{undefined}}></div>
<div id='h11' aria-hidden={{''}}></div>
<div id='h12' aria-hidden='{{true}}'></div>
<div id='h13' aria-hidden='{{false}}'></div>
<div id='h14' aria-hidden='{{"true"}}'></div>
<div id='h15' aria-hidden='{{"false"}}'></div>

{{! C. <input> + disabled (boolean HTML, reflecting) }}
<input id='d1' disabled />
<input id='d2' disabled={{true}} />
<input id='d3' disabled={{false}} />
<input id='d4' disabled={{'false'}} />
<input id='d5' disabled={{'true'}} />
<input id='d6' disabled={{null}} />
<input id='d7' disabled='{{false}}' />
<input id='d8' disabled='{{true}}' />
<input id='d9' disabled='{{"false"}}' />
<input id='d10' disabled='x{{true}}' />

{{! D. <div> + tabindex (numeric) }}
<div id='t1' tabindex={{0}}></div>
<div id='t2' tabindex={{-1}}></div>
<div id='t3' tabindex={{1}}></div>
<div id='t4' tabindex='{{0}}'></div>
<div id='t5' tabindex={{'0'}}></div>
<div id='t6' tabindex={{false}}></div>
<div id='t7' tabindex={{null}}></div>

{{! E. <input> + autocomplete (string) }}
<input id='i1' autocomplete='off' />
<input id='i2' autocomplete={{'off'}} />
<input id='i3' autocomplete='{{"off"}}' />
<input id='i4' autocomplete={{false}} />
<input id='i5' autocomplete='{{false}}' />
```

After rendering, paste this into the devtools console:

```js
(() => {
  const groups = {
    'A. video.muted': {
      prefix: 'm',
      count: 19,
      idl: (el) => ({
        muted: el.muted,
        hasAttr: el.hasAttribute('muted'),
        attrValue: el.getAttribute('muted'),
      }),
    },
    'B. div.ariaHidden': {
      prefix: 'h',
      count: 15,
      idl: (el) => ({
        ariaHidden: el.ariaHidden,
        hasAttr: el.hasAttribute('aria-hidden'),
        attrValue: el.getAttribute('aria-hidden'),
      }),
    },
    'C. input.disabled': {
      prefix: 'd',
      count: 10,
      idl: (el) => ({
        disabled: el.disabled,
        hasAttr: el.hasAttribute('disabled'),
        attrValue: el.getAttribute('disabled'),
      }),
    },
    'D. div.tabIndex': {
      prefix: 't',
      count: 7,
      idl: (el) => ({
        tabIndex: el.tabIndex,
        hasAttr: el.hasAttribute('tabindex'),
        attrValue: el.getAttribute('tabindex'),
      }),
    },
    'E. input.autocomplete': {
      prefix: 'i',
      count: 5,
      idl: (el) => ({
        autocomplete: el.autocomplete,
        hasAttr: el.hasAttribute('autocomplete'),
        attrValue: el.getAttribute('autocomplete'),
      }),
    },
  };
  const lines = [];
  for (const [label, { prefix, count, idl }] of Object.entries(groups)) {
    lines.push(`\n==== ${label} ====`);
    for (let i = 1; i <= count; i++) {
      const id = prefix + i;
      const el = document.querySelector(`#${id}`);
      if (!el) {
        lines.push(`${id}: (NOT FOUND)`);
        continue;
      }
      const idlPairs = Object.entries(idl(el))
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(' ');
      lines.push(`${id.padEnd(4)} ${el.outerHTML.padEnd(75)} | ${idlPairs}`);
    }
  }
  console.log(lines.join('\n'));
})();
```

## Verification metadata

- **Date verified:** 2026-04-28
- **Ember version:** `ember-source` 6.12 (Glimmer VM is merged into the main Ember repo, no separate version)
- **Verified by:** [@johanrd](https://github.com/johanrd) (rendering app, devtools inspection)
- **Methodology:** rendered template fragments via the reproduction template above, captured `outerHTML` and IDL property state via the bundled JS console snippet

## Related

- HTML spec on boolean attributes and reflection: <https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes>
- HTML spec on `muted` IDL vs. `defaultMuted`: <https://html.spec.whatwg.org/multipage/media.html#dom-media-muted>
- ARIA `aria-hidden` semantics: <https://www.w3.org/TR/wai-aria-1.2/#aria-hidden>
- ARIA reflection via `ARIAMixin`: <https://www.w3.org/TR/wai-aria-1.2/#ARIAMixin>
