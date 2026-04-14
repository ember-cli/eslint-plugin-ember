const rule = require('../../../lib/rules/template-attribute-order');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-attribute-order', rule, {
  valid: [
    '<template><div class="foo" id="bar"></div></template>',
    '<template><button class="btn" role="button" aria-label="Submit"></button></template>',
    '<template><input type="text" name="username" value=""></template>',
    '<template><div data-test-id="foo"></div></template>',
    // Single attribute - no ordering needed
    '<template><div class="foo"></div></template>',
    // All same category
    '<template><div aria-label="x" aria-hidden="true"></div></template>',
    // Correct full order
    '<template><input class="x" id="y" role="r" aria-label="l" data-test-foo="1" type="text" name="n" value="v" placeholder="p" disabled></template>',
    // Custom order config: id before class is valid when order is ['id', 'class']
    {
      code: '<template><div id="bar" class="foo"></div></template>',
      options: [{ order: ['id', 'class'] }],
    },
  ],

  invalid: [
    {
      code: '<template><div id="bar" class="foo"></div></template>',
      output: '<template><div class="foo" id="bar"></div></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    {
      code: '<template><button aria-label="Submit" role="button"></button></template>',
      output: '<template><button role="button" aria-label="Submit"></button></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    {
      code: '<template><input name="username" type="text"></template>',
      output: '<template><input type="text" name="username"></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    // Multiple attributes out of order (3 attrs, fully reversed)
    {
      code: '<template><div name="x" id="y" class="z"></div></template>',
      output: '<template><div id="y" name="x" class="z"></div></template>',
      errors: [{ messageId: 'wrongOrder' }, { messageId: 'wrongOrder' }],
    },
    // Unknown attributes go last
    {
      code: '<template><div custom="x" class="y"></div></template>',
      output: '<template><div class="y" custom="x"></div></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    // data-test- prefix before type
    {
      code: '<template><input type="text" data-test-input="true"></template>',
      output: '<template><input data-test-input="true" type="text"></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    // Multiline attributes
    {
      code: '<template><div\n  name="x"\n  class="y"\n></div></template>',
      output: '<template><div\n  class="y"\n  name="x"\n></div></template>',
      errors: [{ messageId: 'wrongOrder' }],
    },
    // Custom order: id before class
    {
      code: '<template><div class="foo" id="bar"></div></template>',
      output: '<template><div id="bar" class="foo"></div></template>',
      options: [{ order: ['id', 'class'] }],
      errors: [{ messageId: 'wrongOrder' }],
    },
    // Custom order: role, class
    {
      code: '<template><div class="btn" role="button"></div></template>',
      output: '<template><div role="button" class="btn"></div></template>',
      options: [{ order: ['role', 'class'] }],
      errors: [{ messageId: 'wrongOrder' }],
    },
  ],
});
