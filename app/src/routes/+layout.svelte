<script>
	import '../app.css';
	import Header from './components/Header.svelte';
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot></slot>
	</main>

	<footer>
	</footer>
</div>
