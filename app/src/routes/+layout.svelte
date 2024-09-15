<script lang='ts'>
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from './Header.svelte';

	function adjustMainHeight(): void {
		const navbar = document.querySelector('nav') as HTMLElement;
		const mainContent = document.getElementById('main-content') as HTMLElement;
		if (navbar && mainContent) {
			const navbarHeight = navbar.offsetHeight;
			mainContent.style.height = `calc(100vh - ${navbarHeight}px)`;
		}
	}

	onMount(() => {
		adjustMainHeight();
		window.addEventListener('resize', adjustMainHeight);

		// cleanup event listener on unmount.
		return () => {
			window.removeEventListener('resize', adjustMainHeight);
		}
	});

</script>

<div class="app">
	<Header></Header>

	<main id="main-content" class="flex justify-center items-center max-w-7xl mx-auto w-full h-screen">
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
