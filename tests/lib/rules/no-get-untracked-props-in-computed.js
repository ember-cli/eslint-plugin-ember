'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-get-untracked-props-in-computed');

describe('exports', () => {
  describe('explodeProperty', () => {
    it('should correctly explode a dependency', () => {
      expect(rule.explodeProperty('foo')).toEqual(['foo']);
      expect(rule.explodeProperty('foo.bar')).toEqual(['foo', 'foo.bar']);
      expect(rule.explodeProperty('foo.bar')).toEqual(['foo', 'foo.bar']);
      expect(rule.explodeProperty('foo.bar.baz')).toEqual(['foo', 'foo.bar', 'foo.bar.baz']);
    });
  });

  describe('isPropertyTracked', () => {
    it('should correctly determine if a dependency is tracker', () => {
      expect(rule.isPropertyTracked(['foo'], 'foo')).toBe(true);
      expect(rule.isPropertyTracked(['foo', 'bar'], 'foo')).toBe(true);
      expect(rule.isPropertyTracked(['bar'], 'foo')).toBe(false);
      expect(rule.isPropertyTracked(['foo'], 'foo.bar')).toBe(true);
      expect(rule.isPropertyTracked(['foo.bar'], 'foo')).toBe(false);
      expect(rule.isPropertyTracked(['foo.bar.[]'], 'foo.bar')).toBe(true);
      expect(rule.isPropertyTracked(['foo.bar.@each.bar'], 'foo.bar')).toBe(true);
    });
  });
});

const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 6, sourceType: 'module' };
ruleTester.run('no-get-untracked-props-in-computed', rule, {
  valid: [
    {
      code: `
      let obj = {
        foo: Ember.computed('model.foo', function() {
          this.get('model.foo');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: Em.computed('model.foo', function() {
          this.get('model.foo');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', function() {
          this.get('model.foo');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('model', function() {
          this.get('model.foo');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('model.{foo,bar}', function() {
          this.get('model.foo');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA', function() {
          anotherFn(() => {
            this.get('propA');
          });
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA', function() {
          anotherFn(function() {
            this.get('propB');
          });
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA', function() {
          function myMethod() {
            this.get('propB');
          };
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA.[]', function() {
          this.get('propA');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA.@each.bar', function() {
          this.get('propA');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('propA', 'propB', function() {
          this.get('propB');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed(function() {
          this.get('propB');
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('foo', function() {
          // Not sure when you would ever do this but lets be sure it doesn't trip up the rule
          return {
            foo: computed('bar', () => {
              this.get('foo');
            })
          };
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', {
          get() {
            this.get('model.foo');
          },
          set() {
            this.get('model.foo');
          },
        })
      }
      `,
      parserOptions,
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', {
          get: function() {
            this.get('model.foo');
          },
          set: function() {
            this.get('model.foo');
          },
        })
      }
      `,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `
      let a = {
        foo: computed('model.foo', function() {
          this.get('model.bar');
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let a = {
        foo: computed('model.foo', function() {
          this.get('model.bar');
          this.get('model.baz');
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }, {
        message: 'Dependency \'model.baz\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let a = {
        foo: computed('model.{foo,bar}', function() {
          this.get('model.baz');
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.baz\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let a = {
        foo: computed('model.bar', function() {
          anotherFn(() => {
            this.get('model.baz');
          });
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.baz\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let obj = {
        foo: computed('foo', function() {
          // Not sure when you would ever do this but lets be sure it doesn't trip up the rule
          return {
            foo: computed('bar', () => {
              this.get('bar');
            })
          };
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'bar\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', function() {
          this.get('model');
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', {
          get() {
            this.get('model.foo');
            this.get('model.bar');
          },
          set() {
            this.get('model.foo');
            this.get('model.bar');
          },
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }, {
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }],
    },
    {
      code: `
      let obj = {
        foo: computed('model.foo', {
          get: function() {
            this.get('model.foo');
            this.get('model.bar');
          },
          set: function() {
            this.get('model.foo');
            this.get('model.bar');
          },
        })
      }
      `,
      parserOptions,
      errors: [{
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }, {
        message: 'Dependency \'model.bar\' is not tracked in computed\'s dependant keys',
      }],
    },
  ]
});
