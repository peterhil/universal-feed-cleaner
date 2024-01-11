function innerTextLocaleCompare (a, b) {
    return a.innerText.localeCompare(b.innerText)
}

export function sortElementChildren (element) {
    console.debug('[CW] sortElementChildren')

    const children = [...element.children].sort(innerTextLocaleCompare)
    element.replaceChildren(...children)

    return element.children
}
