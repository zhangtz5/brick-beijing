// 地理数据：真实经纬度 → 游戏坐标（1km ≈ 200格，核心区外按比例压缩）
// D2 北京化：投影原点=天安门；水系=护城河/什刹海/北海/长河/昆明湖/永定河/通惠河
import { distToSeg } from './util.js'

export const ORIGIN = { lat: 39.9042, lon: 116.3975 } // 天安门
export const UPK = 200 // units per km
const KX = 111.32 * Math.cos((ORIGIN.lat * Math.PI) / 180)
const KZ = 110.574
const CORE_R = 12
const COMPRESS = 0.35

export function compressFactor(lat, lon) {
  const ex = (lon - ORIGIN.lon) * KX, nz = (lat - ORIGIN.lat) * KZ
  const d = Math.hypot(ex, nz)
  return d > CORE_R ? COMPRESS : 1
}

export function project(lat, lon) {
  let ex = (lon - ORIGIN.lon) * KX
  let nz = (lat - ORIGIN.lat) * KZ
  const d = Math.hypot(ex, nz)
  if (d > CORE_R) {
    const f = (CORE_R + (d - CORE_R) * COMPRESS) / d
    ex *= f
    nz *= f
  }
  return { x: ex * UPK, z: -nz * UPK }
}

export function unproject(x, z) {
  let ex = x / UPK, nz = -z / UPK
  const d = Math.hypot(ex, nz)
  if (d > CORE_R) {
    const real = CORE_R + (d - CORE_R) / COMPRESS
    ex *= real / d
    nz *= real / d
  }
  return { lat: ORIGIN.lat + nz / KZ, lon: ORIGIN.lon + ex / KX }
}

const P = (lat, lon) => project(lat, lon)

// ---------------- 水系 ----------------
// [lat, lon, 宽度km]
const RIVER_DATA = [
  {
    // 紫禁城护城河（筒子河）：U 形环廊，南段开口于天安门广场
    name: '护城河',
    pts: [[39.9092, 116.394, 0.05], [39.9092, 116.3912, 0.05], [39.9225, 116.3912, 0.05], [39.9225, 116.404, 0.05], [39.9092, 116.404, 0.05], [39.9092, 116.401, 0.05]]
  },
  {
    // 什刹海：西海→后海→前海
    name: '什刹海',
    pts: [[39.942, 116.3865, 0.1], [39.9415, 116.3905, 0.16], [39.9405, 116.3945, 0.16], [39.938, 116.3965, 0.14], [39.936, 116.398, 0.1]]
  },
  {
    name: '北海',
    pts: [[39.9235, 116.3875, 0.18], [39.9265, 116.3895, 0.22]]
  },
  {
    // 长河：昆明湖 → 什刹海（皇家御河）
    name: '长河',
    pts: [[39.993, 116.281, 0.05], [39.988, 116.292, 0.05], [39.982, 116.302, 0.05], [39.972, 116.312, 0.05], [39.962, 116.322, 0.05], [39.952, 116.332, 0.05], [39.946, 116.345, 0.05], [39.943, 116.362, 0.05], [39.9425, 116.378, 0.06], [39.942, 116.3865, 0.08]]
  },
  {
    // 昆明湖（颐和园）：长条形湖盆，东堤、南湖湾、西堤
    name: '昆明湖',
    pts: [[39.9966, 116.2712, 0.2], [39.9945, 116.2712, 0.28], [39.9918, 116.2718, 0.28], [39.9895, 116.2725, 0.28], [39.9878, 116.2732, 0.2], [39.9868, 116.2725, 0.14]]
  },
  {
    // 永定河（西南，卢沟桥跨河）
    name: '永定河',
    pts: [[39.94, 116.16, 0.45], [39.915, 116.19, 0.4], [39.89, 116.215, 0.35], [39.865, 116.235, 0.35], [39.845, 116.26, 0.4], [39.82, 116.29, 0.45]]
  },
  {
    // 通惠河（CBD 南侧东流）
    name: '通惠河',
    pts: [[39.9045, 116.435, 0.06], [39.903, 116.455, 0.07], [39.901, 116.475, 0.08], [39.898, 116.5, 0.1], [39.895, 116.53, 0.12]]
  },
  {
    // 护城河东南段延伸（二环护城河水系意象）
    name: '南护城河',
    pts: [[39.8845, 116.36, 0.06], [39.883, 116.39, 0.07], [39.883, 116.42, 0.07], [39.8845, 116.435, 0.06], [39.9045, 116.435, 0.06]]
  }
]

