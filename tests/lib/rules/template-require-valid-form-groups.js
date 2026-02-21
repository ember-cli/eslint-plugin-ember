const rule = require('../../../lib/rules/template-require-valid-form-groups');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-valid-form-groups', rule, {
  valid: [
    `<template>
      <fieldset>
        <legend>Preferred Mascot Version</legend>
        <div>
          <label for="radio-001">Chicago Zoey</label>
          <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
        </div>
      </fieldset>
    </template>`,
    `<template>
      <div role="group" aria-labelledby="preferred-mascot-heading">
        <div id="preferred-mascot-heading">Preferred Mascot Version</div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
        <label for="radio-002">Chicago Tom</label>
        <input id="radio-002" type="radio" name="prefMascot-Tom" value="chicago zoey" />
      </div>
    </template>`,
    `<template>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
      </div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    `<template><fieldset>
      <legend>Preferred Mascot Version</legend>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      </div>
    </fieldset></template>`,
    `<template><div role="group" aria-labelledby="preferred-mascot-heading">
      <div id="preferred-mascot-heading">Preferred Mascot Version</div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      <label for="radio-002">Chicago Tom</label>
      <input id="radio-002" type="radio" name="prefMascot-Tom" value="chicago zoey">
    </div></template>`,
    `<template><div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
    </div></template>`,
  ],
  invalid: [
    {
      code: '<template><div><input name="a1">Chicago Zoey<input name="a2">Chicago Tom</div></template>',
      output: null,
      errors: [{ messageId: 'requireValidFormGroups' }, { messageId: 'requireValidFormGroups' }],
    },
    {
      code: '<template><div><input id="prefMascot-Zoey"><label for="prefMascot-Zoey" /><input id="prefMascot-tom"><label for="prefMascot-tom" /></div></template>',
      output: null,
      errors: [{ messageId: 'requireValidFormGroups' }, { messageId: 'requireValidFormGroups' }],
    },
  ],
});
