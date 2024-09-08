<script>
    import '../app.css';
    import Header from './components/Header.svelte';
</script>

<div class="app">
    <Header />

    <main>
        <slot />
    </main>

    <footer>
        <p>Powered by FlightEye</p>
    </footer>
</div>