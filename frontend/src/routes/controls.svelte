<script lang="ts">
	export const ssr = false;

	import { onMount } from 'svelte';

	onMount(() => {
		const socket = io('http://localhost:3005', { auth: { password: 'test' } });
		socket.on('connect_error', (err) => console.log(`Unable to connect to server: ${err.message}`));
		document.addEventListener('click', (event) => {
			const target = event.target as HTMLButtonElement;
			if (target.nodeName === 'BUTTON') {
				const key = target.getAttribute('data-key');
				const modifier = JSON.parse(target.getAttribute('data-modifier')) || null;
				socket.emit('keypress', { key, modifier });
			}
		});
	});
</script>

<button data-key="=">Eng Brk +</button>
<button data-key="-">Eng Brk -</button>
<button data-key="h">Headlights</button>
<button data-key="q" data-modifier={`["command"]`}>Quit</button>
