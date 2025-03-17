/* global console, document */

import {
    countBy,
    empty,
    equals,
    filter,
    head,
    identity,
    includes,
    sortObject,
    tail,
    toPairs,
} from 'rambdax'

import { valueSorter } from '$lib/utils'

export function isVertical (elem) {
    return elem.offsetHeight > elem.offsetWidth
}

export function isVisible (node) {
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)
}

export function sameScrollSize (nodeA, nodeB) {
    const sameWidth = equals(nodeA.scrollWidth, nodeB.scrollWidth)
    const sameHeight = equals(nodeA.scrollHeight, nodeB.scrollHeight)

    return sameWidth && sameHeight
}

// From https://youmightnotneedjquery.com/#parents
export function parents (node, selector) {
    const parents = []

    while ((node = node.parentNode) && node !== document) {
        if (!selector || node.matches(selector)) parents.push(node)
    }

    return parents
}

export function findContainers (minChildCount) {
    const nthChilds = document.querySelectorAll(`:nth-child(${ minChildCount })`)
    const nodes = [...nthChilds].map(n => n.parentNode)

    return nodes.filter(
        node => isVisible(node) &&
            isVertical(node) &&
            !sameScrollSize(document.body, node)
    )
}

export function findSimilarElements (container) {
    const excludedTags = ['SCRIPT', 'IFRAME', 'STYLE']
    const children = Array.from(container.childNodes).filter((node) => !includes(node.tagName, excludedTags))
    const classes = children.map((node) => [node.tagName, ...node.classList])
    const counts = countBy(identity, classes)
    const sorted = sortObject(valueSorter, counts)
    const top = head(toPairs(sorted))
    const spec = (head(top) || '').split(',')
    const tagName = head(spec)
    const classList = tail(spec)

    if (top[1] === 1) {
        console.debug('[UFC] no similar elements found', { sorted })
        return []
    }

    const similar = filter((node) => {
        const sameTag = equals(tagName, node.tagName)
        const sameClasses = equals(classList, Array.from(node.classList))

        if (empty(classList)) {
            return sameTag
        }

        return sameTag && sameClasses
    }, children)

    console.log('[UFC] findSimilarElements:', container, { similar, top, sorted, tagName, classList })

    return similar
}
