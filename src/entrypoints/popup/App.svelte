<script>
    function openOptionsPage () {
        browser.runtime.openOptionsPage()
        return false
    }
</script>

<main>
    <h1>Obey – hide content!</h1>

    <div class="card">
        <button type="button" on:click={openOptionsPage}>
            Options
        </button>
    </div>

    <p class="help">
        Source code and instructions on
        <a href="https://github.com/peterhil/obey/"
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
