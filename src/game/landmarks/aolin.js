// D6 奥林匹克公园区(S)：国家体育场「鸟巢」· 国家游泳中心「水立方」· 奥林匹克塔
// 局部坐标 +z 朝南，原点 = 各自主体中心。参考「方块广州」天河现代楼写法（prism/beam 网格 + curtain/neon 材质）
import { mulberry32 } from '../util.js'
import { paving, roundTree, lamp } from './common.js'
import { BJ } from './axis.js'

const STEEL = 0x9a9a94 // 钢构灰
const STEEL_D = 0x6f6f6a // 暗钢
const BOWL_RED = 0xa8332a // 看台红

// ---------------- 国家体育场 · 鸟巢（S 级） ----------------
// 马鞍形编织钢结构外壳：椭圆筒 + 斜交钢梁网，顶部开口成碗
export function buildBirdsnest(b, ctx) {
  const RX = 38, RZ = 44, H = 24 // 东西/南北半轴、高度
  const SEGN = 26, LVL = 6
  const rf = (t) => 0.8 + 0.3 * Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.04)) // 中部鼓、上下收
  const ring = (t) => t * H
  // 底部基座平台
  b.prism(0, 0, -0.4, 0.6, RX + 6, RZ + 6, 28, 0xbdb8ac, { mat: 'stone' })
  // 碗内红色看台（内壳，低于外壳）
  for (let i = 0; i < 5; i++) {
    const t0 = i / 5, t1 = (i + 1) / 5
    b.prism(0, 0, 2 + t0 * 12, 2 + t1 * 12, (RX - 8) * (0.7 + t1 * 0.35), (RZ - 8) * (0.7 + t1 * 0.35), 24, i % 2 ? BOWL_RED : 0xb8423a, { mat: 'block', open: true, solid: false, noBottom: true })
  }
  // 外围编织钢梁：竖向柱 + 交替斜交梁
  for (let k = 0; k < SEGN; k++) {
    const a0 = (k / SEGN) * Math.PI * 2, a1 = ((k + 1) / SEGN) * Math.PI * 2
    for (let i = 0; i < LVL; i++) {
      const t0 = i / LVL, t1 = (i + 1) / LVL
      const r0 = rf(t0), r1 = rf(t1)
      const y0 = ring(t0), y1 = ring(t1)
      const p0 = [Math.cos(a0) * RX * r0, Math.sin(a0) * RZ * r0]
      const p1 = [Math.cos(a1) * RX * r0, Math.sin(a1) * RZ * r0]
      const q0 = [Math.cos(a0) * RX * r1, Math.sin(a0) * RZ * r1]
      const q1 = [Math.cos(a1) * RX * r1, Math.sin(a1) * RZ * r1]
      // 竖柱
      b.beam(p0[0], y0, p0[1], q0[0], y1, q0[1], 0.7, STEEL_D)
      // 斜交（交替方向形成编织网）
      if ((k + i) % 2 === 0) {
        b.beam(p0[0], y0, p0[1], q1[0], y1, q1[1], 0.6, STEEL)
        b.beam(p1[0], y0, p1[1], q0[0], y1, q0[1], 0.6, STEEL)
      } else {
        b.beam(p1[0], y0, p1[1], q1[0], y1, q1[1], 0.6, STEEL)
        b.beam(p0[0], y0, p0[1], q0[0], y1, q0[1], 0.6, STEEL)
      }
    }
    // 环向主梁（每层）
    for (let i = 1; i < LVL; i++) {
      const t = i / LVL, r = rf(t), y = ring(t)
      const pa = [Math.cos(a0) * RX * r, Math.sin(a0) * RZ * r]
      const pb = [Math.cos(a1) * RX * r, Math.sin(a1) * RZ * r]
      b.beam(pa[0], y, pa[1], pb[0], y, pb[1], 0.5, STEEL_D)
    }
  }
  // 顶口环梁（收边）
  for (let k = 0; k < SEGN; k++) {
    const a0 = (k / SEGN) * Math.PI * 2, a1 = ((k + 1) / SEGN) * Math.PI * 2
    const r = rf(1)
    b.beam(Math.cos(a0) * RX * r, H, Math.sin(a0) * RZ * r, Math.cos(a1) * RX * r, H, Math.sin(a1) * RZ * r, 0.9, STEEL)
  }
  b.sign('国家体育场 · 鸟巢', 0, 6, RZ + 6.5, 1.6, 0, { bg: '#2a2a2e', fg: '#ff5a4a', glow: true })
  // 广场、路灯、人流
  paving(b, -RX - 14, RZ + 6, RX + 14, RZ + 26, 0.05, BJ.pave)
  for (let x = -RX; x <= RX; x += 12) lamp(b, x, 0, RZ + 22, 5, 'old')
  // 内场草坪（可入场观赛）
  b.prism(0, 0, 0.4, 1.2, RX - 16, RZ - 16, 20, 0x4a9a3a, { mat: 'grass', solid: true })
  ctx.interact({ x: 0, z: RZ + 16, r: 9, label: '鸟巢 · 国家体育场', type: 'info', text: '国家体育场“鸟巢”由赫尔佐格与德梅隆设计，2008 北京奥运主会场。看似随意的编织钢梁实为相互支撑的马鞍形受力结构，用钢量约 11 万吨，是北京的现代地标。' })
  ctx.interact({ x: RX + 8, z: 0, r: 6, label: '拍摄鸟巢编织钢结构全景', type: 'view' })
  ctx.interact({ x: 0, z: 0, r: 9, type: 'enter', label: '🎫 入场 · 站上鸟巢内场草坪', ty: 1.5, fadeText: '🎫 入场中…', banner: ['🏟️ 鸟巢 · 内场草坪', '08 奥运主会场，抬头是交织的编织钢梁，按 C 拍照'] })
  ctx.crowd(0, RZ + 16, 26, 10, 14)
}

