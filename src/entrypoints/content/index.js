import './style.css'

import { main as universal, onRequest } from './universal'

export default defineContentScript({
    matches: ['<all_urls>'],
    runAt: 'document_idle',
    main() {
        universal()
        browser.runtime.onMessage.addListener(onRequest)
    },
})
