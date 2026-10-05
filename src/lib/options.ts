import { filter, flatten, values } from 'rambdax'

// TODO Implement options UI
export const options = {
    rules: {
        '*': [
            'AI',
            'Elon Musk',
            'Orpo',
            'Purra',
            'Tekoäly',
            'Trump',
        ],
        'facebook.com': [
            'Follow',
            'Reels',
        ],
        'linkedin.com': [
            'Applied',
            'Java',
            'Php',
            'Promoted',
            'Viewed',
        ],
        'startpage.com': [
            'w3schools.com',
        ],
    }
}

export async function loadRules (url: string) {
    const matched = filter(
        (_, site): boolean => {
            return (site === '*' || !!url.match(site))
        },
        options.rules)
    const rules = flatten(values(matched))

    // console.debug('[UFC] Matched rules:', { matched, rules })

    return rules
}
