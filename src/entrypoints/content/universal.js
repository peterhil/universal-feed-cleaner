/* global console, document */

import escapeRegexp from 'escape-string-regexp'
import { debounce } from 'rambdax'

import { findContainers } from '~/lib/dom'
import { iUniq } from '~/lib/utils'
import { loadRules } from '~/lib/options'
import { markContainers } from '~/lib/marking'

function wrapIntoDetails (node, reason) {
    const children = node.childNodes
    const details = document.createElement('details')
    const summary = document.createElement('summary')

    summary.innerText = reason
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
    const parts = keywords.map(escapeRegexp)
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
    const containers = await findContainers(minChildCount)
    const rules = await loadRules(document.location.host)

    // console.debug('[OBEY] Universal main:', { containers, rules })
    document.body.classList.add('obey-debug')

    await markContainers(containers)
    await hideElements(rules)
}

export const onRequest = debounce((request) => {
    if (request.type === 'xhr' && request.details.thirdParty === false) {
        console.debug('[OBEY] XmlHttpRequest:', { request })
        main()
    }
}, 1500)

export const onMutation = debounce((mutations) => {
    console.debug('[OBEY] Mutations:', mutations)
    main()
}, 1500)

const observer = new MutationObserver(onMutation)

observer.observe(document.body, { childList: true, subtree: true })
