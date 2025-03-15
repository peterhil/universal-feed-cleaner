import parser from '@babel/eslint-parser'
import pluginJs from '@eslint/js'

import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'

import standard from 'eslint-config-standard'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: [
            "**/*.{js,mjs,cjs,ts}"
        ],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    impliedstrict: true,
                },
                requireConfigFile: false,
                sourceType: 'module',
            },
        },
        "plugins": {
            importPlugin,
            n,
            promise,
        },
        rules: {
            'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
            'comma-dangle': ['off', 'always'],
            indent: ['error', 4],
            'no-console': ['off', 'always'],
            // 'no-console': ['warn', {}],
            'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
        },
    },
    pluginJs.configs.recommended,
    importPlugin.flatConfigs.recommended,
    ...tseslint.configs.recommended,
    // ...standard.configs.recommended,
]
