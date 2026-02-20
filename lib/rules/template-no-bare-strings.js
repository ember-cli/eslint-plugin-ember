const DEFAULT_GLOBAL_ATTRIBUTES = [
  'title',
  'aria-label',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
];

const DEFAULT_ELEMENT_ATTRIBUTES = {
  input: ['placeholder'],
  img: ['alt'],
};

const BUILTIN_COMPONENT_ATTRIBUTES = {
  Input: ['placeholder', '@placeholder'],
  Textarea: ['placeholder', '@placeholder'],
};

const DEFAULT_ALLOWLIST = [
  '&lpar;',
  '&rpar;',
  '&comma;',
  '&period;',
  '&amp;',
  '&AMP;',
  '&plus;',
  '&minus;',
  '&equals;',
  '&times;',
  '&ast;',
  '&midast;',
  '&sol;',
  '&num;',
  '&percnt;',
  '&excl;',
  '&quest;',
  '&colon;',
  '&lsqb;',
  '&lbrack;',
  '&rsqb;',
  '&rbrack;',
  '&lcub;',
  '&lbrace;',
  '&rcub;',
  '&rbrace;',
  '&lt;',
  '&LT;',
  '&gt;',
  '&GT;',
  '&bull;',
  '&bullet;',
  '&mdash;',
  '&ndash;',
  '&nbsp;',
  '&Tab;',
  '&NewLine;',
  '&verbar;',
  '&vert;',
  '&VerticalLine;',
  '(',
  ')',
  ',',
  '.',
  '&',
  '+',
  '-',
  '=',
  '*',
  '/',
  '#',
  '%',
  '!',
  '?',
  ':',
  '[',
  ']',
  '{',
  '}',
  '<',
  '>',
  '•',
  '—',
  ' ',
  '|',
];

const IGNORED_ELEMENTS = ['pre', 'script', 'style', 'textarea'];

function sanitizeConfigArray(arr = []) {
  return arr.filter((o) => o !== '').sort((a, b) => b.length - a.length);
}

function mergeObjects(obj1 = {}, obj2 = {}) {
  const result = {};
  for (const [key, value] of Object.entries(obj1)) {
    result[key] = [...(result[key] || []), ...value];
  }
  for (const [key, value] of Object.entries(obj2)) {
    result[key] = [...(result[key] || []), ...value];
  }
  return result;
}

function isPageTitleHelper(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'page-title';
}

function isIfHelper(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'if';
}

function isUnlessHelper(node) {
  return node.path?.type === 'GlimmerPathExpression' && node.path.original === 'unless';
}

function isStringOnlyConcatHelper(node) {
  return (
    node.path?.type === 'GlimmerPathExpression' &&
    node.path.original === 'concat' &&
    (node.params || []).every((p) => p.type === 'GlimmerStringLiteral')
  );
}

