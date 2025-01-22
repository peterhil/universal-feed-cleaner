import $ from 'jquery'

const config = {
    attributes: true,
    childList: true,
    characterData: true,
}

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        const newNodes = mutation.addedNodes // DOM NodeList
        console.debug('[CW] Mutation:', mutation)

        if (newNodes) {
            newNodes.forEach(function (node) {
                if (node.getAttribute('role') === 'article') {
                    console.debug('[CW] Article added:', { node, text: node.innerText })
                }
                else {
                    console.debug('[CW] Node added:', { node, text: node.innerText })
                }
            })
        }
    })
})

export function main () {
    const target = document.body
    // const target = document.getElementById('react-root')
    // const articles = $('[role="article"]')
    const articles = document.querySelectorAll('[role="article"]')

    observer.observe(target, config)

    console.log('[CW]: twitter.js main', {location: document.location.href, articles})
}

console.log('[CW]: twitter.js on', document.location.href)

window.addEventListener ('load', main, false)

setTimeout(main, 7000)
