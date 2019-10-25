// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-super-in-init');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
const message = 'Call this._super(...arguments) in init hook';

eslintTester.run('require-super-in-init', rule, {
  valid: [
    {
      code: `export default Component.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Route.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Mixin.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Service.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Route({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Mixin({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Service({
        init() {
          return this._super(...arguments);
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Route.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Mixin.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Service.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component({
        init() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Route({
        init() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller({
        init() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Mixin({
        init() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Service({
        init() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component({
        init: function() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Route({
        init: function() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller({
        init: function() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Mixin({
        init: function() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Service({
        init: function() {
          this._super(...arguments);
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Service({
        init
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `export default Component.extend({
        init() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return 'meh';
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
  ],
});
