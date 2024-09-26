import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        Handlebars: 'readonly',
      },
    },
    files: ['webpack.config.js'],
    env: {
      node: true,
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
