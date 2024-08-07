module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
    'vue/first-attribute-linebreak': 'off',
  }
}
