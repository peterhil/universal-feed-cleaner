/* global MutationObserver, console, document */

// import escapeRegexp from 'escape-string-regexp'
import { debounce, isEmpty, match } from 'rambdax'

import { findContainers } from '~/lib/dom'
import { iUniq } from '~/lib/utils'
import { loadRules } from '~/lib/options'
import { markContainers } from '~/lib/marking'

function usePrepend () {
    // Use compromise prepend method on Facebook
    return !!document.location.origin.match('facebook.com')
}

function addDetails (element, reason, keywords) {
    const children = element.childNodes
    const details = document.createElement('details')
    const summary = document.createElement('summary')

    summary.innerText = reason
    // console.debug('[UFC] addDetails:', {element, reason})

    if (element.tagName === 'TR') {
        const cells = element.querySelectorAll('td')

        element.dataset.obeyStatus = 'skip'

        cells.forEach((cell) => {
            if (hasKeywords(keywords, cell.innerText)) {
                checkElement(keywords, cell)
            }
        })
    }
    else {
        element.dataset.obeyStatus = 'hidden'

        if (usePrepend()) {
            details.classList.add('obey-prepend')
            details.append(summary)
            element.prepend(details)
        }
        else {
            details.classList.add('obey')
            details.replaceChildren(summary, ...children)
            element.replaceChildren(details)
        }
    }
}

function regexpPattern (keywords) {
    const keys = keywords.map(RegExp.escape)
    const pattern = '\\b(' + keys.join('|') + '\\b)'

    return pattern
}

function hasKeywords (keywords, text) {
    const re = new RegExp(regexpPattern(keywords), 'giu')
    return re.test(text)
}

function searchKeywords (keywords, text) {
    const re = new RegExp(regexpPattern(keywords), 'giu')
    return match(re, text)
}

function getReason (matches) {
    const sorted = iUniq(matches.sort())
    const reason = sorted.join(', ')

    return reason
}

function checkElement (keywords, element) {
    const matches = searchKeywords(keywords, element.innerText)
    const hide = !isEmpty(matches)

    // Avoid recursion with TR elements
    if (element.dataset.obeyStatus === 'skip') return false

    if (hide) {
        const reason = getReason(matches)

        addDetails(element, reason, keywords)
    }

    return hide
}

function hideElements (keywords) {
    // TODO Find elements within a container given as input context
    const newElements = document.body.querySelectorAll(
        '[data-obey="container"] [data-obey="element"]:not([data-obey-status])'
    )
    newElements.forEach((element) => {
        checkElement(keywords, element)
    })
}

export async function main () {
    const minChildCount = 5
    const containers = await findContainers(minChildCount)
    const keywords = await loadRules(document.location.host)

    console.debug('[OBEY] Universal main:', { containers, keywords })
    document.body.classList.add('obey-debug')

    await markContainers(containers)
    await hideElements(keywords)
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
