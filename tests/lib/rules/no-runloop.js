// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-runloop');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

eslintTester.run('no-runloop', rule, {
  valid: [
    `
      run();
      later();
    `,
    `
      import { run } from 'foobar';
      run();
    `,
    `
      import { run } from '@ember/runloop';
      this.run();
      runTask();
      runRun();
    `,
    {
      code: `
        import { run } from '@ember/runloop';
        run();
        later();
      `,
      options: [['run']],
    },
    {
      code: `
        import { run as foobar } from '@ember/runloop';
        foobar();
      `,
      options: [['run']],
    },
    `
      import run from '@ember/runloop';
      run();
    `,
    `
      import { run } from '@ember/runloop';
      run.run();
      run.foobar();
    `,
    `
      import { later } from '@ember/runloop';
      later.run();
      later.foobar();
    `,
    {
      code: `
        import { run } from '@ember/runloop';
        run.later();
      `,
      options: [['later']],
    },
  ],
  invalid: [
    {
      code: `
        import { run } from '@ember/runloop';
        run();
      `,
      output: null,
      errors: [{ messageId: 'main' }],
    },
    {
      code: `
        import { run as foobar } from '@ember/runloop';
        foobar();
      `,
      output: null,
      errors: [{ messageId: 'main' }],
    },
    {
      code: `
        import { later } from '@ember/runloop';
        later();
      `,
      output: null,
      errors: [{ messageId: 'lifelineReplacement' }],
    },
    {
      code: `
        import { later as foobar } from '@ember/runloop';
        foobar();
      `,
      output: null,
      errors: [{ messageId: 'lifelineReplacement' }],
    },
    {
      code: `
        import { run, later } from '@ember/runloop';
        run();
        later();
      `,
      output: null,
      options: [['run']],
      errors: [{ messageId: 'lifelineReplacement' }],
    },
    {
      code: `
        import { run, later } from '@ember/runloop';
        run();
        later();
      `,
      output: null,
      options: [['later']],
      errors: [{ messageId: 'main' }],
    },
    // chaining off of `run`
    {
      code: `
        import { run } from '@ember/runloop';
        run.later();
      `,
      output: null,
      errors: [{ messageId: 'lifelineReplacement' }],
    },
    {
      code: `
        import { run } from '@ember/runloop';
        run.begin();
      `,
      output: null,
      errors: [{ messageId: 'main' }],
    },
    {
      code: `
        import { run as foobar } from '@ember/runloop';
        foobar.schedule();
      `,
      output: null,
      errors: [{ messageId: 'lifelineReplacement' }],
    },
  ],
});
