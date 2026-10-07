<script>
    let { domain, word } = $props()

    function remove (word, domain) {
        console.log('[OBEY] Remove:', {word, domain})
    }
</script>

<li>
    {word}
    <span class="remove" onclick={() => remove(word, domain)}>&times;</span>
</li>
