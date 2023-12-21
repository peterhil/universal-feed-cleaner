function innerTextLocaleCompare (a, b) {
    return a.innerText.localeCompare(b.innerText)
}

export function sortElementChildren (element) {
    const children = [...element.children].sort(innerTextLocaleCompare)
    element.replaceChildren(...children)
}
