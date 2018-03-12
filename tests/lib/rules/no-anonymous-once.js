const rule = require('../../../lib/rules/no-anonymous-once');

const MESSAGE = rule.meta.message;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
const errors = [{
  message: MESSAGE
}];

ruleTester.run('no-anonymous-once', rule, {
  valid: [
    {
      code: `
        function noop() {} ;
        export default Ember.Component({
          perform() {
            Ember.run.scheduleOnce('afterRender', this, noop);
            Ember.run.scheduleOnce('afterRender', noop);
            run.scheduleOnce('afterRender', this, noop);
            run.scheduleOnce('afterRender', noop);
            run.scheduleOnce.apply(this, ['afterRender', this, noop]);
            run.scheduleOnce.apply(this, ['afterRender', noop]);
            run.scheduleOnce.call(this, 'afterRender', this, noop);
            run.scheduleOnce.call(this, 'afterRender', noop);
          }
        });`
    },
    {
      code: `
        function noop() {} ;
        export default Ember.Component({
          perform() {
            Ember.run.once(this, noop);
            Ember.run.once(noop);
            run.once(this, noop);
            run.once(noop);
            run.once.apply(this, [this, noop]);
            run.once.apply(this, [noop]);
            run.once.call(this, this, noop);
            run.once.call(this, noop);
          }
        });`
    },
    {
      code: `
        export default Ember.Component({
          cb: () => {
            // do stuff
          },

          perform() {
            Ember.run.once(this, 'cb');
          }
        });`
    },
    {
      code: `
        export default Ember.Component({
          cb: () => {
            // do stuff
          },

          perform() {
            Ember.run.once(this, this.cb);
          }
        });`
    },
    {
      code: `
        function cb() {
          //do stuff
        }
        export default Ember.Component({
          perform() {
            Ember.run.once(this, cb);
          }
        });`
    },
    {
      code: `
        export default Ember.Component({
          cb: () => {
            // do stuff
          },

          perform() {
            Ember.run.scheduleOnce('afterRender', this, 'cb');
          }
        });`
    },
    {
      code: `
        export default Ember.Component({
          cb: () => {
            // do stuff
          },

          perform() {
            Ember.run.scheduleOnce('afterRender', this, this.cb);
          }
        });`
    },
    {
      code: `
        function cb() {
          //do stuff
        }
        export default Ember.Component({
          perform() {
            Ember.run.scheduleOnce('afterRender', this, cb);
          }
        });`
    }
  ],
  invalid: [
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.scheduleOnce('afterRender', () => {});
          }
        });`,
      errors
    },
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.scheduleOnce('afterRender', this, () => {});
          }
        });`,
      errors
    },
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.once(this, () => {});
          }
        });`,
      errors
    },
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.once(() => {});
          }
        });`,
      errors
    },
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.once(function () {});
          }
        });`,
      errors
    },
    {
      code: `
        export default Ember.Component({
          perform() {
            Ember.run.scheduleOnce('afterRender', function () {});
          }
        });`,
      errors
    }
  ]
});
