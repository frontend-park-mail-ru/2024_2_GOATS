import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['webpack.config.js'],
    env: {
      node: true,
    },
    globals: {
      ...globals.node,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        Handlebars: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
