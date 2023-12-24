import { sortElementChildren } from '@js/lib/sorting'

export function main() {
    console.log('[Resort]: youtube.js on', document.location.href)

    const id = 'contents'
    const element = document.getElementById(id)

    sortElementChildren(element)
}
