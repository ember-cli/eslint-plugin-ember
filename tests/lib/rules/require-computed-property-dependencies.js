'use strict';

const rule = require('../../../lib/rules/require-computed-property-dependencies');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NON_STRING_VALUE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});
ruleTester.run('require-computed-property-dependencies', rule, {
  valid: [
    "import Ember from 'ember'; Ember.computed();",
    "import Ember from 'ember'; Ember.computed(function() {});",
    "import Ember from 'ember'; Ember.computed('unused', function() {});",
    // Volatile:
    "import Ember from 'ember'; Ember.computed('name', function() { return this.get('name'); }).volatile()",
    // ES5 getter usage:
    "import Ember from 'ember'; Ember.computed('name', function() { return this.name; });",
    "import Ember from 'ember'; Ember.computed('name', function() { return this.get('name'); });",
    // String concatenation in dependent key:
    "import Ember from 'ember';  Ember.computed('na' + 'me', function() { return this.get('name'); });",
    // Optional chaining:
    "import Ember from 'ember'; Ember.computed(function() { return this?.someFunction(); });",
    "import Ember from 'ember'; Ember.computed('x.y', function() { return this?.x?.y });",
    // Without `Ember.`:
    "import { computed } from '@ember/object'; computed('name', function() {return this.get('name');});",
    `
      import Ember from 'ember';
      Ember.computed('list.@each.foo', function() {
        return this.get('list').map(function(item) {
          return item.get('foo');
        });
      });
    `,
    "import Ember from 'ember'; Ember.computed('list.[]', function() { return this.get('list.length');});",
    "import Ember from 'ember'; Ember.computed('deeper.than.needed.but.okay', function() { return this.get('deeper'); });",
    "import Ember from 'ember'; Ember.computed('array.[]', function() { return this.get('array.firstObject'); });",
    "import Ember from 'ember'; Ember.computed('array.[]', function() { return this.get('array.lastObject'); });",
    "import Ember from 'ember'; Ember.computed('foo.{bar,baz}', function() { return this.get('foo.bar') + this.get('foo.baz'); });",
    "import Ember from 'ember'; Ember.computed('foo.@each.{bar,baz}', function() { return this.get('foo').mapBy('bar') + this.get('foo').mapBy('bar'); });",
    // Array inside braces:
    `
      import Ember from 'ember';
      Ember.computed('article.{comments.[],title}', function() {
        return this.article.title + someFunction(this.article.comments.mapBy(function(comment) { return comment.author; }));
      });
    `,
    // Nesting inside braces:
    `
      import Ember from 'ember';
      Ember.computed('article.{comments.innerProperty,title}', function() {
        return this.article.title + someFunction(this.article.comments.innerProperty);
      });
    `,
    // Braces but no nesting:
    `
      import Ember from 'ember';
      Ember.computed('{foo,bar}', function() {
        return this.get('foo') + this.get('bar');
      });
    `,
    // Computed macro that should be ignored:
    "import Ember from 'ember'; Ember.computed.someMacro(function() { return this.x; })",
    "import Ember from 'ember'; Ember.computed.someMacro('test')",
    // Dynamic key:
    "import Ember from 'ember'; Ember.computed(dynamic, function() {});",
    // Dynamic key:
    "import Ember from 'ember'; Ember.computed(...PROPERTIES, function() {});",
    // Incorrect usage that should be ignored:
    "import Ember from 'ember'; Ember.computed(123)",
    // Should ignore injected service names:
    `
      import Ember from 'ember';
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
    // Should ignore the left side of an assignment.
    "import Ember from 'ember'; Ember.computed('right', function() { this.left = this.right; })",
    // Should ignore the left side of an assignment with nested path.
    "import Ember from 'ember'; Ember.computed('right', function() { this.left1.left2 = this.right; })",
    // Explicit getter function:
    `
      import { computed } from '@ember/object';
      computed('firstName', 'lastName', {
        get() {
          return this.firstName + ' ' + this.lastName;
        },
        set(key, value) {}
      })
    `,
    // Decorator:
    `
      import { computed } from '@ember/object';
      class Test {
        @computed('first', 'last')
        get fullName() { return this.first + ' ' + this.last; }
      }
    `,
    // Decorator:
    `
      import { computed } from '@ember/object';
      import { inject as service } from '@ember/service';
      class Test {
        @service i18n; // Service names not required as dependent keys by default.
        @computed('first', 'last')
        get fullName() { return this.i18n.t(this.first + ' ' + this.last); }
      }
    `,
  ],
  invalid: [
    // Dynamic key:
    {
      code: "import Ember from 'ember'; Ember.computed(dynamic, function() {});",
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
      code: "import Ember from 'ember'; Ember.computed(...PROPERTIES, function() {});",
      output: null,
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
      code:
        "import Ember from 'ember'; Ember.computed(dynamic, function() { return this.undeclared; });",
      output:
        "import Ember from 'ember'; Ember.computed(dynamic, 'undeclared', function() { return this.undeclared; });",
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
      code:
        "import Ember from 'ember'; Ember.computed(dynamic, ...moreDynamic, function() { return this.undeclared; });",
      output:
        "import Ember from 'ember'; Ember.computed(dynamic, ...moreDynamic, 'undeclared', function() { return this.undeclared; });",
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
        import Ember from 'ember';
        Ember.computed(function() {
          return Ember.get(this, 'undeclared');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.get('undeclared');
        }).volatile();
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.undeclared + this.undeclared2;
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return someFunction(this.undeclared) + some.thing(this.undeclared2) + some(this.undeclared3).thing;
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return someArray[this.undeclared];
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.a.b.c;
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.someArray[123];
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.someArrayOrObject[index];
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.get('service1').someFunction() + this.service2.someFunction();
        });
      `,
      output: `
        import Ember from 'ember';
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
        import { computed } from '@ember/object';
        computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        import { computed } from '@ember/object';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('foo', function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.getProperties('a', dynamic, 'b', 'c');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.getProperties(['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return Ember.getProperties(this, ['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.getWithDefault('maybe', {});
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return Ember.getWithDefault(this, 'maybe', {});
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('constructor.bar', function() {
          return this.get('constructor.bar') + this.get('constructor.baz');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('foo.bar', 'quux.[]', 'quux.length', function() {
          return this.get('foo.bar') + this.get('foo.baz') + this.get('quux.firstObject.test');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('quux.@each.myProp', function() {
          return this.get('quux.firstObject.myProp');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('article.{comments.[],title,first.second}', function() {
          return this.article.title + this.missingProp + someFunction(this.article.comments) + this.article.first.second;
        });
      `,
      // TODO: an improvement would be to use braces here: 'article.{comments.[],first.second,title}'
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('foo.@each.{bar,baz}', function() {
          return this.get('foo').mapBy('bar') + this.get('quux');
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
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
      output: `
        import Ember from 'ember';
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
      // Should ignore the left side of an assignment but not the right side.
      code: `
        import Ember from 'ember';
        Ember.computed(function() {
          this.left = this.right;
        })
      `,
      output: `
        import Ember from 'ember';
        Ember.computed('right', function() {
          this.left = this.right;
        })
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: right',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Should not ignore properties inside injected service:
      code: `
        import Ember from 'ember';
        import Component from '@ember/component';
        import { inject as service } from '@ember/service';
        Component.extend({
          intl: service(),
          myProperty: Ember.computed(function() {
            return this.intl.someProperty;
          })
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed(function() {
          return this.some.very.long.
            multi.line.property.name;
        });
      `,
      output: `
        import Ember from 'ember';
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
        import Ember from 'ember';
        Ember.computed('na' + 'me', function() {
          return this.undeclared + this.name;
        });
      `,
      output: `
        import Ember from 'ember';
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
        import { computed } from '@ember/object';
        computed('firstName', {
          get() {
            return this.firstName + ' ' + this.lastName;
          },
          set(key, value) {}
        })
      `,
      output: `
        import { computed } from '@ember/object';
        computed('firstName', 'lastName', {
          get() {
            return this.firstName + ' ' + this.lastName;
          },
          set(key, value) {}
        })
      `,
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
        import { computed } from '@ember/object';
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
        import { computed } from '@ember/object';
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
    },
    // Decorator with no parens:
    {
      code: `
        import { computed } from '@ember/object';
        class Test {
          @computed
          get someProp() { return this.undeclared; }
        }
      `,
      output: `
        import { computed } from '@ember/object';
        class Test {
          @computed('undeclared')
          get someProp() { return this.undeclared; }
        }
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'Identifier',
        },
      ],
    },
    // Decorator with no args:
    {
      code: `
        import { computed } from '@ember/object';
        class Test {
          @computed()
          get someProp() { return this.undeclared; }
        }
      `,
      output: `
        import { computed } from '@ember/object';
        class Test {
          @computed('undeclared')
          get someProp() { return this.undeclared; }
        }
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    // Decorator with arg:
    {
      code: `
        import { computed } from '@ember/object';
        class Test {
          @computed('first')
          get fullName() { return this.first + ' ' + this.last; }
        }
      `,
      output: `
        import { computed } from '@ember/object';
        class Test {
          @computed('first', 'last')
          get fullName() { return this.first + ' ' + this.last; }
        }
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: last',
          type: 'CallExpression',
        },
      ],
    },
    // Decorator with two arg:
    {
      code: `
        import { computed } from '@ember/object';
        class Test {
          @computed('first', 'last')
          get fullName() { return this.first + ' ' + this.last + ' ' + this.undeclared; }
        }
      `,
      output: `
        import { computed } from '@ember/object';
        class Test {
          @computed('first', 'last', 'undeclared')
          get fullName() { return this.first + ' ' + this.last + ' ' + this.undeclared; }
        }
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },

    {
      // Optional chaining:
      code:
        "import { computed } from '@ember/object'; computed(function() { return this.x?.y?.z; })",
      output:
        "import { computed } from '@ember/object'; computed('x.y.z', function() { return this.x?.y?.z; })",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: x.y.z',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Optional chaining plus overlap with non-optional-chaining:
      code:
        "import { computed } from '@ember/object'; computed(function() { return this.x?.y?.z + this.x.y.foo; })",
      output:
        "import { computed } from '@ember/object'; computed('x.y.{foo,z}', function() { return this.x?.y?.z + this.x.y.foo; })",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: x.y.foo, x.y.z',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Optional chaining with function call:
      code:
        "import { computed } from '@ember/object'; computed(function() { return this.x?.y?.someFunction(); })",
      output:
        "import { computed } from '@ember/object'; computed('x.y', function() { return this.x?.y?.someFunction(); })",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: x.y',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Optional chaining with array/object access:
      code:
        "import { computed } from '@ember/object'; computed(function() { return this.x?.someArrayOrObject[index]; })",
      output:
        "import { computed } from '@ember/object'; computed('x.someArrayOrObject', function() { return this.x?.someArrayOrObject[index]; })",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: x.someArrayOrObject',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Renamed Ember import:
      code: "import E from 'ember'; E.computed(function() { return this.foo; });",
      output: "import E from 'ember'; E.computed('foo', function() { return this.foo; });",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Renamed computed import:
      code: "import { computed as c } from '@ember/object'; c(function() { return this.foo; });",
      output:
        "import { computed as c } from '@ember/object'; c('foo', function() { return this.foo; });",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Renamed get import:
      code:
        "import { computed, get as g } from '@ember/object'; computed(function() { return g(this, 'foo'); });",
      output:
        "import { computed, get as g } from '@ember/object'; computed('foo', function() { return g(this, 'foo'); });",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Renamed getProperties import:
      code:
        "import { computed, getProperties as gp } from '@ember/object'; computed(function() { return gp(this, 'foo'); });",
      output:
        "import { computed, getProperties as gp } from '@ember/object'; computed('foo', function() { return gp(this, 'foo'); });",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Renamed getWithDefault import:
      code:
        "import { computed, getWithDefault as gwd } from '@ember/object'; computed(function() { return gwd(this, 'foo', 'bar'); });",
      output:
        "import { computed, getWithDefault as gwd } from '@ember/object'; computed('foo', function() { return gwd(this, 'foo', 'bar'); });",
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo',
          type: 'CallExpression',
        },
      ],
    },
  ],
});
