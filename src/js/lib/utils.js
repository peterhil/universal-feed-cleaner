import { uniqWith } from 'rambdax'

// Case insensitive unique strings
export const iUniq = uniqWith((x, y) => x.toLowerCase() === y.toLowerCase())

export const valueSorter = (propA, propB, valueA, valueB) => valueA > valueB ? -1 : 1
