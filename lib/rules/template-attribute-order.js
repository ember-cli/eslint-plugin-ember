/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce consistent ordering of attributes in template elements',
      category: 'Stylistic Issues',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-attribute-order.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      wrongOrder: 'Attribute "{{currentAttr}}" should come {{position}} "{{expectedAttr}}".',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/attribute-order.js',
      docs: 'docs/rule/attribute-order.md',
      tests: 'test/unit/rules/attribute-order-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    const options = context.options[0] || {};
    const order = options.order || [
      'class',
      'id',
      'role',
      'aria-',
      'data-test-',
      'type',
      'name',
      'value',
      'placeholder',
      'disabled',
    ];

    function getAttributeCategory(attrName) {
      for (const category of order) {
        if (category.endsWith('-')) {
          if (attrName.startsWith(category)) {
            return category;
          }
        } else if (attrName === category) {
          return category;
        }
      }
      return null;
    }

    function getExpectedIndex(attrName) {
      const category = getAttributeCategory(attrName);
      if (category === null) {
        return order.length; // Unknown attributes go last
      }
      return order.indexOf(category);
    }

    return {
      GlimmerElementNode(node) {
        if (!node.attributes || node.attributes.length < 2) {
          return;
        }

        const attributes = node.attributes.filter(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name
        );

        // Attributes before `...attributes` can be overridden by it and attributes after it can't,
        // so leave `...attributes` in place and only order the attributes on each side of it.
        let groupStart = 0;

        for (let i = 0; i < attributes.length; i++) {
          const current = attributes[i];
          if (current.name === '...attributes') {
            groupStart = i + 1;
            continue;
          }
          const currentIndex = getExpectedIndex(current.name);

          for (let j = groupStart; j < i; j++) {
            const previous = attributes[j];
            const previousIndex = getExpectedIndex(previous.name);

            if (currentIndex < previousIndex) {
              context.report({
                node: current,
                messageId: 'wrongOrder',
                data: {
                  currentAttr: current.name,
                  position: 'before',
                  expectedAttr: previous.name,
                },
                fix(fixer) {
                  // The range of a valueless attribute (e.g. `disabled`) includes the whitespace
                  // after it, so swap the attributes without it.
                  const currentText = sourceCode.getText(current).trimEnd();
                  const previousText = sourceCode.getText(previous).trimEnd();
                  return [
                    fixer.replaceTextRange(
                      [previous.range[0], previous.range[0] + previousText.length],
                      currentText
                    ),
                    fixer.replaceTextRange(
                      [current.range[0], current.range[0] + currentText.length],
                      previousText
                    ),
                  ];
                },
              });
              break;
            }
          }
        }
      },
    };
  },
};
