/* global browser */

import * as R from 'rambdax'

const valueSorter = (propA, propB, valueA, valueB) => valueA > valueB ? -1 : 1

function isVerticalContainer (elem) {
    return elem.childElementCount > 4 && elem.offsetHeight > elem.offsetWidth
}

function findContainers () {
    return Array.from(document.querySelectorAll('*')).filter(isVerticalContainer)
}

function findSimilarElements (container) {
    const children = Array.from(container.childNodes)
    const classes = children.map((node) => [node.tagName, ...node.classList])
    const counts = R.countBy(R.identity, classes)
    const sorted = R.sortObject(valueSorter, counts)
    const top = R.head(R.toPairs(sorted))
    const spec = (R.head(top) || '').split(',')
    const tagName = R.head(spec)
    const classList = R.tail(spec)

    const similar = R.filter((node) => {
        const sameTag = R.equals(tagName, node.tagName)
        const sameClasses = R.equals(classList, Array.from(node.classList))

        return sameTag && sameClasses
    }, children)

    console.log('[UFC] findSimilarElements:', { similar, top, sorted })

    return similar
}

function markElement (node) {
    if (node.dataset.ufc === 'element') {
        return
    }

    node.dataset.ufc = 'element'
}

function markContainer (node) {
    node.dataset.ufc = 'container'

    const mostCommon = findSimilarElements(node)

    mostCommon.forEach(markElement)
}

export function main () {
    const containers = findContainers()
    console.debug('[UFC] main: bsky.js on', document.location.href, containers)

    containers.forEach(markContainer)
}

document.addEventListener('DOMContentLoaded', main)

function handleMessage (request, sender) {
    console.debug('[UFC] Content script got a message:', request, sender)
    main()
}

browser.runtime.onMessage.addListener(handleMessage)
