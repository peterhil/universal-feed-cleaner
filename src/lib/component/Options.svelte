<script lang="ts">
    import { keys } from 'rambdax'
    import { options } from '$lib/options'

    const rules = options.rules
    const sites = keys(rules)
</script>

<div>
    <h1>Options</h1>

    <h2>Keywords to hide</h2>

    {#each sites as site}
        <h3>{site === '*' ? 'Any website' : site}</h3>

        <ul>
            {#each rules[site] as word}
                <li>{word}</li>
            {/each}
        </ul>
    {/each}
</div>
