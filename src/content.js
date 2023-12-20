const elemId = 'mw-panel-toc-list'

let element = document.getElementById(elemId)

function innerTextLocaleCompare (a, b) {
    return a.innerText.localeCompare(b.innerText)
}

function sortElementChildren (element) {
    const children = [...element.children].sort(innerTextLocaleCompare)
    element.replaceChildren(...children)
}

sortElementChildren(element)