function isInAttrNode(node) {
  let p = node.parent;
  while (p) {
    if (p.type === 'GlimmerAttrNode') {
      return p;
    }
    p = p.parent;
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow bare strings in templates (require translation/localization)',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-bare-strings.md',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          {
            type: 'object',
            properties: {
              allowlist: { type: 'array', items: { type: 'string' } },
              globalAttributes: { type: 'array', items: { type: 'string' } },
              elementAttributes: { type: 'object' },
              ignoredElements: { type: 'array', items: { type: 'string' } },
            },
            additionalProperties: false,
          },
          {
            type: 'array',
            items: { type: 'string' },
          },
        ],
      },
    ],
    messages: {
      bareString: 'Non-translated string used{{additionalDescription}}',
    },
  },

  create(context) {
    const rawConfig = context.options[0];
    let config;

    if (Array.isArray(rawConfig)) {
      config = {
        allowlist: sanitizeConfigArray([...rawConfig, ...DEFAULT_ALLOWLIST]),
        globalAttributes: [...DEFAULT_GLOBAL_ATTRIBUTES],
        elementAttributes: mergeObjects(DEFAULT_ELEMENT_ATTRIBUTES, BUILTIN_COMPONENT_ATTRIBUTES),
        ignoredElements: [...IGNORED_ELEMENTS],
      };
    } else if (rawConfig && typeof rawConfig === 'object') {
      config = {
        allowlist: sanitizeConfigArray([...(rawConfig.allowlist || []), ...DEFAULT_ALLOWLIST]),
        globalAttributes: [...(rawConfig.globalAttributes || []), ...DEFAULT_GLOBAL_ATTRIBUTES],
        elementAttributes: mergeObjects(
          rawConfig.elementAttributes,
          mergeObjects(DEFAULT_ELEMENT_ATTRIBUTES, BUILTIN_COMPONENT_ATTRIBUTES)
        ),
        ignoredElements: [
          ...sanitizeConfigArray(rawConfig.ignoredElements || []),
          ...IGNORED_ELEMENTS,
        ],
      };
    } else {
      config = {
        allowlist: [...DEFAULT_ALLOWLIST],
        globalAttributes: [...DEFAULT_GLOBAL_ATTRIBUTES],
        elementAttributes: mergeObjects(DEFAULT_ELEMENT_ATTRIBUTES, BUILTIN_COMPONENT_ATTRIBUTES),
        ignoredElements: [...IGNORED_ELEMENTS],
      };
    }

    const elementStack = [];

    function isWithinIgnoredElement() {
      return elementStack.some((tag) => config.ignoredElements.includes(tag));
    }

    function getBareString(str) {
      let s = str;
      for (const entry of config.allowlist) {
        while (s.includes(entry)) {
          s = s.replace(entry, '');
        }
      }
      return s.trim() === '' ? null : str;
    }

    function checkAndLog(node, additionalDescription) {
      if (isWithinIgnoredElement()) {
        return;
      }

      switch (node.type) {
        case 'GlimmerTextNode': {
          const bareString = getBareString(node.chars);
          if (bareString) {
            context.report({
              node,
              messageId: 'bareString',
              data: { additionalDescription },
            });
          }
          break;
        }
        case 'GlimmerConcatStatement': {
          for (const part of node.parts || []) {
            checkAndLog(part, additionalDescription);
          }
          break;
        }
        case 'GlimmerStringLiteral': {
          const bareString = getBareString(node.value || '');
          if (bareString) {
            context.report({
              node,
              messageId: 'bareString',
              data: { additionalDescription },
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    let currentElementNode = null;

    return {
      GlimmerElementNode(node) {
        currentElementNode = node;
        elementStack.push(node.tag);
      },
      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },

      GlimmerTextNode(node) {
        if (!node.loc) {
          return;
        }

        const attrParent = isInAttrNode(node);
        if (attrParent) {
          // Check if this attribute should be checked
          const attrName = attrParent.name;
          const tag = currentElementNode?.tag;
          const isGlobal = config.globalAttributes.includes(attrName);
          const isElement =
            tag &&
            config.elementAttributes[tag] &&
            config.elementAttributes[tag].includes(attrName);

          if (isGlobal || isElement) {
            const desc = ` in \`${attrName}\` ${attrName.startsWith('@') ? 'argument' : 'attribute'}`;
            checkAndLog(node, desc);
          }
        } else {
          checkAndLog(node, '');
        }
      },

      GlimmerMustacheStatement(node) {
        const inAttr = isInAttrNode(node);

        // Check the path itself (StringLiteral path)
        if (!inAttr && node.path) {
          checkAndLog(node.path, '');
        }

        if (isPageTitleHelper(node)) {
          for (const param of node.params || []) {
            checkAndLog(param, '');
          }
        } else if (isIfHelper(node) && !inAttr) {
          const [, maybeTrue, maybeFalse] = node.params || [];
          if (maybeTrue) {
            checkAndLog(maybeTrue, '');
          }
          if (maybeFalse) {
            checkAndLog(maybeFalse, '');
          }
        } else if (isUnlessHelper(node) && !inAttr) {
          const [, maybeFalse, maybeTrue] = node.params || [];
          if (maybeTrue) {
            checkAndLog(maybeTrue, '');
          }
          if (maybeFalse) {
            checkAndLog(maybeFalse, '');
          }
        } else if (isStringOnlyConcatHelper(node) && !inAttr) {
          if (node.params?.[0]) {
            checkAndLog(node.params[0], '');
          }
        }
      },
    };
  },
};