export const RIVERS = RIVER_DATA.map((r) => ({
  name: r.name,
  pts: r.pts.map(([lat, lon, w]) => {
    const p = P(lat, lon)
    return { x: p.x, z: p.z, w: w * UPK * compressFactor(lat, lon) }
  })
}))

// ---------------- 道路 ----------------
const ROAD_DATA = [
  { name: '长安街', w: 14, pts: [[39.908, 116.32], [39.9078, 116.34], [39.9075, 116.356], [39.9075, 116.374], [39.9075, 116.391], [39.9075, 116.403], [39.9078, 116.412], [39.908, 116.43], [39.9082, 116.445], [39.9085, 116.461], [39.9088, 116.48]] },
  { name: '中轴线', w: 10, ped: true, pts: [[39.8875, 116.3955], [39.893, 116.3965], [39.899, 116.3972], [39.9042, 116.3975], [39.9065, 116.3975], [39.9092, 116.3975], [39.913, 116.3972], [39.918, 116.397], [39.923, 116.3968], [39.9262, 116.3965], [39.931, 116.396], [39.936, 116.3955], [39.94, 116.395], [39.95, 116.394], [39.96, 116.393], [39.975, 116.3925], [39.9925, 116.3925]] },
  { name: '二环路', w: 12, pts: [[39.961, 116.352], [39.9615, 116.39], [39.961, 116.42], [39.96, 116.437], [39.92, 116.438], [39.89, 116.438], [39.862, 116.437], [39.861, 116.39], [39.862, 116.354], [39.89, 116.352], [39.92, 116.351], [39.961, 116.352]] },
  { name: '四环路', w: 14, pts: [[39.975, 116.3], [39.976, 116.36], [39.9755, 116.42], [39.974, 116.48], [39.94, 116.485], [39.9, 116.486], [39.86, 116.484], [39.855, 116.42], [39.856, 116.36], [39.86, 116.3], [39.9, 116.295], [39.94, 116.296], [39.975, 116.3]] },
  { name: '平安大街', w: 12, pts: [[39.935, 116.36], [39.9352, 116.38], [39.9355, 116.4], [39.9352, 116.42], [39.935, 116.44]] },
  { name: '两广路', w: 12, pts: [[39.893, 116.36], [39.8932, 116.38], [39.8935, 116.4], [39.8932, 116.42], [39.893, 116.44]] },
  { name: '西单-西四大街', w: 10, pts: [[39.93, 116.374], [39.92, 116.3742], [39.91, 116.3743], [39.908, 116.374], [39.9, 116.3745], [39.89, 116.3748]] },
  { name: '东单-崇文门大街', w: 10, pts: [[39.93, 116.417], [39.92, 116.4172], [39.91, 116.4175], [39.9, 116.418], [39.89, 116.4185]] },
  { name: '中关村大街', w: 12, pts: [[39.995, 116.31], [39.98, 116.315], [39.965, 116.32], [39.95, 116.325]] },
  { name: '颐和园路', w: 10, pts: [[39.985, 116.3], [39.99, 116.288], [39.995, 116.278], [39.999, 116.27]] },
  { name: '学院路', w: 10, pts: [[39.942, 116.353], [39.955, 116.35], [39.97, 116.347], [39.985, 116.345]] },
  { name: '广渠路', w: 12, pts: [[39.895, 116.44], [39.894, 116.46], [39.893, 116.48], [39.892, 116.5]] },
  { name: '十七孔桥', w: 7, ped: true, pts: [[39.9905, 116.275], [39.9892, 116.2736], [39.9884, 116.2725]] } // 昆明湖东堤→南湖岛（步行桥）
]

export const ROADS = ROAD_DATA.map((r) => ({ name: r.name, w: r.w, ped: !!r.ped, pts: r.pts.map(([lat, lon]) => P(lat, lon)) }))

