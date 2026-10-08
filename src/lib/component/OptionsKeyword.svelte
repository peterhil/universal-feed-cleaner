<script>
    import { debug } from '~/lib/debug'

    let { domain, word } = $props()

    function remove (word, domain) {
        debug('Remove:', {word, domain})
    }
</script>

<li>
    {word}
    <span class="remove" onclick={() => remove(word, domain)}>&times;</span>
</li>
