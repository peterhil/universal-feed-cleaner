import escapeRegexp from 'escape-string-regexp'

import { findContainers } from '~/lib/dom'
import { markContainers } from '~/lib/marking'
import { options } from '~/lib/options'
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
    const pattern = '(' + keywords.map(escapeRegexp).join('|') + ')'

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

function hideElements (): void {
    // TODO Find elements within a container given as input context
    const newElements = document.querySelectorAll(
        '[data-ufc="container"] [data-ufc="element"]:not([data-ufc-status])'
    )
    const regex = buildRegex(options.triggers)

    newElements.forEach((node) => checkElement(regex, node))
}

export async function main (): Promise<void> {
    const containers = await findContainers(options.minChildCount)
    // TODO Return containers without wrappers and use with hideElements
    await markContainers(containers)
    await hideElements()
}

export function onMessage (request, sender): void {
    if (request.type === 'xhr') {
        main()
    }
}
