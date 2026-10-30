// 中央电视塔（A 级）：细塔身 + 大球观景台 + 天线；西三环玉渊潭畔，可乘电梯登顶俯瞰全城
import { paving, roundTree, lamp } from './common.js'
import { BJ } from './axis.js'

const STEEL = 0x9a9aa0

export function buildCCTower(b, ctx) {
  const BALL_Y = 74, BALL_TOP = 90
  // 塔基裙房
  b.prism(0, 0, -0.4, 10, 14, 14, 12, 0xb8b4a8, { mat: 'stone' })
  b.prism(0, 0, 10, 12, 12, 12, 12, 0xc8c4b8, { mat: 'stone' })
  // 塔身（细，上收）
  b.prism(0, 0, 12, BALL_Y, 4.5, 4.5, 12, 0xd8d4c8, { rx1: 2.2, rz1: 2.2, mat: 'block' })
  // 塔身观景窗带
  for (const fy of [40, 55]) b.prism(0, 0, fy, fy + 1.5, 4.8, 4.8, 12, 0x8ab0c8, { open: true, solid: false, mat: 'window' })
  // 大球观景台（棗核形三段近似）
  b.prism(0, 0, BALL_Y, BALL_Y + 4, 4, 4, 12, 0xcfd4d8, { rx1: 9, rz1: 9, mat: 'block' })
  b.prism(0, 0, BALL_Y + 4, BALL_Y + 12, 9, 9, 12, 0xcfd4d8, { rx1: 9, rz1: 9, mat: 'block' })
  b.prism(0, 0, BALL_Y + 12, BALL_TOP, 9, 9, 12, 0xcfd4d8, { rx1: 3, rz1: 3, mat: 'block' })
  // 球面观景窗环
  b.prism(0, 0, BALL_Y + 5, BALL_Y + 6.5, 9.4, 9.4, 12, 0x5a7f9a, { open: true, solid: false, mat: 'window' })
  // 顶部观景平台（可登临）
  b.prism(0, 0, BALL_TOP, BALL_TOP + 0.5, 6, 6, 12, 0xdfe8f0, { mat: 'stone', solid: true })
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; b.boxC(Math.cos(a) * 5.8, BALL_TOP + 0.3, Math.sin(a) * 5.8, 0.25, 0.95, 0.25, BJ.marble, { solid: false }) }
  // 天线
  b.boxC(0, BALL_TOP + 0.3, 0, 1.2, 18, 1.2, STEEL, { solid: false })
  b.boxC(0, BALL_TOP + 18, 0, 0.6, 6, 0.6, STEEL, { solid: false })
  b.boxC(0, BALL_TOP + 24, 0, 1.2, 1.2, 1.2, 0xff3030, 'lamp')
  // 塔基广场
  paving(b, -20, 16, 20, 36, 0.05, BJ.pave)
  for (let x = -16; x <= 16; x += 8) { lamp(b, x, 0, 30, 5); roundTree(b, x + 4, 0, 30, 0.7) }
  b.sign('中央电视塔', 0, 8, 14.5, 1.6, 0, { bg: '#2a2a30', fg: '#ffe08a', glow: true })
  ctx.interact({ x: 0, z: 24, r: 8, label: '中央电视塔', type: 'info', text: '中央广播电视塔高 386 米，矗立西三环玉渊潭畔，上部球状观景台可 360° 俯瞰北京城，曾是北京最高的观景平台。' })
  ctx.interact({ x: 0, z: 40, r: 6, label: '仰望中央电视塔大球', type: 'view' })
  ctx.interact({ x: 0, z: 16, r: 4, y: 0, label: '中央电视塔 · 观光电梯', type: 'elevator', deckY: BALL_TOP, baseR: 6, elevLabel: '中央电视塔电梯', banner: ['🗼 中央电视塔 · 观景球', '360° 俯瞰北京城，西望西山、东眺 CBD'] })
  ctx.interact({ x: 0, z: 0, r: 6, y: BALL_TOP + 0.5, label: '中央电视塔 · 观景球', type: 'elevatorTop', deckY: BALL_TOP, elevLabel: '中央电视塔 · 观景球' })
  ctx.crowd(0, 24, 14, 8, 8)
}

export function cctowerLOD(b) {
  b.prism(0, 0, 0, 10, 12, 12, 8, 0xb8b4a8, { solid: false })
  b.prism(0, 0, 10, 74, 4, 4, 8, 0xd8d4c8, { rx1: 2, rz1: 2, solid: false })
  b.prism(0, 0, 74, 90, 9, 9, 10, 0xcfd4d8, { rx1: 3, rz1: 3, solid: false })
  b.boxC(0, 90, 0, 1, 22, 1, 0x9a9aa0, { solid: false })
}
