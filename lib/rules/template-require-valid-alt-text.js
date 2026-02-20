const REDUNDANT_WORDS = ['image', 'photo', 'picture', 'logo', 'spacer'];

function findAttr(node, name) {
  return node.attributes?.find((a) => a.name === name);
}

function hasAttr(node, name) {
  return node.attributes?.some((a) => a.name === name);
}

function hasAnyAttr(node, names) {
  return names.some((name) => hasAttr(node, name));
}

function getTextValue(attr) {
  if (!attr?.value) {
    return undefined;
  }
  if (attr.value.type === 'GlimmerTextNode') {
    return attr.value.chars;
  }
  return undefined;
}

function getNormalizedAltText(altAttr) {
  if (!altAttr?.value) {
    return null;
  }
  if (altAttr.value.type === 'GlimmerTextNode') {
    return altAttr.value.chars.trim().toLowerCase();
  }
  if (altAttr.value.type === 'GlimmerConcatStatement') {
    const parts = (altAttr.value.parts || [])
      .filter((p) => p.type === 'GlimmerTextNode')
      .map((p) => p.chars)
      .join(' ')
      .trim()
      .toLowerCase();
    return parts === '' ? null : parts;
  }
  return null;
}

function hasChildren(node) {
  return (
    node.children &&
    node.children.some((child) => {
      if (child.type === 'GlimmerTextNode') {
        return child.chars.trim().length > 0;
      }
      return true;
    })
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require valid alt text for images and other elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-valid-alt-text.md',
    },
    schema: [],
    messages: {
      imgMissing: 'All `<img>` tags must have an alt attribute.',
      imgRedundant:
        'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.',
      imgAltEqualsSrc: 'The alt text must not be the same as the image source.',
      imgNumericAlt: 'A number is not valid alt text.',
      imgRolePresentation:
        'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`.',
      inputImage:
        'All <input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
      objectMissing:
        'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.',
      areaMissing:
        'Each area of an image map must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
    },
  },
  create(context) {
    return {
      // eslint-disable-next-line complexity
      GlimmerElementNode(node) {
        // Skip hidden elements
        if (hasAttr(node, 'hidden')) {
          return;
        }

        const ariaHidden = findAttr(node, 'aria-hidden');
        if (ariaHidden) {
          const val = getTextValue(ariaHidden);
          if (val === 'true') {
            return;
          }
        }

        // Skip elements with ...attributes (splattributes)
        if (hasAttr(node, '...attributes')) {
          return;
        }

        const tag = node.tag;

        switch (tag) {
          case 'img': {
            const altAttr = findAttr(node, 'alt');
            const roleAttr = findAttr(node, 'role');
            const srcAttr = findAttr(node, 'src');

            // Check role=none/presentation with non-empty alt
            if (altAttr && roleAttr) {
              const roleValue = getTextValue(roleAttr);
              const altValue = getTextValue(altAttr);
              if (
                roleValue &&
                ['none', 'presentation'].includes(roleValue.trim().toLowerCase()) &&
                altValue !== ''
              ) {
                context.report({ node, messageId: 'imgRolePresentation' });
              }
            }

            if (!altAttr) {
              context.report({ node, messageId: 'imgMissing' });
              return;
            }

            // Check alt === src
            const altValue = getTextValue(altAttr);
            const srcValue = getTextValue(srcAttr);
            if (altValue !== undefined && srcValue !== undefined && altValue === srcValue) {
              context.report({ node, messageId: 'imgAltEqualsSrc' });
              return;
            }

            // Check numeric-only alt and redundant words
            const normalizedAlt = getNormalizedAltText(altAttr);
            if (normalizedAlt !== null) {
              if (/^\d+$/.test(normalizedAlt)) {
                context.report({ node, messageId: 'imgNumericAlt' });
              } else {
                const words = normalizedAlt.split(' ');
                const hasRedundant = REDUNDANT_WORDS.some((w) => words.includes(w));
                if (hasRedundant) {
                  context.report({ node: altAttr, messageId: 'imgRedundant' });
                }
              }
            }

            break;
          }
          case 'input': {
            // Only check input type="image"
            const typeAttr = findAttr(node, 'type');
            const typeVal = getTextValue(typeAttr);
            if (typeVal !== 'image') {
              return;
            }

            if (!hasAnyAttr(node, ['aria-label', 'aria-labelledby', 'alt'])) {
              context.report({ node, messageId: 'inputImage' });
            }

            break;
          }
          case 'object': {
            const roleAttr = findAttr(node, 'role');
            const roleValue = getTextValue(roleAttr);

            if (
              hasAnyAttr(node, ['aria-label', 'aria-labelledby', 'title']) ||
              hasChildren(node) ||
              (roleValue && ['presentation', 'none'].includes(roleValue))
            ) {
              return;
            }

            context.report({ node, messageId: 'objectMissing' });

            break;
          }
          case 'area': {
            if (!hasAnyAttr(node, ['aria-label', 'aria-labelledby', 'alt'])) {
              context.report({ node, messageId: 'areaMissing' });
            }

            break;
          }
          // No default
        }
      },
    };
  },
};
