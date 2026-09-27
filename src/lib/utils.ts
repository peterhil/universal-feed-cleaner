import { uniqWith } from 'rambdax'

// Case insensitive unique strings
export const iUniq = uniqWith((x, y) => x.toLowerCase() === y.toLowerCase())

export const lengthSorter = (propA, propB, valueA, valueB) => valueA.length > valueB.length ? -1 : 1
export const valueSorter = (propA, propB, valueA, valueB) => valueA > valueB ? -1 : 1
