// 主题
//  默认主题

export const theme1 = {
  // 节点内边距
  paddingX: 16,
  paddingY: 9,
  // 图片显示的最大宽度
  imgMaxWidth: 100,
  // 图片显示的最大高度
  imgMaxHeight: 100,
  // icon的大小
  iconSize: 20,
  // 连线的粗细
  lineWidth: 1.4,
  // 连线的颜色
  lineColor: '#C0C1F4',
  // 连线样式
  lineDasharray: 'none',
  // 连线风格
  lineStyle: 'straight', // 曲线（curve）【仅支持logicalStructure、mindMap、verticalTimeline三种结构】、直线（straight）、直连（direct）【仅支持logicalStructure、mindMap、organizationStructure、verticalTimeline四种结构】
  // 曲线连接时，根节点和其他节点的连接线样式保持统一，默认根节点为 ( 型，其他节点为 { 型，设为true后，都为 { 型。仅支持logicalStructure、mindMap两种结构
  rootLineKeepSameInCurve: true,
  // 曲线连接时，根节点和其他节点的连线起始位置保持统一，默认根节点的连线起始位置在节点中心，其他节点在节点右侧，如果该配置设为true，那么根节点的连线起始位置也会在节点右侧
  rootLineStartPositionKeepSameInCurve: false,
  // 直线连接(straight)时，连线的圆角大小，设置为0代表没有圆角，仅支持logicalStructure、mindMap、verticalTimeline三种结构
  lineRadius: 14,
  // 连线是否显示标记，目前只支持箭头
  showLineMarker: false,
  // 概要连线的粗细
  generalizationLineWidth: 1,
  // 概要连线的颜色
  generalizationLineColor: '#549688',
  // 概要曲线距节点的距离
  generalizationLineMargin: 0,
  // 概要节点距节点的距离
  generalizationNodeMargin: 20,
  // 关联线默认状态的粗细
  associativeLineWidth: 2,
  // 关联线默认状态的颜色
  associativeLineColor: 'rgb(51, 51, 51)',
  // 关联线激活状态的粗细
  associativeLineActiveWidth: 8,
  // 关联线激活状态的颜色
  associativeLineActiveColor: 'rgba(2, 167, 240, 1)',
  // 关联线文字颜色
  associativeLineTextColor: 'rgb(51, 51, 51)',
  // 关联线文字大小
  associativeLineTextFontSize: 14,
  // 关联线文字行高
  associativeLineTextLineHeight: 1.2,
  // 关联线文字字体
  associativeLineTextFontFamily: '微软雅黑, Microsoft YaHei',
  // 背景颜色
  backgroundColor: '#fafafa',
  // 背景图片
  backgroundImage: 'none',
  // 背景重复
  backgroundRepeat: 'no-repeat',
  // 设置背景图像的起始位置
  backgroundPosition: 'center center',
  // 设置背景图片大小
  backgroundSize: 'cover',
  // 节点使用只有底边横线的样式，仅支持logicalStructure、mindMap、catalogOrganization、organizationStructure四种结构
  nodeUseLineStyle: false,
  // 根节点样式
  root: {
    paddingX: 100,
    paddingY: 100,
    shape: 'rectangle',
    fillColor: '#5A56CC',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22 / 16,
    borderColor: 'transparent',
    borderWidth: 0,
    borderDasharray: 'none',
    borderRadius: 6,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    // 连线标记的位置，start（头部）、end（尾部），该配置在showLineMarker配置为true时生效
    lineMarkerDir: 'end'
  },
  // 二级节点样式
  second: {
    shape: 'rectangle',
    marginX: 48,
    marginY: 20,
    fillColor: '#DADBF7',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#202020',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20 / 14,
    borderColor: '#DADAFC',
    borderWidth: 0,
    borderDasharray: 'none',
    borderRadius: 6,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    lineMarkerDir: 'end'
  },
  // 三级及以下节点样式
  node: {
    shape: 'rectangle',
    marginX: 48,
    marginY: 20,
    fillColor: '#fff',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#202020',
    fontSize: 13,
    fontWeight: 'noraml',
    fontStyle: 'normal',
    lineHeight: 18 / 13,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 6,
    borderDasharray: 'none',
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    lineMarkerDir: 'end'
  },
  // 概要节点样式
  generalization: {
    shape: 'rectangle',
    marginX: 100,
    marginY: 40,
    fillColor: '#fff',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#565656',
    fontSize: 16,
    fontWeight: 'noraml',
    fontStyle: 'normal',
    lineHeight: 1.5,
    borderColor: '#549688',
    borderWidth: 1,
    borderDasharray: 'none',
    borderRadius: 5,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff'
  }
}

