import escapeRegexp from 'escape-string-regexp'

import { findContainers, findSimilarElements, parents } from '~/lib/dom'
import { markContainers } from '~/lib/marking'
import { iUniq } from '~/lib/utils'

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

function markWrapper (node) {
    if (node.dataset.ufc !== 'container') return

    const parentContainers = parents(node, '[data-ufc="container"]')

    parentContainers.forEach(node => {
        node.dataset.ufc = 'wrapper'
    })
}

async function markContainers (containers) {
    containers.forEach(markContainer)
    containers.forEach(markWrapper)
}

function wrapIntoDetails (node, reason) {
    const children = node.childNodes
    const details = document.createElement('details')
    const summary = document.createElement('summary')

    summary.innerText = reason // TODO Use spans?

    details.replaceChildren(summary, ...children)
    node.replaceChildren(details)
}

function checkElement (node) {
    const triggers = [
        'Elon Musk',
        'Trump',
        'woke',
    ]
    const flags = 'giu'
    const pattern = '(' + triggers.map(escapeRegexp).join('|') + ')'
    const re = new RegExp(pattern, flags)
    const status = re.test(node.innerText) ? 'hidden' : 'checked'

    if (status === 'hidden') {
        const matches = iUniq([...node.innerText.match(re)].sort())
        const reason = [...matches].join(', ')

        // console.debug('[UFC] Matches:', { node, reason })
        node.dataset.ufcReason = reason

        wrapIntoDetails(node, reason)
    }

    node.dataset.ufcStatus = status
}

function hideElements () {
    // TODO Find elements within a container given as input
    const selector = '[data-ufc="container"] [data-ufc="element"]:not([data-ufc-status])'
    const newElements = document.querySelectorAll(selector)

    newElements.forEach(checkElement)
}

export async function main () {
    const containers = await findContainers()
    // TODO Return containers without wrappers and use with hideElements
    await markContainers(containers)
    await hideElements()
}

export function onMessage (request, sender) {
    if (request.type === 'xhr') {
        main()
    }
}
