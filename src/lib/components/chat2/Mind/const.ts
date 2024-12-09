// 导出类型
export enum MIND_EXPORT_TYPE {
  png,
  json,
  md,
  xmind
}

// jsmind节点信息 类型
export interface TMindData {
  id: string
  topic: string
  direction?: 'left' | 'right'
  children?: TMindData[]
  'background-color'?: string
  'leading-line-color'?: string
  'foreground-color'?: string
  height?: number
  'font-size'?: number
  // 额外加的
  text?: string
  content?: string
  index?: number
  level?: number
}

// mindmap节点数据
export interface TMindMapData extends TMindData {
  data?: {
    text?: string
    fillColor?: string
    color?: string
    paddingX?: number
    paddingY?: number
    lineColor?: string
  }
  children?: TMindMapData[]
}

// mind参数类型
export type TMindOption = {
  meta: {
    name?: string
    author?: string
    version?: string
  }
  format?: string
  data: TMindData
}

// 测试数据
export const testData: TMindData = {
  id: 'root',
  topic: 'ai',
  children: []
}

// 工具栏类型
export enum EToolTypes {
  theme = 'theme',
  zoom = 'zoom',
  layout = 'layout',
  drag = 'drag',
  full = 'full'
}

// 层级选择的数据
export const zoom_select_content = [
  { label: '400%', value: '400%' },
  { label: '200%', value: '200%' },
  { label: '150%', value: '150%' },
  { label: '100%', value: '100%' },
  { label: '80%', value: '80%' },
  { label: '60%', value: '60%' },
  { label: '40%', value: '40%' },
  { label: '20%', value: '20%' }
].map((n) => ({ ...n, class: 'js_mind_zoom_select_item' }))

// 主题选择的数据
export const theme_select_content = [
  { label: 'ai', value: 'ai' },
  { label: '清新绿', value: 'freshGreen' },
  { label: '天空蓝', value: 'blueSky' },
  { label: '脑残粉', value: 'brainImpairedPink' },
  { label: '浪漫紫', value: 'romanticPurple' },
  { label: '清新红', value: 'freshRed' },
  { label: '泥土黄', value: 'earthYellow' },
  { label: '脑图经典', value: 'classic' },
  { label: '经典2', value: 'classic2' },
  { label: '经典3', value: 'classic3' },
  { label: '经典4', value: 'classic4' },
  { label: '暗色', value: 'dark' },
  { label: '经典绿', value: 'classicGreen' },
  { label: '经典蓝', value: 'classicBlue' },
  { label: '小黄人', value: 'minions' },
  { label: '粉红葡萄', value: 'pinkGrape' },
  { label: '薄荷', value: 'mint' },
  { label: '金色vip', value: 'gold' },
  { label: '活力橙', value: 'vitalityOrange' },
  { label: '绿叶', value: 'greenLeaf' },
  { label: '暗色2', value: 'dark2' },
  { label: '天清绿', value: 'skyGreen' },
  { label: '简约黑', value: 'simpleBlack' },
  { label: '课程绿', value: 'courseGreen' },
  { label: '咖啡', value: 'coffee' },
  { label: '红色精神', value: 'redSpirit' },
  { label: '黑色幽默', value: 'blackHumour' },
  { label: '深夜办公室', value: 'lateNightOffice' },
  { label: '黑金', value: 'blackGold' },
  { label: '牛油果', value: 'avocado' },
  { label: '秋天', value: 'autumn' },
  { label: '橙汁', value: 'orangeJuice' }
].map((n) => ({ ...n, class: 'js_mind_zoom_select_item' }))

export type TTheme = (typeof theme_select_content)[number]['value']

// 默认项目主题
export const getAppMindTheme = (): TTheme => {
  return 'ai'
}

// 结果选择的数据
export const layout_select_content = [
  { label: '逻辑结构图', value: 'logicalStructure', style: '--n-option-font-size: 12px' },
  { label: '思维导图', value: 'mindMap', style: '--n-option-font-size: 12px' },
  { label: '组织结构图', value: 'organizationStructure', style: '--n-option-font-size: 12px' },
  { label: '目录组织图', value: 'catalogOrganization', style: '--n-option-font-size: 12px' },
  { label: '顺序时间轴', value: 'timeline', style: '--n-option-font-size: 12px' },
  { label: '交叉时间轴', value: 'timeline2', style: '--n-option-font-size: 12px' },
  { label: '鱼骨图', value: 'fishbone', style: '--n-option-font-size: 12px' }
  // { label: '竖向时间轴', value: 'verticalTimeline', style: '--n-option-font-size: 12px' }
]

export type TLayout = (typeof layout_select_content)[number]['value']
