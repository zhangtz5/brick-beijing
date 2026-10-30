// D5 西部园林：颐和园(S) · 圆明园(A)
// 颐和园原点 = 万寿山山巅（佛香阁），+z 朝南（昆明湖/东宫门方向）
import { paifang, chineseHall, paving, railing, roundTree, pine, stoneLion } from './common.js'
import { BJ } from './axis.js'

const YH = {
  stone: 0xa89a80, // 山石
  willow: 0x6a9a4a, // 垂柳
  deck: 0xd8d2c4, // 桥面石
  hull: 0xcfc9bc // 石舫汉白玉
}

// 石拱桥：沿 (x0,z0)→(x1,z1) 起拱，n 孔
function archBridge(b, x0, z0, x1, z1, n, width, color) {
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const ax = x0 + (x1 - x0) * t0, az = z0 + (z1 - z0) * t0
    const bx = x0 + (x1 - x0) * t1, bz = z0 + (z1 - z0) * t1
    const mx = (ax + bx) / 2, mz = (az + bz) / 2
    const hump = 0.5 + Math.sin(Math.PI * ((i + 0.5) / n)) * 0.9
    b.boxC(mx, hump - 0.55, mz, Math.hypot(bx - ax, bz - az) * 0.92, 0.55, width * 0.8, color, { solid: false }) // 桥墩（入水）
    b.box(Math.min(ax, bx) - 0.15, hump, Math.min(az, bz) - 0.15, Math.max(ax, bx) + 0.15, hump + 0.35, Math.max(az, bz) + 0.15, color) // 桥面
  }
  // 侧面石栏
  const dx = (x1 - x0), dz = (z1 - z0), L = Math.hypot(dx, dz)
  const nx = -dz / L, nz = dx / L
  for (const s of [-1, 1]) {
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const px = x0 + dx * t + nx * (width / 2) * s, pz = z0 + dz * t + nz * (width / 2) * s
      const py = 0.5 + Math.sin(Math.PI * t) * 0.9
      b.boxC(px, py + 0.35, pz, 0.22, 0.7, 0.22, BJ.marble, { solid: false })
    }
  }
  // 桥头石狮
  stoneLion(b, x0 + (dx / L) * -1.5, 0.8, z0 + (dz / L) * -1.5, 1)
  stoneLion(b, x1 - (dx / L) * -1.5, 0.8, z1 - (dz / L) * -1.5, 1)
}

// 长廊段落：沿方向步进的石柱 + 绿琉璃檐廊
function corridor(b, x0, z0, x1, z1, color) {
  const L = Math.hypot(x1 - x0, z1 - z0)
  const n = Math.max(2, Math.round(L / 2.2))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t
    b.boxC(x, 0, z - 0.9, 0.4, 3, 0.4, BJ.wall, { solid: false })
    b.boxC(x, 0, z + 0.9, 0.4, 3, 0.4, BJ.wall, { solid: false })
    if (i < n) {
      const t2 = (i + 1) / n
      const x2 = x0 + (x1 - x0) * t2, z2 = z0 + (z1 - z0) * t2
      b.box(Math.min(x, x2) - 0.2, 3, Math.min(z, z2) - 1.3, Math.max(x, x2) + 0.2, 3.5, Math.max(z, z2) + 1.3, 0x3a6a52, { mat: 'roof', solid: false })
      // 檐下彩画枋心
      b.box(Math.min(x, x2), 2.6, Math.min(z, z2) - 1.1, Math.max(x, x2), 3, Math.max(z, z2) + 1.1, BJ.glazeG, { mat: 'roof', solid: false })
    }
  }
}

