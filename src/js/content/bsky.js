/* global browser */

import * as R from 'rambdax'

const valueSorter = (propA, propB, valueA, valueB) => valueA > valueB ? -1 : 1

function notBodySize (node) {
    const body = document.body
    const sameWidth = R.equals(body.offsetWidth, node.offsetWidth)
    const sameHeight = R.equals(body.offsetHeight, node.offsetHeight)

    return !(sameWidth && sameHeight)
}

function isVerticalContainer (elem) {
    return elem.childElementCount > 4 && elem.offsetHeight > elem.offsetWidth
}

function findContainers () {
    return Array.from(document.querySelectorAll('*'))
        .filter(isVerticalContainer)
        .filter(notBodySize)
}

function findSimilarElements (container) {
    const excludedTags = ['SCRIPT', 'IFRAME', 'STYLE']
    const children = Array.from(container.childNodes).filter((node) => !R.includes(node.tagName, excludedTags))
    const classes = children.map((node) => [node.tagName, ...node.classList])
    const counts = R.countBy(R.identity, classes)
    const sorted = R.sortObject(valueSorter, counts)
    const top = R.head(R.toPairs(sorted))
    const spec = (R.head(top) || '').split(',')
    const tagName = R.head(spec)
    const classList = R.tail(spec)

    if (top[1] === 1) {
        console.debug('[UFC] no similar elements found', { sorted })
        return []
    }

    const similar = R.filter((node) => {
        const sameTag = R.equals(tagName, node.tagName)
        const sameClasses = R.equals(classList, Array.from(node.classList))

        if (R.empty(classList)) {
            return sameTag
        }

        return sameTag && sameClasses
    }, children)

    console.log('[UFC] findSimilarElements:', container, { similar, top, sorted, tagName, classList })

    return similar
}

function markElement (node) {
    if (node.dataset.ufc === 'element') {
        return
    }

    node.dataset.ufc = 'element'
}

function markContainer (node) {
    const mostCommon = findSimilarElements(node)

    node.dataset.ufc = 'container'

    if (mostCommon.length <= 1) {
        return
    }

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
