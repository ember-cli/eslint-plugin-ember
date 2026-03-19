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
        <div>
          <label for="radio-002">Office Hours Tomster</label>
          <input
            id="radio-002"
            type="radio"
            name="prefMascot-OfficeHoursTomster"
            value="office hours tomster"
          />
        </div>
        <div>
          <label for="radio-003">A11y Zoey</label>
          <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey" />
        </div>
      </fieldset>
    </template>`,
    `<template>
      <div role="group" aria-labelledby="preferred-mascot-heading">
        <div id="preferred-mascot-heading">Preferred Mascot Version</div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
        <label for="radio-002">Office Hours Tomster</label>
        <input
          id="radio-002"
          type="radio"
          name="prefMascot-OfficeHoursTomster"
          value="office hours tomster"
        />
        <label for="radio-003">A11y Zoey</label>
        <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey" />
      </div>
    </template>`,
    `<template>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
      </div>
    </template>`,

    `<template><fieldset>
      <legend>Preferred Mascot Version</legend>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      </div>
      <div>
        <label for="radio-002">Office Hours Tomster</label>
        <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster">
      </div>
      <div>
        <label for="radio-003">A11y Zoey</label>
        <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey">
      </div>
    </fieldset></template>`,
    `<template><div role="group" aria-labelledby="preferred-mascot-heading">
      <div id="preferred-mascot-heading">Preferred Mascot Version</div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      <label for="radio-002">Office Hours Tomster</label>
      <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster">
      <label for="radio-003">A11y Zoey</label>
      <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey">
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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-require-valid-form-groups', rule, {
  valid: [
    `<fieldset>
      <legend>Preferred Mascot Version</legend>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      </div>
      <div>
        <label for="radio-002">Office Hours Tomster</label>
        <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster">
      </div>
      <div>
        <label for="radio-003">A11y Zoey</label>
        <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey">
      </div>
    </fieldset>`,
    `<div role="group" aria-labelledby="preferred-mascot-heading">
      <div id="preferred-mascot-heading">Preferred Mascot Version</div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      <label for="radio-002">Office Hours Tomster</label>
      <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster">
      <label for="radio-003">A11y Zoey</label>
      <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey">
    </div>`,
    `<div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
    </div>`,
  ],
  invalid: [
    {
      code: '<div><input name="a1">Chicago Zoey<input name="a2">Chicago Tom</div>',
      output: null,
      errors: [
        {
          message:
            'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels',
        },
        {
          message:
            'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels',
        },
      ],
    },
    {
      code: '<div><input id="prefMascot-Zoey"><label for="prefMascot-Zoey" /><input id="prefMascot-tom"><label for="prefMascot-tom" /></div>',
      output: null,
      errors: [
        {
          message:
            'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels',
        },
        {
          message:
            'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels',
        },
      ],
    },
  ],
});
