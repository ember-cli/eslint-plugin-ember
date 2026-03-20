// Common valid BCP 47 language tags (not exhaustive, but covers the most common)
const COMMON_LANG_CODES = new Set([
  'aa',
  'ab',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu',
]);

const DEFAULT_CONFIG = {
  validateValues: true,
};

function isValidLangTag(value) {
  if (!value || !value.trim()) {
    return false;
  }
  const parts = value.trim().toLowerCase().split('-');

  return COMMON_LANG_CODES.has(parts[0]);
}

function parseConfig(config) {
  if (config === true || config === undefined) {
    return DEFAULT_CONFIG;
  }

  if (config && typeof config === 'object') {
    return {
      validateValues:
        'validateValues' in config ? config.validateValues : DEFAULT_CONFIG.validateValues,
    };
  }

  return DEFAULT_CONFIG;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require lang attribute on html element',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-lang-attribute.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        anyOf: [
          { type: 'boolean', enum: [true] },
          {
            type: 'object',
            properties: {
              validateValues: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      invalid: 'The `<html>` element must have the `lang` attribute with a valid value',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-lang-attribute.js',
      docs: 'docs/rule/require-lang-attribute.md',
      tests: 'test/unit/rules/require-lang-attribute-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'html') {
          return;
        }

        const langAttr = node.attributes?.find((a) => a.name === 'lang');
        if (!langAttr) {
          context.report({ node, messageId: 'invalid' });
          return;
        }

        if (!langAttr.value) {
          context.report({ node, messageId: 'invalid' });
          return;
        }

        if (langAttr.value.type === 'GlimmerTextNode') {
          const value = langAttr.value.chars;

          if (!value || !value.trim()) {
            context.report({ node, messageId: 'invalid' });
          } else if (config.validateValues && !isValidLangTag(value)) {
            context.report({ node, messageId: 'invalid' });
          }
        }
      },
    };
  },
};
