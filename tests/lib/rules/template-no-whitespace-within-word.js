const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-whitespace-within-word');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-whitespace-within-word', rule, {
  valid: [
    // No whitespace
    '<template>{{value}}</template>',
    '<template>{{this.property}}</template>',
    '<template>{{@arg}}</template>',
    '<template>{{#if condition}}content{{/if}}</template>',
  
    // Test cases ported from ember-template-lint
    '<template>Welcome</template>',
    '<template>Hey - I like this!</template>',
    '<template>Expected: 5-10 guests</template>',
    '<template>Expected: 5 - 10 guests</template>',
    '<template>It is possible to get some examples of in-word emph a sis past this rule.</template>',
    '<template>However, I do not want a rule that flags annoying false positives for correctly-used single-character words.</template>',
    '<template><div>Welcome</div></template>',
    '<template><div enable-background="a b c d e f g h i j k l m">We want to ignore values of HTML attributes</div></template>',
    `<template><style>
  .my-custom-class > * {
    border: 2px dotted red;
  }
</style></template>`,
  ],
  invalid: [
    {
      code: '<template><div>W e l c o m e</div></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template><span>H e l l o</span></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template><p>C l i c k</p></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>W e l c o m e</template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template>W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e</template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template>Wel c o me</template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template>Wel&nbsp;c&emsp;o&nbsp;me</template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template><div>Wel c o me</div></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template>A  B&nbsp;&nbsp; C </template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
  ],
});
