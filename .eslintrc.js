module.exports =  {
    plugins: [
        "@typescript-eslint/eslint-plugin",
        "eslint-plugin-tsdoc"
    ],
    extends:  [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    parser:  '@typescript-eslint/parser',
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "tsdoc/syntax": "warn"
    }
};
