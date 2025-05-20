const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const typescriptEslintEslintPlugin = require("@typescript-eslint/eslint-plugin");
const tsdoc = require("eslint-plugin-tsdoc");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
        tsdoc,
    },

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ),

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
        },
    },

    rules: {
        "tsdoc/syntax": "warn",
    },
}, globalIgnores(["src/index.d.ts"])]);
