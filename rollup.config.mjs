import copy from 'rollup-plugin-copy'

import { isDev, outputDir, target } from './utils.config.mjs'

const format = 'es'
const sourcemap = (isDev ? 'inline' : false)
const verbose = true

const plugins = [
]

const copyAssets = [
    copy({
        targets: [{
            src: [
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
        input: {
            content: 'src/js/content/main.js',
        },
        output: {
            dir: outputDir('js'),
            entryFileNames: '[name].js',
            format,
            manualChunks: {
            },
            sourcemap,
        },
        plugins: plugins.concat(copyAssets),
        watch,
    }
]
