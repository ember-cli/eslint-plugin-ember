# no-unused-services

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Disallow unused service injections.

By removing unused services, we can reduce the amount of code we have and improve code readability.

## Examples

Examples of **incorrect** code for this rule:

```js
class MyClass {
  @service('foobarbaz') foo;

  // foo is not referenced below at all
}

Component.extend({
  foo: service('foobarbaz')

  // foo is not referenced below at all
});
```

Examples of **correct** usages of services for this rule:

```js
/* Injected service 'foo' above */

// this.get
this.get('foo');
this.get('foo.bar');

// this.getProperties
this.getProperties('foo');
this.getProperties('foo.bar');
this.getProperties(['foo']);
this.getProperties(['foo.bar']);

// Ember.get
get(this, 'foo');
get(this, 'foo.bar');

// Ember.getProperties
getProperties(this, 'foo');
getProperties(this, 'foo.bar');
getProperties(this, ['foo']);
getProperties(this, ['foo.bar']);

// direct this invocation
this.foo;
this.foo.bar;

// destructured this
const { foo } = this;
```

## References

* Ember [Services](https://guides.emberjs.com/release/applications/services/) guide
* Ember [inject](https://emberjs.com/api/ember/release/functions/@ember%2Fservice/inject) function spec
