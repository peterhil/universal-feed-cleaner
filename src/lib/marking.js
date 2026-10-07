import { forEach } from 'rambdax'
import { findSimilarElements, parents } from '$lib/dom'

const minTextLength = 45

function markElement (node) {
    if (node.innerText.length <= minTextLength) return

    node.dataset.obey = 'element'
}

function markContainer (node) {
    // Skip if child count is unchanged
    if (node.childElementCount.toString() === node.dataset.obeyChildElementCount) {
        return
    }

    const mostCommon = findSimilarElements(node)

    if (mostCommon.length <= 1) {
        return
    }

    node.dataset.obey = 'container'
    node.dataset.obeyChildElementCount = node.childElementCount

    mostCommon.forEach(markElement)
}

function markWrapper (node) {
    if (node.dataset.obey !== 'container') return

    const parentContainers = parents(node, '[data-obey="container"]')

    forEach(
        (node) => node.dataset.obey = 'wrapper',
        parentContainers
    )
}

export async function markContainers (containers) {
    containers.forEach(markContainer)
    containers.forEach(markWrapper)
}
