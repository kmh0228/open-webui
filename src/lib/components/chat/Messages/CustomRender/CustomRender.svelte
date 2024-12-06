<script lang="ts">
	import MindMap from '$lib/components/Mind/MindMap.svelte';
	import { chatStore } from '$lib/stores/chatStore';

	export let content = '';

	const sendMessage = () => {
		console.log('sendMessage');
		chatStore.submitPrompt?.('你好');
	};
</script>

<div>
	<div style="width:800px;height:600px;">
		<MindMap></MindMap>
	</div>
	<button on:click={sendMessage}>测试发送消息</button>
</div>

<style>
	div {
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
