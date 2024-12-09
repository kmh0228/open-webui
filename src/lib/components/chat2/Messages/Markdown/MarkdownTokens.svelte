<script lang="ts">
	import DOMPurify from 'dompurify';
	import { createEventDispatcher, onMount, getContext } from 'svelte';
	const i18n = getContext('i18n');

	import fileSaver from 'file-saver';
	const { saveAs } = fileSaver;

	import { marked, type Token } from 'marked';
	import { revertSanitizedResponseContent, unescapeHtml } from './utils';

	import { WEBUI_BASE_URL } from './constants';

	import CodeBlock from './Messages/CodeBlock.svelte';
	import MarkdownInlineTokens from './Messages/Markdown/MarkdownInlineTokens.svelte';
	import KatexRenderer from './KatexRenderer.svelte';
	import Collapsible from './common/Collapsible.svelte';
	import Tooltip from './common/Tooltip.svelte';
	import ArrowDownTray from './icons/ArrowDownTray.svelte';

	const dispatch = createEventDispatcher();

	export let id: string;
	export let tokens: Token[];
	export let top = true;

	export let save = false;
	export let onSourceClick: Function = () => {};

	const headerComponent = (depth: number) => {
		return 'h' + depth;
	};

	const exportTableToCSVHandler = (token, tokenIdx = 0) => {
		console.log('导出表格为CSV');

		// 创建一个数组用于存储映射后的单元格文本
		const rows = token.rows.map((row) =>
			row.map((cell) => cell.tokens.map((token) => token.text).join(''))
		);

		// 使用逗号(,)作为分隔符连接行，使用换行符(\n)连接多行
		const csvContent = rows.map((row) => row.join(',')).join('\n');

		// 记录行和CSV内容以确保一切正确
		console.log(rows);
		console.log(csvContent);

		// 为了处理Unicode字符，需要在数据前加上BOM标记
		const bom = '\uFEFF'; // UTF-8的BOM标记

		// 创建一个新的Blob对象，并在前面加上BOM以确保正确的Unicode编码
		const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=UTF-8' });

		// 使用FileSaver.js的saveAs函数保存生成的CSV文件
		saveAs(blob, `table-${id}-${tokenIdx}.csv`);
	};
</script>

