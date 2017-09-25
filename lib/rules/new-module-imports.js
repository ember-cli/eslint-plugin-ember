'use strict';

const GLOBALS = require('ember-rfc176-data/globals.json');

//------------------------------------------------------------------------------
// General rule - Use "New Module Imports" from Ember RFC #176
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: ' Use "New Module Imports" from Ember RFC #176',
      category: 'Best Practices',
      recommended: false
    },
  },

  create(context) {
    return {
      'MemberExpression > Identifier[name=Ember]': function (node) {
        // filter out "foo.Ember"
        if (node.parent.object !== node) return;

        // build an array of full expression names
        // e.g. [Ember.computed, Ember.computed.or]
        let fullName = 'Ember';
        const fullNames = [];
        let parentNode = node.parent;
        while (parentNode.type === 'MemberExpression') {
          fullName += `.${parentNode.property.name}`;
          fullNames.push(fullName);
          parentNode = parentNode.parent;
        }

        fullNames.reverse();

        // find a matching expression starting at the end
        for (let i = 0; i < fullNames.length; i++) {
          fullName = fullNames[i];

          const key = fullName.replace(/^Ember\./, '');
          const match = GLOBALS[key];
          if (match) {
            // build replacement import for the warning message
            let importSpecifier;
            if (match[1]) {
              importSpecifier = match[2] ? `{ ${match[1]} as ${match[2]} }` : `{ ${match[1]} }`;
            } else {
              importSpecifier = match[2] || key;
            }

            const replacement = `import ${importSpecifier} from '${match[0]}';`;

            const message = `Use  ${replacement}  instead of using  ${fullName}`;

            // report the issue to ESLint
            context.report(node, message);

            // exit the loop after the first match was found
            break;
          }
        }
      }
    };
  }
};
