'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/computed-property-getters');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { PREVENT_GETTER_MESSAGE, ALWAYS_GETTER_MESSAGE, ALWAYS_WITH_SETTER_MESSAGE } = rule;
const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 2022, sourceType: 'module' };
const output = null;

const alwaysWithSetterOptionErrors = [
  {
    message: ALWAYS_WITH_SETTER_MESSAGE,
  },
];

const neverOptionErrors = [
  {
    message: PREVENT_GETTER_MESSAGE,
  },
];

const alwaysOptionErrors = [
  {
    message: ALWAYS_GETTER_MESSAGE,
  },
];

const codeWithRawComputed = [
  `
  {
    foo: computed('model')
  }`,
  `
  {
    foo: computed()
  }`,
  `
  import Ember from 'ember';
  {
    foo: Ember.computed()
  }`,
  `
  {
    foo: computed
  }`,
];

const codeWithoutGettersOrSetters = [
  `
  {
    foo: computed('model', function() {})
  }`,
  `{
      foo: computed('model', function() {}).volatile()
    }`,
  `{
      foo: computed(function() {})
    }`,
  `{
      foo: computed({ random() {} })
    }`,
  `{
      foo: computed(async function() {})
    }`,
  `{
      foo: computed('model', async function() {})
    }`,
];

const codeWithOnlyGetters = [
  `{
      foo: computed({
        get() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        get() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {}
      })
    }`,
  `import Ember from 'ember';
   {
      foo: Ember.computed('model.foo', {
        get() {}
      })
    }`,
];

const codeWithOnlySetters = [
  `{
      foo: computed({
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        set() {}
      })
    }`,
];

const codeWithSettersAndGetters = [
  `{
      foo: computed({
        get() {
          return true;
        },
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        get() {
          return true;
        },
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        },
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        },
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {},
        set() {},
      })
    }`,
];

const validWithDefaultOptions = [
  ...codeWithoutGettersOrSetters.map((code) => ({ code, parserOptions })),
  ...codeWithSettersAndGetters.map((code) => ({ code, parserOptions })),
  ...codeWithRawComputed.map((code) => ({ code, parserOptions })),
];

const validWithAlwaysWithSetterOptions = [
  ...codeWithoutGettersOrSetters.map((code) => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  }),
  ...codeWithSettersAndGetters.map((code) => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  }),
  ...codeWithRawComputed.map((code) => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  }),
];

const validWithNeverOption = [
  ...codeWithoutGettersOrSetters.map((code) => {
    const options = ['never'];
    return { code, parserOptions, options };
  }),
  ...codeWithRawComputed.map((code) => {
    const options = ['never'];
    return { code, parserOptions, options };
  }),
];

const validWithAlwaysOption = [
  ...codeWithOnlyGetters.map((code) => {
    const options = ['always'];
    return { code, parserOptions, options };
  }),
  ...codeWithSettersAndGetters.map((code) => {
    const options = ['always'];
    return { code, parserOptions, options };
  }),
  ...codeWithRawComputed.map((code) => {
    const options = ['always'];
    return { code, parserOptions, options };
  }),
];

const inValidWithDefaultOptions = [
  ...codeWithOnlyGetters.map((code) => ({
    code,
    parserOptions,
    output,
    errors: alwaysWithSetterOptionErrors,
  })),
  ...codeWithOnlySetters.map((code) => ({
    code,
    parserOptions,
    output,
    errors: alwaysWithSetterOptionErrors,
  })),
];

const inValidWithNeverOption = [
  ...codeWithOnlyGetters.map((code) => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  }),
  ...codeWithOnlySetters.map((code) => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  }),
  ...codeWithSettersAndGetters.map((code) => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  }),
];

const inValidWithAlwaysOption = [
  ...codeWithoutGettersOrSetters.map((code) => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors: alwaysOptionErrors };
  }),
  ...codeWithOnlySetters.map((code) => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors: alwaysOptionErrors };
  }),
];

ruleTester.run('computed-property-getters', rule, {
  valid: [
    ...validWithDefaultOptions,
    ...validWithAlwaysWithSetterOptions,
    ...validWithNeverOption,
    ...validWithAlwaysOption,
  ].map(addComputedImport),
  invalid: [
    ...inValidWithDefaultOptions,
    ...inValidWithNeverOption,
    ...inValidWithAlwaysOption,
  ].map(addComputedImport),
});
