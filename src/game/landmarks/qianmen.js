// D8-C 前门·大栅栏（S 级）：正阳门城楼 + 箭楼 + 瓮城 + 前门大街老字号 + 大栅栏商圈
// 局部坐标 +z 朝南（箭楼/大街方向），原点 = 正阳门城楼。补齐中轴线南段，承接烤鸭/兔儿爷/胡同京味
import { paifang, stall, stoneLion, paving, roundTree, lamp } from './common.js'
import { BJ } from './axis.js'

const GREY = BJ.brick
const WOOD = 0x6a4a30

// 正阳门城楼：砖砌城台（开门洞）+ 重檐三滴水歇山黄琉璃
function cityGate(b, cz, w, d, th, name) {
  b.box(-w / 2, 0, cz - d / 2, -5, th, cz + d / 2, GREY, { mat: 'block' })
  b.box(5, 0, cz - d / 2, w / 2, th, cz + d / 2, GREY, { mat: 'block' })
  b.box(-5, th * 0.66, cz - d / 2, 5, th, cz + d / 2, GREY, { mat: 'block' })
  b.box(-4.4, 0, cz + d / 2 + 0.05, 4.4, th * 0.62, cz + d / 2 + 0.35, BJ.door, { mat: 'block', solid: false }) // 门洞券门
  b.box(-w / 2 - 0.6, th, cz - d / 2 - 0.6, w / 2 + 0.6, th + 1.1, cz + d / 2 + 0.6, BJ.marble, { solid: false }) // 城台女墙
  // 城楼殿身（面阔七间，红墙柱廊）
  const ly = th + 1.1, lh = 8
  b.box(-w / 2 + 5, ly, cz - d / 2 + 2, w / 2 - 5, ly + lh, cz + d / 2 - 2, BJ.wall, { mat: 'block' })
  const n = 6
  for (let i = 0; i <= n; i++) b.boxC(-w / 2 + 6 + (i * (w - 12)) / n, ly, cz + d / 2 - 1.4, 0.5, lh * 0.82, 0.5, BJ.door, { solid: false })
  // 三重檐（下/中/上）+ 正脊
  b.box(-w / 2 - 1, ly + lh, cz - d / 2 - 1, w / 2 + 1, ly + lh + 1, cz + d / 2 + 1, BJ.glazeY, { mat: 'roof', solid: false })
  const mw = w - 12, md = d - 3
  b.box(-mw / 2 - 1, ly + lh + 2.4, cz - md / 2 - 1, mw / 2 + 1, ly + lh + 3.2, cz + md / 2 + 1, BJ.glazeY, { mat: 'roof', solid: false })
  const top = b.hipRoof(0, cz, mw, md, ly + lh + 3.2, md * 0.62, BJ.glazeY, { over: 1.1, minW: mw * 0.42, minD: md * 0.4 })
  b.box(-mw / 2 + 1, top, cz - 0.45, mw / 2 - 1, top + 0.8, cz + 0.45, BJ.gold, { solid: false })
  if (name) b.sign(name, 0, ly + lh + 1.4, cz + d / 2 + 1.3, 1.6, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  return top + 0.8
}

// 箭楼：城台 + 南面满布箭窗 + 单檐歇山
function archeryTower(b, cz, w, d, th, name) {
  b.box(-w / 2, 0, cz - d / 2, w / 2, th, cz + d / 2, GREY, { mat: 'block' })
  b.box(-w / 2 - 0.6, th, cz - d / 2 - 0.6, w / 2 + 0.6, th + 1, cz + d / 2 + 0.6, BJ.marble, { solid: false })
  // 南面箭窗（白色券窗阵列）
  const cols = Math.floor((w - 6) / 3)
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < cols; c++) {
      const x = -w / 2 + 3 + c * 3 + 0.6, y = 2 + r * 2.4
      b.box(x, y, cz + d / 2 + 0.05, x + 1.4, y + 1.5, cz + d / 2 + 0.25, 0xe8e4da, { mat: 'block', solid: false })
      b.box(x + 0.35, y + 0.3, cz + d / 2 + 0.26, x + 1.05, y + 1.1, cz + d / 2 + 0.32, 0x2a2a30, { solid: false })
    }
  // 单檐歇山顶
  const ly = th + 1
  b.box(-w / 2 + 4, ly, cz - d / 2 + 1, w / 2 - 4, ly + 2.2, cz + d / 2 - 1, BJ.wall, { mat: 'block' })
  b.box(-w / 2 - 1, ly + 2.2, cz - d / 2 - 1.4, w / 2 + 1, ly + 3, cz + d / 2 + 1.4, BJ.glazeY, { mat: 'roof', solid: false })
  const top = b.hipRoof(0, cz, w - 6, d, ly + 3, d * 0.5, BJ.glazeY, { over: 1, minW: (w - 6) * 0.4 })
  b.box(-(w - 6) / 2 + 1, top, cz - 0.4, (w - 6) / 2 - 1, top + 0.7, cz + 0.4, BJ.gold, { solid: false })
  if (name) b.sign(name, 0, ly + 1.4, cz + d / 2 + 1.3, 1.3, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  return top
}

// 前门大街老字号铺面：两层木构 + 匾额 + 幌子；toward=-1 门脸朝西（东岸店），+1 朝东（西岸店）
function shopFront(b, x, z, w, name, toward) {
  const depth = 9
  const inner = x, outer = x - toward * depth
  const x0 = Math.min(inner, outer), x1 = Math.max(inner, outer)
  b.box(x0, 0, z - w / 2, x1, 7, z + w / 2, WOOD, { mat: 'wood' })
  b.box(x0 - 0.4, 7, z - w / 2 - 0.6, x1 + 0.4, 7.9, z + w / 2 + 0.6, BJ.glazeY, { mat: 'roof', solid: false }) // 檐口
  b.box(inner - 0.1, 0, z - w / 2 + 1.2, inner + 0.1, 4.6, z + w / 2 - 1.2, 0x2a2018, { solid: false }) // 门脸暗面
  for (let i = 0; i < 2; i++) { const zz = z - w / 4 + i * w / 2; b.box(inner + toward * 0.05, 4.4, zz - 1, inner + toward * 0.2, 6.2, zz + 1, 0x8ab0c8, { mat: 'window', solid: false }) } // 二层窗
  b.sign(name, inner + toward * 0.4, 5.5, z, 1.15, toward > 0 ? Math.PI / 2 : -Math.PI / 2, { bg: '#1a1408', fg: '#ffd76a', border: '#8a6a2a' }) // 匾额
  b.box(inner + toward * 0.7, 4.2, z + w / 2 - 2, inner + toward * 0.9, 6.8, z + w / 2 - 1.7, 0xc0392b, { mat: 'neon', solid: false }) // 幌子
}

// ---------------- 前门·大栅栏（S 级） ----------------
export function buildQianmen(b, ctx) {
  // 正阳门城楼（北）+ 箭楼（南）+ 瓮城
  cityGate(b, 0, 52, 16, 12, '正阳门')
  archeryTower(b, 48, 44, 14, 11, '箭楼')
  for (const s of [-1, 1]) b.box(s * 26 - 1.5, 0, 4, s * 26 + 1.5, 8, 44, GREY, { mat: 'block' }) // 瓮城东西墙
  for (let i = 0; i <= 6; i++) { const a = Math.PI * (i / 6); const x = Math.cos(a) * 26, z = 44 + Math.sin(a) * 6; b.boxC(x, 4, z, 3.4, 8, 3.4, GREY, { mat: 'block', solid: false }) } // 瓮城南端弧形
  // 城台石狮 + 登城马道
  for (const s of [-1, 1]) { stoneLion(b, s * 8, 0.1, 10, 1); stoneLion(b, s * 8, 0.1, -10, -1) }

  // 前门大街（步行街 + 两侧老字号）
  paving(b, -15, 56, 15, 132, 0.05, BJ.pave, 0.1)
  b.box(-1.5, 0.1, 58, 1.5, 0.2, 130, 0xb8a888, { mat: 'stone', solid: false }) // 御路石意象
  const west = ['瑞蚨祥', '内联升', '同仁堂', '都一处'], east = ['全聚德', '张一元', '谦祥益', '六必居']
  for (let i = 0; i < 4; i++) {
    const z = 66 + i * 17
    shopFront(b, -22, z, 11, west[i], 1) // 西岸门脸朝东
    if (i < 3) shopFront(b, 22, z + 8, 11, east[i], -1) // 东岸门脸朝西
  }
  // 路灯与槐树
  for (let z = 60; z <= 130; z += 12) { lamp(b, -17, 0, z, 5, 'old'); roundTree(b, 17, 0, z + 6, 0.85, BJ.tree) }

  // 大栅栏商圈（大街东侧，向东支街 + 牌楼 + 小吃摊）
  paifang(b, 40, 90, 16, 9, '大栅栏', BJ.wall, BJ.glazeY)
  paving(b, 26, 84, 66, 96, 0.05, BJ.pave, 0.1)
  stall(b, 34, 82, 0, 0xc0392b, '兔儿爷', 1)
  stall(b, 50, 98, Math.PI, 0x2a6ab0, '吹糖人', -1)
  stall(b, 58, 82, 0, 0x2a8a4a, '糖葫芦', 1)
  for (const dx of [30, 46, 60]) roundTree(b, dx, 0, 90, 0.7, BJ.tree)

  // 互动 / 文化 / 商店 / 机位 / 人流
  ctx.interact({ x: 0, z: -16, r: 7, label: '前门·大栅栏', type: 'info', text: '前门即正阳门，是明清北京内城的正门，由城楼、箭楼、瓮城组成。“前门楼子九丈九”，是老北京的地标。城楼南的前门大街与大栅栏汇聚瑞蚨祥、内联升、同仁堂、全聚德等百年老字号，商贾云集、市井繁华。' })
  ctx.interact({ x: 0, z: 62, r: 6, label: '正阳门箭楼 · 中轴南望', type: 'view' })
  ctx.interact({ x: 16, z: 74, r: 4, label: '🦆 全聚德 · 挂炉烤鸭', type: 'culture', id: 'kaoya' })
  ctx.interact({ x: 34, z: 82, r: 4, label: '🐰 兔儿爷 · 京节吉祥物', type: 'culture', id: 'tueye' })
  ctx.interact({ x: 40, z: 90, r: 5, label: '🏘️ 大栅栏 · 胡同市井', type: 'culture', id: 'hutong' })
  ctx.interact({ x: 20, z: 74, r: 3, label: '全聚德烤鸭店 · 买一只', type: 'shop', shop: 'roastduck' })
  ctx.interact({ x: -20, z: 66, r: 3, label: '前门老字号 · 手信', type: 'shop', shop: 'qianmen' })
  ctx.crowd(0, 70, 16, 8, 12)
  ctx.crowd(40, 90, 14, 7, 8)
}

export function qianmenLOD(b) {
  b.box(-26, 0, -8, 26, 20, 8, BJ.wall, { mat: 'block', solid: false }) // 城楼
  b.box(-22, 0, 42, 22, 16, 54, GREY, { mat: 'block', solid: false }) // 箭楼
  b.box(-15, 0.1, 56, 15, 0.3, 130, BJ.pave, { mat: 'stone', solid: false }) // 大街
}
