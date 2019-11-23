// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-super-in-init');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const message = 'Call this._super(...arguments) in init hook';

eslintTester.run('require-super-in-init', rule, {
  valid: [
    `export default Component.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Route.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Controller.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Mixin.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Service.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Component({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Route({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Controller({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Mixin({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Service({
        init() {
          return this._super(...arguments);
        }
      });`,
    'export default Component.extend();',
    'export default Route.extend();',
    'export default Controller.extend();',
    'export default Mixin.extend();',
    'export default Service.extend();',
    {
      code: 'export default Service.extend({ ...spread })',
      parserOptions: { ecmaVersion: 9, sourceType: 'module' },
    },
    `export default Component({
        init() {
          this._super(...arguments);
        },
      });`,
    `export default Route({
        init() {
          this._super(...arguments);
        },
      });`,
    `export default Controller({
        init() {
          this._super(...arguments);
        },
      });`,
    `export default Mixin({
        init() {
          this._super(...arguments);
        },
      });`,
    `export default Service({
        init() {
          this._super(...arguments);
        },
      });`,
    `export default Component({
        init: function() {
          this._super(...arguments);
        },
      });`,
    `export default Route({
        init: function() {
          this._super(...arguments);
        },
      });`,
    `export default Controller({
        init: function() {
          this._super(...arguments);
        },
      });`,
    `export default Mixin({
        init: function() {
          this._super(...arguments);
        },
      });`,
    `export default Service({
        init: function() {
          this._super(...arguments);
        },
      });`,
    `export default Service({
        init
      });`,
  ],
  invalid: [
    {
      code: `export default Component.extend({
        init() {},
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {},
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {},
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {},
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {},
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return;
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return 'meh';
        }
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
  ],
});
