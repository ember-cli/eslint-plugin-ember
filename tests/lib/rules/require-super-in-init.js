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
    `
      import Component from '@ember/component';
      export default Component.extend({
        init() {
          return this._super(...arguments);
        }
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        init() {
          return this._super(...arguments);
        }
      });
    `,
    `
      import Controller from '@ember/controller';
      export default Controller.extend({
        init() {
          return this._super(...arguments);
        }
      });
    `,
    `
      import Mixin from '@ember/object/mixin';
      export default Mixin.extend({
        init() {
          return this._super(...arguments);
        }
      });
    `,
    `
      import Service from '@ember/service';
      export default Service.extend({
        init() {
          return this._super(...arguments);
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend();
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend();
    `,
    `
      import Controller from '@ember/controller';
      export default Controller.extend();
    `,
    `
      import Mixin from '@ember/object/mixin';
      export default Mixin.extend();
    `,
    `
      import Service from '@ember/service';
      export default Service.extend();
    `,
    `
      import Component from '@ember/component';
      export default Component({
        init() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default Route({
        init() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Controller from '@ember/controller';
      export default Controller({
        init() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Mixin from '@ember/object/mixin';
      export default Mixin({
        init() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Service from '@ember/service';
      export default Service({
        init() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Component from '@ember/component';
      export default Component({
        init: function() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default Route({
        init: function() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Controller from '@ember/controller';
      export default Controller({
        init: function() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Mixin from '@ember/object/mixin';
      export default Mixin({
        init: function() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Service from '@ember/service';
      export default Service({
        init: function() {
          this._super(...arguments);
        },
      });
    `,
    `
      import Service from '@ember/service';
      export default Service({
        init
      });
    `,
  ],
  invalid: [
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {},
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {
            this.set('prop', 'value');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {
            this.set('prop', 'value');
            this.set('prop2', 'value2');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {},
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            this.set('prop', 'value');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            this.set('prop', 'value');
            this.set('prop2', 'value2');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          init() {},
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          init() {
            this.set('prop', 'value');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          init() {
            this.set('prop', 'value');
            this.set('prop2', 'value2');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Mixin from '@ember/object/mixin';
        export default Mixin.extend({
          init() {},
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Mixin from '@ember/object/mixin';
        export default Mixin.extend({
          init() {
            this.set('prop', 'value');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Mixin from '@ember/object/mixin';
        export default Mixin.extend({
          init() {
            this.set('prop', 'value');
            this.set('prop2', 'value2');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          init() {},
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          init() {
            this.set('prop', 'value');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          init() {
            this.set('prop', 'value');
            this.set('prop2', 'value2');
          },
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {
            return;
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            return;
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          init() {
            return;
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Mixin from '@ember/object/mixin';
        export default Mixin.extend({
          init() {
            return;
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          init() {
            return;
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {
            return 'meh';
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            return 'meh';
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          init() {
            return 'meh';
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Mixin from '@ember/object/mixin';
        export default Mixin.extend({
          init() {
            return 'meh';
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          init() {
            return 'meh';
          }
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
  ],
});
