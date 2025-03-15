import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'

import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: [
            "**/*.{js,mjs,cjs,ts}"
        ],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    impliedstrict: true,
                },
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
])
