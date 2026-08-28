# ember/template-no-autoplay

<!-- end auto-generated rule header -->

This rule disallows the `autoplay` attribute on `<audio>` elements, and on
`<video>` elements that are not also marked `muted`.

Autoplaying audio is disruptive for users with cognitive or sensory
sensitivities, can interfere with screen readers, and consumes bandwidth
without user consent. WCAG Success Criterion 1.4.2 requires users to be able
to pause, stop, or control audio that plays automatically for more than three
seconds. The [W3C ACT rule `aaa1bf`][act-aaa1bf] that operationalizes SC 1.4.2
is explicitly inapplicable when the media is muted or has no audio, so a
muted autoplaying `<video>` (e.g. GIF-style hero) is treated as allowed.

[act-aaa1bf]: https://www.w3.org/WAI/standards-guidelines/act/rules/aaa1bf/proposed/

## Examples

This rule **forbids** the following:

```hbs
<audio src='track.mp3' autoplay></audio>
<video src='clip.mp4' autoplay></video>
<audio src='track.mp3' autoplay muted></audio>
<video src='clip.mp4' autoplay muted={{false}}></video>
```

This rule **allows** the following:

```hbs
<audio src='track.mp3' controls></audio>
<video src='clip.mp4' controls></video>
<audio src='track.mp3' autoplay={{false}}></audio>
<video src='clip.mp4' autoplay muted></video>
<video src='clip.mp4' autoplay muted loop playsinline></video>
```

Dynamic values such as `autoplay={{this.shouldAutoplay}}` or
`muted={{this.isMuted}}` are not flagged at lint time — the lint pass can't
know the runtime value, and false positives are considered worse than false
negatives here.

The literal-boolean form `autoplay={{false}}` is treated as a reliable
opt-out (the mustache evaluates to a real JS `false`, the attribute is not
emitted, and the media will not auto-play). The string literal form
`autoplay={{"false"}}` is also treated as a falsy opt-out by this rule —
the rule checks for the exact string `"false"` (case-insensitive) and will
not flag the element. Note that this treatment is a deliberate allowance:
in raw HTML the `autoplay` attribute is boolean, so any presence — including
the string `"false"` — would normally mean the attribute is set. Glimmer,
however, passes `{{"false"}}` through as-is and many migration paths produce
this form intentionally as a no-op; the rule accepts it rather than generating
false positives.

## Configuration

- `additionalElements` (`string[]`): extra tag names to check beyond the default
  `audio` / `video`. Useful if you render a custom element that also supports
  autoplay.

```js
module.exports = {
  rules: {
    'ember/template-no-autoplay': ['error', { additionalElements: ['my-media'] }],
  },
};
```

Note that the `muted` exemption applies **only to `<video>`**. Per WCAG 2.1
SC 1.4.2, auto-playing audible media is a WCAG failure regardless of the
tag; since `additionalElements` may cover custom tags (e.g. `<my-media>`)
whose mute semantics we can't statically verify, `muted` is not treated as
an exemption on those tags. `<audio muted autoplay>` is also flagged, by
the same reasoning.

## References

- [WCAG 2.1 SC 1.4.2: Audio Control](https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html)
- [MDN: HTMLMediaElement.autoplay](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay)
- Adapted from [`html-validate`'s `no-autoplay`](https://html-validate.org/rules/no-autoplay.html) (MIT).
