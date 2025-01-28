/* global browser */

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
import escapeRegexp from 'escape-string-regexp'

import {
    isVisible,
    isVertical,
    parents,
    sameScrollSize,
} from '@js/lib/dom'
import { valueSorter } from '@js/lib/utils'

function findContainers () {
    const nodes = [...document.querySelectorAll(':nth-child(5)')].map(n => n.parentNode)

    return nodes.filter(
        node => isVisible(node) &&
            isVertical(node) &&
            !sameScrollSize(document.body, node)
    )
}

function findSimilarElements (container) {
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

function checkElement (node) {
    const triggers = [
        'Elon Musk',
        'Trump',
        'woke',
    ]
    const flags = 'giu'
    const pattern = '(' + triggers.map(escapeRegexp).join('|') + ')'
    const re = new RegExp(pattern, flags)
    const status = re.test(node.innerText, re) ? 'hidden' : 'checked'

    if (status === 'hidden') {
        const matches = [...node.innerText.match(re)].sort()
        const reason = [...new Set(matches)].join(', ')

        // console.debug('[UFC] Matches:', { node, reason })
        node.dataset.ufcReason = reason
    }

    node.dataset.ufcStatus = status
}

function hideElements () {
    const newElements = document.querySelectorAll('[data-ufc="element"]:not([data-ufc-status])')

    newElements.forEach(checkElement)
}

async function processContents () {
    const containers = await findContainers()
    await markContainers(containers)
    await hideElements()
}

export function main () {
    processContents()
}

function onMessage (request, sender) {
    if (request.type === 'xhr') {
        main()
    }
}

document.addEventListener('DOMContentLoaded', main)

browser.runtime.onMessage.addListener(onMessage)
