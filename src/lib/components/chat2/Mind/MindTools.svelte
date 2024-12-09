<script lang="ts">
	// import { NSelect } from 'naive-ui';
	import {
		EToolTypes,
		layout_select_content,
		theme_select_content,
		type TLayout,
		type TTheme,
		zoom_select_content
	} from './const';

	// Props
	export let zoom: number;
	export let themeDefault: TTheme | undefined = undefined;
	export let layoutDefault: TLayout | undefined = undefined;
	export let tools: EToolTypes[] | undefined = undefined;
	export let isDisableDrag: boolean | undefined = undefined;
	export let isInRead: boolean | undefined = undefined;
	export let maxZoom: number | undefined = undefined;

	// State
	let zoomStr = '70%';
	let themeStr = themeDefault;
	let layoutStr = layoutDefault;
	let oldTheme = themeStr;

	// Methods
	function emitZoomChange(val: number) {
		if (val !== zoom) {
			dispatch('changeZoom', val);
		}
	}

	function plusZoom() {
		emitZoomChange(Math.min(zoom + 0.1, maxZoom || 4));
	}

	function minuteZoom() {
		emitZoomChange(Math.max(zoom - 0.1, 0.1));
	}

	function changeDisableDrag() {
		dispatch('changeDisableDrag', !isDisableDrag);
	}

	function handleFull() {
		dispatch('handleFull');
	}

	function zoomSelectChange(event: CustomEvent) {
		const value = event.detail;
		emitZoomChange(parseInt(value) / 100);
	}

	function themeSelectChange(event: CustomEvent) {
		const theme = event.detail;
		if (oldTheme !== theme) {
			dispatch('changeTheme', theme);
		}
		oldTheme = theme;
	}

	function layoutSelectChange(event: CustomEvent) {
		dispatch('changeLayout', event.detail);
	}

	// Helper function to dispatch events
	function dispatch(name: string, detail?: any) {
		const event = new CustomEvent(name, { detail });
		document.dispatchEvent(event);
	}

	// Reactive statements (replacing Vue watchers)
	$: zoomStr = Math.round(zoom * 100) + '%';
</script>

<div class="js_mind_tools">
	{#if !tools || tools.includes(EToolTypes.theme)}
		<div class="tools_item change_btn">
			<span class="label">主题：</span>
			<!-- <NSelect
				bind:value={themeStr}
				class="select"
				options={theme_select_content}
				style="width: 80px"
				on:update={themeSelectChange}
			>
				<div slot="arrow" class="select_arrow">
					<i class="iconfont icon-xiala2" />
				</div>
			</NSelect> -->
		</div>
		<div class="split" />
	{/if}

	{#if !tools || tools.includes(EToolTypes.layout)}
		<div class="tools_item change_btn">
			<span class="label">结构：</span>
			<!-- <NSelect
				bind:value={layoutStr}
				class="select"
				options={layout_select_content}
				style="width: 114px"
				on:update={layoutSelectChange}
			>
				<div slot="arrow" class="select_arrow">
					<i class="iconfont icon-xiala2" />
				</div>
			</NSelect> -->
		</div>
		<div class="split" />
	{/if}

	{#if tools && tools.includes(EToolTypes.full)}
		<div class="tools_item change_btn">
			<div class="icon_box">
				<i class="iconfont icon-ping-da1" on:click={handleFull} />
			</div>
		</div>
	{/if}

	{#if tools && tools.includes(EToolTypes.drag)}
		<div class="tools_item change_btn">
			<div class="icon_box" class:active={!isDisableDrag}>
				<i class="iconfont icon-shou" on:click={changeDisableDrag} />
			</div>
		</div>
	{/if}

	{#if !tools || tools.includes(EToolTypes.zoom)}
		<div class="tools_item change_btn">
			<div class="icon_box" class:disabled={zoom <= 0.1}>
				<i class="iconfont icon-suoxiao" on:click={minuteZoom} />
			</div>
			<!-- <NSelect
				bind:value={zoomStr}
				class="select"
				options={zoom_select_content}
				on:update={zoomSelectChange}
			>
				<div slot="arrow" class="select_arrow">
					<i class="iconfont icon-xiala2" />
				</div>
			</NSelect> -->
			<div class="icon_box" class:disabled={zoom >= (maxZoom || 4)}>
				<i class="iconfont icon-fangda3" on:click={plusZoom} />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './MindTools.scss';

	:global(.js_mind_zoom_select_item) {
		padding: 0 0 0 7px !important;
		font-size: 12px !important;
	}

	:global(.js_mind_zoom_select_item .lb-base-icon.lb-base-select-option__check) {
		font-size: 12px;
	}
</style>
