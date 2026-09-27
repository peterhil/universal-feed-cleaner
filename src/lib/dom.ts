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
        (node) =>
            node.childElementCount >= minChildCount
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
    )
    return containers.filter(
        node => isVisible(node) &&
            isVertical(node) &&
            !sameScrollSize(document.body, node)
    )
}

export function findSimilarElements (container) {
    const excludedTags = ['SCRIPT', 'IFRAME', 'STYLE']
    const children = Array.from(container.childNodes).filter((node) => !includes(node.tagName, excludedTags))

    const similar = groupBy(
        (node) => [node.tagName, ...Array.from(node.classList).sort()].join(','),
        children
    )
    const mostCommon = head(toPairs(sortObject(lengthSorter, similar)))[1]

    if (mostCommon.length === 1) {
        return []
    }

    return mostCommon
}
