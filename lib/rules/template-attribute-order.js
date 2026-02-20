const TokenType = {
  ARGUMENTS: 'arguments',
  ATTRIBUTES: 'attributes',
  MODIFIERS: 'modifiers',
  SPLATTRIBUTES: 'splattributes',
  COMMENTS: 'comments',
};

const DEFAULT_ORDER = [TokenType.ARGUMENTS, TokenType.ATTRIBUTES, TokenType.MODIFIERS];

function getTokenType(node) {
  if (node.type && node.type.includes('Comment')) {
    return TokenType.COMMENTS;
  }
  if (!node.name) {
    return TokenType.MODIFIERS;
  }
  if (node.name.startsWith('@')) {
    return TokenType.ARGUMENTS;
  }
  if (node.name.startsWith('...')) {
    return TokenType.SPLATTRIBUTES;
  }
  return TokenType.ATTRIBUTES;
}

function getNodePosition(node) {
  if (node.loc) {
    return node.loc.start.line * 10_000 + node.loc.start.column;
  }
  return 0;
}

function groupTokens(node) {
  const groups = {
    [TokenType.ARGUMENTS]: [],
    [TokenType.ATTRIBUTES]: [],
    [TokenType.MODIFIERS]: [],
    [TokenType.SPLATTRIBUTES]: [],
    [TokenType.COMMENTS]: [],
  };

  if (node.attributes) {
    for (const attr of node.attributes) {
      groups[getTokenType(attr)].push(attr);
    }
  }
  if (node.modifiers) {
    for (const mod of node.modifiers) {
      groups[TokenType.MODIFIERS].push(mod);
    }
  }
  if (node.comments) {
    for (const comment of node.comments) {
      groups[TokenType.COMMENTS].push(comment);
    }
  }
  return groups;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce consistent ordering of attributes in template elements',
      category: 'Stylistic Issues',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-attribute-order.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              enum: [
                TokenType.ARGUMENTS,
                TokenType.ATTRIBUTES,
                TokenType.MODIFIERS,
                TokenType.SPLATTRIBUTES,
                TokenType.COMMENTS,
              ],
            },
          },
          alphabetize: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unordered: '{{tokenType}} {{source}} must go {{position}}.',
      notAlphabetized: '{{tokenType}} "{{source}}" is not alphabetized.',
      hashPairOrder: '`{{name}}` must appear after `{{expectedAfter}}`.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const order = options.order || DEFAULT_ORDER;
    const alphabetize = options.alphabetize === undefined ? true : options.alphabetize;
    const sourceCode = context.getSourceCode();

    function getAppliedOrder(tokenGroups) {
      const orderWithoutSplat = order.filter((t) => t !== TokenType.SPLATTRIBUTES);
      const hasSplat = tokenGroups[TokenType.SPLATTRIBUTES]?.length > 0;

      if (!hasSplat) {
        return orderWithoutSplat;
      }

      const splatNode = tokenGroups[TokenType.SPLATTRIBUTES][0];
      const splatPos = getNodePosition(splatNode);

      const allOtherPositions = [];
      for (const [type, nodes] of Object.entries(tokenGroups)) {
        if (type !== TokenType.SPLATTRIBUTES) {
          for (const n of nodes) {
            allOtherPositions.push(getNodePosition(n));
          }
        }
      }

      if (allOtherPositions.length === 0) {
        return [...orderWithoutSplat, TokenType.SPLATTRIBUTES];
      }

      const maxOther = Math.max(...allOtherPositions);
      if (splatPos >= maxOther) {
        return [...orderWithoutSplat, TokenType.SPLATTRIBUTES];
      }
      const minOther = Math.min(...allOtherPositions);
      if (splatPos <= minOther) {
        return [TokenType.SPLATTRIBUTES, ...orderWithoutSplat];
      }

      // Surrounded — don't reorder
      return [...orderWithoutSplat, TokenType.SPLATTRIBUTES];
    }

    function checkElementOrder(node) {
      const tokenGroups = groupTokens(node);
      const appliedOrder = getAppliedOrder(tokenGroups);

      const maxPosPerGroup = {};
      const minPosPerGroup = {};
      for (const tokenType of appliedOrder) {
        const items = tokenGroups[tokenType];
        if (!items || items.length === 0) {
          continue;
        }
        const positions = items.map(getNodePosition);
        maxPosPerGroup[tokenType] = Math.max(...positions);
        minPosPerGroup[tokenType] = Math.min(...positions);
      }

      const activeTypes = appliedOrder.filter((t) => tokenGroups[t] && tokenGroups[t].length > 0);

      // Check group ordering
      for (let i = 0; i < activeTypes.length; i++) {
        for (let j = i + 1; j < activeTypes.length; j++) {
          const currentType = activeTypes[i];
          const laterType = activeTypes[j];
          if (maxPosPerGroup[currentType] > minPosPerGroup[laterType]) {
            const offendingItem = tokenGroups[currentType].find(
              (item) => getNodePosition(item) > minPosPerGroup[laterType]
            );
            if (offendingItem) {
              const capType = currentType[0].toUpperCase() + currentType.slice(1);
              context.report({
                node: offendingItem,
                messageId: 'unordered',
                data: {
                  tokenType: capType,
                  source: sourceCode.getText(offendingItem).split('=')[0].split('\n')[0].trim(),
                  position: `before ${laterType}`,
                },
              });
              return;
            }
          }
        }
      }

      // Check alphabetization within groups
      if (alphabetize) {
        for (const tokenType of activeTypes) {
          if (tokenType === TokenType.SPLATTRIBUTES || tokenType === TokenType.COMMENTS) {
            continue;
          }
          const items = tokenGroups[tokenType];
          if (items.length < 2) {
            continue;
          }

          const names = items.map((item) => {
            const raw = sourceCode.getText(item).split('=')[0].split('\n')[0];
            const match = raw.match(/([^A-Za-z]*)([\w-]*)/);
            return match ? match[2] : raw;
          });

          for (let k = 1; k < names.length; k++) {
            if (names[k].localeCompare(names[k - 1]) < 0) {
              context.report({
                node: items[k],
                messageId: 'notAlphabetized',
                data: {
                  tokenType: tokenType[0].toUpperCase() + tokenType.slice(1),
                  source: names[k],
                },
              });
              break;
            }
          }
        }
      }
    }

    function checkHashPairOrder(pairs) {
      if (!pairs || pairs.length < 2) {
        return;
      }
      for (let i = 1; i < pairs.length; i++) {
        if (pairs[i].key.localeCompare(pairs[i - 1].key) < 0) {
          context.report({
            node: pairs[i],
            messageId: 'hashPairOrder',
            data: { name: pairs[i].key, expectedAfter: pairs[i - 1].key },
          });
          break;
        }
      }
    }

    return {
      GlimmerElementNode(node) {
        checkElementOrder(node);
      },

      GlimmerMustacheStatement(node) {
        if (alphabetize && node.hash && node.hash.pairs) {
          checkHashPairOrder(node.hash.pairs);
        }
      },

      GlimmerBlockStatement(node) {
        if (alphabetize && node.hash && node.hash.pairs) {
          checkHashPairOrder(node.hash.pairs);
        }
      },
    };
  },
};
