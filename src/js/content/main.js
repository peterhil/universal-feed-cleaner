/* global chrome */

// Use ES modules with dynamic import() on content scripts
// https://stackoverflow.com/a/53033388/470560
(async () => {
    let url = null
    const location = document.location.host

    if (location.match('bsky.app')) {
        url = 'js/content/bsky.js'
    }
    else {
        url = 'js/content/universal.js'
    }
    const src = chrome.runtime.getURL(url)
    const contentScript = await import(src)

    contentScript.main()
})()
