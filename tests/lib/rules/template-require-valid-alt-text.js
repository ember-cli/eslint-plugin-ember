const rule = require('../../../lib/rules/template-require-valid-alt-text');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-valid-alt-text', rule, {
  valid: [
    '<template><img alt="A cat" src="/cat.jpg" /></template>',
    '<template><img alt="Company branding" src="/logo.png" /></template>',
    '<template><img alt="" src="/decorative.png" /></template>',
    '<template><img hidden alt="" /></template>',

    '<template><img alt="hullo"></template>',
    '<template><img alt={{foo}}></template>',
    '<template><img alt="blah {{derp}}"></template>',
    '<template><img aria-hidden="true"></template>',
    '<template><img hidden></template>',
    '<template><img alt="" role="none" src="zoey.jpg"></template>',
    '<template><img alt="" role="presentation" src="zoey.jpg"></template>',
    '<template><img alt="a stylized graphic of a female hamster" src="zoey.jpg"></template>',
    '<template><img alt="some-alt-name"></template>',
    '<template><img alt="name {{picture}}"></template>',
    '<template><img alt="{{picture}}"></template>',
    '<template><img alt=""></template>',
    '<template><img alt="" src="zoey.jpg"></template>',
    '<template><img alt="" role="none"></template>',
    '<template><img alt="" role="presentation"></template>',
    '<template><img alt></template>',
    '<template><img alt role="none"></template>',
    '<template><img alt role="presentation"></template>',
    '<template><img alt src="zoey.jpg"></template>',
    '<template><img alt="logout"></template>',
    '<template><img alt="photography"></template>',
    '<template><img alt="picturesque"></template>',
    '<template><img alt="pilgrimage"></template>',
    '<template><img alt="spacers"></template>',
    '<template><img ...attributes></template>',
    '<template><input type="image" alt="some-alt"></template>',
    '<template><input type="image" aria-labelledby="some-alt"></template>',
    '<template><input type="image" aria-label="some-alt"></template>',
    '<template><input type="image" hidden></template>',
    '<template><input type="image" aria-hidden="true"></template>',
    '<template><object title="some-alt"></object></template>',
    '<template><object role="presentation"></object></template>',
    '<template><object role="none"></object></template>',
    '<template><object hidden></object></template>',
    '<template><object aria-hidden="true"></object></template>',
    '<template><object aria-labelledby="some-alt"></object></template>',
    '<template><object aria-label="some-alt"></object></template>',
    '<template><object>some text</object></template>',
    '<template><area alt="some-alt"></template>',
    '<template><area hidden></template>',
    '<template><area aria-hidden="true"></template>',
    '<template><area aria-labelledby="some-alt"></template>',
    '<template><area aria-label="some-alt"></template>',
    '<template><img role={{unless this.altText "presentation"}} alt={{this.altText}}></template>',
  ],
  invalid: [
    {
      code: '<template><img src="/test.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="image of a cat" src="/cat.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="photo of sunset" src="/sunset.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },

    {
      code: '<template><img></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img src="zoey.jpg"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="path/to/zoey.jpg" src="path/to/zoey.jpg"></template>',
      output: null,
      errors: [{ messageId: 'imgAltEqualsSrc' }],
    },
    {
      code: '<template><input type="image"></template>',
      output: null,
      errors: [{ messageId: 'inputImage' }],
    },
    {
      code: '<template><object></object></template>',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<template><object /></template>',
      output: null,
      errors: [{ messageId: 'objectMissing' }],
    },
    {
      code: '<template><area></template>',
      output: null,
      errors: [{ messageId: 'areaMissing' }],
    },
    {
      code: '<template><img alt="picture"></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="photo"></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="image"></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="  IMAGE "></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="  IMAGE {{picture}} {{word}} "></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="52" src="b52.jpg"></template>',
      output: null,
      errors: [{ messageId: 'imgNumericAlt' }],
    },
    {
      code: '<template><img alt="not-null-alt" src="zoey.jpg" role="none"></template>',
      output: null,
      errors: [{ messageId: 'imgRolePresentation' }],
    },
    {
      code: '<template><img alt="not-null-alt" src="zoey.jpg" role="presentation"></template>',
      output: null,
      errors: [{ messageId: 'imgRolePresentation' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-require-valid-alt-text', rule, {
  valid: [
    '<img alt="hullo">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img aria-hidden="true">',
    '<img hidden>',
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
    '<img alt="a stylized graphic of a female hamster" src="zoey.jpg">',
    '<img alt="some-alt-name">',
    '<img alt="name {{picture}}">',
    '<img alt="{{picture}}">',
    '<img alt="">',
    '<img alt="" src="zoey.jpg">',
    '<img alt="" role="none">',
    '<img alt="" role="presentation">',
    '<img alt>',
    '<img alt role="none">',
    '<img alt role="presentation">',
    '<img alt src="zoey.jpg">',
    '<img alt="logout">',
    '<img alt="photography">',
    '<img alt="picturesque">',
    '<img alt="pilgrimage">',
    '<img alt="spacers">',
    '<img ...attributes>',
    '<input type="image" alt="some-alt">',
    '<input type="image" aria-labelledby="some-alt">',
    '<input type="image" aria-label="some-alt">',
    '<input type="image" hidden>',
    '<input type="image" aria-hidden="true">',
    '<object title="some-alt"></object>',
    '<object role="presentation"></object>',
    '<object role="none"></object>',
    '<object hidden></object>',
    '<object aria-hidden="true"></object>',
    '<object aria-labelledby="some-alt"></object>',
    '<object aria-label="some-alt"></object>',
    '<object>some text</object>',
    '<area alt="some-alt">',
    '<area hidden>',
    '<area aria-hidden="true">',
    '<area aria-labelledby="some-alt">',
    '<area aria-label="some-alt">',
    '<img role={{unless this.altText "presentation"}} alt={{this.altText}}>',
  ],
  invalid: [
    {
      code: '<img>',
      output: null,
      errors: [
        { message: 'All `<img>` tags must have an alt attribute.' },
      ],
    },
    {
      code: '<img src="zoey.jpg">',
      output: null,
      errors: [
        { message: 'All `<img>` tags must have an alt attribute.' },
      ],
    },
    {
      code: '<img alt="path/to/zoey.jpg" src="path/to/zoey.jpg">',
      output: null,
      errors: [
        { message: 'The alt text must not be the same as the image source.' },
      ],
    },
    {
      code: '<input type="image">',
      output: null,
      errors: [
        { message: 'All <input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.' },
      ],
    },
    {
      code: '<object></object>',
      output: null,
      errors: [
        { message: 'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.' },
      ],
    },
    {
      code: '<object />',
      output: null,
      errors: [
        { message: 'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.' },
      ],
    },
    {
      code: '<area>',
      output: null,
      errors: [
        { message: 'Each area of an image map must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.' },
      ],
    },
    {
      code: '<img alt="picture">',
      output: null,
      errors: [
        { message: 'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.' },
      ],
    },
    {
      code: '<img alt="photo">',
      output: null,
      errors: [
        { message: 'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.' },
      ],
    },
    {
      code: '<img alt="image">',
      output: null,
      errors: [
        { message: 'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.' },
      ],
    },
    {
      code: '<img alt="  IMAGE ">',
      output: null,
      errors: [
        { message: 'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.' },
      ],
    },
    {
      code: '<img alt="  IMAGE {{picture}} {{word}} ">',
      output: null,
      errors: [
        { message: 'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.' },
      ],
    },
    {
      code: '<img alt="52" src="b52.jpg">',
      output: null,
      errors: [
        { message: 'A number is not valid alt text.' },
      ],
    },
    {
      code: '<img alt="not-null-alt" src="zoey.jpg" role="none">',
      output: null,
      errors: [
        { message: 'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`.' },
      ],
    },
    {
      code: '<img alt="not-null-alt" src="zoey.jpg" role="presentation">',
      output: null,
      errors: [
        { message: 'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`.' },
      ],
    },
  ],
});
