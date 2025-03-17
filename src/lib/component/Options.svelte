<script lang="ts">
    import { options } from '$lib/options'

    let keywords: string[] = [
        'Alpha',
        'Beta'
    ]
</script>

<div>
    <h1>Options</h1>

    <h2>Keywords</h2>

    <textarea
        placeholder="Add keywords, one per line"
        rows="12"
        bind:value={keywords}
        >
    </textarea>
</div>