// ---------------- 分区 ----------------
export const DISTRICTS = {
  dongcheng: { name: '东城区', color: '#c0392b', theme: '中轴核心 · 胡同市井' },
  xicheng: { name: '西城区', color: '#c8a24a', theme: '皇城园林 · 坛庙' },
  chaoyang: { name: '朝阳区', color: '#5b8fd9', theme: '现代 CBD · 奥运区' },
  haidian: { name: '海淀区', color: '#5fae6b', theme: '皇家园林 · 学府' },
  fengtai: { name: '丰台区', color: '#d9785b', theme: '卢沟古韵 · 南苑' },
  shijingshan: { name: '石景山区', color: '#8f9aa8', theme: '首钢工业记忆' },
  changping: { name: '昌平区', color: '#9b6bd1', theme: '十三陵 · 居庸关' },
  yanqing: { name: '延庆区', color: '#4fb3b8', theme: '八达岭长城' }
}

const SEEDS = [
  ['dongcheng', 39.915, 116.41], ['dongcheng', 39.93, 116.412], ['dongcheng', 39.895, 116.412], ['dongcheng', 39.942, 116.405], ['dongcheng', 39.905, 116.42],
  ['xicheng', 39.915, 116.38], ['xicheng', 39.93, 116.372], ['xicheng', 39.895, 116.372], ['xicheng', 39.925, 116.386], ['xicheng', 39.905, 116.365],
  ['chaoyang', 39.92, 116.455], ['chaoyang', 39.95, 116.46], ['chaoyang', 39.91, 116.47], ['chaoyang', 39.992, 116.395], ['chaoyang', 39.965, 116.42], ['chaoyang', 39.935, 116.445],
  ['haidian', 39.98, 116.32], ['haidian', 39.96, 116.33], ['haidian', 39.995, 116.272], ['haidian', 39.95, 116.3], ['haidian', 40.005, 116.305],
  ['fengtai', 39.865, 116.35], ['fengtai', 39.85, 116.285], ['fengtai', 39.87, 116.4], ['fengtai', 39.84, 116.32],
  ['shijingshan', 39.91, 116.22], ['shijingshan', 39.93, 116.2], ['shijingshan', 39.89, 116.24],
  ['changping', 40.1, 116.25], ['changping', 40.25, 116.22], ['changping', 40.05, 116.3],
  ['yanqing', 40.36, 116.02], ['yanqing', 40.45, 116.1]
].map(([id, lat, lon]) => ({ id, ...P(lat, lon) }))

export function districtAt(x, z) {
  let best = null, bd = Infinity
  for (const s of SEEDS) {
    const d = (s.x - x) ** 2 + (s.z - z) ** 2
    if (d < bd) { bd = d; best = s.id }
  }
  return best
}

// ---------------- 地形 ----------------
const HILLS = [
  // 景山（万春亭山巅）
  [39.9272, 116.3968, 14, 45],
  // 万寿山（颐和园，佛香阁山巅）
  [39.9985, 116.2725, 17, 50],
  // 香山 / 西山
  [39.992, 116.188, 110, 250], [39.975, 116.2, 70, 200], [40.01, 116.17, 90, 260], [39.96, 116.22, 50, 180],
  // 石景山
  [39.905, 116.19, 40, 120],
  // 北部军都山 / 燕山（长城带）
  [40.15, 116.3, 150, 300], [40.1, 116.45, 120, 280], [40.2, 116.5, 140, 300], [40.05, 116.2, 100, 260], [40.36, 116.02, 160, 320]
].map(([lat, lon, h, r]) => ({ ...P(lat, lon), h, r }))

export function rawHeight(x, z) {
  let h = 0
  for (const k of HILLS) {
    const dx = x - k.x, dz = z - k.z
    const d2 = dx * dx + dz * dz
    const r2 = k.r * k.r
    if (d2 < r2 * 6) h += k.h * Math.exp(-d2 / (r2 * 0.6))
  }
  if (h > 1) {
    h += (Math.sin(x * 0.07) * Math.cos(z * 0.05) + Math.sin((x + z) * 0.031)) * Math.min(4, h * 0.08)
  }
  return h < 0.6 ? 0 : h
}

// 方块化地形高度（整数台阶）
export function terrainHeight(x, z) {
  let h = rawHeight(x, z)
  if (h > 0) {
    const r = roadAt(x, z, 18)
    if (r) h *= Math.min(1, Math.max(0, (r.d - r.hw + 18) / 18) ** 2)
  }
  return Math.floor(h)
}

