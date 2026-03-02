const rule = require('../../../lib/rules/template-no-action-on-submit-button');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-action-on-submit-button', rule, {
  valid: [
    '<template><button {{on "click" this.handleClick}}>Click</button></template>',
    '<template><button type="button" action="doSomething">Click</button></template>',
    '<template><input type="text" action="search" /></template>',
    '<template><div action="whatever">Not a button</div></template>',

    '<template>button</template>',
    '<template><form><button type="button" /></form></template>',
    '<template><form><button type="button" {{action this.handleClick}} /></form></template>',
    '<template><form><button type="button" {{action this.handleClick on="click"}} /></form></template>',
    '<template><form><button type="button" {{action this.handleMouseover on="mouseOver"}} /></form></template>',
    '<template><form><button type="button" {{on "click" this.handleClick}} /></form></template>',
    '<template><form><button type="button" {{on "mouseover" this.handleMouseover}} /></form></template>',
    '<template>submit</template>',
    '<template><form><button /></form></template>',
    '<template><form><button type="submit" /></form></template>',
    '<template><form><button type="submit" {{action this.handleMouseover on="mouseOver"}} /></form></template>',
    '<template><form><button type="submit" {{on "mouseover" this.handleMouseover}} /></form></template>',
    '<template><form><div/></form></template>',
    '<template><form><div></div></form></template>',
    '<template><form><div type="submit"></div></form></template>',
    '<template><form><div type="submit" {{action this.handleClick}}></div></form></template>',
    '<template><form><div type="submit" {{on "click" this.handleClick}}></div></form></template>',
    '<template><button {{action this.handleClick}} /></template>',
    '<template><button {{action this.handleClick on="click"}}/></template>',
    '<template><button {{on "click" this.handleClick}} /></template>',
    '<template><button type="submit" {{action this.handleClick}} /></template>',
    '<template><button type="submit" {{action this.handleClick on="click"}} /></template>',
    '<template><button type="submit" {{action (fn this.someAction "foo")}} /></template>',
    '<template><button type="submit" {{on "click" this.handleClick}} /></template>',
    '<template><button type="submit" {{on "click" (fn this.addNumber 123)}} /></template>',
  ],

  invalid: [
    {
      code: '<template><button action="save">Save</button></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><button type="submit" action="submit">Submit</button></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><input type="submit" action="go" /></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><form><button {{action this.handleClick}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button {{action this.handleClick on="click"}}/></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button {{on "click" this.handleClick}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button type="submit" {{action this.handleClick}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button type="submit" {{action this.handleClick on="click"}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button type="submit" {{action (fn this.someAction "foo")}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button type="submit" {{on "click" this.handleClick}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><button type="submit" {{on "click" (fn this.addNumber 123)}} /></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<template><form><div><button type="submit" {{action this.handleClick}} /></div></form></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-action-on-submit-button (hbs)', rule, {
  valid: [
    '<form><button type="button" /></form>',
    '<form><button type="button" {{action this.handleClick}} /></form>',
    '<form><button type="button" {{action this.handleClick on="click"}} /></form>',
    '<form><button type="button" {{action this.handleMouseover on="mouseOver"}} /></form>',
    '<form><button type="button" {{on "click" this.handleClick}} /></form>',
    '<form><button type="button" {{on "mouseover" this.handleMouseover}} /></form>',
    '<form><button /></form>',
    '<form><button type="submit" /></form>',
    '<form><button type="submit" {{action this.handleMouseover on="mouseOver"}} /></form>',
    '<form><button type="submit" {{on "mouseover" this.handleMouseover}} /></form>',
    '<form><div/></form>',
    '<form><div></div></form>',
    '<form><div type="submit"></div></form>',
    '<form><div type="submit" {{action this.handleClick}}></div></form>',
    '<form><div type="submit" {{on "click" this.handleClick}}></div></form>',
    '<button {{action this.handleClick}} />',
    '<button {{action this.handleClick on="click"}}/>',
    '<button {{on "click" this.handleClick}} />',
    '<button type="submit" {{action this.handleClick}} />',
    '<button type="submit" {{action this.handleClick on="click"}} />',
    '<button type="submit" {{action (fn this.someAction "foo")}} />',
    '<button type="submit" {{on "click" this.handleClick}} />',
    '<button type="submit" {{on "click" (fn this.addNumber 123)}} />',
  ],
  invalid: [
    {
      code: '<form><button {{action this.handleClick}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button {{action this.handleClick on="click"}}/></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button {{on "click" this.handleClick}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button type="submit" {{action this.handleClick}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button type="submit" {{action this.handleClick on="click"}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button type="submit" {{action (fn this.someAction "foo")}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button type="submit" {{on "click" this.handleClick}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><button type="submit" {{on "click" (fn this.addNumber 123)}} /></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
    {
      code: '<form><div><button type="submit" {{action this.handleClick}} /></div></form>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
        },
      ],
    },
  ],
});
