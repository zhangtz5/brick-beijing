// 出生点定义（轻量模块：仅依赖 geo 投影，供菜单与游戏共用，避免把 Game.js 拖进首屏）
import { project } from './geo.js'

const SP = (lat, lon) => ({ ...project(lat, lon), y: 0 })

export const SPAWNS = [
  { id: 'tiananmen', name: '天安门广场', desc: '东城区 · 中轴核心', pos: SP(39.9027, 116.3975), yaw: 0 },
  { id: 'wangfujing', name: '王府井', desc: '东城区 · 商业老街', pos: SP(39.9135, 116.412), yaw: 0 },
  { id: 'shichahai', name: '什刹海', desc: '西城区 · 后海胡同', pos: SP(39.9395, 116.3925), yaw: 0 },
  { id: 'aolin', name: '奥林匹克公园', desc: '朝阳区 · 鸟巢水立方', pos: SP(39.9925, 116.3925), yaw: 0 },
  { id: 'yiheyuan', name: '颐和园', desc: '海淀区 · 皇家园林', pos: SP(39.9985, 116.281), yaw: 0 },
  { id: 'guomao', name: '国贸 CBD', desc: '朝阳区 · 现代天际线', pos: SP(39.9085, 116.461), yaw: 0 }
]
