import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import eslint from '@rollup/plugin-eslint'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

import { isDev, outputDir, rel, target } from './utils.config.mjs'

const format = 'es'
const sourcemap = (isDev ? 'inline' : false)
const verbose = true

const aliases = [
    { find: '@js', replacement: rel('src/js') },
]

const plugins = [
    alias({
        entries: aliases,
    }),

    eslint({
        exclude: [
            'src/**/*.{css,sass}',
        ]
    }),

    // Resolve node modules
    resolve({
        browser: true, // default: false
        dedupe: [],
        modulesOnly: false, // default: false
        modulePaths: [
            './node_modules/'
        ],
        preferBuiltins: false,
    }),

    // Convert CommonJS libraries to ES6
    commonjs(),

    !isDev && terser(),
]

const copyAssets = [
    copy({
        targets: [{
            src: [
                'src/css/content.css',
                'src/manifest.json',
            ],
            dest: outputDir(),
        }],
        flatten: false,
        verbose,
    }),
]

const watch = {
    chokidar: true,
    clearScreen: true,
    exclude: ['node_modules/**'],
    include: ['src/**/*'],
}

export default [
    {
        input: 'src/js/background/script.js',
        output: {
            dir: outputDir('js/background'),
            format,
            sourcemap,
        },
        plugins,
        watch,
    },
    {
        input: 'src/js/content/main.js',
        output: {
            dir: outputDir('js/content'),
            format,
            sourcemap,
        },
        plugins: plugins.concat(copyAssets),
        watch,
    },
    {
        input: 'src/js/content/bsky.js',
        output: {
            dir: outputDir('js/content'),
            format,
            sourcemap,
        },
        plugins,
        watch,
    },
    {
        input: 'src/js/content/universal.js',
        output: {
            dir: outputDir('js/content'),
            format,
            sourcemap,
        },
        plugins,
        watch,
    },
]
