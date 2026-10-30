// D6 远郊 · 八达岭长城（S 级，独立传送场景岛）
// 沿燕山山脊蜿蜒的砖石城墙：马道可行走、两侧垛口女墙、方形敌楼、登城阶梯、好汉坡陡升段
// 地标 foundation=true，原点坐落在山脊制高点（北八楼意象），+z 朝南
import { terrainHeight } from '../geo.js'
import { pine, roundTree } from './common.js'

const WALL = 0x9a9088 // 长城灰砖
const WALL_D = 0x7d7568 // 暗砖
const WALK = 0xbdb4a4 // 马道石板
const CREN = 0xcac2b2 // 垛口

export function buildGreatWall(b, ctx) {
  const gy = (x, z) => terrainHeight(b.wx(x, z), b.wz(x, z)) - b.oy // 相对地标原点的地形高（可负）
  const X = (z) => Math.sin(z * 0.03) * 46 // 山脊蜿蜒中线
  const WT = 6, CW = 6 // 马道相对地形高、城宽
  const pts = []
  for (let z = -108; z <= 108; z += 3) pts.push({ z, x: X(z), y: gy(X(z), z) })

  // ---- 城墙主体（z 单调推进，x 随山脊摆动） ----
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    const top = p.y + WT
    b.box(p.x - CW / 2, p.y - 5, p.z - 1.6, p.x + CW / 2, top, p.z + 1.6, WALL, { mat: 'brick' }) // 墙身（嵌入山坡）
    b.box(p.x - CW / 2, top, p.z - 1.6, p.x + CW / 2, top + 0.35, p.z + 1.6, WALK, { mat: 'stone' }) // 马道（可行走）
    b.box(p.x - CW / 2 - 0.5, top, p.z - 1.5, p.x - CW / 2, top + 2.2, p.z + 1.5, WALL_D, { mat: 'brick' }) // 外侧女墙
    b.box(p.x + CW / 2, top, p.z - 1.5, p.x + CW / 2 + 0.5, top + 2.2, p.z + 1.5, WALL_D, { mat: 'brick' }) // 内侧宇墙
    if (i % 2 === 0) { // 垛口齿
      b.box(p.x - CW / 2 - 0.6, top + 2.2, p.z - 0.55, p.x - CW / 2, top + 3.1, p.z + 0.55, CREN, { mat: 'stone', solid: false })
      b.box(p.x + CW / 2, top + 2.2, p.z - 0.55, p.x + CW / 2 + 0.6, top + 3.1, p.z + 0.55, CREN, { mat: 'stone', solid: false })
    }
  }

  // ---- 敌楼（方形双层台，跨城墙） ----
  for (const bz of [-78, -30, 24, 72]) {
    const bx = X(bz), by = gy(bx, bz) + WT
    b.box(bx - CW / 2 - 3, by - 6, bz - 8, bx + CW / 2 + 3, by + 7, bz + 8, WALL, { mat: 'brick' })
    b.box(bx - CW / 2 - 4, by + 7, bz - 9, bx + CW / 2 + 4, by + 8, bz + 9, WALK, { mat: 'stone' }) // 敌楼顶平台
    for (let k = -8; k <= 8; k += 3) { // 顶层垛口
      b.box(bx - CW / 2 - 4, by + 8, bz + k, bx - CW / 2 - 2.8, by + 8.9, bz + k + 1.2, CREN, { solid: false })
      b.box(bx + CW / 2 + 2.8, by + 8, bz + k, bx + CW / 2 + 4, by + 8.9, bz + k + 1.2, CREN, { solid: false })
    }
    for (const dz of [-8.2, 8.2]) b.box(bx - 1.6, by - 5, bz + dz - 0.2, bx + 1.6, by + 2, bz + dz + 0.2, 0x35302a, { solid: false }) // 南北券门
    b.sign('敌楼', bx, by + 9.5, bz, 0.7, 0, { bg: 'rgba(0,0,0,0)', fg: '#4a4238', px: 40 })
  }

  // ---- 登城阶梯（起点 + 中点，从马道下到地面） ----
  const stair = (p) => {
    const sw = p.y + WT + 0.35
    for (let k = 0; k < 12; k++) b.box(p.x + CW / 2, sw - 0.6 * (k + 1), p.z - 2.2, p.x + CW / 2 + 0.9 * (k + 1), sw - 0.6 * k, p.z + 2.2, WALK, { mat: 'stone' })
  }
  stair(pts[0]); stair(pts[pts.length >> 1])

  // ---- 山脊松柏 + 秋色 ----
  for (let z = -104; z <= 104; z += 13) {
    for (const s of [-1, 1]) {
      const x = X(z) + s * (CW / 2 + 8 + (Math.abs(z) % 7))
      const y = gy(x, z)
      if (z > 40 && (z % 3) === 0) roundTree(b, x, y, z, 0.9, 0xb4552a) // 好汉坡红叶
      else pine(b, x, y, z, 1)
    }
  }

  b.sign('八达岭长城', X(0) , gy(X(0), 0) + WT + 11, 0, 2, 0, { bg: '#3a3428', fg: '#e8dcc0', glow: true })
  const mid = pts[pts.length >> 1]
  ctx.interact({ x: X(96), z: 96, r: 7, label: '八达岭长城 · 天下九塞', type: 'info', text: '八达岭长城是明长城中保存最完好、最具代表性的一段，居庸关外镇。城墙随山脊起伏，敌楼相望。“不到长城非好汉”，北八楼是海拔最高的制高点。' })
  ctx.interact({ x: X(90), z: 90, r: 6, label: '好汉坡 · 陡登北八楼', type: 'view' })
  ctx.interact({ x: mid.x, z: mid.z, r: 10, type: 'enter', label: '🏯 登上长城马道（不到长城非好汉）', ty: mid.y + WT + 0.5, fadeText: '🏯 登城中…', banner: ['🏯 八达岭长城 · 马道', '“不到长城非好汉”——沿城垒向西可登好汉坡敌楼'] })
  ctx.crowd(X(0), 0, 12, 8, 6)
}

export function greatwallLOD(b) {
  const X = (z) => Math.sin(z * 0.03) * 46
  for (let z = -108; z <= 108; z += 12) {
    const x = X(z)
    b.box(x - 3, 2, z - 6, x + 3, 9, z + 6, WALL, { mat: 'brick', solid: false })
  }
}
