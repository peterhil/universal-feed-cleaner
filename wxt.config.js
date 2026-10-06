import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: 'src',
    alias: {
        $lib: './src/lib',
    },
    extensionApi: 'webextension-polyfill',
    imports: {
        eslintrc: {
            enabled: 'auto',
        },
    },
    modules: ['@wxt-dev/module-svelte'],
    manifest: {
        name: 'Universal feed cleaner',
        version: '0.1',
        description: 'Hide social media posts or other content behind collapsible elements.',
        permissions: [
            'https://*/',
            'storage',
            'tabs',
            'webRequest',
        ],
        browser_specific_settings: {
            gecko: {id: 'obey@composed.nu'},
        },
        web_accessible_resources: [
            {
                matches: ['<all_urls>'],
                resources: [
                    'assets/content/universal.js',
                ],
            },
        ],
    },
})
