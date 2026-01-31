/* eslint-disable unicorn/consistent-function-scoping, unicorn/prefer-at */
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require sorted attributes and modifiers',
      category: 'Best Practices',
      recommended: false,
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-sort-invocations.md',
    },
    fixable: null,
    schema: [],
    messages: {
      attributeOrder: '`{{attributeName}}` must appear after `{{expectedAfter}}`',
      modifierOrder: '`{{{{modifierName}}}}` must appear after `{{{{expectedAfter}}}}`',
      hashPairOrder: '`{{hashPairName}}` must appear after `{{expectedAfter}}`',
      splattributesOrder: '`...attributes` must appear after modifiers',
    },
  },

  create(context) {
    function getAttributeName(node) {
      return node.name;
    }

    function getAttributePosition(node) {
      const name = getAttributeName(node);

      if (name.startsWith('@')) {
        return 1; // Arguments first
      }

      if (name === '...attributes') {
        return 3; // Splattributes last
      }

      return 2; // Regular attributes in the middle
    }

    function getHashPairName(node) {
      return node.key;
    }

    function getModifierName(node) {
      if (node.path.type !== 'GlimmerPathExpression') {
        return '';
      }

      return node.path.original;
    }

    function compareAttributes(a, b) {
      const positionA = getAttributePosition(a);
      const positionB = getAttributePosition(b);

      if (positionA !== positionB) {
        return positionA - positionB;
      }

      const nameA = getAttributeName(a);
      const nameB = getAttributeName(b);

      return nameA.localeCompare(nameB);
    }

    function compareHashPairs(a, b) {
      const nameA = getHashPairName(a);
      const nameB = getHashPairName(b);

      return nameA.localeCompare(nameB);
    }

    function compareModifiers(a, b) {
      const nameA = getModifierName(a);
      const nameB = getModifierName(b);

      if (nameA !== nameB) {
        return nameA.localeCompare(nameB);
      }

      // For 'on' modifiers, sort by event name
      if (nameA === 'on' && a.params && b.params && a.params.length > 0 && b.params.length > 0) {
        const eventA = a.params[0];
        const eventB = b.params[0];

        if (eventA.type === 'GlimmerStringLiteral' && eventB.type === 'GlimmerStringLiteral') {
          return eventA.value.localeCompare(eventB.value);
        }
      }

      return 0;
    }

    function getUnsortedAttributeIndex(attributes) {
      return attributes.findIndex((attribute, index) => {
        if (index === attributes.length - 1) {
          return false;
        }

        return compareAttributes(attribute, attributes[index + 1]) > 0;
      });
    }

    function getUnsortedHashPairIndex(pairs) {
      return pairs.findIndex((hashPair, index) => {
        if (index === pairs.length - 1) {
          return false;
        }

        return compareHashPairs(hashPair, pairs[index + 1]) > 0;
      });
    }

    function getUnsortedModifierIndex(modifiers) {
      return modifiers.findIndex((modifier, index) => {
        if (index === modifiers.length - 1) {
          return false;
        }

        return compareModifiers(modifier, modifiers[index + 1]) > 0;
      });
    }

    function canSkipSplattributesLast(node) {
      const { attributes, modifiers } = node;

      if (!attributes || attributes.length === 0 || !modifiers || modifiers.length === 0) {
        return true;
      }

      const splattributes = attributes.at(-1);
      const lastModifier = modifiers.at(-1);

      if (!splattributes || splattributes.name !== '...attributes' || !lastModifier) {
        return true;
      }

      // Check that ...attributes appears after the last modifier
      const splattributesPosition = splattributes.loc.start;
      const lastModifierPosition = lastModifier.loc.start;

      if (splattributesPosition.line > lastModifierPosition.line) {
        return true;
      }

      return (
        splattributesPosition.line === lastModifierPosition.line &&
        splattributesPosition.column > lastModifierPosition.column
      );
    }

    return {
      GlimmerElementNode(node) {
        const { attributes, modifiers } = node;

        if (attributes && attributes.length > 1) {
          const index = getUnsortedAttributeIndex(attributes);

          if (index !== -1) {
            context.report({
              node: attributes[index],
              messageId: 'attributeOrder',
              data: {
                attributeName: getAttributeName(attributes[index]),
                expectedAfter: getAttributeName(attributes[index + 1]),
              },
            });
          }
        }

        if (modifiers && modifiers.length > 1) {
          const index = getUnsortedModifierIndex(modifiers);

          if (index !== -1) {
            context.report({
              node: modifiers[index],
              messageId: 'modifierOrder',
              data: {
                modifierName: getModifierName(modifiers[index]),
                expectedAfter: getModifierName(modifiers[index + 1]),
              },
            });
          }
        }

        if (!canSkipSplattributesLast(node)) {
          const splattributes = attributes.at(-1);
          context.report({
            node: splattributes,
            messageId: 'splattributesOrder',
          });
        }
      },

      GlimmerBlockStatement(node) {
        if (node.hash && node.hash.pairs && node.hash.pairs.length > 1) {
          const index = getUnsortedHashPairIndex(node.hash.pairs);

          if (index !== -1) {
            context.report({
              node: node.hash.pairs[index],
              messageId: 'hashPairOrder',
              data: {
                hashPairName: getHashPairName(node.hash.pairs[index]),
                expectedAfter: getHashPairName(node.hash.pairs[index + 1]),
              },
            });
          }
        }
      },

      GlimmerMustacheStatement(node) {
        if (node.hash && node.hash.pairs && node.hash.pairs.length > 1) {
          const index = getUnsortedHashPairIndex(node.hash.pairs);

          if (index !== -1) {
            context.report({
              node: node.hash.pairs[index],
              messageId: 'hashPairOrder',
              data: {
                hashPairName: getHashPairName(node.hash.pairs[index]),
                expectedAfter: getHashPairName(node.hash.pairs[index + 1]),
              },
            });
          }
        }
      },

      GlimmerSubExpression(node) {
        if (node.hash && node.hash.pairs && node.hash.pairs.length > 1) {
          const index = getUnsortedHashPairIndex(node.hash.pairs);

          if (index !== -1) {
            context.report({
              node: node.hash.pairs[index],
              messageId: 'hashPairOrder',
              data: {
                hashPairName: getHashPairName(node.hash.pairs[index]),
                expectedAfter: getHashPairName(node.hash.pairs[index + 1]),
              },
            });
          }
        }
      },
    };
  },
};
/* eslint-enable unicorn/consistent-function-scoping, unicorn/prefer-at */
