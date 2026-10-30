// 景山公园(A)：万春亭 + 五亭山脊 · 俯瞰故宫中轴官方机位
// 钟鼓楼(A)：钟楼 + 鼓楼 · 暮鼓晨钟彩蛋
import { paving, railing, roundTree, stoneLion } from './common.js'
import { BJ } from './axis.js'

// ---------------- 景山 ----------------
// 山体由 geo.js HILLS 程序化生成（45 格高），本建筑只落山顶亭台
// 局部原点 = 万春亭（山巅），+z 朝南（故宫方向）
export function buildJingshan(b, ctx) {
  // 万春亭：四方重檐绿琉璃攒尖
  paving(b, -7, -7, 7, 7, 0, BJ.marble, 0.2)
  railing(b, -7, -7, 7, -7, 0.2, 0.9, BJ.marble, 1.4)
  railing(b, -7, 7, 7, 7, 0.2, 0.9, BJ.marble, 1.4)
  for (const [dx, dz] of [[-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]])
    b.boxC(dx, 0.2, dz, 0.6, 4.4, 0.6, BJ.door, { solid: false })
  b.box(-6.2, 4.6, -6.2, 6.2, 5.4, 6.2, BJ.glazeG, { mat: 'roof', solid: false })
  const t1 = b.hipRoof(0, 0, 8, 8, 5.4, 2.2, BJ.glazeG, { over: 1 })
  b.box(-3.4, t1, -3.4, 3.4, t1 + 2.6, 3.4, BJ.door, { mat: 'block', solid: false })
  const t2 = b.hipRoof(0, 0, 5, 5, t1 + 2.6, 2.4, BJ.glazeG, { over: 0.8 })
  b.boxC(0, t2, 0, 0.6, 1.4, 0.6, BJ.gold, { solid: false })
  b.sign('万春亭', 0, 6.6, 5.4, 1, 0, { bg: '#2a4a34', fg: '#ffd76a', border: '#d9a628' })
  // 山脊五亭意象：西侧三座小亭（辑芳/观妙/周赏简化）
  for (const dx of [-16, -26, 16, 26]) {
    const hy = ctx.height(dx, 0)
    if (hy < -12) continue
    const y = Math.max(-6, -hy)
    for (const [px, pz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) b.boxC(dx + px, y, pz, 0.4, 2.6, 0.4, BJ.door, { solid: false })
    b.hipRoof(dx, 0, 5, 5, y + 2.2, 1.8, dx < 0 ? BJ.glazeY : BJ.glazeG, { over: 0.7, solid: false })
  }
  // 下山步道两侧古柏
  for (let z = 8; z <= 40; z += 8) {
    const hy = ctx.height(0, z)
    const y = Math.max(-8, -hy)
    roundTree(b, -5, y, z, 0.8, 0x3a6a30)
    roundTree(b, 5, y, z, 0.8, 0x3a6a30)
  }
  // 官方推荐机位：景山之巅俯瞰故宫中轴线
  ctx.interact({
    x: 0, z: 4, r: 5, label: '景山之巅 · 俯瞰故宫中轴线', type: 'view',
    id: 'peak'
  })
  ctx.interact({ x: 0, z: -6, r: 4, y: 6, label: '万春亭中感受“中轴之眼”', type: 'view' })
  ctx.interact({ x: 0, z: 0, r: 5, label: '🧭 北京中轴线', type: 'culture', id: 'zhongzhou' })
  ctx.crowd(0, 2, 10, 6, 8)
}

// ---------------- 钟鼓楼 ----------------
// 局部 +z 朝南（鼓楼方向），原点 = 钟楼
const GREY = BJ.brick
function towerBase(b, x, z, w, d, h, openings) {
  // 砖砌高台 + 门洞
  b.box(x - w / 2, 0, z - d / 2, x + w / 2, h, z + d / 2, GREY, { mat: 'block' })
  for (let i = 0; i < openings; i++) {
    const ox = x - w / 2 + (i + 0.5) * (w / openings)
    b.box(ox - 1.3, 0, z + d / 2 - 0.3, ox + 1.3, 4.2, z + d / 2 + 0.3, 0x3a3a40, { solid: false })
    b.box(ox - 1.3, 0, z - d / 2 - 0.3, ox + 1.3, 4.2, z - d / 2 + 0.3, 0x3a3a40, { solid: false })
  }
  b.box(x - w / 2 - 0.8, h, z - d / 2 - 0.8, x + w / 2 + 0.8, h + 0.7, z + d / 2 + 0.8, BJ.marble, { solid: false })
}

function towerHall(b, x, z, w, d, y, roof, name, signZ) {
  // 城楼：红墙柱廊 + 单檐歇山意象 + 匾额
  b.box(x - w / 2, y, z - d / 2, x + w / 2, y + 6.5, z + d / 2, BJ.wall, { mat: 'block' })
  const n = Math.round(w / 3.5)
  for (let i = 0; i <= n; i++) b.boxC(x - w / 2 + (i * w) / n, y, z + d / 2 + 0.8, 0.5, 5.6, 0.5, BJ.door, { solid: false })
  b.box(x - w / 2 - 1.6, y + 6.5, z - d / 2 - 1.6, x + w / 2 + 1.6, y + 7.4, z + d / 2 + 1.6, roof, { mat: 'roof', solid: false })
  const top = b.hipRoof(x, z, w, d, y + 7.4, 3.4, roof, { over: 1.4 })
  b.box(x - w / 2 - 0.2, top, z - 0.4, x + w / 2 + 0.2, top + 0.7, z + 0.4, BJ.gold, { solid: false })
  if (name) b.sign(name, x, y + 8.4, signZ, 1.3, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  return top
}

export function buildZhonggu(b, ctx) {
  // 钟楼（北）：灰砖高台开券门，上覆单檐重檐灰琉璃
  towerBase(b, 0, -14, 20, 12, 8, 3)
  towerHall(b, 0, -14, 16, 9, 8.7, BJ.tile, '钟楼', -14 + 5.4)
  // 钟楼正脊悬“钟”意象
  b.boxC(0, 20.5, -14, 1.6, 2.2, 1.6, 0x6a5a2a, { mat: 'lamp', solid: false })
  // 鼓楼（南）：红墙台基 + 两层楼阁
  towerBase(b, 0, 16, 24, 14, 6, 5)
  const gy = 6.7
  b.box(-10, gy, 16 - 6, 10, gy + 5.5, 16 + 6, BJ.wall, { mat: 'block' })
  b.box(-11.5, gy + 5.5, 16 - 7.5, 11.5, gy + 6.3, 16 + 7.5, BJ.glazeY, { mat: 'roof', solid: false })
  b.box(-9, gy + 6.3, 16 - 5, 9, gy + 10.5, 16 + 5, BJ.wall, { mat: 'block' })
  b.hipRoof(0, 16, 18, 10, gy + 10.5, 3.2, BJ.glazeY, { over: 1.2 })
  b.sign('鼓楼', 0, gy + 8.6, 16 + 6.3, 1.3, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  // 鼓檐下红灯笼
  for (const dx of [-8, -4, 0, 4, 8]) b.boxC(dx, gy + 5.9, 16 + 6.6, 0.7, 0.9, 0.7, 0xc03328, { mat: 'lamp', solid: false })
  // 更楼前小广场 + 石狮
  paving(b, -22, -4, 22, 8, 0.05, BJ.pave)
  stoneLion(b, -5, 0.05, 6, 1)
  stoneLion(b, 5, 0.05, 6, 1)
  // 钟楼内外可登临（简化：梯道 + 顶层平台）
  b.box(7, 0, -14 - 5, 9, 8.7, -14 + 5, BJ.brick, { solid: false })
  for (let i = 0; i < 12; i++) b.box(7, 0.7 * i, -14 + 4.6 - i * 0.8, 9, 0.7 * (i + 1), -14 + 5.4 - i * 0.8, BJ.marble, { solid: false })
  // 互动
  ctx.interact({
    x: 0, z: 4, r: 7, label: '钟鼓楼 · 暮鼓晨钟', type: 'info',
    text: '元代始建的报时中心：“暮鼓晨钟”报全城时辰，鼓楼置更鼓二十四面，钟楼悬铜钟。老北京人说“钟鼓楼的时辰——到了”，京味十足。'
  })
  ctx.interact({ x: 0, z: -14 + 8, r: 4, y: 9, label: '登上钟楼远眺中轴北端', type: 'view' })
  ctx.interact({ x: 0, z: 16 + 8, r: 4, y: 7, label: '鼓楼上听二十四面更鼓', type: 'info', text: '击鼓十三声为一回合：“紧十三、慢三、又十三”，报警亦报安，老北京听得懂鼓点的急缓。' })
  ctx.interact({ x: -7, z: 4, r: 5, label: '🏘️ 胡同文化', type: 'culture', id: 'hutong' })
  ctx.interact({ x: 7, z: 4, r: 5, label: '🏠 四合院', type: 'culture', id: 'siheyuan' })
  ctx.interact({ x: 0, z: -3, r: 5, label: '🎤 相声与京韵大鼓', type: 'culture', id: 'erjing' })
  // 钟楼顶观景平台（可登楼远眺）
  const ZDY = 19
  b.box(-8, ZDY, -20, 8, ZDY + 0.5, -8, 0xdfe8f0, { mat: 'stone', solid: true })
  railing(b, -8, -20, 8, -20, ZDY + 0.5, 0.9, BJ.marble, 2)
  railing(b, -8, -8, 8, -8, ZDY + 0.5, 0.9, BJ.marble, 2)
  ctx.interact({ x: 0, z: -4, r: 5, type: 'enter', ty: ZDY, tx: 0, tz: -14, label: '🔔 登钟楼 · 远眺中轴北端', fadeText: '🔔 登楼中…', banner: ['🔔 钟鼓楼 · 钟楼顶', '俯瞰鼓楼、胡同与奥林匹克塔'] })
  ctx.crowd(0, 5, 14, 7, 10)
}
