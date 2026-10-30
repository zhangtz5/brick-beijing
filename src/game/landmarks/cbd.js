// D6 东部 CBD(A/S)：中国尊(中信大厦,收分花樽形) · 央视总部「大裤衩」(悬挑闭环) · 国贸天际线
// 局部坐标 +z 朝南。比例参考广州 CBD 楼（528m→约 210 单位）
import { mulberry32 } from '../util.js'
import { paving, roundTree, lamp, modernTower, railing } from './common.js'
import { BJ } from './axis.js'

const GLASS = 0x8fb4d0 // 玻璃幕墙蓝灰
const GLASS_D = 0x5f7f9a
// 中国尊观光电梯/观景台参数（局部高度，供 Game.js 使用）
export const ZZZ = { DECK_Y: 226, H: 210, BASE_R: 17 }

// ---------------- 中国尊 · 中信大厦（528m，北京第一高楼，S 级） ----------------
// 造型：圆角八角平面，底部宽→中部收腰→顶部樽口外撇，如古代礼器「尊」
export function buildZhongguozun(b, ctx) {
  const H = 210, R0 = 17, SEC = 18
  const rOf = (t) => R0 * (1 - 0.34 * Math.sin(Math.PI * Math.min(1, t * 0.92)) + 0.16 * t * t) // 收腰 + 顶部外撇
  // 裙房基座
  b.box(-R0 - 8, 0, -R0 - 8, R0 + 8, 10, R0 + 8, GLASS_D, { mat: 'curtain' })
  // 主塔：逐段八角棱柱，半径沿高度变化
  for (let i = 0; i < SEC; i++) {
    const t0 = i / SEC, t1 = (i + 1) / SEC
    const y0 = 10 + t0 * (H - 10), y1 = 10 + t1 * (H - 10)
    b.prism(0, 0, y0, y1, rOf(t0), rOf(t0), 8, GLASS, { mat: 'curtain', rx1: rOf(t1), rz1: rOf(t1), rot: Math.PI / 8, open: i < SEC - 1 })
    // 白色竖向肋（八角棱线强调收分轮廓）
    for (let k = 0; k < 8; k++) {
      const a = Math.PI / 8 + (k / 8) * Math.PI * 2
      b.beam(Math.cos(a) * (rOf(t0) + 0.3), y0, Math.sin(a) * (rOf(t0) + 0.3), Math.cos(a) * (rOf(t1) + 0.3), y1, Math.sin(a) * (rOf(t1) + 0.3), 0.5, 0xeef2f5)
    }
  }
  // 顶部「樽口」：外撇收边 + 中央内凹开口
  const rt = rOf(1)
  b.prism(0, 0, H + 10, H + 16, rt, rt, 8, 0xdfe6ec, { rot: Math.PI / 8, rx1: rt * 1.06, rz1: rt * 1.06 })
  b.prism(0, 0, H + 12, H + 17, rt * 0.6, rt * 0.6, 8, 0x30404a, { rot: Math.PI / 8, solid: false }) // 凹口
  b.boxC(0, H + 17, 0, 1, 8, 1, 0xd0d0d0, { solid: false })
  b.boxC(0, H + 25, 0, 1.2, 1.2, 1.2, 0xff3030, 'lamp')
  // 226 米天空观景台：玻璃地板平台 + 汉白玉围栏（可登临俯瞰全城）
  const DY = 226
  b.box(-rt * 0.72, DY, -rt * 0.72, rt * 0.72, DY + 0.4, rt * 0.72, 0x9fc0d8, { mat: 'glass', solid: true })
  for (const [ax, az, bx, bz] of [[-1, -1, 1, -1], [-1, 1, 1, 1], [-1, -1, -1, 1], [1, -1, 1, 1]]) {
    railing(b, ax * rt * 0.72, az * rt * 0.72, bx * rt * 0.72, bz * rt * 0.72, DY + 0.4, 1.1, BJ.marble, 2.2)
  }
  b.sign('中信大厦 · 中国尊', 0, 12, R0 + 8.6, 1.4, 0, { bg: '#1a2a3a', fg: '#e8eef4', glow: true })
  ctx.interact({ x: 0, z: R0 + 16, r: 8, label: '中国尊 · 北京第一高楼', type: 'info', text: '中信大厦“中国尊”高 528 米，是北京现行最高建筑。造型取自古代礼器“尊”，呈收腰外撇的花樽形，幕墙由 8 条竖向折面构成，日落时通体泛金。' })
  ctx.interact({ x: 26, z: 26, r: 6, label: '仰望中国尊收分轮廓', type: 'view' })
  ctx.interact({ x: 0, z: R0 + 9, r: 4, y: 0, label: '中国尊 · 观光电梯（登 226m 天空观景台）', type: 'elevator', deckY: DY, baseR: R0, elevLabel: '中国尊电梯', banner: ['🏙️ 中国尊 · 226米天空观景台', '北京第一高楼！透明玻璃地板下是中轴线与 CBD 全景，按 C 拍照'] })
  ctx.interact({ x: 0, z: 0, r: 6, y: DY + 0.5, label: '中国尊 · 天空观景台', type: 'elevatorTop', deckY: DY, elevLabel: '中国尊 · 天空观景台' })
  ctx.crowd(0, R0 + 16, 16, 8, 8)
}

