// 天坛公园(S)：祈年殿三重檐 · 皇穹宇 · 回音壁 · 圜丘坛(天心石彩蛋) · 丹陛桥
import { railing, roundTree, pine } from './common.js'
import { BJ } from './axis.js'

const CY = BJ.glazeB // 祈年殿三重檐蓝琉璃
const RED = 0xa0473a // 檐间红柱带
const ASTONE = 0xb89a6a // 艾叶青石台

// 三重檐圆殿通用：三层蓝琉璃锥形檐 + 金顶（axis 的 palaceHall 为方殿，此处另写圆殿）
function yuanHall(b, x, z, y, opt = {}) {
  const R = opt.R || 12
  const bh = opt.bodyH || 18
  const s = opt.scale || 1
  // 殿身圆柱（红色，上收）
  b.prism(x, z, y, y + bh * 0.56, R * s, R * s, 16, BJ.wall, { rx1: R * 0.74 * s, rz1: R * 0.74 * s, solid: false, noBottom: true })
  b.prism(x, z, y + bh * 0.56, y + bh, R * 0.74 * s, R * 0.74 * s, 16, RED, { rx1: R * 0.52 * s, rz1: R * 0.52 * s, solid: false, noBottom: true })
  // 三重檐：下中上，自宽到窄的蓝琉璃锥台
  b.prism(x, z, y + bh * 0.4, y + bh * 0.56, R * 1.34 * s, R * 1.34 * s, 20, CY, { rx1: R * 0.82 * s, rz1: R * 0.82 * s, solid: false })
  b.prism(x, z, y + bh * 0.66, y + bh * 0.8, R * 1.05 * s, R * 1.05 * s, 18, CY, { rx1: R * 0.6 * s, rz1: R * 0.6 * s, solid: false })
  b.prism(x, z, y + bh * 0.88, y + bh, R * 0.78 * s, R * 0.78 * s, 16, CY, { rx1: R * 0.16 * s, rz1: R * 0.16 * s, solid: false })
  // 鎏金宝顶
  b.prism(x, z, y + bh, y + bh + 2.2 * s, R * 0.16 * s, R * 0.16 * s, 10, BJ.gold, { rx1: 0.12, rz1: 0.12, solid: false })
  b.boxC(x, y + bh + 2.2 * s, z, 0.4, 0.8, 0.4, BJ.gold, { solid: false })
}

// 圆形汉白玉/艾叶青石台基（带栏杆）
function marbleRing(b, x, z, R, y0, h, color, rails = 30) {
  b.prism(x, z, y0, y0 + h, R, R, 24, color, { top: color })
  for (let i = 0; i < rails; i++) {
    const a = (i / rails) * Math.PI * 2
    b.boxC(x + Math.cos(a) * (R - 0.5), y0 + h, z + Math.sin(a) * (R - 0.5), 0.3, 0.9, 0.3, BJ.marble, { solid: false })
  }
  b.prism(x, z, y0 + h + 0.75, y0 + h + 0.9, R - 0.5, R - 0.5, rails + 4, BJ.marble, { open: true, solid: false })
}

