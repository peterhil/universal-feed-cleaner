/* global browser */

import './style.css'

import { main as bsky, onMessage } from './bsky.ts'
import { main as universal } from './universal.ts'

export default defineContentScript({
    matches: ['<all_urls>'],
    runAt: 'document_idle',
    main() {
        const location = document.location.host

        console.log('Hello content.')

        if (location.match('bsky.app')) {
            bsky()
            browser.runtime.onMessage.addListener(onMessage)
        }
        else {
            universal()
        }
    },
})