export function zhongguozunLOD(b) {
  const H = 210, R0 = 17, SEC = 6
  const rOf = (t) => R0 * (1 - 0.34 * Math.sin(Math.PI * Math.min(1, t * 0.92)) + 0.16 * t * t)
  for (let i = 0; i < SEC; i++) {
    const t0 = i / SEC, t1 = (i + 1) / SEC
    b.prism(0, 0, t0 * H, t1 * H, rOf(t0), rOf(t0), 8, GLASS, { mat: 'curtain', rx1: rOf(t1), rz1: rOf(t1), rot: Math.PI / 8, solid: false })
  }
}

// ---------------- 央视总部大楼「大裤衩」（悬挑闭环，S 级） ----------------
// 两座相向内倾的塔楼，在高空由 L 形悬挑箱连接成环，中部镂空成门洞
export function buildCCTV(b, ctx) {
  const H = 120, TIERS = 20, th = H / TIERS, HW = 7, GAP = 10
  // 西腿（x<0）向东(+x)倾斜；东腿（x>0）向西(-x)倾斜
  const leg = (sign) => {
    for (let i = 0; i < TIERS; i++) {
      const y0 = i * th, y1 = (i + 1) * th
      const shift = (i / TIERS) * (GAP * 0.9) // 向内收
      const cx = sign * (GAP + HW) - sign * shift
      b.box(cx - HW, y0, -HW, cx + HW, y1, HW, GLASS, { mat: 'curtain' })
      // 幕墙横向白线
      b.box(cx - HW - 0.1, y1 - 0.4, -HW - 0.1, cx + HW + 0.1, y1, HW + 0.1, 0xeef2f5, { solid: false })
    }
    return sign * (GAP + HW - GAP * 0.9) // 顶部中心 x
  }
  const topA = leg(-1)
  const topB = leg(1)
  // 顶部悬挑连接箱（横跨两塔顶，形成闭环）
  const bx0 = Math.min(topA, topB) - HW, bx1 = Math.max(topA, topB) + HW
  b.box(bx0, H, -HW, bx1, H + th * 2.2, HW, GLASS_D, { mat: 'curtain' })
  // L 形外挑角（向 +z 探出，制造不规则环）
  b.box(bx0, H, HW, bx0 + (bx1 - bx0) * 0.5, H + th * 2.2, HW + 12, GLASS, { mat: 'curtain' })
  // 悬挑箱网格肋
  for (let x = bx0 + 2; x < bx1; x += 4) b.box(x, H, -HW - 0.1, x + 0.4, H + th * 2.2, HW + 0.1, 0xdfe6ec, { solid: false })
  // 底部入口架空层
  b.box(bx0 - 2, 0, -HW - 2, bx1 + 2, 1.5, HW + 2, 0x9aa0a6, { mat: 'stone' })
  b.sign('中央电视台总部大楼', bx0 - 1, 4, HW + 13, 1.4, 0, { bg: '#2a2a2e', fg: '#ffffff', glow: true })
  // 悬挑之巅观景台：闭环顶部玻璃平台 + 围栏（可乘电梯登临）
  const CDY = H + 14
  b.box(bx0 + 3, CDY, -HW + 2, bx1 - 3, CDY + 0.4, HW - 2, 0x9fc0d8, { mat: 'glass', solid: true })
  for (const [ax, az, cx2, cz2] of [[bx0 + 3, -HW + 2, bx1 - 3, -HW + 2], [bx0 + 3, HW - 2, bx1 - 3, HW - 2], [bx0 + 3, -HW + 2, bx0 + 3, HW - 2], [bx1 - 3, -HW + 2, bx1 - 3, HW - 2]]) railing(b, ax, az, cx2, cz2, CDY + 0.4, 1.1, BJ.marble, 3)
  ctx.interact({ x: 0, z: HW + 16, r: 8, label: '央视大楼 · “大裤衩”', type: 'info', text: '央视总部由雷姆·库哈斯（OMA）设计，两座倾斜塔楼在 162 米高空由 L 形悬挑结构对接成闭合环，颠覆了摩天楼“向上生长”的定式，被市民昵称为“大裤衩”。' })
  ctx.interact({ x: 0, z: HW + 6, r: 4, y: 0, label: '央视大楼 · 观光电梯（登悬挑观景台）', type: 'elevator', deckY: CDY, baseR: 12, elevLabel: '央视大楼电梯', banner: ['📺 央视大楼 · 悬挑观景台', '站在 160 米悬挑闭环之巅，俯瞰国贸 CBD 与中轴线'] })
  ctx.interact({ x: 0, z: 0, r: 6, y: CDY + 0.5, label: '央视大楼 · 悬挑观景台', type: 'elevatorTop', deckY: CDY, elevLabel: '央视大楼 · 悬挑观景台' })
  ctx.interact({ x: -24, z: 22, r: 6, label: '正侧角度拍悬挑闭环', type: 'view' })
  ctx.crowd(0, HW + 14, 16, 8, 8)
}

