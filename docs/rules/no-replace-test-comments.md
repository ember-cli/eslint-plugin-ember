# no-replace-test-comments

Ember developers using blueprints to generate classes should write real tests.

Leaving the default test comment in place is a sign of a rushed class.

## Rule Details

This rule aims to nudge developers into writing more/better tests.

It aims to do this by complaining at them early about a default test file.

This rule only fires for test files (ending in '-test.js' or '-test.ts')

This will especially push TDD (test-driven development) on repos with githooks that enforce lint early.

## Examples

Examples of **incorrect** code for this rule:

```js
// Replace this with your real tests.
test('it exists', function(assert) {
  const service = this.owner.lookup('service:company');
  assert.ok(service);
});
```

Examples of **correct** code for this rule:

```js
test('it has a purpose beyond mere existence', function(assert) {
  const service = this.owner.lookup('service:company');
  set(service, 'company', myCompanyMock);
  assert.equal(service.isOnboardingComplete, true, 'the computed property works as expected');
});
```

## Migration

- The [testing guides](https://guides.emberjs.com/release/testing/testing-components/) shall be your guide
- Consider a code coverage tool like [ember-cli-code-coverage](https://github.com/kategengler/ember-cli-code-coverage) as well

## References

- [Learn Test Driven Development in Ember](https://learntdd.in/ember/)
