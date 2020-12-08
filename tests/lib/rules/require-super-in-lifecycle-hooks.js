// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-super-in-lifecycle-hooks');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE: message } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
  parser: require.resolve('babel-eslint'),
});

eslintTester.run('require-super-in-lifecycle-hooks', rule, {
  valid: [
    `export default Component.extend({
        init() {
          return this._super(...arguments);
        }
      });`,
    `export default Component.extend({
        didInsertElement() {
          return this._super(...arguments);
        }
      });`,
    {
      code: `export default Component.extend({
        didInsertElement() {
          return this._super(...arguments);
        }
      });`,
      options: [{ checkInitOnly: true }],
    },
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

    // Properly-used glimmer hook:
    "import Component from '@glimmer/component'; class Foo extends Component { willDestroy() { super.willDestroy(); }}",

    // Non-init hooks should not be checked when checkInitOnly = true
    {
      code: 'export default Component({ didInsertElement() {} });',
      options: [{ checkInitOnly: true }],
    },
    {
      code:
        "import Component from '@ember/component'; class Foo extends Component { didInsertElement() {} }",
      options: [{ checkNativeClasses: true, checkInitOnly: true }],
    },
    {
      code:
        "import Component from '@glimmer/component'; class Foo extends Component { willDestroy() {} }",
      options: [{ checkInitOnly: true }],
    },

    // Native classes should not be checked when checkNativeClasses = false
    {
      code: `import Component from '@ember/component';
     class Foo extends Component { init() { } }`,
      options: [{ checkNativeClasses: false }],
    },

    // checkNativeClasses = true
    {
      code: `import Service from '@ember/service';
     class Foo extends Service { init() { super.init(...arguments); }}`,
      options: [{ checkNativeClasses: true }],
    },
    {
      code: `import Component from '@ember/component';
     class Foo extends Component { didInsertElement() { super.didInsertElement(...arguments); }}`,
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
    },
    {
      code: `import Service from '@ember/service';
     class Foo extends Service { didInsertElement() { }}`,
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
    },

    // checkInitOnly = false
    {
      code: 'export default Component({ didInsertElement() { this._super();} });',
      options: [{ checkInitOnly: false }],
    },

    // Not inside Ember class:
    {
      code: 'export default Foo({ init() { } });',
      options: [{ checkInitOnly: false }],
    },
    {
      code: 'class Foo { init() { } }',
      options: [{ checkNativeClasses: true }],
    },
    'export default Foo({ didInsertElement() { } });',
    {
      code: 'class Foo { didInsertElement() { } }',
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
    },
    'const foo = { init() { } }',

    // init hook should be checked in all Ember classes:
    {
      code:
        "import Controller from '@ember/controller'; class Foo extends Controller { init() { super.init(...arguments); }}",
      options: [{ checkNativeClasses: true }],
    },
    {
      code:
        "import Route from '@ember/routing/route'; class Foo extends Route { init() { super.init(...arguments); }}",
      options: [{ checkNativeClasses: true }],
    },
    {
      code:
        "import Service from '@ember/service'; class Foo extends Service { init() { super.init(...arguments); }}",
      options: [{ checkNativeClasses: true }],
    },
    {
      code:
        "import Mixin from '@ember/object/mixin'; class Foo extends Mixin { init() { super.init(...arguments); }}",
      options: [{ checkNativeClasses: true }],
    },

    // Glimmer component allows non-glimmer hook to be used without super:
    "import Component from '@glimmer/component'; class Foo extends Component { init() {} }",
    "import Component from '@glimmer/component'; class Foo extends Component { didInsertElement() {} }",
  ],
  invalid: [
    {
      code: `export default Component.extend({
        init() {},
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);},
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        didInsertElement() {},
      });`,
      output: `export default Component.extend({
        didInsertElement() {
this._super(...arguments);},
      });`,
      options: [{ checkInitOnly: false }],
      errors: [{ message, line: 2 }],
    },

    // checkInitOnly = false
    {
      code: 'export default Component.extend({ didInsertElement() {} });',
      output: `export default Component.extend({ didInsertElement() {
this._super(...arguments);} });`,
      errors: [{ message, type: 'Property' }],
    },
    {
      code: `export default Component.extend({
        init() {},
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);},
      });`,
      options: [{ checkInitOnly: false }],
      errors: [{ message, line: 2 }],
    },
    {
      code:
        'import Component from "@glimmer/component"; class Foo extends Component { willDestroy() {} }',
      output: `import Component from "@glimmer/component"; class Foo extends Component { willDestroy() {
super.willDestroy(...arguments);} }`,
      errors: [{ message, type: 'MethodDefinition' }],
    },

    {
      code: `export default Component.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {

        },
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);

        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          // Foo
          console.log();
        },
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);
          // Foo
          console.log();
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {},
      });`,
      output: `export default Controller.extend({
        init() {
this._super(...arguments);},
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: `export default Controller.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: `export default Controller.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {},
      });`,
      output: `export default Mixin.extend({
        init() {
this._super(...arguments);},
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: `export default Mixin.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: `export default Mixin.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {},
      });`,
      output: `export default Service.extend({
        init() {
this._super(...arguments);},
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          this.set('prop', 'value');
        },
      });`,
      output: `export default Service.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      output: `export default Service.extend({
        init() {
this._super(...arguments);
          this.set('prop', 'value');
          this.set('prop2', 'value2');
        },
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return;
        }
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return;
        }
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return;
        }
      });`,
      output: `export default Controller.extend({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return;
        }
      });`,
      output: `export default Mixin.extend({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return;
        }
      });`,
      output: `export default Service.extend({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return;
        }
      });`,
      output: `export default Component({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return;
        }
      });`,
      output: `export default Route({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return;
        }
      });`,
      output: `export default Controller({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return;
        }
      });`,
      output: `export default Mixin({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return;
        }
      });`,
      output: `export default Service({
        init() {
this._super(...arguments);
          return;
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Component.extend({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route.extend({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Route.extend({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller.extend({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Controller.extend({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin.extend({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Mixin.extend({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service.extend({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Service.extend({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Component({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Route({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Route({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Controller({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Controller({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Mixin({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Mixin({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          return 'meh';
        }
      });`,
      output: `export default Service({
        init() {
this._super(...arguments);
          return 'meh';
        }
      });`,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Service({
        init() {
          someRandomIdentifier;
        },
      });`,
      output: `export default Service({
        init() {
this._super(...arguments);
          someRandomIdentifier;
        },
      });`,
      errors: [{ message, line: 2 }],
    },

    // attrs hooks should call super without ...arguments to satisfy ember/no-attrs-snapshot rule.
    {
      code: 'Component({ didReceiveAttrs() {} })',
      output: `Component({ didReceiveAttrs() {
this._super();} })`,
      options: [{ checkInitOnly: false }],
      errors: [{ message, line: 1 }],
    },

    // checkInitOnly = false
    {
      code:
        "import Component from '@ember/component'; class Foo extends Component { didUpdateAttrs() {} }",
      output: `import Component from '@ember/component'; class Foo extends Component { didUpdateAttrs() {
super.didUpdateAttrs();} }`,
      options: [{ checkNativeClasses: true }],
      errors: [{ message, type: 'MethodDefinition' }],
    },
    {
      code: `import Component from '@ember/component';
      class Foo extends Component { didUpdateAttrs() {} }`,
      output: `import Component from '@ember/component';
      class Foo extends Component { didUpdateAttrs() {
super.didUpdateAttrs();} }`,
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
      errors: [{ message, line: 2 }],
    },

    // Native classes:
    {
      code: "import Service from '@ember/service'; class Foo extends Service { init() {} }",
      output: `import Service from '@ember/service'; class Foo extends Service { init() {
super.init(...arguments);} }`,
      errors: [{ message, type: 'MethodDefinition' }],
    },
    {
      code: `import Service from '@ember/service';
      class Foo extends Service {
        init() {}
      }`,
      output: `import Service from '@ember/service';
      class Foo extends Service {
        init() {
super.init(...arguments);}
      }`,
      options: [{ checkNativeClasses: true }],
      errors: [{ message, line: 3 }],
    },
    {
      code: `import Component from '@ember/component';
      class Foo extends Component {
        didInsertElement() {}
      }`,
      output: `import Component from '@ember/component';
      class Foo extends Component {
        didInsertElement() {
super.didInsertElement(...arguments);}
      }`,
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
      errors: [{ message, line: 3 }],
    },
    {
      code: `import Mixin from '@ember/object/mixin';
      class Foo extends Mixin {
        didInsertElement() {}
      }`,
      output: `import Mixin from '@ember/object/mixin';
      class Foo extends Mixin {
        didInsertElement() {
super.didInsertElement(...arguments);}
      }`,
      options: [{ checkNativeClasses: true, checkInitOnly: false }],
      errors: [{ message, line: 3 }],
    },
  ],
});
