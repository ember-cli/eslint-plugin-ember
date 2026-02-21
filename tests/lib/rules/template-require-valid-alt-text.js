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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><input type="image"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><object></object></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><object /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><area></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="picture"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="photo"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="image"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="  IMAGE "></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="  IMAGE {{picture}} {{word}} "></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="52" src="b52.jpg"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="not-null-alt" src="zoey.jpg" role="none"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="not-null-alt" src="zoey.jpg" role="presentation"></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
  ],
});
