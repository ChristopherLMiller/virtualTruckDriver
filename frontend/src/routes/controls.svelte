<script lang="ts">
	export const ssr = false;

	import { onMount } from 'svelte';

	onMount(() => {
		// setup the connetion to the socket server
		const socket = io('http://localhost:3005', { auth: { password: 'test' } });
		socket.on('connect_error', (err) => console.log(`Unable to connect to server: ${err.message}`));

		// Event listener for 'press' buttons
		const pressButtons = document.querySelectorAll('button[data-type="press"]');
		pressButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const key = button.getAttribute('data-key');
				const modifier = JSON.parse(button.getAttribute('data-modifier')) || null;
				const type = button.getAttribute('data-type') || 'press';
				socket.emit('keypress', { key, modifier, type: 'press' });
			});
		});

		// add event listener for pointer events
		const toggleButtons = document.querySelectorAll('button[data-type="toggle"]');
		toggleButtons.forEach((button) => {
			button.addEventListener('pointerdown', () => {
				const key = button.getAttribute('data-key');
				socket.emit('keypress', { key, type: 'toggle', direction: 'down' });
			});
			button.addEventListener('pointerup', () => {
				const key = button.getAttribute('data-key');
				socket.emit('keypress', { key, type: 'toggle', direction: 'up' });
			});
		});
	});
</script>

<main>
	<div class="grid-container">
		<button data-key="=" data-type="press">Eng Brk +</button>
		<button data-key="-" data-type="press">Eng Brk -</button>
		<button data-key="l" data-type="press">Headlights</button>
		<button data-key="h" data-type="toggle" data-direction="down">Horn</button>
		<button data-key="p" data-type="toggle" data-direction="down">Horn</button>
		<button data-key="q" data-type="press" data-modifier={`["command"]`}>Quit</button>
	</div>
</main>

<style>
	:root {
		--button-dim: 150px;
		--hue: 206deg;
		--sat: 8%;
		--lum: 17%;
		--color-primary: hsl(var(--hue) var(--sat) var(--lum));
	}
	main {
		background: var(--color-primary);
		width: 100vw;
		height: 100vh;
		justify-content: center;
		align-items: center;
		padding: 30px;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, var(--button-dim));
		gap: 30px;
	}
	button {
		width: var(--button-dim);
		height: var(--button-dim);
		min-width: var(--button-dim);
		min-height: var(--button-dim);
		border-radius: 50%;
		background: var(--color-primary);
		border: 8px solid var(--color-primary);
		box-shadow: -10px -10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) + 13%) / 50%),
			10px 10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) - 20%) / 12%);
		outline: none;
		color: #ececec;
		text-transform: uppercase;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}
	button:active,
	button:focus {
		box-shadow: -10px -10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) + 13%) / 50%),
			10px 10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) - 20%) / 12%),
			-10px -10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) + 13%) / 50%) inset,
			10px 10px 15px hsl(var(--hue) var(--sat) calc(var(--lum) - 20%) / 12%) inset;
	}
</style>
