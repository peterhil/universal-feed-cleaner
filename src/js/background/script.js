console.log('[UFC]: background script')

function onRequestCompleted (details) {
    if (details.method === "GET" && details.type === "xmlhttprequest") {
        const message = {type: 'xhr', details}
        const tabId = details.tabId

        console.info('XHR completed:', details)

        // Note: You can also use a connection-based approach to exchange messages.
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging
        browser.tabs.sendMessage(tabId, message)
    }

    return { cancel: false }
}

browser.webRequest.onCompleted.addListener(
    onRequestCompleted,
    { urls: ['<all_urls>'] },
)
