## Don't use `needs` to load other controllers

### Rule name: `avoid-using-needs-in-controllers`

Avoid using `needs` to load other controllers. Inject the required controller instead. `needs` was deprecated
in ember 1.x and removed in 2.0.

```javascript
// Bad
export default Controller.extend({
  needs: ['comments'],
  newComments: alias('controllers.comments.newest')
});
```

```javascript
// Good
import Controller, {
  inject as controller
} from '@ember/controller';

export default Component.extend({
  comments: controller(),
  newComments: alias('comments.newest')
});
```
