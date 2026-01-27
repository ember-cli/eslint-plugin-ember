const rule = require('../../../lib/rules/template-no-jsx-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-jsx-attributes', rule, {
  valid: [
    '<template><div></div></template>',
    '<template><div class="foo"></div></template>',
    '<template><div class></div></template>',
    '<template><div autoplay></div></template>',
    '<template><div contenteditable="true"></div></template>',
  ],
  invalid: [
    {
      code: '<template><div acceptCharset="utf-8"></div></template>',
      output: '<template><div accept-charset="utf-8"></div></template>',
      errors: [
        {
          message:
            'Incorrect html attribute name detected - "acceptCharset", is probably unintended. Attributes in HTML are kebeb case.',
        },
      ],
    },
    {
      code: '<template><div contentEditable="true"></div></template>',
      output: '<template><div contenteditable="true"></div></template>',
      errors: [
        {
          message:
            'Incorrect html attribute name detected - "contentEditable", is probably unintended. Attributes in HTML are kebeb case.',
        },
      ],
    },
    {
      code: '<template><div className></div></template>',
      output: '<template><div class></div></template>',
      errors: [
        {
          message:
            "Attribute, className, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.",
        },
      ],
    },
    {
      code: '<template><div className="foo"></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message:
            "Attribute, className, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.",
        },
      ],
    },
  ],
});
