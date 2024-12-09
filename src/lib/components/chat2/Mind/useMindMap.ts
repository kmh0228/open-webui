// 思维导图
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import {
	getAppMindTheme,
	MIND_EXPORT_TYPE,
	type TLayout,
	type TMindMapData,
	type TTheme
} from './const';
import MarkdownIt from 'markdown-it';
import { base64ToBlob } from './utils';
import MindMap from 'simple-mind-map';

function extractTopicContent(topic: string) {
	return topic.match(/"(.*)"/)?.[1] || topic;
}

class MindMapNode {
	topic: string;
	id?: string;
	level: number;
	children: MindMapNode[];

	constructor(topic: string, parent?: MindMapNode) {
		// this.id = Math.random().toString(36).slice(2)
		this.topic = extractTopicContent(topic || '');
		this.level = parent ? parent.level + 1 : 0;
		this.children = [];
		if (parent) {
			parent.children.push(this);
		}
	}
}

export function mermaidToMindData(code: string): TMindMapData | null {
	if (!/[\s\S]*(```mermaid)?\n?mindmap\n*/.test(code)) {
		return null;
	}

	const lines = code
		.replace(/[\s\S]*(```mermaid)?\n?mindmap\n*/g, '')
		.replace(/```[\s\S]/g, '')
		.split('\n')
		.filter((line) => line.trim());

	const root = new MindMapNode(lines[0]);
	const stack: { node: MindMapNode; level: number }[] = [{ node: root, level: 0 }];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		const level = line.lastIndexOf('  ') + 1; // Counting leading spaces to determine level
		const name = line.trim();

		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop();
		}

		const parent = stack[stack.length - 1]?.node;
		const node = new MindMapNode(name, parent);

		stack.push({ node: node, level: level });
	}

	return root;
}

function useMindMap(opt: {
	useMarkdownRender: boolean;
	defaultTheme: TTheme;
	defaultLayout: TLayout;
	defaultData: TMindMapData;
	$dom: () => HTMLElement | undefined;
	$cacheDom: () => HTMLElement | undefined;
	onlyView?: boolean;
	disabledOperation?: boolean;
	fitPadding?: number;
	breakAwayLoad?: boolean;
}) {
	const {
		useMarkdownRender,
		defaultTheme,
		defaultLayout,
		defaultData,
		$dom,
		$cacheDom,
		onlyView,
		disabledOperation,
		fitPadding,
		breakAwayLoad
	} = opt;

	// 使用 Svelte store 替代 Vue 的 ref
	const mindZoom: Writable<number> = writable(0);
	const isDisableDrag: Writable<boolean> = writable(disabledOperation);
	const needReset: Writable<boolean> = writable(false);

	// 思维导图渲染次数
	let renderPics = 0;
	let mindMap: any = null;
	let loading = false;
	let data: TMindMapData = defaultData || null;
	let theme = defaultTheme || getAppMindTheme();
	let layout: TLayout = defaultLayout || 'mindMap';

	// 获取要渲染的dom
	const doms = [$dom, $cacheDom].filter((n) => n);
	const domsLength = doms.length;
	const getRenderDom = () => {
		return doms[renderPics % domsLength]();
	};

	const changeDisableDrag = (value: boolean) => {
		isDisableDrag.set(value);
	};

	const changeMindZoom = (zoom: number) => {
		mindZoom.set(zoom);
		mindMap?.view.scaleInCenter(zoom);
		mindMap?.view.transform();
	};

	const changeMindTheme = (newTheme: TTheme) => {
		if (newTheme === 'ai' || theme === 'ai') {
			theme = newTheme;
			init(data);
		} else {
			theme = newTheme;
			mindMap?.setTheme(theme);
		}
	};

	const changeMindLayout = (newLayout: TLayout) => {
		layout = newLayout;
		init(data);
	};

	// 格式化数据
	const formatData = (data: TMindMapData) => {
		const format = (item: TMindMapData, level = 0) => {
			// 文本
			let text = item.topic;
			if (useMarkdownRender) {
				const md: InstanceType<typeof MarkdownIt> = new MarkdownIt({
					html: true,
					linkify: false,
					typographer: true
				});
				const div = document.createElement('div');
				div.innerHTML = md.render(text);
				text = div.innerText.trim();
			}
			// 间距
			if (theme === 'ai') {
				const paddingXS = [24, 16];
				const paddingX = paddingXS[level] || 10;
				const paddingYS = [12, 9];
				const paddingY = paddingYS[level] || 5;

				// 线条颜色
				const lineColor = level < 3 ? '#5A56CC' : '#C0C1F4';

				item.data = { text, paddingX, paddingY, lineColor };
			} else {
				item.data = { text };
			}

			// 四级及其以上不要背景
			if (level > 2 && theme === 'ai') {
				item.data.fillColor = 'transparent';
			}

			item.children?.forEach((child) => {
				format(child as TMindMapData, level + 1);
			});
		};
		format(data);
		// 设置背景色
		// let colorIndex = 0
		// data.children?.forEach((child) => {
		//   child.data!.fillColor = ['#F39C26', '#6A85ED', '#FC7C8E', '#6D69DC'][colorIndex++ % 4]
		//   child.data!.color = '#fff'
		// })
		return data;
	};

	const renderRes: { resolve: null | ((value: boolean) => void) } = { resolve: null };
	type TIntOption = { transformData?: number; isPrintscreen?: boolean; breakAwayLoad?: boolean };

	const createMind = async (mindData: TMindMapData, option: TIntOption = {}) => {
		if (!mindData) {
			return false;
		}

		data = mindData;
		const { transformData, breakAwayLoad: _breakAwayLoad } = option;
		const renderDom = getRenderDom();

		if (!renderDom) {
			return false;
		}

		renderDom.innerHTML = '';

		let renderInner = renderDom;
		if ((_breakAwayLoad ?? breakAwayLoad) && renderDom) {
			renderInner = document.createElement('div');
			const { offsetWidth, offsetHeight } = renderDom;
			Object.assign(renderInner.style, {
				width: offsetWidth + 'px',
				height: offsetHeight + 'px',
				position: 'absolute',
				top: 0,
				left: -offsetWidth - 5 + 'px'
			});
			document.body.append(renderInner);
		}

		mindMap = new MindMap({
			mousewheelAction: 'zoom',
			el: renderInner,
			data: formatData(data),
			theme,
			// themeConfig: { backgroundColor: props.background },
			// 此外formatData中还有特定样式配置,若是重复配置会覆盖themeConfig
			scaleRatio: 0.1,
			layout,
			readonly: onlyView,
			disableMouseWheelZoom: disabledOperation,
			isDisableDrag: false,
			beforeTextEdit: () => false,
			disabledClipboard: true,
			...(theme === 'ai'
				? {
						hoverRectColor: '#6D69DC',
						hoverRectPadding: 0
					}
				: {})
		} as any);

		// 修复滚动条影响缩放
		const _toPos = mindMap.toPos;
		mindMap.toPos = (...args: any) => {
			mindMap.getElRectInfo();
			return _toPos.call(mindMap, ...args);
		};

		// 滚轮放大得方法不支持限制。重写滚轮放大得方法
		//  放大
		mindMap.view.enlarge = (cx: number, cy: number, isTouchPad: boolean) => {
			const _this = mindMap.view;
			const scaleRatio = _this.mindMap.opt.scaleRatio / (isTouchPad ? 5 : 1);
			const scale = Math.min(_this.scale + scaleRatio, 4);
			_this.scaleInCenter(scale, cx, cy);
			_this.transform();
			_this.emitEvent('scale');
		};

		mindMap.on('scale', (scale: number) => {
			mindZoom.set(scale);
		});

		if (transformData) {
			mindMap.view.setTransformData(transformData);
		}

		let renderEnd = false;
		mindMap.on('node_tree_render_end', () => {
			if (!renderEnd) {
				if (!get(needReset) || !renderPics) {
					doms.forEach((dom, index) => {
						if (dom()) dom().style.zIndex = index === renderPics % domsLength ? '2' : '0';
					});
					renderPics++;
				}
				if ((_breakAwayLoad ?? breakAwayLoad) && renderInner) {
					setTimeout(() => {
						Object.assign(renderInner.style, {
							position: 'relative',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%'
						});
						renderDom?.append(renderInner);
					});
				}
				renderEnd = true;
			}
			renderRes.resolve?.(true);
			renderRes.resolve = null;
			if (!transformData) {
				mindMap.getElRectInfo();
				mindMap.view.fit(undefined, undefined, fitPadding);
			}
		});

		return new Promise((resolve: (value: boolean) => void) => {
			renderRes.resolve = resolve;
		});
	};

	// 更新思维导图数据 - 流式输出的时候用
	let nextRenderData: TMindMapData | undefined = undefined; // 准备执行得数据
	const init = (mindData: TMindMapData) => {
		if (loading) {
			nextRenderData = mindData;
			return;
		}
		loading = true;
		needReset.set(false);
		return createMind(mindData).then(() => {
			if (nextRenderData || get(needReset)) {
				loading = false;
				const nData = nextRenderData || data;
				nextRenderData = undefined;
				init(nData);
			} else {
				loading = false;
			}
		});
	};

	const updateData = (newData: TMindMapData | undefined) => {
		if (newData) init(newData);
	};

	// 获取截图
	const getImage = (): Promise<Blob> => {
		return mindMap.export('png', false).then((base64: string) => {
			return base64ToBlob(base64);
		});
	};

	// 导出事件
	const exportMind = (type: MIND_EXPORT_TYPE, title?: string) => {
		switch (type) {
			// 页面滚动后生成png位置错乱，原逻辑为页面滚动时频繁触发init。
			// 现修改 导出时触发一次init并在node_tree_render_end调用导出png
			case MIND_EXPORT_TYPE.png:
				createMind(data, {
					transformData: mindMap.view.getTransformData(),
					breakAwayLoad: false
				}).then(() => {
					mindMap.export('png', true, title);
				});
				break;
			case MIND_EXPORT_TYPE.json:
				mindMap.export('json', true, title);
				break;
			case MIND_EXPORT_TYPE.md:
				mindMap.export('md', true, title);
				break;
			case MIND_EXPORT_TYPE.xmind:
				mindMap.export('xmind', true, title);
				break;
			default:
				break;
		}
	};

	const getMindMap = () => {
		return mindMap;
	};

	// 清空激活
	const clearActiveNode = () => {
		mindMap.execCommand('CLEAR_ACTIVE_NODE');
	};

	return {
		mindZoom: { subscribe: mindZoom.subscribe },
		isDisableDrag: { subscribe: isDisableDrag.subscribe },
		needReset: { subscribe: needReset.subscribe },
		changeMindZoom,
		changeMindTheme,
		changeMindLayout,
		getMindMap,
		init,
		updateData,
		getImage,
		exportMind,
		changeDisableDrag,
		clearActiveNode
	};
}

export default useMindMap;
