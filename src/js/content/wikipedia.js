import { sortElementChildren } from '@js/lib/sorting'

export function main() {
    console.log('[Resort] wikipedia.js on', document.location.href)

    const id = 'mw-panel-toc-list'
    const element = document.getElementById(id)

    sortElementChildren(element)
}
