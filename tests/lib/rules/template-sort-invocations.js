const rule = require('../../../lib/rules/template-sort-invocations');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-sort-invocations', rule, {
  valid: [
    // Basic component
    '<template><Button /></template>',

    // Single attribute
    '<template><Button @label="submit" /></template>',

    // Correctly sorted: @args first, then attributes, then modifiers
    '<template><Button @isDisabled={{true}} @label="Submit" class="button" {{on "click" this.handleClick}} /></template>',

    // Correctly sorted attributes
    '<template><div class="foo" id="bar" /></template>',

    // Correctly sorted modifiers
    '<template><button {{on "click" this.handleClick}} {{on "focus" this.handleFocus}} /></template>',

    // ...attributes at the end (after modifiers per rule)
    '<template><Button @label="Submit" class="button" {{on "click" this.handleClick}} ...attributes /></template>',

    // Hash pairs sorted
    '<template>{{component name="button" type="submit"}}</template>',

    // Block with sorted hash
    '<template>{{#each items as |item|}}{{item}}{{/each}}</template>',
    '<template>{{#let a="1" b="2" as |x y|}}{{x}}{{y}}{{/let}}</template>',
  ],

  invalid: [
    // Unsorted attributes (regular before @arg)
    {
      code: '<template><Button class="button" @label="Submit" /></template>',
      output: '<template><Button @label="Submit" class="button" /></template>',
      errors: [
        {
          messageId: 'attributeOrder',
          data: { attributeName: 'class', expectedAfter: '@label' },
        },
      ],
    },

    // Unsorted regular attributes
    {
      code: '<template><div id="bar" class="foo" /></template>',
      output: '<template><div class="foo" id="bar" /></template>',
      errors: [
        {
          messageId: 'attributeOrder',
          data: { attributeName: 'id', expectedAfter: 'class' },
        },
      ],
    },

    // Unsorted modifiers
    {
      code: '<template><button {{on "focus" this.handleFocus}} {{on "click" this.handleClick}} /></template>',
      output:
        '<template><button {{on "click" this.handleClick}} {{on "focus" this.handleFocus}} /></template>',
      errors: [
        {
          messageId: 'modifierOrder',
          data: { modifierName: 'on', expectedAfter: 'on' },
        },
      ],
    },

    // ...attributes before modifiers
    {
      code: '<template><Button @label="Submit" ...attributes {{on "click" this.handleClick}} /></template>',
      output:
        '<template><Button @label="Submit" {{on "click" this.handleClick}} ...attributes /></template>',
      errors: [
        {
          messageId: 'splattributesOrder',
        },
      ],
    },

    // Unsorted hash pairs
    {
      code: '<template>{{component type="submit" name="button"}}</template>',
      output: '<template>{{component name="button" type="submit"}}</template>',
      errors: [
        {
          messageId: 'hashPairOrder',
          data: { hashPairName: 'type', expectedAfter: 'name' },
        },
      ],
    },

    // Unsorted hash in block
    {
      code: '<template>{{#let b="2" a="1" as |x y|}}{{x}}{{y}}{{/let}}</template>',
      output: '<template>{{#let a="1" b="2" as |x y|}}{{x}}{{y}}{{/let}}</template>',
      errors: [
        {
          messageId: 'hashPairOrder',
          data: { hashPairName: 'b', expectedAfter: 'a' },
        },
      ],
    },

    {
      code: `<template>
        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      output: `<template>
        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
          @label="Submit form"
        />

        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button=""
          ...attributes
        >
          Submit form
        </Ui::Button>

        {{ui/button
          onclick=this.doSomething
          data-test-button=""
          type="submit"
          label="Submit form"
        }}

        {{#ui/button
          onclick=this.doSomething
          data-test-button=""
          type="submit"
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
      ],
    },
    {
      code: `<template>
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      output: `<template>
        <Ui::Button
          @type="submit"
          {{on "click" this.doSomething}}
          data-cucumber-button="Submit form"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          @type="submit"
          {{on "click" this.doSomething}}
          data-cucumber-button="Submit form"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
      ],
    },
    {
      code: `<template>
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button=""
          {{autofocus}}
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      output: `<template>
        <Ui::Button
          @type="submit"
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />

        <Ui::Button
          @type="submit"
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button=""
          {{autofocus}}
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'modifierOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'modifierOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
      ],
    },
    {
      code: `<template>
        <MyComponent
          @title="Update history"
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          }}
        />

        {{my-component
          title="Update history"
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          )
        }}
      </template>`,
      output: `<template>
        <MyComponent
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          }}
          @title="Update history"
        />

        {{my-component
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          )
          title="Update history"
        }}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'hashPairOrder' },
      ],
    },
    {
      code: `<template>
        <Ui::Button
          data-cucumber-button="Submit form"
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          @type="submit"
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />
      </template>`,
      output: `<template>
        <Ui::Button
          @type="submit"
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />
      </template>`,
      errors: [{ messageId: 'attributeOrder' }, { messageId: 'modifierOrder' }],
    },
    {
      code: `<template>
        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
        >
          Submit form
        </this.MyButton>
      </template>`,
      output: `<template>
        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
          @label="Submit form"
        />

        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
        >
          Submit form
        </this.MyButton>
      </template>`,
      errors: [{ messageId: 'attributeOrder' }, { messageId: 'attributeOrder' }],
    },
    {
      code: `<template>
        {{component "ui/button"}}

        {{component "ui/button"
          onClick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=@onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}
      </template>`,
      output: `<template>
        {{component "ui/button"}}

        {{component "ui/button"
          onClick=this.doSomething
          data-test-button=""
          type="submit"
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=@onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
      ],
    },
    {
      code: `<template>
        <button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          type="submit"
          disabled
          class={{local this.styles "button" "disabled"}}
          ...attributes
          data-test-button
          {{autofocus}}
        >
          Submit form
        </button>

        <div
          role="button"
          {{on "mouseleave" (fn this.setFocus false)}}
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "click" this.submitForm}}
        >
          Submit form
        </div>
      </template>`,
      output: `<template>
        <button
          data-cucumber-button="Submit form"
          {{autofocus}}
          type="submit"
          disabled
          class={{local this.styles "button" "disabled"}}
          ...attributes
          data-test-button
          {{on "click" @onSubmit}}
        >
          Submit form
        </button>

        <div
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          {{on "mouseleave" (fn this.setFocus false)}}
          role="button"
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "click" this.submitForm}}
        >
          Submit form
        </div>
      </template>`,
      errors: [
        { messageId: 'modifierOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'modifierOrder' },
      ],
    },
    {
      code: `<template>
        {{#let (unique-id) as |formId|}}
          <form
            class={{this.styles.form}}
            data-test-form={{if @title @title ""}}
            aria-labelledby={{if @title (concat formId "-title")}}
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }}
            {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}}
              @title={{@title}}
              @instructions={{@instructions}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                type="submit"
                data-test-button="Submit"
                class={{this.styles.submit-button}}
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      </template>`,
      output: `<template>
        {{#let (unique-id) as |formId|}}
          <form
            class={{this.styles.form}}
            aria-labelledby={{if @title (concat formId "-title")}}
            data-test-form={{if @title @title ""}}
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }}
            {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}}
              @instructions={{@instructions}}
              @title={{@title}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                data-test-button="Submit"
                type="submit"
                class={{this.styles.submit-button}}
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'hashPairOrder' },
        { messageId: 'attributeOrder' },
      ],
    },
    {
      code: `<template>
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>
      </template>`,
      output: `<template>
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          ...attributes
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          ...attributes
          {{on "load" this.doSomething2}}
        ></iframe>
      </template>`,
      errors: [{ messageId: 'attributeOrder' }, { messageId: 'splattributesOrder' }],
    },
    {
      code: `<template>
        <Ui::Page
          @title={{"Your product"}}
          {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          @routeName={{this.router.currentRouteName}}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @id="products.overview" @icon="rightarrow" @label="" />
          {{else if this.someCondition2}}
            <Page.Button @id="products.product" @icon="" @label="" />
          {{else}}
            <Page.Button
              @id="products.product"
              @icon=""
              @label="
              "
            />
          {{/if}}
        </Ui::Page>
      </template>`,
      output: `<template>
        <Ui::Page
          @routeName={{this.router.currentRouteName}}
          {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          @title={{"Your product"}}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @icon="rightarrow" @id="products.overview" @label="" />
          {{else if this.someCondition2}}
            <Page.Button @icon="" @id="products.product" @label="" />
          {{else}}
            <Page.Button
              @icon=""
              @id="products.product"
              @label="
              "
            />
          {{/if}}
        </Ui::Page>
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
      ],
    },
    {
      code: `<template>
        <MyComponent
          @parentContainerId={{concat "#" @parentId}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style={{concat "." @type "1"}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          type="tel"
          local-class="input {{concat 'flag-' @country}}"
        />

        <MyComponent
          @parentContainerId="#{{@parentId}}"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style=".{{@type}}1"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          aria-describedby="1"
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
        />

        <input
          type="tel"
          local-class="input flag-{{@country}}"
        />
      </template>`,
      output: `<template>
        <MyComponent
          @isOpen={{this.isOpen}}
          @parentContainerId={{concat "#" @parentId}}
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @style={{concat "." @type "1"}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          local-class="input {{concat 'flag-' @country}}"
          type="tel"
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @parentContainerId="#{{@parentId}}"
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @style=".{{@type}}1"
        />

        <MyComponent
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
          aria-describedby="1"
        />

        <input
          local-class="input flag-{{@country}}"
          type="tel"
        />
      </template>`,
      errors: [
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
        { messageId: 'attributeOrder' },
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

hbsRuleTester.run('template-sort-invocations', rule, {
  valid: [
    '',
    `
        <Ui::Button />

        <Ui::Button>
          Submit form
        </Ui::Button>

        {{ui/button}}

        {{#ui/button}}
          Submit form
        {{/ui/button}}
      `,
    `
        <Ui::Button
          @label="Submit form"
          @type="submit"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    `
        <Ui::Button
          @isDisabled={{true}}
          @label="Submit form"
          @type="submit"
          class="ui-button disabled"
          data-cucumber-button="Submit form"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    `
        <Ui::Button
          @isDisabled={{not this.enableSubmit}}
          @label="Submit form"
          @type="submit"
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          data-cucumber-button="Submit form"
          data-test-button
          {{autofocus}}
          {{on "click" @onSubmit}}
          ...attributes
        />
      `,
    `
        <MyComponent
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              installedOn=this.installationDate
              packageName="ember-source"
              packageVersion="6.0.0"
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageName="ember-source"
                packageVersion="6.0.0"
              )
            )
          }}
          @title="Update history"
        />
      `,
    `
        <Ui::Button
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          @label="Submit form"
          @type="submit"
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          data-cucumber-button="Submit form"
          data-test-button
          {{autofocus}}
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          ...attributes
        />
      `,
    `
        <this.MyButton
          @label="Submit form"
          @type="submit"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    `
        {{component
          "ui/button"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=(not this.enableSubmit)
          label="Submit form"
          onClick=@onSubmit
          type="submit"
        }}
      `,
    `
        <button
          class={{local this.styles "button" "disabled"}}
          data-cucumber-button="Submit form"
          data-test-button
          disabled
          type="submit"
          {{autofocus}}
          {{on "click" @onSubmit}}
          ...attributes
        >
          Submit form
        </button>

        <div
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          role="button"
          {{on "click" this.submitForm}}
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "mouseleave" (fn this.setFocus false)}}
        >
          Submit form
        </div>
      `,
    `
        <MyComponent
        >
          <div
          >
            <span class={{this.styles.highlight}}>
            Hello world!
            </span>
          </div>
        </MyComponent>
      `,
  ],
  invalid: [
    {
      code: `
        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      output: `
        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
          @label="Submit form"
        />

        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button=""
          ...attributes
        >
          Submit form
        </Ui::Button>

        {{ui/button
          onclick=this.doSomething
          data-test-button=""
          type="submit"
          label="Submit form"
        }}

        {{#ui/button
          onclick=this.doSomething
          data-test-button=""
          type="submit"
        }}
          Submit form
        {{/ui/button}}
      `,
      errors: [
        { message: '`...attributes` must appear after `data-test-button`' },
        { message: '`...attributes` must appear after `data-test-button`' },
        { message: '`type` must appear after `data-test-button`' },
        { message: '`type` must appear after `data-test-button`' },
      ],
    },
    {
      code: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      output: `
        <Ui::Button
          @type="submit"
          {{on "click" this.doSomething}}
          data-cucumber-button="Submit form"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          @type="submit"
          {{on "click" this.doSomething}}
          data-cucumber-button="Submit form"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      errors: [
        { message: '`data-cucumber-button` must appear after `@type`' },
        { message: '`data-cucumber-button` must appear after `@type`' },
        { message: '`type` must appear after `isDisabled`' },
        { message: '`type` must appear after `isDisabled`' },
      ],
    },
    {
      code: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button=""
          {{autofocus}}
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      output: `
        <Ui::Button
          @type="submit"
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />

        <Ui::Button
          @type="submit"
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button=""
          {{autofocus}}
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      errors: [
        { message: '`data-cucumber-button` must appear after `@type`' },
        { message: '`{{on}}` must appear after `{{autofocus}}`' },
        { message: '`data-cucumber-button` must appear after `@type`' },
        { message: '`{{on}}` must appear after `{{autofocus}}`' },
        { message: '`type` must appear after `isDisabled`' },
        { message: '`type` must appear after `isDisabled`' },
      ],
    },
    {
      code: `
        <MyComponent
          @title="Update history"
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          }}
        />

        {{my-component
          title="Update history"
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          )
        }}
      `,
      output: `
        <MyComponent
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          }}
          @title="Update history"
        />

        {{my-component
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          )
          title="Update history"
        }}
      `,
      errors: [
        { message: '`@title` must appear after `@description`' },
        { message: '`packageVersion` must appear after `packageName`' },
        { message: '`packageVersion` must appear after `packageName`' },
        { message: '`title` must appear after `description`' },
        { message: '`packageVersion` must appear after `packageName`' },
        { message: '`packageVersion` must appear after `packageName`' },
      ],
    },
    {
      code: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          @type="submit"
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />
      `,
      output: `
        <Ui::Button
          @type="submit"
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          data-cucumber-button="Submit form"
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />
      `,
      errors: [
        { message: '`data-cucumber-button` must appear after `@type`' },
        { message: '`{{on}}` must appear after `{{autofocus}}`' },
      ],
    },
    {
      code: `
        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
        >
          Submit form
        </this.MyButton>
      `,
      output: `
        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
          @label="Submit form"
        />

        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          data-test-button
          ...attributes
        >
          Submit form
        </this.MyButton>
      `,
      errors: [
        { message: '`...attributes` must appear after `data-test-button`' },
        { message: '`...attributes` must appear after `data-test-button`' },
      ],
    },
    {
      code: `
        {{component "ui/button"}}

        {{component "ui/button"
          onClick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=@onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}
      `,
      output: `
        {{component "ui/button"}}

        {{component "ui/button"
          onClick=this.doSomething
          data-test-button=""
          type="submit"
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=this.doSomething
          isDisabled=true
          type="submit"
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=@onSubmit
          isDisabled=(not this.enableSubmit)
          type="submit"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}
      `,
      errors: [
        { message: '`type` must appear after `data-test-button`' },
        { message: '`type` must appear after `isDisabled`' },
        { message: '`type` must appear after `isDisabled`' },
      ],
    },
    {
      code: `
        <button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          type="submit"
          disabled
          class={{local this.styles "button" "disabled"}}
          ...attributes
          data-test-button
          {{autofocus}}
        >
          Submit form
        </button>

        <div
          role="button"
          {{on "mouseleave" (fn this.setFocus false)}}
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "click" this.submitForm}}
        >
          Submit form
        </div>
      `,
      output: `
        <button
          data-cucumber-button="Submit form"
          {{autofocus}}
          type="submit"
          disabled
          class={{local this.styles "button" "disabled"}}
          ...attributes
          data-test-button
          {{on "click" @onSubmit}}
        >
          Submit form
        </button>

        <div
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          {{on "mouseleave" (fn this.setFocus false)}}
          role="button"
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "click" this.submitForm}}
        >
          Submit form
        </div>
      `,
      errors: [
        { message: '`{{on}}` must appear after `{{autofocus}}`' },
        { message: '`type` must appear after `disabled`' },
        { message: '`role` must appear after `class`' },
        { message: '`{{on}}` must appear after `{{on}}`' },
      ],
    },
    {
      code: `
        {{#let (unique-id) as |formId|}}
          <form
            class={{this.styles.form}}
            data-test-form={{if @title @title ""}}
            aria-labelledby={{if @title (concat formId "-title")}}
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }}
            {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}}
              @title={{@title}}
              @instructions={{@instructions}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                type="submit"
                data-test-button="Submit"
                class={{this.styles.submit-button}}
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      `,
      output: `
        {{#let (unique-id) as |formId|}}
          <form
            class={{this.styles.form}}
            aria-labelledby={{if @title (concat formId "-title")}}
            data-test-form={{if @title @title ""}}
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }}
            {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}}
              @instructions={{@instructions}}
              @title={{@title}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                data-test-button="Submit"
                type="submit"
                class={{this.styles.submit-button}}
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      `,
      errors: [
        { message: '`data-test-form` must appear after `aria-labelledby`' },
        { message: '`@title` must appear after `@instructions`' },
        { message: '`Textarea` must appear after `Number`' },
        { message: '`type` must appear after `data-test-button`' },
      ],
    },
    {
      code: `
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>
      `,
      output: `
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          ...attributes
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          ...attributes
          {{on "load" this.doSomething2}}
        ></iframe>
      `,
      errors: [
        { message: '`...attributes` must appear after `modifiers`' },
        { message: '`...attributes` must appear after modifiers' },
      ],
    },
    {
      code: `
        <Ui::Page
          @title={{"Your product"}}
          {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          @routeName={{this.router.currentRouteName}}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @id="products.overview" @icon="rightarrow" @label="" />
          {{else if this.someCondition2}}
            <Page.Button @id="products.product" @icon="" @label="" />
          {{else}}
            <Page.Button
              @id="products.product"
              @icon=""
              @label="
              "
            />
          {{/if}}
        </Ui::Page>
      `,
      output: `
        <Ui::Page
          @routeName={{this.router.currentRouteName}}
          {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          @title={{"Your product"}}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @icon="rightarrow" @id="products.overview" @label="" />
          {{else if this.someCondition2}}
            <Page.Button @icon="" @id="products.product" @label="" />
          {{else}}
            <Page.Button
              @icon=""
              @id="products.product"
              @label="
              "
            />
          {{/if}}
        </Ui::Page>
      `,
      errors: [
        { message: '`@title` must appear after `@routeName`' },
        { message: '`@id` must appear after `@icon`' },
        { message: '`@id` must appear after `@icon`' },
        { message: '`@id` must appear after `@icon`' },
      ],
    },
    {
      code: `
        <MyComponent
          @parentContainerId={{concat "#" @parentId}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style={{concat "." @type "1"}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          type="tel"
          local-class="input {{concat 'flag-' @country}}"
        />

        <MyComponent
          @parentContainerId="#{{@parentId}}"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style=".{{@type}}1"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          aria-describedby="1"
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
        />

        <input
          type="tel"
          local-class="input flag-{{@country}}"
        />
      `,
      output: `
        <MyComponent
          @isOpen={{this.isOpen}}
          @parentContainerId={{concat "#" @parentId}}
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @style={{concat "." @type "1"}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          local-class="input {{concat 'flag-' @country}}"
          type="tel"
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @parentContainerId="#{{@parentId}}"
        />

        <MyComponent
          @isOpen={{this.isOpen}}
          @style=".{{@type}}1"
        />

        <MyComponent
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
          aria-describedby="1"
        />

        <input
          local-class="input flag-{{@country}}"
          type="tel"
        />
      `,
      errors: [
        { message: '`@parentContainerId` must appear after `@isOpen`' },
        { message: '`@style` must appear after `@isOpen`' },
        { message: '`type` must appear after `local-class`' },
        { message: '`@parentContainerId` must appear after `@isOpen`' },
        { message: '`@style` must appear after `@isOpen`' },
        { message: '`aria-describedby` must appear after `@className`' },
        { message: '`type` must appear after `local-class`' },
      ],
    },
  ],
});
