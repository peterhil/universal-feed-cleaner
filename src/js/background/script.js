console.log('[UFC]: background script')

function onRequestCompleted (details) {
    if (details.method === "GET" && details.type === "xmlhttprequest") {
        console.info('XHR completed:', details)
    }

    return { cancel: false }
}

browser.webRequest.onCompleted.addListener(
    onRequestCompleted,
    { urls: ['<all_urls>'] },
)
