'use strict';

const rule = require('../../../lib/rules/require-computed-property-dependencies');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NON_STRING_VALUE } = rule;

const ruleTester = new RuleTester();
ruleTester.run('require-computed-property-dependencies', rule, {
  valid: [
    `
      Ember.computed();
    `,
    `
      Ember.computed(function() {});
    `,
    `
      Ember.computed('unused', function() {});
    `,
    // Volatile:
    `
      Ember.computed('name', function() {
        return this.get('name');
      }).volatile()
    `,
    // ES5 getter usage:
    `
      Ember.computed('name', function() {
        return this.name;
      });
    `,
    `
      Ember.computed('name', function() {
        return this.get('name');
      });
    `,
    // String concatenation in dependent key:
    `
      Ember.computed('na' + 'me', function() {
        return this.get('name');
      });
    `,
    // Without `Ember.`:
    `
      computed('name', function() {
        return this.get('name');
      });
    `,
    `
      Ember.computed('list.@each.foo', function() {
        return this.get('list').map(function(item) {
          return item.get('foo');
        });
      });
    `,
    `
      Ember.computed('list.[]', function() {
        return this.get('list.length');
      });
    `,
    `
      Ember.computed('deeper.than.needed.but.okay', function() {
        return this.get('deeper');
      });
    `,
    `
      Ember.computed('array.[]', function() {
        return this.get('array.firstObject');
      });
    `,
    `
      Ember.computed('array.[]', function() {
        return this.get('array.lastObject');
      });
    `,
    `
      Ember.computed('foo.{bar,baz}', function() {
        return this.get('foo.bar') + this.get('foo.baz');
      });
    `,
    `
      Ember.computed('foo.@each.{bar,baz}', function() {
        return this.get('foo').mapBy('bar') + this.get('foo').mapBy('bar');
      });
    `,
    // Array inside braces:
    `
      Ember.computed('article.{comments.[],title}', function() {
        return this.article.title + someFunction(this.article.comments.mapBy(function(comment) { return comment.author; }));
      });
    `,
    // Nesting inside braces:
    `
      Ember.computed('article.{comments.innerProperty,title}', function() {
        return this.article.title + someFunction(this.article.comments.innerProperty);
      });
    `,
    // Computed macro that should be ignored:
    `
      Ember.computed.someMacro(function() {
        return this.x;
      })
    `,
    `
      Ember.computed.someMacro('test')
    `,
    // Dynamic key:
    `
      Ember.computed(dynamic, function() {});
    `,
    // Dynamic key:
    {
      code: `
        Ember.computed(...PROPERTIES, function() {});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    // Incorrect usage that should be ignored:
    `
      Ember.computed(123)
    `,
    // Should ignore injected service names:
    {
      code: `
      import Component from '@ember/component';
      import { inject as service } from '@ember/service';
      Component.extend({
        intl: service(),
        myProperty: Ember.computed('name', function() {
          console.log(this.intl);
          return this.name + this.intl.t('some.translation.key');
          console.log(this.otherService);
        }),
        otherService: service() // Service injection coming after computed property.
      });
    `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    // Explicit getter function:
    {
      code: `
        computed('firstName', 'lastName', {
          get() {
            return this.firstName + ' ' + this.lastName;
          },
          set(key, value) {}
        })
    `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    // Decorator:
    {
      // TODO: this should be an invalid test case.
      // Still missing native class and decorator support: https://github.com/ember-cli/eslint-plugin-ember/issues/560
      code: `
        class Test {
          @computed()
          get someProp() { return this.undeclared; }
        }
      `,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ],
  invalid: [
    // Dynamic key:
    {
      code: 'Ember.computed(dynamic, function() {});',
      output: null,
      options: [{ allowDynamicKeys: false }],
      errors: [
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'Identifier',
        },
      ],
    },
    // Dynamic keys:
    {
      code: 'Ember.computed(...PROPERTIES, function() {});',
      output: null,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{ allowDynamicKeys: false }],
      errors: [
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'SpreadElement',
        },
      ],
    },
    // Dynamic key with missing dependency:
    {
      code: 'Ember.computed(dynamic, function() { return this.undeclared; });',
      output: "Ember.computed(dynamic, 'undeclared', function() { return this.undeclared; });",
      options: [{ allowDynamicKeys: false }],
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'Identifier',
        },
      ],
    },
    // Multiple dynamic (identifier and spread) keys with missing dependency:
    {
      code: 'Ember.computed(dynamic, ...moreDynamic, function() { return this.undeclared; });',
      output:
        "Ember.computed(dynamic, ...moreDynamic, 'undeclared', function() { return this.undeclared; });",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{ allowDynamicKeys: false }],
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'Identifier',
        },
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'SpreadElement',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.get(this, 'undeclared');
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return Ember.get(this, 'undeclared');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    // Volatile:
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared');
        }).volatile();
      `,
      output: `
        Ember.computed('undeclared', function() {
          return this.get('undeclared');
        }).volatile();
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage:
    {
      code: `
        Ember.computed(function() {
          return this.undeclared + this.undeclared2;
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', function() {
          return this.undeclared + this.undeclared2;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage inside function call:
    {
      code: `
        Ember.computed(function() {
          return someFunction(this.undeclared) + some.thing(this.undeclared2) + some(this.undeclared3).thing;
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', 'undeclared3', function() {
          return someFunction(this.undeclared) + some.thing(this.undeclared2) + some(this.undeclared3).thing;
        });
      `,
      errors: [
        {
          message:
            'Use of undeclared dependencies in computed property: undeclared, undeclared2, undeclared3',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage inside array index:
    {
      code: `
        Ember.computed(function() {
          return someArray[this.undeclared];
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return someArray[this.undeclared];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage with nesting:
    {
      code: `
        Ember.computed(function() {
          return this.a.b.c;
        });
      `,
      output: `
        Ember.computed('a.b.c', function() {
          return this.a.b.c;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a.b.c',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage with array with numeric index:
    // TODO: an improvement would be to detect the missing `someArray.[]` dependency key.
    {
      code: `
        Ember.computed(function() {
          return this.someArray[123];
        });
      `,
      output: `
        Ember.computed('someArray', function() {
          return this.someArray[123];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: someArray',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage with array/object access:
    {
      code: `
        Ember.computed(function() {
          return this.someArrayOrObject[index];
        });
      `,
      output: `
        Ember.computed('someArrayOrObject', function() {
          return this.someArrayOrObject[index];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: someArrayOrObject',
          type: 'CallExpression',
        },
      ],
    },
    // With function calls on properties.
    {
      code: `
        Ember.computed(function() {
          return this.get('service1').someFunction() + this.service2.someFunction();
        });
      `,
      output: `
        Ember.computed('service1', 'service2', function() {
          return this.get('service1').someFunction() + this.service2.someFunction();
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: service1, service2',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Without `Ember.`:
      code: `
        computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        computed('undeclared', 'undeclared2', function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared');
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return this.get('undeclared') + this.get('undeclared');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        Ember.computed('foo.bar.baz', function() {
          return this.get('foo.bar.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo.bar.baz',
          type: 'CallExpression',
        },
      ],
    },
    // Ensure that the redundant key (`foo`) is removed.
    {
      code: `
        Ember.computed('foo', function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        Ember.computed('foo.bar.baz', function() {
          return this.get('foo.bar.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo.bar.baz',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getProperties('a', dynamic, 'b', 'c');
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return this.getProperties('a', dynamic, 'b', 'c');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getProperties(['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return this.getProperties(['a', dynamic, 'b', 'c']);
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.getProperties(this, ['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return Ember.getProperties(this, ['a', dynamic, 'b', 'c']);
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getWithDefault('maybe', {});
        });
      `,
      output: `
        Ember.computed('maybe', function() {
          return this.getWithDefault('maybe', {});
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: maybe',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.getWithDefault(this, 'maybe', {});
        });
      `,
      output: `
        Ember.computed('maybe', function() {
          return Ember.getWithDefault(this, 'maybe', {});
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: maybe',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed('constructor.bar', function() {
          return this.get('constructor.bar') + this.get('constructor.baz');
        });
      `,
      output: `
        Ember.computed('constructor.{bar,baz}', function() {
          return this.get('constructor.bar') + this.get('constructor.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: constructor.baz',
          type: 'CallExpression',
        },
      ],
    },
    // Ensure that the fixer removes the redundant `quux.length` dependency.
    {
      code: `
        Ember.computed('foo.bar', 'quux.[]', 'quux.length', function() {
          return this.get('foo.bar') + this.get('foo.baz') + this.get('quux.firstObject.test');
        });
      `,
      output: `
        Ember.computed('foo.{bar,baz}', 'quux.[]', 'quux.firstObject.test', function() {
          return this.get('foo.bar') + this.get('foo.baz') + this.get('quux.firstObject.test');
        });
      `,
      errors: [
        {
          message:
            'Use of undeclared dependencies in computed property: foo.baz, quux.firstObject.test',
          type: 'CallExpression',
        },
      ],
    },
    // TODO: this should actually be a valid test case because the property added by the fixer (`quux.firstObject.myProp`) is redundant.
    {
      code: `
        Ember.computed('quux.@each.myProp', function() {
          return this.get('quux.firstObject.myProp');
        });
      `,
      output: `
        Ember.computed('quux.@each.myProp', 'quux.firstObject.myProp', function() {
          return this.get('quux.firstObject.myProp');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: quux.firstObject.myProp',
          type: 'CallExpression',
        },
      ],
    },
    // Gracefully handles nesting/array inside braces:
    {
      code: `
        Ember.computed('article.{comments.[],title,first.second}', function() {
          return this.article.title + this.missingProp + someFunction(this.article.comments) + this.article.first.second;
        });
      `,
      // TODO: an improvement would be to use braces here: 'article.{comments.[],first.second,title}'
      output: `
        Ember.computed('article.comments.[]', 'article.first.second', 'article.title', 'missingProp', function() {
          return this.article.title + this.missingProp + someFunction(this.article.comments) + this.article.first.second;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: missingProp',
          type: 'CallExpression',
        },
      ],
    },
    {
      // don't expand @each.{foo,bar}
      code: `
        Ember.computed('foo.@each.{bar,baz}', function() {
          return this.get('foo').mapBy('bar') + this.get('quux');
        });
      `,
      output: `
        Ember.computed('foo.@each.{bar,baz}', 'quux', function() {
          return this.get('foo').mapBy('bar') + this.get('quux');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: quux',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Catch missing injected service name with `requireServiceNames` enabled:
      code: `
        import Component from '@ember/component';
        import { inject as service } from '@ember/service';
        Component.extend({
          intl: service(),
          myProperty: Ember.computed('foo', function() {
            console.log(this.intl);
            return this.get('foo') + this.intl.t('some.translation.key');
          })
        });
      `,
      options: [{ requireServiceNames: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: `
        import Component from '@ember/component';
        import { inject as service } from '@ember/service';
        Component.extend({
          intl: service(),
          myProperty: Ember.computed('foo', 'intl', function() {
            console.log(this.intl);
            return this.get('foo') + this.intl.t('some.translation.key');
          })
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: intl',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Should not ignore properties inside injected service:
      code: `
        import Component from '@ember/component';
        import { inject as service } from '@ember/service';
        Component.extend({
          intl: service(),
          myProperty: Ember.computed(function() {
            return this.intl.someProperty;
          })
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: `
        import Component from '@ember/component';
        import { inject as service } from '@ember/service';
        Component.extend({
          intl: service(),
          myProperty: Ember.computed('intl.someProperty', function() {
            return this.intl.someProperty;
          })
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: intl.someProperty',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.some.very.long.
            multi.line.property.name;
        });
      `,
      output: `
        Ember.computed('some.very.long.multi.line.property.name', function() {
          return this.some.very.long.
            multi.line.property.name;
        });
      `,
      errors: [
        {
          message:
            'Use of undeclared dependencies in computed property: some.very.long.multi.line.property.name',
          type: 'CallExpression',
        },
      ],
    },
    {
      // String concatenation in dependent key:
      code: `
        Ember.computed('na' + 'me', function() {
          return this.undeclared + this.name;
        });
      `,
      output: `
        Ember.computed('name', 'undeclared', function() {
          return this.undeclared + this.name;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Explicit getter function:
      code: `
        computed('firstName', {
          get() {
            return this.firstName + ' ' + this.lastName;
          },
          set(key, value) {}
        })
      `,
      output: `
        computed('firstName', 'lastName', {
          get() {
            return this.firstName + ' ' + this.lastName;
          },
          set(key, value) {}
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: lastName',
          type: 'CallExpression',
        },
      ],
    },
    // Decorator with getter inside object parameter:
    {
      code: `
        class Test {
          @computed('firstName', {
            get() {
              return this.firstName + ' ' + this.lastName;
            },
            set(key, value) {}
          })
          fullName
        }
      `,
      output: `
        class Test {
          @computed('firstName', 'lastName', {
            get() {
              return this.firstName + ' ' + this.lastName;
            },
            set(key, value) {}
          })
          fullName
        }
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: lastName',
          type: 'CallExpression',
        },
      ],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ],
});
