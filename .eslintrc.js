module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  // extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2019
  },
  rules: {
    'class-methods-use-this': 0,
    'max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        comments: 120,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'no-console': ['warn', { allow: ['error'] }]
  }
};
