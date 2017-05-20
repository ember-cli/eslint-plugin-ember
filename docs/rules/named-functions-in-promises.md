## Use named functions defined on objects to handle promises

### Rule name: `named-functions-in-promises`

#### Configuration

```
ember/named-functions-in-promises: [2, {
  allowConciseArrow: false,
}]
```

Setting `allowConciseArrow` to `true` allows arrow function expressions that do not have block bodies.
For example: `.then(user => this._reloadUser(user))`.

#### Description

When you use promises and its handlers, use named functions defined on parent object. Thus, you will be able to test them in isolation using unit tests without any additional mocking.

```javascript
export default Component.extend({
  actions: {
    // BAD
    updateUser(user) {
      user.save().then(() => {
        return user.reload();
      }).then(() => {
        this.notifyAboutSuccess();
      }).catch(() => {
        this.notifyAboutFailure();
      });
    },
    // GOOD
    updateUser(user) {
      user.save()
        .then(this._reloadUser.bind(this))
        .then(this._notifyAboutSuccess.bind(this))
        .catch(this._notifyAboutFailure.bind(this));
    },
  },
  _reloadUser(user) {
    return user.reload();
  },
  _notifyAboutSuccess() {
    // ...
  },
  _notifyAboutFailure() {
    // ...
  },
});
```

And then you can make simple unit tests for handlers:

```javascript
test('it reloads user in promise handler', function(assert) {
  const component = this.subject();
  // assuming that you have `user` defined with kind of sinon spy on its reload method
  component._reloadUser(user);
  assert.ok(userReloadSpy.calledOnce, 'user#reload should be called once');
});
```
