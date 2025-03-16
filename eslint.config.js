import globals from "globals"
import js from "@eslint/js"
import tseslint from "typescript-eslint"

import importPlugin from "eslint-plugin-import"
import n from "eslint-plugin-n"
import promise from "eslint-plugin-promise"

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

const languageOptions = {
    parserOptions: {
        ecmaVersion: 'latest',  // or a year
        ecmaFeatures: {
            impliedstrict: true,
        },
        globals: {
            ...globals.browser,
        },
        sourceType: "module",
    },
}

const plugins = {
    importPlugin,
    n,
    promise,
}

const rules = {
    "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
    "comma-dangle": ["off", "always"],
    "indent": ["error", 4],
    "no-console": ["off", "always"],
    // "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
}

export default tseslint.config([
    js.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions,
        plugins,
        rules,
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
        ],
        languageOptions,
        plugins,
        rules,
        settings: {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                }),
            ],
        },
    }
])
