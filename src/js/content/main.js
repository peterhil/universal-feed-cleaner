/* global chrome */

// Use ES modules with dynamic import() on content scripts
// https://stackoverflow.com/a/53033388/470560
(async () => {
    let url = null
    if (document.location.href.match('youtube.com')) {
        url = 'js/content/youtube.js'
    }
    else {
        url = 'js/content/wikipedia.js'
    }
    const src = chrome.runtime.getURL(url)
    const contentScript = await import(src)

    contentScript.main()
})()
