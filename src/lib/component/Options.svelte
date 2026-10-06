<script>
    import { keys } from 'rambdax'

    import OptionsKeyword from '$lib/component/OptionsKeyword.svelte'
    import { options } from '$lib/options'

    const rules = options.rules
    const domains = keys(rules)
</script>

<div>
    <h1>Options</h1>

    <h2>Keywords to hide</h2>

    {#each domains as domain}
        <h3>{domain === '*' ? 'All domains' : domain}</h3>

        <ul>
            {#each rules[domain] as word}
                <OptionsKeyword {word} {domain} />
            {/each}
        </ul>
    {/each}
</div>
