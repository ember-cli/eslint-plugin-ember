# no-restricted-resolver-tests

Don't use constructs or configuration that use the restricted resolver in tests.

[RFC-0229](https://github.com/emberjs/rfcs/blob/master/text/0229-deprecate-testing-restricted-resolver.md)
proposed to remove the concept of artificially restricting the resolver used under testing. This rule helps
identify anti-patterns in tests that we want to migrate off.

## Examples

Examples of **incorrect** code for this rule:

If `integration: true` is not included in the specified options for the APIs listed below. This specifically includes specifying `unit: true`, `needs: []`, or specifying none of the "test type options" (`unit`, `needs`,or `integration` options) to the following ember-qunit and ember-mocha API's:

```js
// ember-qunit

moduleFor('service:session');
moduleFor('service:session', {
  unit: true
});
moduleFor('service:session', {
  needs: ['type:thing']
});
moduleFor('service:session', 'arg2', ['etc'], {});

moduleForComponent('display-page');
moduleForComponent('display-page', {
  unit: true
});
moduleForComponent('display-page', {
  needs: ['type:thing']
});
moduleForComponent('display-page', 'arg2', ['etc'], {});

moduleForModel('post');
moduleForModel('post', {
  unit: true
});
moduleForModel('post', {
  needs: ['type:thing']
});
moduleForModel('post', 'arg2', ['etc'], {});
```

```js
// ember-mocha

setupTest('service:session');
setupTest('service:session', {
  unit: true
});
setupTest('service:session', {
  needs: ['type:thing']
});
moduleFor('arg1', 'arg2', ['etc'], {});

setupComponentTest('display-page');
setupComponentTest('display-page', {
  unit: true
});
setupComponentTest('display-page', {
  needs: ['type:thing']
});
setupComponentTest('display-page', 'arg2', ['etc'], {});

setupModelTest('post');
setupModelTest('post', {
  unit: true
});
setupModelTest('post', {
  needs: ['type:thing']
});
setupModelTest('post', 'arg2', ['etc'], {});
```

Examples of **correct** code for this rule:

```js
// ember-qunit

moduleFor('service:session', {
  integration: true
});

moduleForComponent('display-page', {
  integration: true
});

moduleFor('service:session', {
  integration: true
});
```

```js
// ember-mocha

setupTest('service:session', {
  integration: true
});

setupComponentTest('display-page', {
  integration: true
});

setupModelTest('post', {
  integration: true
});

```

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
