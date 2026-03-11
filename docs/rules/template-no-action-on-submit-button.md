# ember/template-no-action-on-submit-button

<!-- end auto-generated rule header -->

Disallow click action on submit buttons within a form.

In a `<form>`, all `<button>` elements with a `type="submit"` attribute (or no `type`, since buttons default to `type="submit"`) should not have any click action. The action should be on the `<form>` element instead of directly on the button.

## Rule Details

This rule disallows:

- Using `{{action}}` or `{{on "click"}}` modifiers on submit buttons inside a `<form>`.
- Using the HTML `action` attribute on submit buttons or `<input type="submit">` elements.

## Examples

### Incorrect

```hbs
<form>
  <button type='submit' {{on 'click' this.handleClick}} />
  <button type='submit' {{action 'handleClick'}} />
  <button {{on 'click' this.handleClick}} />
  <button {{action 'handleClick'}} />
</form>
```

### Correct

```hbs
<form>
  <button type='button' {{on 'click' this.handleClick}} />
  <button type='button' {{action 'handleClick'}} />
  <button type='submit' />
  <button />
</form>
```

Buttons outside a `<form>` are allowed to have click actions:

```hbs
<button type='submit' {{on 'click' this.handleClick}} />
<button type='submit' {{action 'handleClick'}} />
<button {{on 'click' this.handleClick}} />
<button {{action 'handleClick'}} />
```

## Related Rules

- [template-no-action-modifiers](./template-no-action-modifiers.md)

## References

- [eslint-plugin-ember template-no-invalid-interactive](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-invalid-interactive.md)
