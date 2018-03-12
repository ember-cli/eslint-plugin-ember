# Disallow use of anonymous functions when use in scheduleOnce or once (no-anonymous-once)

If `scheduleOnce` is passed an anonymous function, then each invocation of `scheduleOnce` will be passed a different function instance and the function will run multiple times. Passing a named function, will allow `scheduleOnce` to detect if the same function is being scheduled multiple times and work as expected.


## Rule Details

Examples of **incorrect** code for this rule:

```js
function scheduleIt() {
  scheduleOnce('actions', myContext, function() {
    console.log('Closure');
  });
}
```

Examples of **correct** code for this rule:

```js
function log() {
  console.log('Logging only once');
}

function scheduleIt() {
  scheduleOnce('actions', myContext, log);
}
```

## Further Reading

https://emberjs.com/api/ember/3.0/functions/@ember%2Frunloop/scheduleOnce
