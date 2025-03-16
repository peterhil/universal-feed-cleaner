/* global document */

import './style.css'

import { browser } from 'webextension-polyfill'

import { main as universal, onMessage } from './universal'
import { main as noop } from './noop'

export default defineContentScript({
    matches: ['<all_urls>'],
    runAt: 'document_idle',
    main() {
        const location = document.location.host

        if (location.match('bsky.app')) {
            universal()
            browser.runtime.onMessage.addListener(onMessage)
        }
        else {
            noop()
        }
    },
})
