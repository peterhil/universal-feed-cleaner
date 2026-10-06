<script>
    import { keys } from 'rambdax'

    import OptionsKeyword from '$lib/component/OptionsKeyword.svelte'
    import { options } from '$lib/options'
    // import { domains } from '$lib/store/domains'

    const rules = options.rules
    const domains = keys(rules)
</script>

<div>
    <h1>Obey options</h1>
    <h2>Keywords to hide</h2>

    {#each domains as domain}
        <section class="domain">
            <h3>{domain === '*' ? 'All domains' : domain}</h3>

            <ul>
                {#each rules[domain] as word}
                    <OptionsKeyword {word} {domain} />
                {/each}
            </ul>

            <div class="input-group">
                <input type="text" placeholder="Keyword" />
                <button type="button">Add</button>
            </div>
        </section>
    {/each}
</div>
