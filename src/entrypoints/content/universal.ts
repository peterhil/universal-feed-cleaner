import escapeRegexp from 'escape-string-regexp'
import { debounce } from 'rambdax'

import { findContainers } from '~/lib/dom'
import { markContainers } from '~/lib/marking'
import { loadRules } from '~/lib/options'
import { iUniq } from '~/lib/utils'

function wrapIntoDetails (node: HTMLElement, reason: string): void {
    const children = node.childNodes
    const details = document.createElement('details')
    const summary = document.createElement('summary')

    summary.innerText = reason // TODO Use spans?

    details.replaceChildren(summary, ...children)
    node.replaceChildren(details)
}

function buildRegex (keywords: string[]): RegExp {
    const flags = 'giu'
    const parts = keywords
        .map(escapeRegexp)
        .map((keyword) => `\\b${keyword}\\b`)
    const pattern = '(' + parts.join('|') + ')'

    return new RegExp(pattern, flags)
}

function getReason (re: RegExp, node: HTMLElement): string {
    const matches = iUniq([...node.innerText.match(re)].sort())
    const reason = [...matches].join(', ')

    return reason
}

function checkElement (re: RegExp, node: HTMLElement): string | null {
    const status = re.test(node.innerText) ? 'hidden' : 'checked'
    let reason = null

    if (status === 'hidden') {
        reason = getReason(re, node)

        node.dataset.ufcReason = reason
        wrapIntoDetails(node, reason)
    }
    node.dataset.ufcStatus = status

    return reason
}

function hideElements (rules: object): void {
    // TODO Find elements within a container given as input context
    const newElements = document.querySelectorAll(
        '[data-ufc="container"] [data-ufc="element"]:not([data-ufc-status])'
    )
    const regex = buildRegex(rules)

    newElements.forEach((node) => checkElement(regex, node))
}

export async function main (): Promise<void> {
    const minChildCount = 5
    // TODO Return containers without wrappers and use with hideElements
    const containers = await findContainers(minChildCount)
    const rules = await loadRules(document.location.host)

    console.debug('[UFC] Universal main:', { containers, rules })
    document.body.classList.add('ufc-debug')

    await markContainers(containers)
    await hideElements(rules)
}

export function onRequestPlain (request, sender): void {
    if (request.type === 'xhr' && request.details.method === 'GET') {
        console.debug('[UFC] Xhr request:', { request })
        main()
    }
}

export const onRequest = debounce(onRequestPlain, 1000)
