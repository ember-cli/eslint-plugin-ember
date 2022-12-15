'use strict';

/** @type {import('eslint').Rule.RuleModule} */

function reportInvalidSyntax(context, node) {
	if (isInvalidSyntax(node)) {
		const isDefaultExport = node.type === 'ExportDefaultDeclaration';
		const isNamed = node.declaration.id !== null;
		const name = isNamed ? node.declaration.id.name : '';
		const numDecorators = node.declaration.decorators.length;

		const message = `Usage of class decorator${numDecorators > 1 ? 's' : ''} on the ${isNamed ? '' : 'un-named '}${
			isDefaultExport ? 'default ' : ''
		}export${isNamed ? ' ' + name : ''} must occur prior to exporting the class.`;

		if (isNamed) {
			const sourceCode = context.getSourceCode();
			const src = sourceCode.getText(node);
			context.report({
				node,
				message,
				fix(fixer) {
					if (isDefaultExport) {
						let newSrc = src.replace(`export default class ${name}`, `class ${name}`);
						newSrc = newSrc + `\nexport default ${name};\n`;
						return fixer.replaceText(node, newSrc);
					}
					let newSrc = src.replace(`export class ${name}`, `class ${name}`);
					newSrc = newSrc + `\nexport { ${name} };\n`;
					return fixer.replaceText(node, newSrc);
				},
			});
		} else {
			context.report({ node, message });
		}
	}
}

function isInvalidSyntax(node) {
	return node.declaration && node.declaration.type === 'ClassDeclaration' && node.declaration.decorators?.length;
}

module.exports = {
	meta: {
		type: 'problem',
		fixable: true,
		docs: {
			description:
				'The use of a class decorator on an export declaration is disallowed. Use the decorator on the class directly and export the result. E.g. instead of `@decorator export default class Example {}` use `@decorator class Example {}\nexport default Example;`',
			category: 'Miscellaneous',
			recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-decorators-before-export.md',
		},
	},

	create(context) {
		return {
			ExportDefaultDeclaration(node) {
				return reportInvalidSyntax(context, node);
			},
			ExportNamedDeclaration(node) {
				return reportInvalidSyntax(context, node);
			},
		};
	},
};
