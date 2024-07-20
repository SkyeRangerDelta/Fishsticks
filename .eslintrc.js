module.exports = {
  extends: [
    'eslint:recommended'
  ],
  env: {
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'semi': [2, 'always'],
    'space-in-parens': [2, 'always']
  },
  ignorePatterns: [
    'node_modules/'
  ]
};