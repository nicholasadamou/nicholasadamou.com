<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import ScrollToTopButton from '$components/ScrollToTopButton.svelte';

	import Header from '$sections/Header.svelte';
	import Navigation from '$sections/Navigation.svelte';
	import Sidebar from '$sections/Sidebar.svelte';
	import Hero from '$sections/Hero.svelte';
	import Websites from '$sections/Websites.svelte';
	import Projects from '$sections/Projects.svelte';
	import Footer from '$sections/Footer.svelte';

	let isSidebarOpen = writable(false);

	setContext('isSidebarOpen', isSidebarOpen);
</script>

<style lang="scss">
	main {
		position: relative;

		margin: 5rem auto 2rem;

		width: 960px;

		text-align: left;

		@media screen and (max-width: 820px) {
			margin-left: 2rem;

			width: 100%;
		}

		@media screen and (max-width: 430px) {
			margin: 2rem 0 0;
		}
	}

	#sponsor-button {
		padding-top: 10px;

		@media screen and (max-width: 430px) {
			padding-top: 0;
		}
	}
</style>

<main>
	<Header />
	<Navigation />
	<Hero />
	<Websites />
	<Projects />
</main>

<Footer />

<Sidebar />
<ScrollToTopButton />
