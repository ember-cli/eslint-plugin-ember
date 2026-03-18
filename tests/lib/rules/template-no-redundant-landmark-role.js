//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-redundant-landmark-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-redundant-landmark-role', rule, {
  valid: [
    `<template>
      <nav>Navigation</nav>
    </template>`,
    `<template>
      <main>Content</main>
    </template>`,
    `<template>
      <aside>Sidebar</aside>
    </template>`,
    `<template>
      <div role="navigation">Custom nav</div>
    </template>`,
    `<template>
      <nav role="presentation">Override implicit role</nav>
    </template>`,

    // header/footer inside sectioning elements lose their implicit role,
    // so role="banner"/role="contentinfo" is NOT redundant there.
    `<template>
      <article><header role="banner">Title</header></article>
    </template>`,
    `<template>
      <section><header role="banner">Title</header></section>
    </template>`,
    `<template>
      <aside><header role="banner">Title</header></aside>
    </template>`,
    `<template>
      <main><header role="banner">Title</header></main>
    </template>`,
    `<template>
      <nav><header role="banner">Title</header></nav>
    </template>`,
    `<template>
      <article><footer role="contentinfo">Info</footer></article>
    </template>`,
    `<template>
      <section><footer role="contentinfo">Info</footer></section>
    </template>`,
    `<template>
      <aside><footer role="contentinfo">Info</footer></aside>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <nav role="navigation">Nav</nav>
      </template>`,
      output: `<template>
        <nav>Nav</nav>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "navigation". The <nav> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <main role="main">Content</main>
      </template>`,
      output: `<template>
        <main>Content</main>
      </template>`,
      errors: [
        {
          message: 'Redundant role "main". The <main> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <aside role="complementary">Sidebar</aside>
      </template>`,
      output: `<template>
        <aside>Sidebar</aside>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "complementary". The <aside> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <header role="banner">Title</header>
      </template>`,
      output: `<template>
        <header>Title</header>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "banner". The <header> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <footer role="contentinfo">Info</footer>
      </template>`,
      output: `<template>
        <footer>Info</footer>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "contentinfo". The <footer> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});

//------------------------------------------------------------------------------
// HBS parser tests
//------------------------------------------------------------------------------

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-redundant-landmark-role (hbs)', rule, {
  valid: [
    '<nav>Navigation</nav>',
    '<main>Content</main>',
    '<aside>Sidebar</aside>',
    '<div role="navigation">Custom nav</div>',
    '<nav role="presentation">Override implicit role</nav>',

    // header/footer inside sectioning elements - not redundant
    '<article><header role="banner">Title</header></article>',
    '<section><header role="banner">Title</header></section>',
    '<article><footer role="contentinfo">Info</footer></article>',
    '<section><footer role="contentinfo">Info</footer></section>',
  ],

  invalid: [
    {
      code: '<nav role="navigation">Nav</nav>',
      output: '<nav>Nav</nav>',
      errors: [
        {
          message:
            'Redundant role "navigation". The <nav> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<main role="main">Content</main>',
      output: '<main>Content</main>',
      errors: [
        {
          message: 'Redundant role "main". The <main> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<header role="banner">Title</header>',
      output: '<header>Title</header>',
      errors: [
        {
          message:
            'Redundant role "banner". The <header> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<footer role="contentinfo">Info</footer>',
      output: '<footer>Info</footer>',
      errors: [
        {
          message:
            'Redundant role "contentinfo". The <footer> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
