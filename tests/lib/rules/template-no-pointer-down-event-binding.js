//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-pointer-down-event-binding');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    '<template><button {{on "click" this.handleClick}}>Click</button></template>',
    '<template><button {{on "keydown" this.handleKeyDown}}>Press</button></template>',
    '<template><div {{on "mouseup" this.handleMouseUp}}>Content</div></template>',
    '<template><div {{on "pointerup" this.handlePointerUp}}>Content</div></template>',
    '<template><div {{action this.handler on="click"}}></div></template>',
    '<template><div {{action this.handler on="mouseup"}}></div></template>',
    // Case-insensitive: MOUSEUP is fine
    '<template><div {{on "MOUSEUP" this.handler}}>Content</div></template>',
    // onmouseup attribute is fine
    '<template><input type="text" onmouseup="myFunction()"></template>',
    // Component arguments are not flagged (could be any prop name)
    '<template><MyComponent @mouseDown={{this.doSomething}} /></template>',
  ],

  invalid: [
    {
      code: '<template><button {{on "mousedown" this.handleMouseDown}}>Click</button></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    {
      code: '<template><div {{on "pointerdown" this.handlePointerDown}}>Content</div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    // Case-insensitive
    {
      code: '<template><div {{on "MouseDown" this.handler}}>Content</div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    // HTML attributes
    {
      code: '<template><div onmousedown={{this.handleMouseDown}}>Content</div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerAttrNode' }],
    },
    {
      code: '<template><input type="text" onmousedown="myFunction()"></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerAttrNode' }],
    },
    {
      code: '<template><div onpointerdown={{this.handlePointerDown}}>Content</div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerAttrNode' }],
    },
    // {{action}} modifier with on= hash pair
    {
      code: '<template><div {{action this.handler on="mousedown"}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    {
      code: '<template><div {{action this.handler on="pointerdown"}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    // on= is not the first hash pair
    {
      code: '<template><div {{action this.handler preventDefault=true on="mousedown"}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    '<div {{on "mouseup" this.doSomething}}></div>',
    '<div {{action this.doSomething on="mouseup"}}></div>',
    '<input type="text" onmouseup="myFunction()">',
    // Component arguments are not flagged
    '{{my-component mouseDown=this.doSomething}}',
    '<MyComponent @mouseDown={{this.doSomething}} />',
  ],
  invalid: [
    {
      code: '<div {{on "mousedown" this.doSomething}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    {
      code: '<div {{action this.doSomething on="mousedown"}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    // on= is not the first hash pair
    {
      code: '<div {{action this.doSomething preventDefault=true on="mousedown"}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
    {
      code: '<input type="text" onmousedown="myFunction()">',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerAttrNode' }],
    },
    {
      code: '<div {{on "pointerdown" this.doSomething}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerElementModifierStatement' }],
    },
  ],
});
