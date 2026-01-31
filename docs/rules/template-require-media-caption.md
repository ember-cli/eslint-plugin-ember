# ember/template-require-media-caption

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Requires that audio and video elements have captions.

Captions are essential for deaf or hard-of-hearing users to understand media content. All `<audio>` and `<video>` elements should include a `<track>` element with `kind="captions"`.

## Rule Details

This rule requires that `<audio>` and `<video>` elements have a child `<track>` element with `kind="captions"`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <video src="movie.mp4"></video>
</template>
```

```gjs
<template>
  <audio src="audio.mp3"></audio>
</template>
```

```gjs
<template>
  <video>
    <track kind="subtitles" src="subs.vtt" />
  </video>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <video>
    <track kind="captions" src="captions.vtt" />
  </video>
</template>
```

```gjs
<template>
  <audio>
    <track kind="captions" src="captions.vtt" />
  </audio>
</template>
```

## References

- [ember-template-lint require-media-caption](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/require-media-caption.md)
- [WCAG 2.1 - Captions (Prerecorded)](https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html)
- [MDN - track element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
