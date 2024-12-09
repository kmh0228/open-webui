import html2Canvas from 'html2canvas';
import dom2image from 'dom-to-image';
// import { isSafari } from './utils';
const isSafari = () => true;
import XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 下载图片
export const downloadImage = (dataUrl: string, type: string, fileName?: string) => {
	const a = document.createElement('a');
	a.href = dataUrl;
	a.download = `${fileName || Date.now()}.${type}`;
	a.click();
};

/**
 * html转图片
 */
export const htmlToImg = async ({
	element,
	type = 'png',
	fileName,
	scale = 1,
	width,
	backgroundColor
}: {
	element: HTMLElement;
	type?: 'png' | 'jpg';
	fileName?: string;
	scale?: number;
	width?: number;
	backgroundColor?: string;
}) => {
	if (isSafari()) {
		try {
			const htmlCanvas = await html2Canvas(element, {
				useCORS: true, // 【重要】开启跨域配置
				scale: scale,
				allowTaint: true, // 允许跨域图片
				...(backgroundColor ? { backgroundColor } : {})
			});

			const dataUrl = htmlCanvas.toDataURL(`image/${type}`, 1.0);
			downloadImage(dataUrl, type, fileName);
			return true;
		} catch (error) {
			return false;
		}
	} else {
		try {
			width = width || element.offsetWidth;
			const height = element.offsetHeight;

			const exportFn = type === 'png' ? dom2image.toPng : dom2image.toJpeg;

			const dataUrl = await exportFn(element, {
				height: height * scale,
				width: width * scale,
				style: {
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
					width: `${width}px`,
					height: `${height}px`
				},
				...(backgroundColor ? { bgcolor: backgroundColor } : {})
			});
			downloadImage(dataUrl, type, fileName);
			return true;
		} catch (error) {
			return false;
		}
	}
};

/**
 * html转图片-抛出图片地址
 */
export const htmlToImg2 = async ({
	element,
	type = 'png',
	scale = 1,
	width,
	backgroundColor
}: {
	element: HTMLElement;
	type?: 'png' | 'jpg';
	scale?: number;
	width?: number;
	backgroundColor?: string;
}) => {
	if (isSafari()) {
		try {
			const htmlCanvas = await html2Canvas(element, {
				useCORS: true, // 【重要】开启跨域配置
				scale: scale,
				allowTaint: true, // 允许跨域图片
				...(backgroundColor ? { backgroundColor } : {})
			});

			const dataUrl = htmlCanvas.toDataURL(`image/${type}`, 1.0);

			return dataUrl;
		} catch (error) {
			return false;
		}
	} else {
		try {
			width = width || element.offsetWidth;
			const height = element.offsetHeight;

			const exportFn = type === 'png' ? dom2image.toPng : dom2image.toJpeg;

			const dataUrl = await exportFn(element, {
				height: height * scale,
				width: width * scale,
				style: {
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
					width: `${width}px`,
					height: `${height}px`
				},
				...(backgroundColor ? { bgcolor: backgroundColor } : {})
			});

			return dataUrl;
		} catch (error) {
			return false;
		}
	}
};

export const htmlToBlob = async (element: HTMLElement) => {
	return new Promise<Blob>((resolve, reject) => {
		if (isSafari()) {
			html2Canvas(element, {
				useCORS: true, // 【重要】开启跨域配置
				// scale: scale,
				allowTaint: true // 允许跨域图片
			})
				.then((canvas) => {
					canvas.toBlob(async (blob) => {
						if (!blob) {
							reject();
							return;
						}

						resolve(blob);
					});
				})
				.catch(reject);
		} else {
			const width = element.offsetWidth;
			const height = element.offsetHeight;

			dom2image
				.toBlob(element, {
					height,
					width,
					style: {
						transform: `scale(${1})`,
						transformOrigin: 'top left',
						width: `${width}px`,
						height: `${height}px`
					}
				})
				.then((blob) => {
					if (!blob) {
						reject();
						return;
					}
					resolve(blob);
				})
				.catch(reject);
		}
	});
};

function getCellWidth(value: string) {
	if (!value) {
		return 10;
	} else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
		// 中文的长度
		const chineseLength = value.match(/[\u4e00-\u9fa5]/g)?.length || 0;
		// 其他不是中文的长度
		const otherLength = value.length - chineseLength;
		return chineseLength * 2.3 + otherLength * 1.1;
	} else {
		return value.toString().length * 1.1;
	}
}

/**
 * 表格dom导出excel
 * @param tableEle
 * @param name
 */