// ---------------- 祈年殿（S 级主体） ----------------
// 局部坐标 +z 朝南（西门方向），中心≈(39.882, 116.3945)
export function buildTiantan(b, ctx) {
  // 三重圆形台基（祈谷坛）：艾叶青石 + 汉白玉栏杆
  marbleRing(b, 0, 0, 34, 0, 1.2, ASTONE, 36)
  marbleRing(b, 0, 0, 28, 1.2, 1.2, ASTONE, 30)
  marbleRing(b, 0, 0, 22, 2.4, 1.3, ASTONE, 24)
  // 东西出阶（朝向西门神道）
  for (const s of [-1, 1]) b.box(s * 34 - 3, 0, -3, s * 34 + 3, 3.7, 3, BJ.marble, { solid: false })
  // 北神道（往皇穹宇方向）
  b.box(-3, 0, -50, 3, 0.2, -34, BJ.marble, { solid: false })
  // 三重檐圆殿
  yuanHall(b, 0, 0, 3.7, { R: 13, bodyH: 21 })
  // 殿内：四根龙井柱 + 十二檐柱 + 祭天宝座（可入殿观内景）
  for (const [lx, lz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) b.boxC(lx, 3.7, lz, 1.1, 17, 1.1, 0xb8860b, { mat: 'wood', solid: false })
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; b.boxC(Math.cos(a) * 9.5, 3.7, Math.sin(a) * 9.5, 0.9, 14, 0.9, BJ.door, { solid: false }) }
  b.boxC(0, 3.7, -4, 4.6, 1.2, 3.6, BJ.gold, { solid: false }) // 祭天宝座
  b.boxC(0, 4.9, -5.6, 2, 2.3, 1, 0xd4af37, { solid: false }) // 宝座背屏
  b.sign('祈年殿', 0, 15, 13.4, 1.4, 0, { bg: '#1d3f7a', fg: '#ffd76a', border: '#d9a628' })
  ctx.interact({ x: 0, z: 0, r: 6, type: 'enter', ty: 4.3, label: '🏛️ 入殿 · 祈年殿内景', fadeText: '🏛️ 入殿中…', banner: ['🏛️ 祈年殿 · 殿内', '四根龙井柱擎起三重蓝檐，殿心陈祭天宝座'] })
  // 坛内古柏列植
  for (const [dx, dz] of [[-26, -18], [26, -18], [-26, 18], [26, 18], [-16, -28], [16, -28]]) pine(b, dx, 0, dz, 1.1)
  // 丹陛桥：祈年殿 → 皇穹宇 / 圜丘（南向甬道，北高南低）
  b.box(-4, 0, 33, 4, 3.2, 44, BJ.marble)
  b.box(-3.4, 0, 44, 3.4, 2.4, 66, BJ.marble)
  railing(b, -4, 33, -4, 66, 3.2, 1, BJ.marble, 2)
  railing(b, 4, 33, 4, 66, 3.2, 1, BJ.marble, 2)
  // 西门外神道 + 祈年门意象（门廊列柱）
  for (const dx of [-9, -4.5, 4.5, 9]) b.boxC(dx + 30, 0, 0, 1, 6, 1, BJ.wall, { solid: false })
  b.box(22, 6, -11, 40, 7.2, 11, BJ.glazeY, { mat: 'roof', solid: false })
  // 皇穹宇（单檐圆殿 + 回音壁）
  buildHuangqiongyu(b)
  // 圜丘坛（三叠圆台 + 天心石）
  buildHuanqiu(b, 0, 76)
  // 古柏林（坛墙内散点）
  for (let i = 0; i < 14; i++) {
    const a = i * 2.399963, r = 40 + (i % 4) * 7
    const x = Math.cos(a) * r, z = Math.sin(a) * r + 30
    if (Math.abs(x) < 8 && z > 15 && z < 100) continue
    roundTree(b, x, 0, z, 0.9, 0x3a6a30)
  }
  // 互动与人流
  ctx.interact({ x: 38, z: 0, r: 7, label: '天坛西门 · 祈年殿', type: 'info', text: '天坛是明清两代皇帝祭天、祈谷的场所，祈年殿以三重蓝琉璃圆檐象征“天圆地方”，是北京的象征。殿内四根“龙井柱”代表四季。' })
  ctx.interact({ x: 0, z: 30, r: 6, label: '丹陛桥远眺祈年殿', type: 'view' })
  ctx.interact({
    x: 0, z: 76, r: 3, label: '圜丘 · 天心石', type: 'info',
    text: '圜丘是皇帝冬至祭天的坛台，台面中心的“天心石”向外环砌九重石板，九为极数。站在石上轻声说话，回音层层叠起，仿佛天与人在对话——这就是著名的声学奇观。'
  })
  ctx.interact({ x: 0, z: 52, r: 4, label: '回音壁下侧耳听墙', type: 'info', text: '皇穹宇外的圆形磨砖对缝围墙就是回音壁：一人贴近墙低声说话，另一人在墙另一端能清晰听见——声波沿光滑弧墙连续反射，传过百米。' })
  ctx.interact({ x: 0, z: 16, r: 4, y: 8, label: '仰观祈年殿三重檐', type: 'view' })
  ctx.interact({ x: 0, z: 30, r: 5, label: '🕊️ 鸽哨掠空', type: 'culture', id: 'geshao' })
  ctx.interact({ x: 34, z: 0, r: 5, label: '🎪 庙会民俗', type: 'culture', id: 'miaohui' })
  ctx.crowd(36, 0, 14, 8, 10)
  ctx.crowd(0, 26, 20, 8, 8)
  ctx.crowd(0, 76, 14, 6, 5)
}

// 皇穹宇 + 回音壁（蓝琉璃圆殿，圆形围墙留 south 入口）
function buildHuangqiongyu(b) {
  const cz = 30
  marbleRing(b, 0, cz, 11, 0, 1.1, BJ.marble, 20)
  yuanHall(b, 0, cz, 1.1, { R: 6.5, bodyH: 11 })
  b.sign('皇穹宇', 0, 7.5, cz + 7, 1, 0, { bg: '#1d3f7a', fg: '#ffd76a', border: '#d9a628' })
  // 回音壁：半径 16 的蓝琉璃顶薄墙，南面开门洞
  const WALL_R = 16, WALL_H = 5
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2
    if (a > Math.PI * 0.42 && a < Math.PI * 0.58) continue // 南面门洞
    b.prism(Math.cos(a) * WALL_R, cz + Math.sin(a) * WALL_R, 0, WALL_H, 0.45, 0.45, 4, BJ.wall, { solid: false })
    b.boxC(Math.cos(a) * WALL_R, WALL_H, cz + Math.sin(a) * WALL_R, 1.0, 0.5, 1.0, BJ.glazeB, { mat: 'roof', solid: false })
  }
}

// 圜丘坛：三层圆台 + 天心石（发声彩蛋）
function buildHuanqiu(b, x, z) {
  marbleRing(b, x, z, 22, 0, 1, BJ.marble, 28)
  marbleRing(b, x, z, 16, 1, 1, BJ.marble, 22)
  marbleRing(b, x, z, 10, 2, 1, BJ.marble, 16)
  // 中心天心石
  b.prism(x, z, 3, 3.2, 1.4, 1.4, 12, 0xd8cfc0, { top: 0xe8e0d0 })
  b.sign('圜丘', x, 4.6, z + 10.6, 0.9, 0, { bg: 'rgba(0,0,0,0)', fg: '#edeae0', px: 48 })
}

export function tiantanLOD(b) {
  b.prism(0, 0, 0, 4, 30, 30, 14, ASTONE)
  yuanHall(b, 0, 0, 4, { R: 13, bodyH: 20 })
  b.prism(0, 30, 0, 8, 8, 8, 10, BJ.wall, { rx1: 2, rz1: 2, solid: false })
  b.prism(0, 76, 0, 3, 20, 20, 14, BJ.marble, { solid: false })
}
