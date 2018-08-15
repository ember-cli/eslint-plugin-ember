# Don't use constructs or configuration that use the restricted resolver in tests. (no-restricted-resolver-tests)

[RFC-0229](https://github.com/emberjs/rfcs/blob/master/text/0229-deprecate-testing-restricted-resolver.md)
proposed to remove the concept of artificially restricting the resolver used under testing. This rule helps
identify anti-patterns in tests that we want to migrate off.

## Rule Details

This rule aims to...

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
moduleFor('arg1', 'arg2', [...,] {});

moduleForComponent('display-page');
moduleForComponent('display-page', {
  unit: true
});
moduleForComponent('display-page', {
  needs: ['type:thing']
});
moduleForComponent('thing', 'arg2', [...,] {});

moduleForModel('post');
moduleForModel('post', {
  unit: true
});
moduleForModel('post', {
  needs: ['type:thing']
});
moduleForModel('thing', 'arg2', [...,] {});
```

```js
// ember-mocha
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

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
