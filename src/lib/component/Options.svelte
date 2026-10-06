<script lang="ts">
    import { keys } from 'rambdax'
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
                <li>{word}</li>
            {/each}
        </ul>
    {/each}
</div>
