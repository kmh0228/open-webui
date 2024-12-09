<script lang="ts">
	import { onMount } from 'svelte';

	export let url: string;
	export let messageData: any;

	let iframeElement: HTMLIFrameElement;

	onMount(() => {
		if (iframeElement) {
			iframeElement.onload = () => {
				setTimeout(() => {
					iframeElement.contentWindow?.postMessage(messageData || { getBodyColor: '#ccc' }, url);
				}, 1);
			};
		}
	});
</script>

<iframe bind:this={iframeElement} src={url} style="width: 100%; height: 100%; border: none;"
></iframe>
