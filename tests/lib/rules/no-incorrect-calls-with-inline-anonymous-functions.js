//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-incorrect-calls-with-inline-anonymous-functions');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
ruleTester.run('no-anonymous-functions-to-single-scheduler-methods', rule, {
  valid: [
    `
      import { once, scheduleOnce, debounce } from '@ember/runloop';
      scheduleOnce('afterRender', this, this.methodToInvokeOnce);
      scheduleOnce('afterRender', this, methodToInvokeOnce);
      scheduleOnce('afterRender', methodToInvokeOnce);
      scheduleOnce('afterRender', this.methodToInvokeOnce);
      once(this, this.methodToInvokeOnce);
      once(this, methodToInvokeOnce);
      once(methodToInvokeOnce);
      once(this.methodToInvokeOnce);
      schedule('afterRender', this, this.methodToInvoke);
      schedule('afterRender', this, methodToInvoke);
      schedule('afterRender', this.methodToInvoke);
      schedule('afterRender', methodToInvoke);
      debounce(this, this.methodToDebounce, 300);
      debounce(this, methodToDebounce, 300);
      debounce(this.methodToDebounce, 300);
      debounce(methodToDebounce, 300);

      // schedule always allows inline functions
      schedule('afterRender', this, function() {});
      schedule('afterRender', function() {});
      schedule('afterRender', () => {});

      someOtherMethod('foo', this, function() {});
      someOtherMethod('foo', function() {});
      someOtherMethod(function() {});
      someOtherMethod(() => {});
    `,
    `
      import { run } from '@ember/runloop';
      run.scheduleOnce('afterRender', this, this.methodToInvokeOnce);
      run.scheduleOnce('afterRender', this, methodToInvokeOnce);
      run.scheduleOnce('afterRender', methodToInvokeOnce);
      run.scheduleOnce('afterRender', this.methodToInvokeOnce);
      run.once(this, this.methodToInvokeOnce);
      run.once(this, methodToInvokeOnce);
      run.once(methodToInvokeOnce);
      run.once(this.methodToInvokeOnce);
      run.debounce(this, this.methodToDebounce, 300);
      run.debounce(this, methodToDebounce, 300);
      run.debounce(this.methodToDebounce, 300);
      run.debounce(methodToDebounce, 300);

      run.schedule('afterRender', this, this.methodToInvoke);
      run.schedule('afterRender', this, methodToInvoke);
      run.schedule('afterRender', this.methodToInvoke);
      run.schedule('afterRender', methodToInvoke);

      // schedule always allows inline functions
      run.schedule('afterRender', this, function() {});
      run.schedule('afterRender', function() {});
      run.schedule('afterRender', () => {});

      someOtherMethod('foo', this, function() {});
      someOtherMethod('foo', function() {});
      someOtherMethod(function() {});
      someOtherMethod(() => {});
    `,
    `
      import { somethingElse } from '@ember/runloop';
      scheduleOnce('afterRender', this, function() {});
      scheduleOnce('afterRender', function() {});
      once(this, function() {});
      once(function() {});
      debounce(this, function() {}, 300);
      debounce(function() {}, 300);

      run.scheduleOnce('afterRender', this, function() {});
      run.scheduleOnce('afterRender', function() {});
      run.once(this, function() {});
      run.once(function() {});

      scheduleOnce('afterRender', this, () => {});
      scheduleOnce('afterRender', () => {});
      once(this, () => {});
      once(() => {});
      debounce(this, () => {}, 300);
      debounce(() => {}, 300);
      run.scheduleOnce('afterRender', this, () => {});
      run.scheduleOnce('afterRender', () => {});
      run.once(this, () => {});
      run.once(() => {});
    `,
    `
      import { run } from 'not-ember';

      run.once(this, function() {});
      run.scheduleOnce('afterRender', this, function() {});
      run.once(function() {});
      run.scheduleOnce('afterRender', function() {});
      run.debounce(this, function() {}, 300);

      run.once(this, () => {});
      run.scheduleOnce('afterRender', this, () => {});
      run.once(() => {});
      run.scheduleOnce('afterRender', () => {});
      run.debounce(this, () => {}, 300);
    `,
    `
      import { run } from '@ember/runloop';

      run.once.somethingElse(this, function() {});
      run.scheduleOnce.somethingElse('afterRender', this, function() {});
      run.debounce.somethingElse(this, function() {}, 300);
      somethingElse.run.once(this, function() {});
      somethingElse.run.scheduleOnce('afterRender', this, function() {});
      somethingElse.run.debounce(this, function() {}, 300);

      run.once.somethingElse(this, () => {});
      run.scheduleOnce.somethingElse('afterRender', this, () => {});
      run.debounce.somethingElse(this, () => {}, 300);
      somethingElse.run.once(this, () => {});
      somethingElse.run.scheduleOnce('afterRender', this, () => {});
      somethingElse.run.debounce(this, () => {}, 300);
    `,
    "someOtherMethod('foo', this, function() {})",
    "someOtherMethod('foo', function() {})",
    'someOtherMethod(function() {})',
    "import OtherThing from 'other-thing';",
    "import YetOtherThing, { namedThing, anotherNamedThing } from 'yet-other-thing';",
  ],
  invalid: [
    {
      code: `
        import { once } from '@ember/runloop';
        once(function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { once } from '@ember/runloop';
        once(this, function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { once, scheduleOnce } from '@ember/runloop';
        once(function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { scheduleOnce } from '@ember/runloop';
        scheduleOnce('afterRender', function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { scheduleOnce } from '@ember/runloop';
        scheduleOnce('afterRender', this, function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { once, scheduleOnce } from '@ember/runloop';
        scheduleOnce('afterRender', this, function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { debounce } from '@ember/runloop';
        debounce(this, function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.once(function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.once(this, function() {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.scheduleOnce('afterRender', function() {})
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.scheduleOnce('afterRender', this, function() {})
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { once, scheduleOnce, run } from '@ember/runloop';
        run.scheduleOnce('afterRender', this, function() {})
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.scheduleOnce('afterRender', this, () => {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: `
        import { scheduleOnce } from '@ember/runloop';
        scheduleOnce('afterRender', this, () => {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: `
        import { once } from '@ember/runloop';
        once(this, () => {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: `
        import { debounce } from '@ember/runloop';
        debounce(this, () => {});
      `,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
  ],
});
