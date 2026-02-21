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
      output: null,
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
      output: null,
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
      output: null,
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
      output: null,
      errors: [
        {
          messageId: 'splattributesOrder',
        },
      ],
    },

    // Unsorted hash pairs
    {
      code: '<template>{{component type="submit" name="button"}}</template>',
      output: null,
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
      output: null,
      errors: [
        {
          messageId: 'hashPairOrder',
          data: { hashPairName: 'b', expectedAfter: 'a' },
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
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
      output: null,
      errors: [{ messageId: 'attributeOrder' }],
    },
  ],
});
