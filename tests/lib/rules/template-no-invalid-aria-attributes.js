//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-aria-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-aria-attributes', rule, {
  valid: [
    '<template><div aria-label="Label">Content</div></template>',
    '<template><div aria-hidden="true">Content</div></template>',
    '<template><div aria-describedby="id">Content</div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><h1 aria-hidden="true">Valid Heading</h1></template>',
    '<template><h1 aria-hidden={{true}}>Second valid Heading</h1></template>',
    '<template><input type="email" aria-required="true" /></template>',
    '<template><input type="text" aria-labelledby="label1 label2" /></template>',
    '<template><div role="checkbox" aria-checked="true" onclick="handleCheckbox()" tabindex="0"></div></template>',
    '<template><button aria-haspopup="true"></button></template>',
    '<template><button aria-haspopup="dialog"></button></template>',
    '<template><div role="slider" aria-valuenow="50" aria-valuemax="100" aria-valuemin="0" /></template>',
    '<template><div role="heading" aria-level={{2}}></div></template>',
    '<template><input type="text" id="name" aria-invalid="grammar" /></template>',
    '<template><div role="region" aria-live="polite" aria-relevant="additions text">Valid live region</div></template>',
    '<template><div aria-label="{{@foo.bar}} baz"></div></template>',
    '<template><CustomComponent @ariaRequired={{this.ariaRequired}} aria-errormessage="errorId" /></template>',
    '<template><button type="submit" aria-disabled={{this.isDisabled}}>Submit</button></template>',
    '<template><div role="textbox" aria-sort={{if this.hasCustomSort "other" "ascending"}}></div></template>',
    '<template><div role="combobox" aria-expanded="undefined"></div></template>',
    '<template><button aria-label={{if @isNew (t "actions.add") (t "actions.edit")}}></button></template>',
  ],
  invalid: [
    {
      code: '<template><div aria-fake="value">Content</div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-fake' } }],
    },
    {
      code: '<template><div aria-invalid-attr="value">Content</div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute', data: { attribute: 'aria-invalid-attr' } }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><input aria-text="inaccessible text" /></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute' }],
    },
    {
      code: '<template><div role="slider" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-value-min={{this.baz}} /></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute' }],
    },
    {
      code: '<template><h1 aria--hidden="true">Broken heading</h1></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute' }],
    },
    {
      code: '<template><CustomComponent role="region" aria-alert="polite" /></template>',
      output: null,
      errors: [{ messageId: 'noInvalidAriaAttribute' }],
    },
    {
      code: '<template><span role="checkbox" aria-checked="bad-value" tabindex="0" aria-label="Forget me"></span></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><button type="submit" disabled="true" aria-disabled="123">Submit</button></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><input type="text" disabled="true" aria-errormessage="false" /></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><button type="submit" aria-describedby="blah false">Continue at your own risk</button></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><div role="heading" aria-level="bogus">Inaccessible heading</div></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><div role="heading" aria-level="true">Another inaccessible heading</div></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><div role="slider" aria-valuenow=(2*2)  aria-valuemax="100" aria-valuemin="30">Broken slider</div></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><div role="region" aria-live="no-such-value">Inaccessible live region</div></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><div role="region" aria-live="polite" aria-relevant="additions errors">Inaccessible live region</div></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
    {
      code: '<template><input type="text" aria-required="undefined" /></template>',
      output: null,
      errors: [{ messageId: 'invalidAriaAttributeValue' }],
    },
  ],
});
