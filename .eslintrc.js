module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-redeclare': 'off',
    quotes: ['error', 'single'],
    // we want to force semicolons
    semi: ['error', 'always'],
    // we use 2 spaces to indent our code
    indent: ['error', 2, { SwitchCase: 1 }],
    // we want to avoid useless spaces
    'no-multi-spaces': ['error'],
    'linebreak-style': 'off',
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'max-len': ['error', { code: 180 }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
  // without this settings 'import' of .ts and .js files does not working
  // if set './config/serviceConfig.ts' (with extension) then TS said 'An import path cannot end with a '.ts' extension.'
  // if set './config/serviceConfig' (without extension) then ESLINT said 'Missing file extension for "./config/serviceConfig"'
  // and 'Unable to resolve path to module './config/serviceConfig''
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ts',
        ],
      },
    },
  },
};