// 绿地 / 公园 [lat, lon, 半径units]
export const PARKS = [
  [39.882, 116.41, 90], // 天坛公园
  [39.925, 116.388, 55], // 北海公园
  [39.9265, 116.3968, 50], // 景山公园
  [39.941, 116.391, 65], // 什刹海
  [39.993, 116.2718, 140], // 颐和园
  [40.004, 116.303, 150], // 圆明园
  [40.015, 116.392, 150], // 奥林匹克森林公园
  [39.87, 116.38, 65], // 陶然亭
  [39.913, 116.32, 65], // 玉渊潭
  [39.94, 116.335, 45], // 动物园
  [39.875, 116.43, 55], // 龙潭湖
  [39.945, 116.475, 85], // 朝阳公园
  [39.9355, 116.4085, 40], // 地坛
  [39.92, 116.435, 35] // 日坛
].map(([lat, lon, r]) => ({ ...P(lat, lon), r }))

export function isPark(x, z) {
  for (const p of PARKS) if ((p.x - x) ** 2 + (p.z - z) ** 2 < p.r * p.r) return true
  return false
}

// ---------------- 空间索引 ----------------
const GRID = 64
function buildSegGrid(lines, widthOf) {
  const grid = new Map()
  for (const line of lines) {
    for (let i = 1; i < line.pts.length; i++) {
      const a = line.pts[i - 1], b = line.pts[i]
      const w = Math.max(widthOf(line, a), widthOf(line, b)) / 2 + 20
      const seg = { ax: a.x, az: a.z, bx: b.x, bz: b.z, wa: widthOf(line, a), wb: widthOf(line, b), line }
      const x0 = Math.floor((Math.min(a.x, b.x) - w) / GRID), x1 = Math.floor((Math.max(a.x, b.x) + w) / GRID)
      const z0 = Math.floor((Math.min(a.z, b.z) - w) / GRID), z1 = Math.floor((Math.max(a.z, b.z) + w) / GRID)
      for (let gx = x0; gx <= x1; gx++)
        for (let gz = z0; gz <= z1; gz++) {
          const k = gx + ',' + gz
          let arr = grid.get(k)
          if (!arr) grid.set(k, (arr = []))
          arr.push(seg)
        }
    }
  }
  return grid
}

const riverGrid = buildSegGrid(RIVERS, (l, p) => p.w)
const roadGrid = buildSegGrid(ROADS, (l) => l.w)

function querySeg(grid, x, z, pad = 0) {
  const arr = grid.get(Math.floor(x / GRID) + ',' + Math.floor(z / GRID))
  if (!arr) return null
  let best = null
  for (const s of arr) {
    const { d, t } = distToSeg(x, z, s.ax, s.az, s.bx, s.bz)
    const hw = (s.wa + (s.wb - s.wa) * t) / 2 + pad
    if (d < hw && (!best || d - hw < best.m)) best = { seg: s, d, hw, m: d - hw, line: s.line }
  }
  return best
}

// 陆地覆盖（岛屿、码头等）: 矩形 {x0,z0,x1,z1}
export const LAND_OVERRIDES = []
export function addLandOverride(x0, z0, x1, z1) {
  LAND_OVERRIDES.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) })
}
function inLandOverride(x, z) {
  for (const r of LAND_OVERRIDES) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return true
  return false
}

export function riverAt(x, z, pad = 0) {
  return querySeg(riverGrid, x, z, pad)
}
export function isWater(x, z) {
  return !!querySeg(riverGrid, x, z) && !inLandOverride(x, z)
}
export function roadAt(x, z, pad = 0) {
  return querySeg(roadGrid, x, z, pad)
}
export function isBridge(x, z) {
  return isWater(x, z) && !!querySeg(roadGrid, x, z)
}
// 玩家/NPC 是否可在此处站立（水面上只有桥可走）
export function walkableWater(x, z) {
  if (!isWater(x, z)) return true
  return !!querySeg(roadGrid, x, z, -0.5)
}

export const WATER_Y = -0.7
export const BRIDGE_Y = 0.35

