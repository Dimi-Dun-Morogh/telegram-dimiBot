module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    "import"
  ],
  extends: [
    'airbnb-typescript',
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "consistent-return": "off",
    "no-console": "off",
    "import/prefer-default-export": "off",
    "no-return-assign": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/naming-convention": "off",
    "no-await-in-loop": "off",
    "no-nested-ternary": "off",
    "no-param-reassing": "off",
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": ["off"],
    "import/no-extraneous-dependencies": "off",
    "react/jsx-filename-extension": [0],
    "import/extensions": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off"
  }
};