const ALLOWED_TABLE_CHILDREN = ['caption', 'colgroup', 'thead', 'tbody', 'tfoot'];
const CONTROL_FLOW_START_MARK = 0;
const CONTROL_FLOW_END_MARK = 1;

function dasherize(str) {
  return str
    .replaceAll('::', '/')
    .replaceAll(/([\da-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function isControlFlowHelper(node) {
  if (node.type !== 'GlimmerBlockStatement' && node.type !== 'GlimmerMustacheStatement') {
    return false;
  }
  const name = node.path?.original;
  return ['if', 'unless', 'each', 'each-in', 'let', 'with'].includes(name);
}

function isIfOrUnless(node) {
  const name = node.path?.original;
  return name === 'if' || name === 'unless';
}

function getEffectiveChildren(children) {
  return (children || []).flatMap((child) => {
    if (isControlFlowHelper(child)) {
      if (isIfOrUnless(child) && child.program && child.inverse) {
        return [
          CONTROL_FLOW_START_MARK,
          ...getEffectiveChildren(child.program?.body || child.children || []),
          CONTROL_FLOW_END_MARK,
          CONTROL_FLOW_START_MARK,
          ...getEffectiveChildren(child.inverse?.body || []),
          CONTROL_FLOW_END_MARK,
        ];
      }
      const body = child.program?.body || child.children || child.body?.body || [];
      return getEffectiveChildren(body);
    }
    return [child];
  });
}

function isAllowedTableChild(child, internalTags) {
  switch (child.type) {
    case 'GlimmerElementNode': {
      const idx = ALLOWED_TABLE_CHILDREN.indexOf(child.tag);
      if (idx > -1) {
        return { allowed: true, indices: [idx] };
      }
      // Check @tagName attribute
      const tagNameAttr = child.attributes?.find((a) => a.name === '@tagName');
      if (tagNameAttr) {
        const val = tagNameAttr.value?.type === 'GlimmerTextNode' ? tagNameAttr.value.chars : null;
        const tIdx = ALLOWED_TABLE_CHILDREN.indexOf(val);
        return { allowed: tIdx > -1, indices: tIdx > -1 ? [tIdx] : [] };
      }
      // Check custom component mapping
      const dasherized = dasherize(child.tag);
      const possibleIndices = internalTags.get(dasherized) || [];
      if (possibleIndices.length > 0) {
        return { allowed: true, indices: possibleIndices };
      }
      return { allowed: false };
    }
    case 'GlimmerBlockStatement':
    case 'GlimmerMustacheStatement': {
      // Check tagName hash pair
      const tagNamePair = child.hash?.pairs?.find((p) => p.key === 'tagName');
      if (tagNamePair) {
        const val = tagNamePair.value?.value || tagNamePair.value?.chars;
        const idx = ALLOWED_TABLE_CHILDREN.indexOf(val);
        return { allowed: idx > -1, indices: idx > -1 ? [idx] : [] };
      }
      if (child.path?.original === 'yield') {
        return { allowed: true, indices: [] };
      }
      const possibleIndices = internalTags.get(child.path?.original) || [];
      if (possibleIndices.length > 0) {
        return { allowed: true, indices: possibleIndices };
      }
      return { allowed: false };
    }
    case 'GlimmerCommentStatement':
    case 'GlimmerMustacheCommentStatement': {
      return { allowed: true, indices: [] };
    }
    case 'GlimmerTextNode': {
      return { allowed: !/\S/.test(child.chars || ''), indices: [] };
    }
    default: {
      return { allowed: false };
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require table elements to use table grouping elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-table-groups.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          'allowed-table-components': { type: 'array', items: { type: 'string' } },
          'allowed-caption-components': { type: 'array', items: { type: 'string' } },
          'allowed-colgroup-components': { type: 'array', items: { type: 'string' } },
          'allowed-thead-components': { type: 'array', items: { type: 'string' } },
          'allowed-tbody-components': { type: 'array', items: { type: 'string' } },
          'allowed-tfoot-components': { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing: 'Tables must have a table group (thead, tbody or tfoot).',
      ordering:
        'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const outerTags = new Set(options['allowed-table-components'] || []);
    const internalTags = new Map();

    const componentKeys = [
      'allowed-caption-components',
      'allowed-colgroup-components',
      'allowed-thead-components',
      'allowed-tbody-components',
      'allowed-tfoot-components',
    ];

    for (const [index, key] of componentKeys.entries()) {
      if (options[key]) {
        for (const comp of options[key]) {
          if (!internalTags.has(comp)) {
            internalTags.set(comp, []);
          }
          internalTags.get(comp).push(index);
        }
      }
    }

    function isTableElement(node) {
      if (node.tag === 'table') {
        return true;
      }
      if (outerTags.has(dasherize(node.tag))) {
        return true;
      }
      const tagNameAttr = node.attributes?.find((a) => a.name === '@tagName');
      if (tagNameAttr) {
        const val = tagNameAttr.value?.type === 'GlimmerTextNode' ? tagNameAttr.value.chars : null;
        return val === 'table';
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        if (!isTableElement(node)) {
          return;
        }

        const children = getEffectiveChildren(node.children);
        let currentAllowedMinimumIndices = new Set([0]);
        const scopedIndices = [];

        for (const child of children) {
          if (child === CONTROL_FLOW_START_MARK) {
            scopedIndices.push(currentAllowedMinimumIndices);
            currentAllowedMinimumIndices = new Set(scopedIndices.flat());
            continue;
          }
          if (child === CONTROL_FLOW_END_MARK) {
            currentAllowedMinimumIndices = scopedIndices.pop();
            continue;
          }

          const { allowed, indices } = isAllowedTableChild(child, internalTags);
          if (!allowed) {
            context.report({ node, messageId: 'missing' });
            return;
          }

          if (indices.length > 0) {
            const newAllowedMinimumIndices = new Set(
              [...currentAllowedMinimumIndices].flatMap((currentIndex) =>
                indices.filter((newIndex) => newIndex >= currentIndex)
              )
            );
            if (newAllowedMinimumIndices.size === 0) {
              context.report({ node, messageId: 'ordering' });
              return;
            }
            currentAllowedMinimumIndices = newAllowedMinimumIndices;
          }
        }
      },
    };
  },
};