// ---------------- 交通 ----------------
export const BUS_ROUTE = {
  name: '观光巴士 1 路',
  pts: [
    [39.908, 116.374], [39.9075, 116.391], [39.9075, 116.403], [39.9078, 116.412], [39.908, 116.43], [39.9085, 116.461]
  ].map(([a, b]) => P(a, b)),
  stops: [
    { name: '西单', lat: 39.908, lon: 116.374 },
    { name: '天安门西', lat: 39.9075, lon: 116.391 },
    { name: '天安门东', lat: 39.9075, lon: 116.403 },
    { name: '王府井', lat: 39.9078, lon: 116.412 },
    { name: '国贸', lat: 39.9085, lon: 116.461 }
  ].map((s) => ({ ...s, ...P(s.lat, s.lon) }))
}

export const METRO_STATIONS = [
  { id: 'xidan', name: '西单站', lines: ['1号线', '4号线'], lat: 39.908, lon: 116.374 },
  { id: 'tamend', name: '天安门东站', lines: ['1号线'], lat: 39.9075, lon: 116.4035 },
  { id: 'wangfujing', name: '王府井站', lines: ['1号线'], lat: 39.908, lon: 116.412 },
  { id: 'guomao', name: '国贸站', lines: ['1号线', '10号线'], lat: 39.9085, lon: 116.461 },
  { id: 'gongzhufen', name: '公主坟站', lines: ['1号线', '10号线'], lat: 39.9075, lon: 116.311 },
  { id: 'fuxingmen', name: '复兴门站', lines: ['1号线', '2号线'], lat: 39.9075, lon: 116.356 },
  { id: 'qianmen', name: '前门站', lines: ['2号线'], lat: 39.9, lon: 116.3975 },
  { id: 'chongwenmen', name: '崇文门站', lines: ['2号线', '5号线'], lat: 39.9, lon: 116.419 },
  { id: 'xizhimen', name: '西直门站', lines: ['2号线', '4号线', '13号线'], lat: 39.942, lon: 116.353 },
  { id: 'dongzhimen', name: '东直门站', lines: ['2号线', '13号线'], lat: 39.942, lon: 116.434 },
  { id: 'yonghegong', name: '雍和宫站', lines: ['2号线', '5号线'], lat: 39.9465, lon: 116.417 },
  { id: 'nanluoguxiang', name: '南锣鼓巷站', lines: ['6号线', '8号线'], lat: 39.934, lon: 116.4055 },
  { id: 'shichahai', name: '什刹海站', lines: ['8号线'], lat: 39.942, lon: 116.39 },
  { id: 'beihaibei', name: '北海北站', lines: ['6号线'], lat: 39.9255, lon: 116.383 },
  { id: 'aolin', name: '奥林匹克公园站', lines: ['8号线', '15号线'], lat: 39.9925, lon: 116.3925 },
  { id: 'xiyuan', name: '西苑站(颐和园)', lines: ['4号线', '16号线'], lat: 39.999, lon: 116.289 },
  { id: 'yuanmingyuan', name: '圆明园站', lines: ['4号线'], lat: 40.005, lon: 116.305 },
  { id: 'beijingnz', name: '北京南站', lines: ['4号线', '14号线'], lat: 39.865, lon: 116.378 }
].map((s) => ({ ...s, ...P(s.lat, s.lon) }))

// 昆明湖游船航线（沿湖心南北环线）
const KUNMING_RING = [
  [39.9948, 116.2718], [39.9932, 116.2722], [39.9915, 116.2728], [39.99, 116.2732], [39.9888, 116.2725], [39.9895, 116.2712], [39.9912, 116.2708], [39.9932, 116.2708], [39.9948, 116.2718]
]
export function cruiseRoute() {
  return KUNMING_RING.map(([lat, lon]) => P(lat, lon))
}

export const PIERS = [
  { id: 'yiheyuan', name: '颐和园码头(东堤)', lat: 39.9905, lon: 116.275 },
  { id: 'nanhu', name: '南湖岛码头', lat: 39.9884, lon: 116.2725 }
].map((s) => ({ ...s, ...P(s.lat, s.lon) }))

export function worldBounds() {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const s of SEEDS) {
    x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); z0 = Math.min(z0, s.z); z1 = Math.max(z1, s.z)
  }
  return { x0: x0 - 600, x1: x1 + 600, z0: z0 - 600, z1: z1 + 600 }
}
