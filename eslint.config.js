import globals from "globals"
import js from "@eslint/js"

import importPlugin from "eslint-plugin-import"
import n from "eslint-plugin-n"
import promise from "eslint-plugin-promise"

import autoImports from './.wxt/eslint-auto-imports.mjs'

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

export default [
    autoImports,
    js.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions,
        plugins,
        rules,
    },
]
