<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import MindMap from 'simple-mind-map';
	import Export from 'simple-mind-map/src/plugins/Export.js';
	import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js';
	import {
		EToolTypes,
		getAppMindTheme,
		type TMindMapData,
		type TMindOption,
		type TLayout
	} from './const';
	import { theme1 } from './mindMapTheme';
	import MindTools from './MindTools.svelte';
	import useMindMap from './useMindMap';

	MindMap.usePlugin(Export);
	MindMap.usePlugin(ExportXMind);
	MindMap.defineTheme('ai', theme1);

	// Props
	export let layoutType: TLayout | undefined = undefined;
	export let option: TMindOption | undefined = undefined;
	export let data: TMindMapData | undefined = {
		topic: '红楼梦人物关系',
		children: [
			{
				topic: '贾府',
				children: [
					{
						topic: '贾母',
						children: [
							{
								topic: '贾赦',
								children: [
									{
										topic: '贾链',
										children: [{ topic: '王熙凤', children: [{ topic: '平儿' }] }]
									},
									{ topic: '贾迎春' }
								]
							},
							{ topic: '贾政', children: [{ topic: '王夫人' }] }
						]
					}
				]
			}
		]
	};
	export let onlyView: boolean | undefined = undefined;
	export let useMarkdownRender: boolean | undefined = undefined;
	export let showTools: boolean = true;
	export let background: string = 'rgb(247, 247, 248)';
	export let disabledOperation: boolean = false;
	export let scrollElements: HTMLElement[] = [];
	export let theme: string | undefined = undefined;
	export let isInRead: boolean | undefined = undefined;
	export let fitPadding: number | undefined = undefined;
	export let breakAwayLoad: boolean = true;
	export let disabledKeyBoardEvent: boolean = true;
	export let tools: EToolTypes[] | undefined = undefined;

	// DOM refs
	let el_mindMap: HTMLElement;
	let el_mindMapCache: HTMLElement;

	// State
	const defaultTheme = theme || getAppMindTheme();
	let defaultLayout: TLayout = layoutType || 'mindMap';

	// Events
	function dispatch(name: string, detail?: any) {
		if (!el_mindMap) return;
		const event = new CustomEvent(name, { detail });
		el_mindMap.dispatchEvent(event);
	}

	const mindMapHook = useMindMap({
		useMarkdownRender,
		defaultTheme,
		defaultLayout,
		defaultData: (data || option?.data) as TMindMapData,
		$dom: () => el_mindMap,
		$cacheDom: () => el_mindMapCache,
		onlyView,
		disabledOperation,
		fitPadding,
		breakAwayLoad: disabledOperation && breakAwayLoad
	});

	// ... rest of the logic remains similar but adapted to Svelte syntax ...

	// 键盘事件
	const keyDownEvent = (e: KeyboardEvent) => {
		if (e.ctrlKey && e.key === 'c') {
			mindMapHook.copyActiveNodeText();
		}
		if (props.disabledOperation || props.disabledKeyBoardEvent) {
			e.stopPropagation();
		}
	};

	onMount(async () => {
		await tick();
		setTimeout(() => {
			mindMapHook.init(data || (option?.data as TMindMapData));
		}, 1);

		scrollElements?.forEach((ele) => {
			ele?.addEventListener('scroll', viewScroll);
		});

		document.addEventListener('keydown', keyDownEvent);
		dispatch('update:layoutType', defaultLayout);
	});

	onDestroy(() => {
		scrollElements?.forEach((ele) => {
			ele?.removeEventListener('scroll', viewScroll);
		});
		document.removeEventListener('keydown', keyDownEvent);
	});

	// Reactive statements (replacing Vue watchers)
	$: if (data || option) {
		mindMapHook.updateData(data || option?.data);
	}

	$: if (defaultLayout) {
		dispatch('update:layoutType', defaultLayout);
	}
</script>

<!-- <div class="mind_map_container" use:clickOutside={() => mindMapHook.clearActiveNode()}> -->
<div class="mind_map_container">
	<div class="mind_map_view">
		<div bind:this={el_mindMapCache} class="mind_map_view_cache" />
		<div bind:this={el_mindMap} class="mind_map_view_show" />
	</div>

	{#if disabledOperation || mindMapHook.isDisableDrag}
		<div class="disable_mask" />
	{/if}

	{#if showTools || isInRead}
		<MindTools
			zoom={mindMapHook.mindZoom}
			themeDefault={defaultTheme}
			layoutDefault={defaultLayout}
			{tools}
			isDisableDrag={mindMapHook.isDisableDrag}
			on:changeZoom={(e) => mindMapHook.changeMindZoom(e.detail)}
			on:changeTheme={(e) => mindMapHook.changeMindTheme(e.detail)}
			on:changeLayout={(e) => mindMapHook.changeMindLayout(e.detail)}
			on:changeDisableDrag={(e) => mindMapHook.changeDisableDrag(e.detail)}
			on:handleFull={() => dispatch('handleFull')}
		/>
	{/if}
</div>

<style lang="scss">
	.mind_map_container {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 0;
		border-radius: 8px;
		overflow: hidden;
	}

	.mind_map_view {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.mind_map_view_cache,
	.mind_map_view_show {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	/* Global styles need to be moved to a separate global CSS file */
	:global(.disable_mask) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9;
	}

	:global(.topic_content) {
		font-size: 13px;
		border-radius: 6px;
		line-height: 18px;
		padding: 5px 10px;
		max-width: 380px;
	}

	:global(.topic_content li) {
		list-style: inside;
	}

	:global(.topic_content_lv0) {
		font-size: 14px;
		color: #fff;
		padding: 12px 20px;
		line-height: 20px;
		border-radius: 8px;
	}

	:global(.topic_content_lv1) {
		font-size: 13px;
		color: #fff;
		padding: 9px 16px;
		line-height: 18px;
		border-radius: 6px;
	}
</style>
