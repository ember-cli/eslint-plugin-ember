import globals from 'globals';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  prettier,
  n.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
];
