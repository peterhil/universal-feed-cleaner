<script lang="ts">
    import svelteLogo from '../../assets/svelte.svg'
    import Counter from '../../lib/Counter.svelte'

    function openOptionsPage () {
        browser.runtime.openOptionsPage()
        return false
    }
</script>

<main>
    <div>
        <a href="https://wxt.dev" target="_blank" rel="noreferrer">
            <img src="/wxt.svg" class="logo" alt="WXT Logo" />
        </a>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
    </div>
    <h1>
        Universal<br>
        feed cleaner
    </h1>

    <div class="card">
        <button type="button" on:click={openOptionsPage}>
            Options
        </button>
        <Counter />
    </div>

    <p class="read-the-docs">
        Source code and instructions on
        <a href="https://github.com/peterhil/universal-feed-cleaner/">
            Github
        </a>
    </p>
</main>

<style>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #54bc4ae0);
    }
    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .read-the-docs {
        color: #888;
    }
</style>
