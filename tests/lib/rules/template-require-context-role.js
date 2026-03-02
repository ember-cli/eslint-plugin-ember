//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-context-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-context-role', rule, {
  valid: [
    `<template>
      <ul role="list">
        <li role="listitem">Item</li>
      </ul>
    </template>`,
    `<template>
      <div role="tablist">
        <div role="tab">Tab 1</div>
      </div>
    </template>`,
    `<template>
      <div role="menu">
        <div role="menuitem">Item</div>
      </div>
    </template>`,
    `<template>
      <div role="button">No context needed</div>
    </template>`,

    '<template><div role="list"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div></template>',
    '<template><div role="group"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div></template>',
    '<template><div role="row"><div role="columnheader">Item One</div></div></template>',
    '<template><div role="gridcell">Item One</div></template>',
    '<template><div role="row">{{yield}}</div></template>',
    '<template><div role="row"><div role="gridcell">Item One</div></div></template>',
    '<template><div role="row"><br>{{#if a}}<div role="gridcell">Item One</div>{{/if}}</div></template>',
    '<template><div role="group"><div role="menuitem">Item One</div></div></template>',
    '<template><div role="menu"><div role="menuitem">Item One</div></div></template>',
    '<template><div role="menubar"><div role="menuitem">Item One</div></div></template>',
    '<template><div role="menu"><div role="menuitemcheckbox">Item One</div></div></template>',
    '<template><div role="menubar"><div role="menuitemcheckbox">Item One</div></div></template>',
    '<template><div role="group"><div role="menuitemradio">Item One</div></div></template>',
    '<template><div role="menu"><div role="menuitemradio">Item One</div></div></template>',
    '<template><div role="menubar"><div role="menuitemradio">Item One</div></div></template>',
    '<template><div role="menubar"><div role="presentation"><a role="menuitem">Item One</a></div></div></template>',
    '<template><div role="listbox"><div role="option">Item One</div></div></template>',
    '<template><div role="grid"><div role="row">Item One</div></div></template>',
    '<template><div role="rowgroup"><div role="row">Item One</div></div></template>',
    '<template><div role="treegrid"><div role="row">Item One</div></div></template>',
    '<template><div aria-hidden="true" role="tablist"><div role="treeitem">Item One</div></div></template>',
    '<template><div role="grid"><div role="rowgroup">Item One</div></div></template>',
    '<template><div role="row"><div role="rowheader">Item One</div></div></template>',
    '<template><div role="tablist"><div role="tab">Item One</div></div></template>',
    '<template><div role="group"><div role="treeitem">Item One</div></div></template>',
    '<template><div role="tree"><div role="treeitem">Item One</div></div></template>',
    '<template><div role="list">{{#each someList as |item|}}{{list-item item=item}}{{/each}}</div></template>',
    '<template><div role="list">{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}</div></template>',
    '<template><div role="list">{{#if this.show}}{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}{{/if}}</div></template>',
    '<template><div role="table"><div role="row"><div role="cell">One</div></div></div></template>',
    `<template><typeahead.list role="list">
      <:content as |items|>
        {{#each items as |job idx|}}
          <result role="listitem">
            ...
          </result>
        {{/each}}
        </:content>
    </typeahead.list></template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div>
          <div role="listitem">Item</div>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Role "listitem" must be contained in an element with one of these roles: list, group, directory',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div>
          <div role="tab">Tab 1</div>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Role "tab" must be contained in an element with one of these roles: tablist',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div>
          <div role="menuitem">Item</div>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><div role="tablist"><div role="treeitem">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "treeitem" must be contained in an element with one of these roles: tree, group',
        },
      ],
    },
    {
      code: '<template><div><div role="columnheader">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "columnheader" must be contained in an element with one of these roles: row',
        },
      ],
    },
    {
      code: '<template><div><div role="gridcell">Item One</div></div></template>',
      output: null,
      errors: [
        { message: 'Role "gridcell" must be contained in an element with one of these roles: row' },
      ],
    },
    {
      code: '<template><div><div role="listitem">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "listitem" must be contained in an element with one of these roles: list, group, directory',
        },
      ],
    },
    {
      code: '<template><div><div role="menuitem">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group',
        },
      ],
    },
    {
      code: '<template><div><div role="menuitemcheckbox">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "menuitemcheckbox" must be contained in an element with one of these roles: menu, menubar, group',
        },
      ],
    },
    {
      code: '<template><div><div role="menuitemradio">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "menuitemradio" must be contained in an element with one of these roles: menu, menubar, group',
        },
      ],
    },
    {
      code: '<template><div><div role="option">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "option" must be contained in an element with one of these roles: listbox, group',
        },
      ],
    },
    {
      code: '<template><div><div role="row">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "row" must be contained in an element with one of these roles: table, grid, treegrid, rowgroup',
        },
      ],
    },
    {
      code: '<template><div><div role="rowgroup">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "rowgroup" must be contained in an element with one of these roles: grid, table, treegrid',
        },
      ],
    },
    {
      code: '<template><div><div role="rowheader">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message: 'Role "rowheader" must be contained in an element with one of these roles: row',
        },
      ],
    },
    {
      code: '<template><div><div role="tab">Item One</div></div></template>',
      output: null,
      errors: [
        { message: 'Role "tab" must be contained in an element with one of these roles: tablist' },
      ],
    },
    {
      code: '<template><div><div role="treeitem">Item One</div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "treeitem" must be contained in an element with one of these roles: tree, group',
        },
      ],
    },
    {
      code: '<template><div role="menu"><div><a role="menuitem">Item One</a></div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group',
        },
      ],
    },
    {
      code: '<template><div role="menu"><div role="button"><a role="menuitem">Item One</a></div></div></template>',
      output: null,
      errors: [
        {
          message:
            'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group',
        },
      ],
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

hbsRuleTester.run('template-require-context-role', rule, {
  valid: [
    '<div role="list"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div>',
    '<div role="group"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div>',
    '<div role="row"><div role="columnheader">Item One</div></div>',
    '<div role="gridcell">Item One</div>',
    '<div role="row">{{yield}}</div>',
    '<div role="row"><div role="gridcell">Item One</div></div>',
    '<div role="row"><br>{{#if a}}<div role="gridcell">Item One</div>{{/if}}</div>',
    '<div role="group"><div role="menuitem">Item One</div></div>',
    '<div role="menu"><div role="menuitem">Item One</div></div>',
    '<div role="menubar"><div role="menuitem">Item One</div></div>',
    '<div role="menu"><div role="menuitemcheckbox">Item One</div></div>',
    '<div role="menubar"><div role="menuitemcheckbox">Item One</div></div>',
    '<div role="group"><div role="menuitemradio">Item One</div></div>',
    '<div role="menu"><div role="menuitemradio">Item One</div></div>',
    '<div role="menubar"><div role="menuitemradio">Item One</div></div>',
    '<div role="menubar"><div role="presentation"><a role="menuitem">Item One</a></div></div>',
    '<div role="listbox"><div role="option">Item One</div></div>',
    '<div role="grid"><div role="row">Item One</div></div>',
    '<div role="rowgroup"><div role="row">Item One</div></div>',
    '<div role="treegrid"><div role="row">Item One</div></div>',
    '<div aria-hidden="true" role="tablist"><div role="treeitem">Item One</div></div>',
    '<div role="grid"><div role="rowgroup">Item One</div></div>',
    '<div role="row"><div role="rowheader">Item One</div></div>',
    '<div role="tablist"><div role="tab">Item One</div></div>',
    '<div role="group"><div role="treeitem">Item One</div></div>',
    '<div role="tree"><div role="treeitem">Item One</div></div>',
    '<div role="list">{{#each someList as |item|}}{{list-item item=item}}{{/each}}</div>',
    '<div role="list">{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}</div>',
    '<div role="list">{{#if this.show}}{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}{{/if}}</div>',
    '<div role="table"><div role="row"><div role="cell">One</div></div></div>',
    `<typeahead.list role="list">
      <:content as |items|>
        {{#each items as |job idx|}}
          <result role="listitem">
            ...
          </result>
        {{/each}}
        </:content>
    </typeahead.list>`,
  ],
  invalid: [
    {
      code: '<div role="tablist"><div role="treeitem">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "treeitem" must be contained in an element with one of these roles: tree, group' },
      ],
    },
    {
      code: '<div><div role="columnheader">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "columnheader" must be contained in an element with one of these roles: row' },
      ],
    },
    {
      code: '<div><div role="gridcell">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "gridcell" must be contained in an element with one of these roles: row' },
      ],
    },
    {
      code: '<div><div role="listitem">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "listitem" must be contained in an element with one of these roles: list, group, directory' },
      ],
    },
    {
      code: '<div><div role="menuitem">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group' },
      ],
    },
    {
      code: '<div><div role="menuitemcheckbox">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "menuitemcheckbox" must be contained in an element with one of these roles: menu, menubar, group' },
      ],
    },
    {
      code: '<div><div role="menuitemradio">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "menuitemradio" must be contained in an element with one of these roles: menu, menubar, group' },
      ],
    },
    {
      code: '<div><div role="option">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "option" must be contained in an element with one of these roles: listbox, group' },
      ],
    },
    {
      code: '<div><div role="row">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "row" must be contained in an element with one of these roles: table, grid, treegrid, rowgroup' },
      ],
    },
    {
      code: '<div><div role="rowgroup">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "rowgroup" must be contained in an element with one of these roles: grid, table, treegrid' },
      ],
    },
    {
      code: '<div><div role="rowheader">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "rowheader" must be contained in an element with one of these roles: row' },
      ],
    },
    {
      code: '<div><div role="tab">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "tab" must be contained in an element with one of these roles: tablist' },
      ],
    },
    {
      code: '<div><div role="treeitem">Item One</div></div>',
      output: null,
      errors: [
        { message: 'Role "treeitem" must be contained in an element with one of these roles: tree, group' },
      ],
    },
    {
      code: '<div role="menu"><div><a role="menuitem">Item One</a></div></div>',
      output: null,
      errors: [
        { message: 'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group' },
      ],
    },
    {
      code: '<div role="menu"><div role="button"><a role="menuitem">Item One</a></div></div>',
      output: null,
      errors: [
        { message: 'Role "menuitem" must be contained in an element with one of these roles: menu, menubar, group' },
      ],
    },
  ],
});
