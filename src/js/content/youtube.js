import { sortElementChildren } from '@js/lib/sorting'

const id = 'ytd-popup-container'
const config = {
    attributes: false,
    childList: true,
    characterData: false,
}

let container = null

// Create an observer instance
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        const newNodes = mutation.addedNodes // DOM NodeList
        console.debug('[Resort] Mutation:', mutation)

        if (newNodes) {
            newNodes.forEach(function (node) {
                if (node.classList.contains(id)) {
                    console.debug('[Resort] Popup opened:', node)

                    container = document.getElementById('playlists')
                }
            })
        }
    })

    if (container) {
        sortElementChildren(container)
    }
})

export function main () {
    console.log('[Resort]: youtube.js on', document.location.href)

    const popup = document.getElementsByTagName(id)[0]

    // Pass in the target node, as well as the observer options
    observer.observe(popup, config)

    // Later, you can stop observing
    // observer.disconnect()
}
