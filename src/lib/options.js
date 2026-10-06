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
            'LLM',
            'LLMs',
            'Php',
            'Power platform',
            'Promoted',
            'Viewed',
        ],
        'startpage.com': [
            'w3schools.com',
        ],
    }
}

export async function loadRules (url) {
    const matched = filter(
        (_, domain) => {
            return (domain === '*' || !!url.match(domain))
        },
        options.rules)
    const rules = flatten(values(matched))

    // console.debug('[UFC] Matched rules:', { matched, rules })

    return rules
}
