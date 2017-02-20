## Use brace expansion

### Rule name: `use-brace-expansion`

This allows much less redundancy and is easier to read.

Note that **the dependent keys must be together (without space)** for the brace expansion to work.

```javascript
// Good
fullName: computed('user.{firstName,lastName}', {
  // Code
})

// Bad
fullName: computed('user.firstName', 'user.lastName', {
  // Code
})
```
