import { equals } from 'rambdax'

export function sameScrollSize (nodeA, nodeB) {
    const sameWidth = equals(nodeA.scrollWidth, nodeB.scrollWidth)
    const sameHeight = equals(nodeA.scrollHeight, nodeB.scrollHeight)

    return sameWidth && sameHeight
}

export function isVertical (elem) {
    return elem.offsetHeight > elem.offsetWidth
}

export function isVisible (node) {
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)
}

// From https://youmightnotneedjquery.com/#parents
export function parents (node, selector) {
    const parents = []

    while ((node = node.parentNode) && node !== document) {
        if (!selector || node.matches(selector)) parents.push(node)
    }

    return parents
}