// ---------------- 颐和园（S 级） ----------------
export function buildYiheyuan(b, ctx) {
  // 万寿山山顶平台 + 佛香阁（八面四层黄琉璃，俯瞰昆明湖官方机位）
  paving(b, -10, -10, 10, 10, 0, BJ.stone, 0.25)
  railing(b, -10, -10, 10, -10, 0.25, 0.9, BJ.marble, 1.6)
  b.prism(0, 0, 0.25, 8, 9, 9, 8, BJ.stone, { rot: Math.PI / 8 }) // 石砌阁基
  let gy = 8
  const levels = [[6.5, 5.5], [5.6, 5], [4.6, 4.5]]
  for (const [rw, hh] of levels) {
    b.prism(0, 0, gy, gy + hh, rw, rw, 8, BJ.door, { rot: Math.PI / 8, solid: false, noBottom: true })
    gy = b.prism(0, 0, gy + hh, gy + hh + 1.6, rw + 2.4, rw + 2.4, 8, BJ.glazeY, { rot: Math.PI / 8, rx1: rw * 0.55, rz1: rw * 0.55, solid: false })
  }
  b.prism(0, 0, gy, gy + 3.6, 4.6, 4.6, 8, BJ.glazeY, { rot: Math.PI / 8, rx1: 0.5, rz1: 0.5, solid: false })
  b.boxC(0, gy + 3.6, 0, 0.8, 2, 0.8, BJ.gold, { solid: false }) // 铜毗卢亭宝顶
  // 佛香阁观景层（登阁俯瞰昆明湖，PRD S 级官方机位）
  const FTY = gy + 3.6
  b.prism(0, 0, FTY, FTY + 0.5, 5.2, 5.2, 8, 0xdfe8f0, { rot: Math.PI / 8, mat: 'stone', solid: true })
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; b.boxC(Math.cos(a) * 5.0, FTY + 0.3, Math.sin(a) * 5.0, 0.3, 0.95, 0.3, BJ.marble, { solid: false }) }
  b.sign('佛香阁', 0, 15.5, 7.2, 1.4, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  ctx.interact({ x: 0, z: 13, r: 4, y: 0, label: '佛香阁 · 登阁电梯', type: 'elevator', deckY: FTY, baseR: 7, elevLabel: '佛香阁电梯', banner: ['🏯 佛香阁 · 观景层', '俯瞰昆明湖、十七孔桥与西山，是颐和园最佳机位'] })
  ctx.interact({ x: 0, z: 0, r: 5, y: FTY + 0.5, label: '佛香阁 · 观景层', type: 'elevatorTop', deckY: FTY, elevLabel: '佛香阁 · 观景层' })
  // 排云殿（山麓正殿，与佛香阁同轴，黄琉璃）
  chineseHall(b, 18, -24, 18, 9, 7, { wall: BJ.wall, col: BJ.door, roof: BJ.glazeY, hip: true, baseColor: BJ.marble, wallMat: 'block' })
  b.sign('排云殿', 18, 8.5, -18.9, 1.1, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  paifang(b, 18, -13, 11, 8, '云辉玉宇', BJ.wall, BJ.glazeY)
  // 长廊（西岸临水，画檐 728m 意象）
  corridor(b, 8, -10, 0, -14, BJ.glazeG)
  corridor(b, 0, -14, -4, -22, BJ.glazeG)
  // 湖南端湖岸树
  for (const [x, z] of [[18, 10], [20, 18], [22, 26]]) roundTree(b, x, 0, z, 0.8, YH.willow)

  // ---- 昆明湖 ----
  // 南湖岛（陆地覆盖 + 涵虚亭）
  ctx.landOverride(38, 22, 68, 52)
  paving(b, 46, 28, 58, 42, 0.1, YH.stone, 0.3)
  for (const [dx, dz] of [[-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5], [3.5, 3.5]]) b.boxC(52 + dx, 0.4, 35 + dz, 0.5, 3.2, 0.5, BJ.door, { solid: false })
  b.hipRoof(52, 35, 9.5, 9.5, 3.6, 2.6, BJ.glazeY, { over: 1, solid: false })
  b.boxC(52, 6.2, 35, 0.5, 1, 0.5, BJ.gold, { solid: false })
  for (const [dx, dz] of [[-7, -4], [7, 5], [-6, 8]]) pine(b, 52 + dx, 0.3, 35 + dz, 0.8)
  // 十七孔桥（东堤 → 南湖岛，17 孔）
  archBridge(b, 44, 6, 53, 28, 17, 4.5, YH.deck)
  b.sign('十七孔桥', 46, 3.2, 8, 1, 0, { bg: 'rgba(0,0,0,0)', fg: '#edeae0', px: 48 })
  // 清晏舫石舫（湖西北岸，西洋舱楼 + 孔雀蓝棚）
  b.box(6, -0.4, -16, 20, 1.2, -12.5, YH.hull, { solid: false })
  b.box(8, -0.4, -15.5, 10, 1.4, -13, YH.hull, { solid: false })
  b.box(9, 1.2, -15.5, 17, 3.4, -13, 0xe8e4da, { mat: 'window', solid: false })
  b.box(9.5, 3.4, -15.2, 16.5, 5, -13.3, 0x4a7a9a, { mat: 'glass', solid: false })
  b.sign('清晏舫', 13, 6, -12.9, 0.7, 0, { bg: '#3a5a6a', fg: '#ffffff' })

  // ---- 东宫门 + 仁寿殿（园南入口区） ----
  paifang(b, 36, 76, 14, 8, '颐和园', BJ.wall, BJ.glazeY)
  paving(b, 26, 62, 46, 78, 0.05, BJ.pave)
  chineseHall(b, 36, 54, 16, 9, 6.5, { wall: 0xb8a888, col: BJ.door, roof: BJ.tile, hip: true, wallMat: 'block' })
  b.sign('仁寿殿', 36, 8, 59, 1, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  for (const dx of [-5, 5]) stoneLion(b, 36 + dx * 1.6, 0.1, 59.5, 1)
  // 铜牛（东堤廓如亭意象）
  b.boxC(41, 0.3, 22, 2.4, 1.2, 1.2, 0x8a6a3a, { solid: false })
  b.boxC(42.2, 1.2, 22, 0.7, 0.7, 0.7, 0x8a6a3a, { solid: false })
  b.sign('铜牛', 41, 2.6, 22, 0.6, 0, { bg: 'rgba(0,0,0,0)', fg: '#5a4a2a', px: 40 })
  // 西堤垂柳
  for (let z = 4; z <= 34; z += 6) roundTree(b, 12, 0, z, 0.9, YH.willow)

  // ---- 互动 / 机位 / 人流 ----
  ctx.interact({ x: 36, z: 80, r: 7, label: '颐和园 · 东宫门', type: 'info', text: '颐和园以万寿山、昆明湖为骨架，借景西山，是保存最完整的皇家园林。原为乾隆为祝孝寿母崇庆皇太后所建清漪园，光绪重建后改名颐和园。' })
  ctx.interact({ x: 0, z: -7, r: 5, y: 9, label: '登佛香阁俯瞰昆明湖', type: 'view' })
  ctx.interact({ x: 50, z: 18, r: 5, label: '十七孔桥 · 十七孔望月', type: 'view' })
  ctx.interact({ x: 13, z: -10, r: 4, label: '石舫边看湖山', type: 'view' })
  ctx.interact({ x: 28, z: 62, r: 5, label: '🎭 京剧 · 德和园大戏楼', type: 'culture', id: 'jingju' })
  ctx.crowd(36, 76, 12, 7, 8)
  ctx.crowd(46, 14, 10, 6, 6)
  ctx.crowd(2, -14, 10, 5, 5)
}

export function yiheyuanLOD(b) {
  b.prism(0, 0, -2, 8, 26, 30, 10, 0x6a7a58, { solid: false }) // 万寿山体量
  b.prism(0, 0, 8, 26, 5.5, 5.5, 8, BJ.door, { rot: Math.PI / 8, solid: false })
  b.prism(0, 0, 26, 32, 7, 7, 8, BJ.glazeY, { rot: Math.PI / 8, rx1: 0.8, rz1: 0.8, solid: false })
  b.boxC(50, 0.5, 25, 16, 1, 14, YH.stone, { solid: false }) // 南湖岛
}

// ---------------- 圆明园（A 级） ----------------
// 原点 = 大水法遗址，+z 朝南
export function buildYuanmingyuan(b, ctx) {
  // 西洋楼遗址：残白石柱列 + 断拱（大水法标志性剪影）
  const RU = 0xd9d4c4
  // 主拱门残迹（两根整柱 + 断柱 + 门楣）
  for (const dx of [-3, 3]) b.boxC(dx, 0, 0, 0.9, 7, 0.9, RU, { solid: false })
  b.box(-4.2, 7, -0.6, 4.2, 8.6, 0.6, RU, { solid: false })
  b.boxC(-1.2, 0, 1.6, 0.8, 3.4, 0.8, RU, { solid: false }) // 断柱
  b.boxC(2.4, 0, -1.8, 0.8, 4.8, 0.8, RU, { solid: false })
  // 渐进残柱群（线列 + 倒卧石块）
  for (let i = 0; i < 8; i++) {
    const x = -14 + i * 4, z = 6 + (i % 3) * 3
    const hh = [6.5, 4, 2.2, 0][i % 4]
    if (hh > 0) b.boxC(x, 0, z, 0.8, hh, 0.8, RU, { solid: false })
    else b.box(x - 1.2, 0, z - 0.7, x + 1.2, 0.9, z + 0.7, 0xcac4b4, { solid: false })
  }
  // 散落的雕花石件与喷泉池遗址
  b.box(-8, -0.2, -8, 8, 0.2, -2, 0xbcc8c0, { solid: false })
  b.rbox(0, 1.2, -22, 10, 0.8, 5, 0, 0.5, 0, 0xcac4b4, { solid: false })
  for (const [x, z, a] of [[-16, -6, 0.7], [14, -10, -0.4], [-6, 16, 1.2]]) b.rbox(x, 0.5, z, 3.5, 0.8, 1.6, 0, a, 0, 0xc4beae, { solid: false })
  // 海晏堂石屏（“海晏”取河清海晏之意，生肖兽首喷水池即在此）
  b.boxC(-8, 0, 10, 0.5, 3.6, 0.9, 0x8a8478, { solid: false })
  b.boxC(-8, 3.6, 10, 0.8, 0.5, 1.2, 0x8a8478, { solid: false })
  b.sign('海晏堂', -8, 5, 10, 0.9, 0, { bg: 'rgba(0,0,0,0)', fg: '#5a4a2a', px: 44 })
  // 福海方向指路 + 秋色柳
  for (let i = 0; i < 6; i++) roundTree(b, -24 + i * 9, 0, 20 + (i % 2) * 4, 0.85, 0x7a8a3a)
  ctx.interact({ x: 0, z: 6, r: 7, label: '圆明园 · 大水法遗址', type: 'info', text: '圆明园汇集南北园林之胜，曾被称作“万园之园”。1860 年遭英法联军劫焚，西洋楼石件残柱成为遗址公园的标志性剪影，警示后人。' })
  ctx.interact({ x: -6, z: -8, r: 5, label: '残柱夕阳 · 官方机位', type: 'view' })
  ctx.interact({ x: -8, z: 10, r: 4, label: '海晏堂 · 十二生肖喷泉', type: 'info', text: '海晏堂取“河清海晏”之意，阶前十二生肖兽首人像按时辰轮番喷水，是西洋楼最精巧的喷泉。1860 年兽首散佚，成为国宝寻回的往事。' })
  ctx.interact({ x: 14, z: -10, r: 4, label: '观水法 · 西洋楼残迹', type: 'info', text: '观水法是乾隆观赏喷泉的坐台，五道石屏与巴洛克雕饰环绕，如今只剩残迹，静卧荒草间。' })
  ctx.interact({ x: -16, z: -6, r: 4, label: '西洋楼 · 残柱遗存', type: 'info', text: '西洋楼由郎世宁等设计，融合巴洛克与中国技法，大水法、海晏堂、远瀛观皆在此。残柱断拱成为遗址公园的标志。' })
  ctx.interact({ x: 0, z: -22, r: 5, label: '大水法石龛 · 官方机位', type: 'view' })
  ctx.crowd(0, 10, 12, 6, 5)
}

export function yuanmingyuanLOD(b) {
  for (const dx of [-3, 3]) b.boxC(dx, 0, 0, 0.9, 7, 0.9, 0xd9d4c4, { solid: false })
  b.box(-4.2, 7, -0.6, 4.2, 8.6, 0.6, 0xd9d4c4, { solid: false })
}

// ---------------- 香山公园（A 级） ----------------
// 原点 = 香炉峰顶（由 geo.js HILLS 生成山体），秋叶红叶点景
export function buildXiangshan(b, ctx) {
  // 峰顶平台 + 观光亭
  paving(b, -8, -8, 8, 8, 0, YH.stone, 0.25)
  railing(b, -8, -8, 8, -8, 0.25, 0.9, BJ.marble, 1.5)
  railing(b, -8, 8, 8, 8, 0.25, 0.9, BJ.marble, 1.5)
  for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) b.boxC(dx, 0.25, dz, 0.45, 3, 0.45, BJ.door, { solid: false })
  b.hipRoof(0, 0, 8, 8, 3.2, 2.4, BJ.glazeY, { over: 0.8, solid: false })
  b.boxC(0, 5.6, 0, 0.4, 0.8, 0.4, BJ.gold, { solid: false })
  b.sign('香炉峰', 0, 4.4, 3.4, 0.9, 0, { bg: '#7a3a2a', fg: '#ffe08a' })
  // 红叶黄栌散点（体块暖色树冠）
  const REDS = [0xc4553a, 0xd97742, 0xb04a30, 0xc86a3a]
  for (let i = 0; i < 16; i++) {
    const a = i * 2.399963, r = 14 + (i % 5) * 6
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    const hy = ctx.height(x, z)
    roundTree(b, x, Math.max(-14, -hy), z, 0.85, REDS[i % 4])
  }
  ctx.interact({ x: 0, z: 4, r: 5, label: '香炉峰顶 · 西山晴雪', type: 'view' })
  ctx.interact({
    x: 0, z: -4, r: 4, label: '香山 · 红叶季', type: 'info',
    text: '香山主峰香炉峰海拔 557 米，“香山红叶”名满京华，每至深秋黄栌尽染。登顶可俯瞰北京西城，是重阳登高的老北京习俗。'
  })
  ctx.crowd(0, 0, 8, 4, 5)
}
