<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot></slot>
	</main>

	<footer>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
	}
</style>
