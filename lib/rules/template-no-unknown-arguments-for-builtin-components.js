function deprecateArgument(componentName, argumentName, replacementAttribute) {
  const msgs = [`Passing the "${argumentName}" argument to <${componentName} /> is deprecated.`];
  if (replacementAttribute) {
    msgs.push(
      `Instead, please pass the attribute directly, i.e. "<${componentName} ${replacementAttribute}={{...}} />" instead of "<${componentName} ${argumentName}={{...}} />".`
    );
  }
  return msgs.join('\n');
}

function deprecateEvent(componentName, argumentName, replacementAttribute) {
  const msgs = [`Passing the "${argumentName}" argument to <${componentName} /> is deprecated.`];
  if (replacementAttribute) {
    msgs.push(
      `Instead, please use the {{on}} modifier, i.e. "<${componentName} {{on "${replacementAttribute}" ...}} />" instead of "<${componentName} ${argumentName}={{...}} />".`
    );
  }
  return msgs.join('\n');
}

const KnownArguments = {
  LinkTo: {
    arguments: [
      'route',
      'model',
      'models',
      'query',
      'replace',
      'disabled',
      'current-when',
      'activeClass',
      'loadingClass',
      'disabledClass',
    ],
    deprecatedArguments: {
      '@active': '',
      '@loading': '',
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',
      '@tagName': '',
      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@rel': 'rel',
      '@tabindex': 'tabindex',
      '@target': 'target',
      '@title': 'title',
    },
    deprecatedEvents: {
      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@focusIn': 'focusin',
      '@focusOut': 'focusout',
      '@input': 'input',
      '@keyDown': 'keydown',
      '@keyPress': 'keypress',
      '@keyUp': 'keyup',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
    },
    conflicts: [['model', 'models']],
    required: [['route', 'query', 'model', 'models']],
  },
  Input: {
    arguments: ['type', 'value', 'checked', 'insert-newline', 'enter', 'escape-press'],
    deprecatedArguments: {
      '@bubbles': '',
      '@cancel': '',
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',
      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@accept': 'accept',
      '@autocapitalize': '',
      '@autocomplete': 'autocomplete',
      '@autocorrect': '',
      '@autofocus': 'autofocus',
      '@autosave': '',
      '@dir': 'dir',
      '@disabled': 'disabled',
      '@form': 'form',
      '@formaction': 'formaction',
      '@formenctype': 'formenctype',
      '@formmethod': 'formmethod',
      '@formnovalidate': 'formnovalidate',
      '@formtarget': 'formtarget',
      '@height': 'height',
      '@indeterminate': '',
      '@inputmode': '',
      '@lang': 'lang',
      '@list': 'list',
      '@max': 'max',
      '@maxlength': 'maxlength',
      '@min': 'min',
      '@minlength': 'minlength',
      '@multiple': 'multiple',
      '@name': 'name',
      '@pattern': 'pattern',
      '@placeholder': 'placeholder',
      '@readonly': 'readonly',
      '@required': 'required',
      '@selectionDirection': '',
      '@size': 'size',
      '@spellcheck': 'spellcheck',
      '@step': 'step',
      '@tabindex': 'tabindex',
      '@title': 'title',
      '@width': 'width',
    },
    conflicts: [['checked', 'value']],
    deprecatedEvents: {
      '@change': 'change',
      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@input': 'input',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
      '@focus-in': 'focusin',
      '@focus-out': 'focusout',
      '@key-down': 'keydown',
      '@key-press': 'keypress',
      '@key-up': 'keyup',
    },
  },
  Textarea: {
    arguments: ['value', 'insert-newline', 'enter', 'escape-press'],
    deprecatedArguments: {
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',
      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@autocapitalize': '',
      '@autocomplete': 'autocomplete',
      '@autocorrect': '',
      '@autofocus': 'autofocus',
      '@cols': 'cols',
      '@dir': 'dir',
      '@disabled': 'disabled',
      '@form': 'form',
      '@lang': 'lang',
      '@maxlength': 'maxlength',
      '@minlength': 'minlength',
      '@name': 'name',
      '@placeholder': 'placeholder',
      '@readonly': 'readonly',
      '@required': 'required',
      '@rows': 'rows',
      '@selectionDirection': '',
      '@selectionEnd': '',
      '@selectionStart': '',
      '@spellcheck': 'spellcheck',
      '@tabindex': 'tabindex',
      '@title': 'title',
      '@wrap': 'wrap',
    },
    deprecatedEvents: {
      '@bubbles': '',
      '@cancel': '',
      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@input': 'input',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
      '@focus-in': 'focusin',
      '@focus-out': 'focusout',
      '@key-down': 'keydown',
      '@key-press': 'keypress',
      '@key-up': 'keyup',
    },
  },
};

