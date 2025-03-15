import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: 'src',
    extensionApi: 'webextension-polyfill',
    modules: ['@wxt-dev/module-svelte'],
    manifest: {
        name: 'Universal feed cleaner',
        version: '0.1',
        description: 'Hide triggering social media content behind a warning to have better peace of mind.',
        permissions: [
            'https://*/',
            'storage',
            'tabs',
            'webRequest',
        ],
        web_accessible_resources: [
            {
                matches: ['<all_urls>'],
                resources: [
                    'assets/content/universal.js',
                ],
            },
            {
                matches: ['*://*.bsky.app/*'],
                resources: [
                    'assets/content/bsky.js',
                ],
            },
        ],
    },
})
