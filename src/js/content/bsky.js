function isVerticalContainer (elem) {
    return elem.childElementCount > 4 && elem.offsetHeight > elem.offsetWidth
}

function findContainers () {
    return Array.from(document.querySelectorAll('*')).filter(isVerticalContainer)
}

export function main () {
    const containers = findContainers()
    console.log('[UFC] main: bsky.js on', document.location.href, containers)
}

console.log('[UFC]: loaded on', document.location.href)

window.addEventListener('load', main, false)
// document.addEventListener("DOMContentLoaded", main)

setTimeout(main, 7000)

function handleMessage(request, sender) {
    console.debug('[UFC] Content script got a message:', request, sender)
    main()
}

browser.runtime.onMessage.addListener(handleMessage)