function removeAtSymbol(txt) {
  return txt.replace('@', '');
}

function fuzzyMatch(query, candidates) {
  // Simple fuzzy match without external dependency
  const q = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const c = candidate.toLowerCase();
    // Simple substring/prefix matching
    if (c === q) {
      return candidate;
    }
    if (c.startsWith(q) || q.startsWith(c)) {
      const score = Math.min(q.length, c.length) / Math.max(q.length, c.length);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    }
    // Levenshtein-like: count matching chars
    let matchCount = 0;
    let qi = 0;
    for (let ci = 0; ci < c.length && qi < q.length; ci++) {
      if (c[ci] === q[qi]) {
        matchCount++;
        qi++;
      }
    }
    const score = matchCount / Math.max(q.length, c.length);
    if (score > bestScore && score > 0.4) {
      bestScore = score;
      bestMatch = candidate;
    }
  }
  return bestMatch;
}

function getErrorMessage(tagName, argumentName) {
  const tagMeta = KnownArguments[tagName];
  const deprecatedArgs = tagMeta.deprecatedArguments || {};
  const deprecatedEvents = tagMeta.deprecatedEvents || {};
  const candidates = [
    ...new Set([
      ...tagMeta.arguments,
      ...Object.keys(deprecatedArgs).map(removeAtSymbol),
      ...Object.keys(deprecatedEvents).map(removeAtSymbol),
    ]),
  ];
  const pureQuery = removeAtSymbol(argumentName);
  const hasArgumentsMatch = candidates.includes(pureQuery);

  if (!hasArgumentsMatch) {
    const msg = `"${argumentName}" is not a known argument for the <${tagName} /> component.`;
    const suggestion = fuzzyMatch(pureQuery, candidates);
    if (suggestion) {
      return `${msg} Did you mean "@${suggestion}"?`;
    }
    return msg;
  }

  if (argumentName in deprecatedArgs) {
    return deprecateArgument(tagName, argumentName, deprecatedArgs[argumentName]);
  }

  if (argumentName in deprecatedEvents) {
    return deprecateEvent(tagName, argumentName, deprecatedEvents[argumentName]);
  }

  return `"${argumentName}" is unknown argument for <${tagName} /> component.`;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unknown arguments for built-in components',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unknown-arguments-for-builtin-components.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unknownArgument: '{{message}}',
      conflictArgument: '{{message}}',
      requiredArgument: '{{message}}',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.tag || !node.attributes) {
          return;
        }

        const nodeMeta = KnownArguments[node.tag];
        if (!nodeMeta) {
          return;
        }

        const seen = [];
        const warns = [];

        for (const attr of node.attributes) {
          if (attr.type !== 'GlimmerAttrNode' || !attr.name?.startsWith('@')) {
            continue;
          }

          const argName = removeAtSymbol(attr.name);
          if (nodeMeta.arguments.includes(argName)) {
            seen.push(argName);
          } else {
            warns.push(attr);
          }
        }

        // Report unknown/deprecated arguments
        for (const attr of warns) {
          context.report({
            node: attr,
            messageId: 'unknownArgument',
            data: { message: getErrorMessage(node.tag, attr.name) },
          });
        }

        // Check conflicts
        if (nodeMeta.conflicts) {
          for (const conflictList of nodeMeta.conflicts) {
            if (conflictList.every((item) => seen.includes(item))) {
              for (const argName of conflictList) {
                const attr = node.attributes.find(({ name }) => `@${argName}` === name);
                if (attr) {
                  const conflictsWith = conflictList
                    .filter((el) => `@${el}` !== attr.name)
                    .map((el) => `"@${el}"`)
                    .join(', ');
                  context.report({
                    node: attr,
                    messageId: 'conflictArgument',
                    data: {
                      message: `"${attr.name}" conflicts with ${conflictsWith}, only one should exist.`,
                    },
                  });
                }
              }
            }
          }
        }

        // Check required arguments
        if (nodeMeta.required) {
          for (const requiredItems of nodeMeta.required) {
            const variants = Array.isArray(requiredItems) ? requiredItems : [requiredItems];
            if (!variants.some((el) => seen.includes(el))) {
              const argNames = variants.map((el) => `"@${el}"`).join(' or ');
              context.report({
                node,
                messageId: 'requiredArgument',
                data: {
                  message: `Argument${variants.length > 1 ? 's' : ''} ${argNames} is required for <${node.tag} /> component.`,
                },
              });
            }
          }
        }
      },
    };
  },
};
