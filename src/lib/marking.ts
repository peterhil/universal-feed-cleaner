import { findSimilarElements, parents } from '$lib/dom'

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
    node.dataset.ufcChildElementCount = node.childElementCount

    mostCommon.forEach(markElement)
}

function markWrapper (node) {
    if (node.dataset.ufc !== 'container') return

    const parentContainers = parents(node, '[data-ufc="container"]')

    parentContainers.forEach(node => {
        node.dataset.ufc = 'wrapper'
    })
}

export async function markContainers (containers) {
    containers.forEach(markContainer)
    containers.forEach(markWrapper)
}