export function birdsnestLOD(b) {
  const RX = 38, RZ = 44, H = 24
  for (let i = 0; i < 5; i++) {
    const t0 = i / 5, t1 = (i + 1) / 5
    const rf = (t) => 0.8 + 0.3 * Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.04))
    b.prism(0, 0, t0 * H, t1 * H, RX * rf(t0), RZ * rf(t0), 16, STEEL, { mat: 'block', rx1: RX * rf(t1), rz1: RZ * rf(t1), open: true, solid: false })
  }
  b.prism(0, 0, 2, 12, RX - 10, RZ - 10, 16, BOWL_RED, { mat: 'block', open: true, solid: false })
}

// ---------------- 国家游泳中心 · 水立方（S 级） ----------------
// 蓝色半透明方盒 + 表面随机 ETFE 气泡气枕
export function buildWatercube(b, ctx) {
  const W = 40, D = 42, H = 16
  // 内部水体暗示 + 基座
  b.prism(0, 0, -0.4, 0.6, W + 8, D + 8, 4, 0xbdb8ac, { mat: 'stone' })
  // 蓝色膜结构外壳（glass 半透明）
  b.box(-W / 2, 0.6, -D / 2, W / 2, H, D / 2, 0x4a9ad8, { mat: 'glass' })
  // 内部结构（透过玻璃可见的蓝色楼层）
  b.box(-W / 2 + 2, 0.6, -D / 2 + 2, W / 2 - 2, 1.2, D / 2 - 2, 0x2a6ab0, { mat: 'neon', solid: false })
  for (const fy of [5, 10]) b.box(-W / 2 + 2, fy, -D / 2 + 2, W / 2 - 2, fy + 0.4, D / 2 - 2, 0x3a7ac0, { mat: 'window', solid: false })
  // 表面气泡：四壁随机分布的不规则浅蓝白方格
  const r = mulberry32(2008)
  const bubble = (x, y, z, s, face) => {
    const c = r() < 0.4 ? 0xbfe4ff : r() < 0.7 ? 0x8ec8f0 : 0xe8f6ff
    if (face === 'z') b.box(x - s / 2, y - s / 2, z, x + s / 2, y + s / 2, z + 0.4, c, { mat: 'window', solid: false })
    else b.box(z, y - s / 2, x - s / 2, z + 0.4, y + s / 2, x + s / 2, c, { mat: 'window', solid: false })
  }
  for (let i = 0; i < 150; i++) {
    const s = 1.6 + r() * 3.2, u = -W / 2 + r() * W, v = 1.5 + r() * (H - 2.5)
    bubble(u, v, D / 2, s, 'z')
    bubble(u, v, -D / 2 - 0.4, s, 'z')
    bubble(u, v, W / 2, s, 'x')
    bubble(u, v, -W / 2 - 0.4, s, 'x')
  }
  // 屋顶气泡（更密）
  for (let i = 0; i < 60; i++) {
    const x = -W / 2 + r() * W, z = -D / 2 + r() * D, s = 1.6 + r() * 3
    b.box(x - s / 2, H, z - s / 2, x + s / 2, H + 0.4, z + s / 2, r() < 0.5 ? 0xdff0ff : 0x9fd0f0, { mat: 'window', solid: false })
  }
  b.sign('国家游泳中心 · 水立方', 0, H + 2, D / 2 + 1, 1.6, 0, { bg: '#1a4a7a', fg: '#bfe4ff', glow: true })
  // 内部游泳馆：湛蓝泳池 + 池边平台（可入场）
  b.box(-13, 0.6, -13, 13, 0.95, 13, 0x3a8ac8, { mat: 'pond', solid: false })
  for (const [x0, z0, x1, z1] of [[-W / 2 + 2, -D / 2 + 2, -13, D / 2 - 2], [13, -D / 2 + 2, W / 2 - 2, D / 2 - 2], [-13, -D / 2 + 2, 13, -13], [-13, 13, 13, D / 2 - 2]]) b.box(x0, 0.6, z0, x1, 1.2, z1, 0xbdb8ac, { mat: 'stone' })
  // 前广场水景
  paving(b, -W / 2 - 4, D / 2 + 2, W / 2 + 4, D / 2 + 20, 0.05, BJ.pave)
  b.box(-14, 0.1, D / 2 + 8, 14, 0.3, D / 2 + 14, 0x3a7ac0, { mat: 'pond', solid: false })
  ctx.interact({ x: 0, z: D / 2 + 12, r: 8, label: '水立方 · 国家游泳中心', type: 'info', text: '国家游泳中心“水立方”外墙由 3000 多个不规则蓝色“气泡”（ETFE 膜结构）组成，灵感来自水分子泡沫与细胞结构，2008 奥运游泳比赛场馆。夜晚气泡亮起，梦幻通透。' })
  ctx.interact({ x: -W / 2 - 6, z: 0, r: 5, label: '拍水立方蓝色气泡墙', type: 'view' })
  ctx.interact({ x: 0, z: D / 2 + 4, r: 6, type: 'enter', tx: 0, tz: 16, ty: 1.2, fadeText: '🏊 入场中…', label: '🏊 入场 · 水立方游泳馆', banner: ['🏊 水立方 · 游泳馆', '蓝色气泡膜下是奥运泳池，池水湛蓝，按 C 拍照'] })
  ctx.crowd(0, D / 2 + 12, 20, 8, 12)
}

