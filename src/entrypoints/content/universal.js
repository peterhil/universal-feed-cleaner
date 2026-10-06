/* global console, document */

import escapeRegexp from 'escape-string-regexp'
import { debounce } from 'rambdax'

import { findContainers } from '~/lib/dom'
import { markContainers } from '~/lib/marking'
import { loadRules } from '~/lib/options'
import { iUniq } from '~/lib/utils'

function wrapIntoDetails (node, reason) {
    const children = node.childNodes
    const details = document.createElement('details')
    const summary = document.createElement('summary')

    summary.innerText = reason // TODO Use spans?

    details.replaceChildren(summary, ...children)

    if (node.tagName === 'TR') {
        const tr = document.createElement('td')
        const colspan = details.querySelectorAll('td').length

        tr.setAttribute('colspan', colspan)
        tr.replaceChildren(details)
        node.replaceChildren(tr)
    }
    else {
        node.replaceChildren(details)
    }
}

function buildRegex (keywords) {
    const flags = 'giu'
    const parts = keywords
        .map(escapeRegexp)
    const pattern = '\\b(' + parts.join('|') + ')\\b'

    return new RegExp(pattern, flags)
}

function getReason (re, node) {
    const matches = iUniq([...node.innerText.match(re)].sort())
    const reason = [...matches].join(', ')

    return reason
}

function checkElement (re, node) {
    const status = re.test(node.innerText) ? 'hidden' : 'checked'
    let reason = null

    if (status === 'hidden') {
        reason = getReason(re, node)

        node.dataset.obeyReason = reason
        wrapIntoDetails(node, reason)
    }
    node.dataset.obeyStatus = status

    return reason
}

function hideElements (rules) {
    // TODO Find elements within a container given as input context
    const newElements = document.querySelectorAll(
        '[data-obey="container"] [data-obey="element"]:not([data-obey-status])'
    )
    const regex = buildRegex(rules)

    newElements.forEach((node) => checkElement(regex, node))
}

export async function main () {
    const minChildCount = 5
    // TODO Return containers without wrappers and use with hideElements
    const containers = await findContainers(minChildCount)
    const rules = await loadRules(document.location.host)

    console.debug('[OBEY] Universal main:', { containers, rules })
    document.body.classList.add('obey-debug')

    await markContainers(containers)
    await hideElements(rules)
}

export function onRequestPlain (request) {
    if (request.type === 'xhr' && request.details.method === 'GET') {
        console.debug('[OBEY] Xhr request:', { request })
        main()
    }
}

export const onRequest = debounce(onRequestPlain, 1000)