export const theme2 = {
  // 节点内边距
  paddingX: 16,
  paddingY: 9,
  // 图片显示的最大宽度
  imgMaxWidth: 100,
  // 图片显示的最大高度
  imgMaxHeight: 100,
  // icon的大小
  iconSize: 20,
  // 连线的粗细
  lineWidth: 2,
  // 连线的颜色
  lineColor: '#D9D8DD',
  // 连线样式
  lineDasharray: 'none',
  // 连线风格
  lineStyle: 'curve', // 曲线（curve）【仅支持logicalStructure、mindMap、verticalTimeline三种结构】、直线（straight）、直连（direct）【仅支持logicalStructure、mindMap、organizationStructure、verticalTimeline四种结构】
  // 曲线连接时，根节点和其他节点的连接线样式保持统一，默认根节点为 ( 型，其他节点为 { 型，设为true后，都为 { 型。仅支持logicalStructure、mindMap两种结构
  rootLineKeepSameInCurve: true,
  // 曲线连接时，根节点和其他节点的连线起始位置保持统一，默认根节点的连线起始位置在节点中心，其他节点在节点右侧，如果该配置设为true，那么根节点的连线起始位置也会在节点右侧
  rootLineStartPositionKeepSameInCurve: false,
  // 直线连接(straight)时，连线的圆角大小，设置为0代表没有圆角，仅支持logicalStructure、mindMap、verticalTimeline三种结构
  lineRadius: 5,
  // 连线是否显示标记，目前只支持箭头
  showLineMarker: false,
  // 概要连线的粗细
  generalizationLineWidth: 1,
  // 概要连线的颜色
  generalizationLineColor: '#549688',
  // 概要曲线距节点的距离
  generalizationLineMargin: 0,
  // 概要节点距节点的距离
  generalizationNodeMargin: 20,
  // 关联线默认状态的粗细
  associativeLineWidth: 2,
  // 关联线默认状态的颜色
  associativeLineColor: 'rgb(51, 51, 51)',
  // 关联线激活状态的粗细
  associativeLineActiveWidth: 8,
  // 关联线激活状态的颜色
  associativeLineActiveColor: 'rgba(2, 167, 240, 1)',
  // 关联线文字颜色
  associativeLineTextColor: 'rgb(51, 51, 51)',
  // 关联线文字大小
  associativeLineTextFontSize: 14,
  // 关联线文字行高
  associativeLineTextLineHeight: 1.2,
  // 关联线文字字体
  associativeLineTextFontFamily: '微软雅黑, Microsoft YaHei',
  // 背景颜色
  backgroundColor: '#fafafa',
  // 背景图片
  backgroundImage: 'none',
  // 背景重复
  backgroundRepeat: 'no-repeat',
  // 设置背景图像的起始位置
  backgroundPosition: 'center center',
  // 设置背景图片大小
  backgroundSize: 'cover',
  // 节点使用只有底边横线的样式，仅支持logicalStructure、mindMap、catalogOrganization、organizationStructure四种结构
  nodeUseLineStyle: false,
  // 根节点样式
  root: {
    shape: 'rectangle',
    fillColor: '#5C59A3',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 18,
    borderColor: 'transparent',
    borderWidth: 0,
    borderDasharray: 'none',
    borderRadius: 8,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    // 连线标记的位置，start（头部）、end（尾部），该配置在showLineMarker配置为true时生效
    lineMarkerDir: 'end'
  },
  // 二级节点样式
  second: {
    shape: 'rectangle',
    marginX: 45,
    marginY: 50,
    // fillColor: '#6A85ED',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'noraml',
    fontStyle: 'normal',
    lineHeight: 1.5,
    borderColor: '#549688',
    borderWidth: 0,
    borderDasharray: 'none',
    borderRadius: 6,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    lineMarkerDir: 'end'
  },
  // 三级及以下节点样式
  node: {
    shape: 'rectangle',
    marginX: 45,
    marginY: 13,
    fillColor: '#fff',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#202020',
    fontSize: 14,
    fontWeight: 'noraml',
    fontStyle: 'normal',
    lineHeight: 1.5,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 6,
    borderDasharray: 'none',
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff',
    lineMarkerDir: 'end'
  },
  // 概要节点样式
  generalization: {
    shape: 'rectangle',
    marginX: 100,
    marginY: 40,
    fillColor: '#fff',
    fontFamily: '微软雅黑, Microsoft YaHei',
    color: '#565656',
    fontSize: 16,
    fontWeight: 'noraml',
    fontStyle: 'normal',
    lineHeight: 1.5,
    borderColor: '#549688',
    borderWidth: 1,
    borderDasharray: 'none',
    borderRadius: 5,
    textDecoration: 'none',
    gradientStyle: false,
    startColor: '#549688',
    endColor: '#fff'
  }
}
// 支持激活样式的属性
// 简单来说，会改变节点大小的都不支持在激活时设置，为了性能考虑，节点切换激活态时不会重新计算节点大小
export const supportActiveStyle = [
  'fillColor',
  'borderColor',
  'borderWidth',
  'borderDasharray',
  'borderRadius'
]

// 检测主题配置是否是节点大小无关的
const nodeSizeIndependenceList = [
  'lineWidth',
  'lineColor',
  'lineDasharray',
  'lineStyle',
  'generalizationLineWidth',
  'generalizationLineColor',
  'associativeLineWidth',
  'associativeLineColor',
  'associativeLineActiveWidth',
  'associativeLineActiveColor',
  'associativeLineTextColor',
  'associativeLineTextFontSize',
  'associativeLineTextLineHeight',
  'associativeLineTextFontFamily',
  'backgroundColor',
  'backgroundImage',
  'backgroundRepeat',
  'backgroundPosition',
  'backgroundSize',
  'rootLineKeepSameInCurve',
  'rootLineStartPositionKeepSameInCurve',
  'showLineMarker',
  'gradientStyle',
  'lineRadius',
  'startColor',
  'endColor'
]
export const checkIsNodeSizeIndependenceConfig = (config: { [key: string]: any }) => {
  const keys = Object.keys(config)
  for (let i = 0; i < keys.length; i++) {
    if (
      !nodeSizeIndependenceList.find((item) => {
        return item === keys[i]
      })
    ) {
      return false
    }
  }
  return true
}

export const lineStyleProps = ['lineColor', 'lineDasharray', 'lineWidth', 'lineMarkerDir']
