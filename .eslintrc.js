module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
    // 'unused-import',
  ],
  'rules': {
    'object-curly-spacing': 'off',
    // 'no-unused-vars': [
    //   'error', {
    //     'vars': 'all',
    //     'args': 'after-used',
    //     'ignoreRestSiblings': false,
    //   },
    // ],
    'max-len': 'off',
  },
  // "rules": {
  //   "no-unused-vars": "on",
  //   "unused-imports/no-unused-imports": "error",
  //   "unused-imports/no-unused-vars": [
  //     "warn",
  //     {
  //       "vars": "all",
  //       "varsIgnorePattern": "^_",
  //       "args": "after-used",
  //       "argsIgnorePattern": "^_"
  //     }
  //   ]
  // }
};
