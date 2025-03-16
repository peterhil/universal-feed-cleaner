import { browser } from 'webextension-polyfill'

function onRequestCompleted (details) {
    if (details.method === 'GET' && details.type === 'xmlhttprequest') {
        const message = { type: 'xhr', details }
        const tabId = details.tabId

        // console.debug('XHR completed:', details)

        if (tabId >= 0) {
            // Note: You can also use a connection-based approach to exchange messages.
            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging
            browser.tabs.sendMessage(tabId, message)  // TODO Use @webext-core/messaging?
        }
    }

    return { cancel: false }
}

export default defineBackground(() => {
    // console.debug('[UFC]: background script', { id: browser.runtime.id })

    browser.webRequest.onCompleted.addListener(
        onRequestCompleted,
        { urls: ['<all_urls>'] },
    )
})