export function watercubeLOD(b) {
  b.box(-20, 0.6, -21, 20, 16, 21, 0x4a9ad8, { mat: 'glass', solid: false })
  b.box(-20, 16, -21, 20, 16.4, 21, 0x9fd0f0, { mat: 'window', solid: false })
}

// ---------------- 奥林匹克塔（大钉子，观景塔群） ----------------
export function buildAolinTower(b, ctx) {
  // 五座高低不等的塔，顶部圆盘观景层（北京中轴北端地标“金色钉阵”）
  const towers = [[0, 0, 62], [-11, 6, 48], [11, 6, 48], [-6, -12, 38], [6, -12, 38]]
  for (const [x, z, h] of towers) {
    // 格构塔身：四柱 + 横撑
    for (const [dx, dz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) b.box(x + dx - 0.35, 0, z + dz - 0.35, x + dx + 0.35, h, z + dz + 0.35, STEEL_D)
    for (let y = 4; y < h; y += 6) b.box(x - 1.9, y, z - 1.9, x + 1.9, y + 0.5, z + 1.9, STEEL, { solid: false })
    // 顶部圆盘观景层（金色）
    b.prism(x, z, h, h + 2.4, 4.2, 4.2, 14, BJ.gold, { mat: 'block' })
    b.prism(x, z, h + 2.4, h + 3.2, 4.6, 4.6, 14, 0xe8c86a, { solid: false })
    b.boxC(x, h + 3.2, z, 0.5, 4, 0.5, STEEL, { solid: false })
    b.boxC(x, h + 7.2, z, 0.9, 0.9, 0.9, 0xff3030, 'lamp')
  }
  b.prism(0, 0, -0.4, 0.6, 26, 24, 4, 0xbdb8ac, { mat: 'stone' })
  // 最高塔顶观景盘（可乘电梯登临）
  const TY = 65.2
  b.prism(0, 0, TY, TY + 0.5, 4.4, 4.4, 14, 0xdfe8f0, { mat: 'stone', solid: true })
  for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; b.boxC(Math.cos(a) * 4.3, TY + 0.3, Math.sin(a) * 4.3, 0.25, 0.95, 0.25, BJ.marble, { solid: false }) }
  b.sign('奥林匹克塔', 0, 8, 15, 1.3, 0, { bg: '#3a3a2a', fg: '#ffd76a', glow: true })
  ctx.interact({ x: 0, z: 18, r: 6, label: '奥林匹克塔 · 中轴北端', type: 'info', text: '奥林匹克塔由五座“金色钉子”组成，最高塔 246.8 米，塔顶 360° 观景层可南望故宫中轴线、北眺燕山，是俯瞰北京中轴线的最佳位置之一。' })
  ctx.interact({ x: 0, z: 9, r: 4, y: 0, label: '奥林匹克塔 · 观光电梯', type: 'elevator', deckY: TY, baseR: 2, elevLabel: '奥林匹克塔电梯', banner: ['🏙️ 奥林匹克塔 · 观景盘', '北京中轴北端，南望故宫中轴、北眺燕山'] })
  ctx.interact({ x: 0, z: 0, r: 5, y: TY + 0.5, label: '奥林匹克塔 · 观景盘', type: 'elevatorTop', deckY: TY, elevLabel: '奥林匹克塔 · 观景盘' })
  ctx.crowd(0, 16, 12, 6, 6)
}

// ---------------- 龙形水系 + 中轴广场（奥区氛围点景，可选注册为 B 级） ----------------
export function buildAolinPlaza(b, ctx) {
  paving(b, -30, -60, 30, 60, 0.05, BJ.pave)
  // 龙形水系（蜿蜒水道）
  for (let z = -54; z < 54; z += 4) {
    const x = Math.sin(z * 0.12) * 8
    b.box(x - 2.5, 0.1, z, x + 2.5, 0.3, z + 4, 0x3a7ac0, { mat: 'pond', solid: false })
  }
  for (let z = -56; z <= 56; z += 10) { roundTree(b, -24, 0, z, 0.9, 0x4a9a42); roundTree(b, 24, 0, z, 0.9, 0x4a9a42); lamp(b, -20, 0, z + 5, 5) }
  ctx.interact({ x: 0, z: 0, r: 8, label: '奥林匹克中心区 · 龙形水系', type: 'view' })
  ctx.crowd(0, 0, 24, 50, 16)
}