export function cctvLOD(b) {
  const H = 120, HW = 7, GAP = 10
  for (const s of [-1, 1]) b.box(s * (GAP + HW) - s * GAP * 0.9 - HW, 0, -HW, s * (GAP + HW) - s * GAP * 0.9 + HW, H, HW, GLASS, { mat: 'curtain', solid: false })
  b.box(-GAP - HW, H, -HW, GAP + HW, H + 26, HW, GLASS_D, { mat: 'curtain', solid: false })
}

// ---------------- 国贸天际线（背景楼群，B 级氛围） ----------------
export function buildCIDSkyline(b, ctx) {
  // 国贸三期、银泰、建外 SOHO 等风格化高楼群
  modernTower(b, -34, -10, 20, 18, 155, 0x86a8c4, { mat: 'curtain' }) // 国贸三期意象
  modernTower(b, 30, 12, 16, 14, 96, 0x9ab8d0, { mat: 'curtain' })
  modernTower(b, -12, 34, 14, 12, 72, 0xa8c0d4, { mat: 'curtain' })
  modernTower(b, 16, -30, 13, 13, 84, 0x94b2cc, { mat: 'curtain' })
  // 低层裙房铺底
  const r = mulberry32(116)
  for (let i = 0; i < 10; i++) {
    const x = -50 + r() * 100, z = -50 + r() * 100, w = 8 + r() * 8, h = 20 + r() * 40
    if (Math.hypot(x, z) < 24) continue
    b.box(x - w / 2, 0, z - w / 2, x + w / 2, h, z + w / 2, 0x9ab0c4, { mat: 'curtain' })
  }
  paving(b, -60, -60, 60, 60, 0.02, BJ.pave, 0.05)
  for (let x = -50; x <= 50; x += 14) { lamp(b, x, 0, 52, 5); roundTree(b, x + 6, 0, 52, 0.8, 0x4a9a42) }
  ctx.interact({ x: 0, z: 40, r: 10, label: '北京 CBD · 国贸天际线', type: 'view' })
  ctx.crowd(0, 44, 30, 12, 14)
}
