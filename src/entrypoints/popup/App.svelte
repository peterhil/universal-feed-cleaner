<script lang="ts">
    function openOptionsPage () {
        browser.runtime.openOptionsPage()
        return false
    }
</script>

<main>
    <h1>
        Universal<br>
        feed cleaner
    </h1>

    <div class="card">
        <button type="button" on:click={openOptionsPage}>
            Options
        </button>
    </div>

    <p class="help">
        Source code and instructions on
        <a href="https://github.com/peterhil/universal-feed-cleaner/"
           target="_blank" rel="noreferrer">
            Github
        </a>
    </p>
</main>

<style>
    .help {
        color: #888;
    }
</style>
