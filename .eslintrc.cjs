module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['@dpgradio/eslint-config-recommended', 'plugin:import/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  rules: {
    'import/extensions': [2, 'ignorePackages'],
  },
}
