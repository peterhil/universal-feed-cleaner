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
            enabled: 9,
        },
    },
    modules: ['@wxt-dev/module-svelte'],
    manifest: {
        name: 'Obey - hide content!',
        version: '0.2',
        description: 'Hide social media posts or other content behind collapsible elements.',
        permissions: [
            'https://*/',
            'storage',
            'tabs',
            'webRequest',
        ],
        browser_specific_settings: {
            gecko: {
                id: 'obey@composed.nu',
                data_collection_permissions: {
                    required: [
                        "none"
                    ]
                },
                strict_min_version: "58.0",
            },
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
