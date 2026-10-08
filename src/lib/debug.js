const isDev = import.meta.env.DEV
const prefix = 'OBEY'

function addPrefix (string) {
    return `[${prefix}] ` + string
}

export function debug (...args) {
    if (isDev) {
        if (args.length >= 1 && typeof args[0] === 'string') {
            args[0] = addPrefix(args[0])
        }
        console.debug(...args)
    }
}

export function time (label) {
    if (isDev) {
        console.time(label && addPrefix(label))
    }
}

export function timeEnd (label) {
    if (isDev) {
        console.timeEnd(label && addPrefix(label))
    }
}