export const downloadTableAsExcel = async (
	tableEle: HTMLElement,
	name?: string
): Promise<boolean> => {
	const fileName = name || String(Date.now());
	const workerSheet = XLSX.utils.table_to_sheet(tableEle, { raw: true });
	const workBook = XLSX.utils.book_new();

	// 获取每一列的最大宽度
	const ws = XLSX.utils.sheet_to_json(workerSheet);
	const wsCols: Array<{ wch: number }> = [];
	// 默认有表头一行的
	const wxRows: Array<{ hpx: number }> = [{ hpx: 20 }];
	for (const [_index, colData] of ws.entries()) {
		Object.values(colData as unknown as object).forEach((item: string, index: number) => {
			const colWidth = getCellWidth(item) as number;
			wsCols[index] = { wch: Math.max(colWidth, wsCols[index]?.wch || 20) };
		});

		wxRows[_index + 1] = { hpx: 20 };
	}

	// workbook.SheetNames[0]获取到到是文件里的到第一个表格
	workerSheet['!cols'] = wsCols;
	workerSheet['!rows'] = wxRows;
	// 设置竖直居中
	for (const key in workerSheet) {
		if (key.indexOf('!') !== 0) {
			workerSheet[key]['s'] = {
				alignment: {
					//设置标题水平竖直方向居中
					vertical: 'center'
				}
			};
		}
	}

	XLSX.utils.book_append_sheet(workBook, workerSheet, fileName);

	try {
		XLSX.writeFile(workBook, fileName + '.xlsx');
		return true;
	} catch (e) {
		console.log(e, workBook);
		return false;
	}
};

export const base64ToBlob = (base64: string, mimeType = 'image/png') => {
	const byteCharacters = window.atob(base64.split(',').at(-1) || '');
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);
		const byteNumbers = new Array(slice.length);

		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	return new Blob(byteArrays, { type: mimeType });
};

/* 给base64图片 添加背景色 */
export const base64AddBackground = (base64: string, color = '#fff'): Promise<string> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = base64;
		img.onload = function () {
			// 创建一个Canvas元素
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			// 获取Canvas的2D渲染上下文
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return;
			}
			// 绘制白色背景
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 绘制原始图片
			ctx.drawImage(img, 0, 0);

			// 将Canvas转换回base64
			const newBase64 = canvas.toDataURL('image/png');

			// 调用回调函数并传递新的base64字符串
			resolve(newBase64);
		};
	});
};

export const base64ToFile = (base64: string, fileName = '公式图片', mimeType = 'image/png') => {
	const byteCharacters = window.atob(base64.split(',').at(-1) || '');
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);
		const byteNumbers = new Array(slice.length);

		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	return new File(byteArrays, fileName, { type: mimeType });
};

// svg转换为png
export function svgToPng(svgElement: SVGAElement, fileName?: string) {
	// 获取SVG元素的XML字符串
	const svgData = new XMLSerializer().serializeToString(svgElement);

	// 创建一个canvas元素
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	// 设置canvas的大小与SVG图像一致
	const svgSize = svgElement.getBoundingClientRect();
	canvas.width = svgSize.width;
	canvas.height = svgSize.height;

	// 创建一个Image对象
	const img = new Image();
	img.onload = function () {
		// 将SVG图像绘制到canvas上
		ctx?.drawImage(img, 0, 0);

		// 将canvas转换为PNG数据URL
		const pngData = canvas.toDataURL('image/png');

		downloadImage(pngData, 'png', fileName);
	};

	// 将SVG数据转换为Data URL并赋值给Image对象的src属性
	img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

export const downloadPDF = async (
	pdfDom: HTMLElement,
	fileName: string
): Promise<void | boolean> => {
	pdfDom.style.padding = '0 10px !important';
	const A4Width = 595.28;
	const A4Height = 841.89;
	const canvas = await html2Canvas(pdfDom, {
		scale: 2,
		useCORS: true,
		backgroundColor: '#f8f8f8'
	});

	const imgWidth = A4Width;
	const imgHeight = (A4Width / canvas.width) * canvas.height;
	const pageData = canvas.toDataURL('image/jpeg', 1.0);
	const PDF = new jsPDF('p', 'pt', [imgWidth, Math.max(imgHeight, A4Height)]);
	PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);

	PDF.save(fileName || Date.now().toString() + '.pdf');
	return true;
};

export function downloadFiles(
	files: Array<{
		url: string;
		fileName?: string;
	}>
): Promise<void> {
	return new Promise((resolve, reject) => {
		const zip = new JSZip();
		const promises = files.map((file) => {
			return fetch(file.url)
				.then((response) => response.blob())
				.then((blob) => {
					const flieName = file.fileName || file.url.split('?')[0].split('/').pop();
					return zip.file(flieName as string, blob, { compression: 'DEFLATE' });
				});
		});
		Promise.all(promises)
			.then(() => {
				zip.generateAsync({ type: 'blob' }).then((blob) => {
					saveAs(blob, 'files.zip');
				});
			})
			.then(resolve)
			.catch(reject);
	});
}
export function cloneNodeIgnoringClass(
	node: Node | HTMLElement,
	classNameToIgnore: string
): Node | HTMLElement | undefined {
	function cloneRecursively(originalNode: Node | HTMLElement): Node | HTMLElement | undefined {
		const clonedNode = originalNode.cloneNode(false) as HTMLElement;
		const childenList = Array.from(originalNode.childNodes || []);

		if (clonedNode?.classList?.contains(classNameToIgnore)) {
			return;
		}

		if (childenList?.length) {
			childenList.forEach((childNode) => {
				const cloneEle = cloneRecursively(childNode);

				cloneEle && clonedNode.appendChild(cloneEle);
			});
		}

		return clonedNode;
	}

	return cloneRecursively(node);
}
