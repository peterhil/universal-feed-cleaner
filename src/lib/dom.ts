/* global console, document */

import {
    countBy,
    empty,
    equals,
    filter,
    groupBy,
    head,
    identity,
    includes,
    sortObject,
    tail,
    toPairs,
} from 'rambdax'

import { lengthSorter, valueSorter } from '$lib/utils'

const containerTags = [
    // -- Content sectioning
    'ARTICLE',
    // 'ASIDE',
    'MAIN',
    'SECTION',
    // -- Text content
    'BLOCKQUOTE',
    'DIV',
    'FIGURE',
    'UL',
    // -- Tables
    'TABLE',
    'TBODY',
]

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

export function findNodesBy (filterFn) {
    const nodeIterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        filterFn,
    )
    const nodes = []
    let currentNode

    while ((currentNode = nodeIterator.nextNode())) {
        nodes.push(currentNode)
    }

    return nodes
}

export function findContainers (minChildCount) {
    const containers = findNodesBy(
        (node) => {
            const accept =
                node.childElementCount >= minChildCount
                && includes(node.tagName, containerTags)
                && isVertical(node)
                && isVisible(node)
                && !sameScrollSize(document.body, node)
            return accept
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT
        }
    )

    console.debug('[UFC] findContainers:', { containers })
    return containers
}

export function findSimilarElements (container) {
    const excludedTags = ['SCRIPT', 'IFRAME', 'STYLE']
    const children = [...container.childNodes].filter(
        (node) => (node.tagName && !includes(node.tagName, excludedTags))
    )
    const similar = groupBy(
        function grouper (node) {
            return (node.tagName && node.classList)
                ? [node.tagName, ...[...node.classList].sort()].join(',')
                : node.tagName
        },
        children
    )
    // TODO If most common element counts are a tie include all of them
    const mostCommon = head(toPairs(sortObject(lengthSorter, similar)))[1]
    console.debug('[UFC] findSimilarElements:', { similar, mostCommon })

    if (mostCommon.length <= 1) {
        return []
    }

    return mostCommon
}
