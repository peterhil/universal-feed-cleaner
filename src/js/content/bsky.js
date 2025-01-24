/* global browser */

import * as R from 'rambdax'

const valueSorter = (propA, propB, valueA, valueB) => valueA > valueB ? -1 : 1

function notBodySize (node) {
    const body = document.body
    const sameWidth = R.equals(body.scrollWidth, node.scrollWidth)
    const sameHeight = R.equals(body.scrollHeight, node.scrollHeight)

    return !(sameWidth && sameHeight)
}

function isVerticalContainer (elem) {
    return elem.offsetHeight > elem.offsetWidth
}

function isVisible (node) {
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)
}

function findContainers () {
    return Array.from(document.querySelectorAll('*'))
        .filter(node => {
            return node.childElementCount > 4
                && isVisible(node)
                && isVerticalContainer(node)
                && notBodySize(node)
        })
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
    // Skip if child count is unchanged
    if (node.childElementCount.toString() === node.dataset.ufcChildElementCount) {
        return
    }

    const mostCommon = findSimilarElements(node)

    if (mostCommon.length <= 1) {
        return
    }

    node.dataset.ufc = 'container'

    mostCommon.forEach(markElement)

    node.dataset.ufcChildElementCount = node.childElementCount
}

// From https://youmightnotneedjquery.com/#parents
function parents (node, selector) {
    const parents = []

    while ((node = node.parentNode) && node !== document) {
        if (!selector || node.matches(selector)) parents.push(node)
    }

    return parents
}

function markWrapper (node) {
    if (node.dataset.ufc !== 'container') return

    const parentContainers = parents(node, '[data-ufc="container"]')

    parentContainers.forEach(node => {
        node.dataset.ufc = 'wrapper'
    })
}

export function main () {
    const containers = findContainers()
    const url = document.location.href
    console.debug('[UFC] main: bsky.js on', url, { containers })

    containers.forEach(markContainer)
    containers.forEach(markWrapper)
}

function onMessage (request, sender) {
    console.debug('[UFC] Content script got a message:', request, sender)
    if (request.type === 'xhr') {
        main()
    }
}

document.addEventListener('DOMContentLoaded', main)

browser.runtime.onMessage.addListener(onMessage)
