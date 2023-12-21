const id = 'mw-panel-toc-list'
const element = document.getElementById(id)

function innerTextLocaleCompare (a, b) {
    return a.innerText.localeCompare(b.innerText)
}

function sortElementChildren (element) {
    const children = [...element.children].sort(innerTextLocaleCompare)
    element.replaceChildren(...children)
}

sortElementChildren(element)