<!-- {JSON.stringify(tokens)} -->
{#each tokens as token, tokenIdx (tokenIdx)}
	{#if token.type === 'hr'}
		<hr />
	{:else if token.type === 'heading'}
		<svelte:element this={headerComponent(token.depth)}>
			<MarkdownInlineTokens id={`${id}-${tokenIdx}-h`} tokens={token.tokens} {onSourceClick} />
		</svelte:element>
	{:else if token.type === 'code'}
		{#if token.raw.includes('```')}
			<CodeBlock
				id={`${id}-${tokenIdx}`}
				{token}
				lang={token?.lang ?? ''}
				code={revertSanitizedResponseContent(token?.text ?? '')}
				{save}
				on:code={(e) => {
					dispatch('code', e.detail);
				}}
				on:save={(e) => {
					dispatch('update', {
						raw: token.raw,
						oldContent: token.text,
						newContent: e.detail
					});
				}}
			/>
		{:else}
			{token.text}
		{/if}
	{:else if token.type === 'table'}
		<div class="relative w-full group">
			<div class="scrollbar-hidden relative overflow-x-auto max-w-full rounded-lg">
				<table
					class=" w-full text-sm text-left text-gray-500 dark:text-gray-400 max-w-full rounded-xl"
				>
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-850 dark:text-gray-400 border-none"
					>
						<tr class="">
							{#each token.header as header, headerIdx}
								<th
									scope="col"
									class="!px-3 !py-1.5 cursor-pointer select-none border border-gray-50 dark:border-gray-850"
									style={token.align[headerIdx] ? '' : `text-align: ${token.align[headerIdx]}`}
								>
									<div class="flex flex-col gap-1.5 text-left">
										<div class="flex-shrink-0 break-normal">
											<MarkdownInlineTokens
												id={`${id}-${tokenIdx}-header-${headerIdx}`}
												tokens={header.tokens}
												{onSourceClick}
											/>
										</div>
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each token.rows as row, rowIdx}
							<tr class="bg-white dark:bg-gray-900 dark:border-gray-850 text-xs">
								{#each row ?? [] as cell, cellIdx}
									<td
										class="!px-3 !py-1.5 text-gray-900 dark:text-white w-max border border-gray-50 dark:border-gray-850"
										style={token.align[cellIdx] ? '' : `text-align: ${token.align[cellIdx]}`}
									>
										<div class="flex flex-col break-normal">
											<MarkdownInlineTokens
												id={`${id}-${tokenIdx}-row-${rowIdx}-${cellIdx}`}
												tokens={cell.tokens}
												{onSourceClick}
											/>
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class=" absolute top-1 right-1.5 z-20 invisible group-hover:visible">
				<Tooltip content={$i18n.t('Export to CSV')}>
					<button
						class="p-1 rounded-lg bg-transparent transition"
						on:click={(e) => {
							e.stopPropagation();
							exportTableToCSVHandler(token, tokenIdx);
						}}
					>
						<ArrowDownTray className=" size-3.5" strokeWidth="1.5" />
					</button>
				</Tooltip>
			</div>
		</div>
	{:else if token.type === 'blockquote'}
		<blockquote>
			<svelte:self id={`${id}-${tokenIdx}`} tokens={token.tokens} />
		</blockquote>
	{:else if token.type === 'list'}
		{#if token.ordered}
			<ol start={token.start || 1}>
				{#each token.items as item, itemIdx}
					<li>
						<svelte:self
							id={`${id}-${tokenIdx}-${itemIdx}`}
							tokens={item.tokens}
							top={token.loose}
						/>
					</li>
				{/each}
			</ol>
		{:else}
			<ul>
				{#each token.items as item, itemIdx}
					<li>
						<svelte:self
							id={`${id}-${tokenIdx}-${itemIdx}`}
							tokens={item.tokens}
							top={token.loose}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	{:else if token.type === 'details'}
		<Collapsible title={token.summary} className="w-fit space-y-1">
			<div class=" mb-1.5" slot="content">
				<svelte:self id={`${id}-${tokenIdx}-d`} tokens={marked.lexer(token.text)} />
			</div>
		</Collapsible>
	{:else if token.type === 'html'}
		{@const html = DOMPurify.sanitize(token.text)}
		{#if html && html.includes('<video')}
			{@html html}
		{:else if token.text.includes(`<iframe src="${WEBUI_BASE_URL}/api/v1/files/`)}
			{@html `${token.text}`}
		{:else}
			{token.text}
		{/if}
	{:else if token.type === 'iframe'}
		<iframe
			src="{WEBUI_BASE_URL}/api/v1/files/{token.fileId}/content"
			title={token.fileId}
			width="100%"
			frameborder="0"
			onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';"
		></iframe>
	{:else if token.type === 'paragraph'}
		<p>
			<MarkdownInlineTokens
				id={`${id}-${tokenIdx}-p`}
				tokens={token.tokens ?? []}
				{onSourceClick}
			/>
		</p>
	{:else if token.type === 'text'}
		{#if top}
			<p>
				{#if token.tokens}
					<MarkdownInlineTokens id={`${id}-${tokenIdx}-t`} tokens={token.tokens} {onSourceClick} />
				{:else}
					{unescapeHtml(token.text)}
				{/if}
			</p>
		{:else if token.tokens}
			<MarkdownInlineTokens
				id={`${id}-${tokenIdx}-p`}
				tokens={token.tokens ?? []}
				{onSourceClick}
			/>
		{:else}
			{unescapeHtml(token.text)}
		{/if}
	{:else if token.type === 'inlineKatex'}
		{#if token.text}
			<KatexRenderer
				content={revertSanitizedResponseContent(token.text)}
				displayMode={token?.displayMode ?? false}
			/>
		{/if}
	{:else if token.type === 'blockKatex'}
		{#if token.text}
			<KatexRenderer
				content={revertSanitizedResponseContent(token.text)}
				displayMode={token?.displayMode ?? false}
			/>
		{/if}
	{:else if token.type === 'space'}
		<div class="my-2" />
	{:else}
		{console.log('Unknown token', token)}
	{/if}
{/each}
