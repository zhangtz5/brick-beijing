// 中轴核心区：故宫(S) · 天安门(S) · 天安门广场(A)
import { paving, railing, roundTree, pine } from './common.js'

// 京味调色板（PRD 10.5）
export const BJ = {
  wall: 0x8c1f28, // 宫墙红
  door: 0xb23a2e, // 朱漆门
  glazeY: 0xc8a24a, // 琉璃黄
  glazeB: 0x2a5caa, // 琉璃蓝
  glazeG: 0x3b7a57, // 琉璃绿
  gold: 0xd4af37, // 金顶
  brick: 0x8a8a85, // 灰砖
  marble: 0xedeae0, // 汉白玉
  tile: 0x4a4a52, // 青瓦
  tree: 0x4c7a34, // 古树绿
  pave: 0xcfc9bc // 广场石
}

// 红灯笼
function lantern(b, x, y, z) {
  b.boxC(x, y - 0.45, z, 0.7, 0.9, 0.7, 0xc03328, { mat: 'lamp', solid: false })
  b.boxC(x, y + 0.45, z, 0.35, 0.2, 0.35, BJ.gold, { solid: false })
}

// 宫殿大殿：红墙/柱廊 + 双重檐 + 庑殿黄琉璃 + 金脊。返回顶高
function palaceHall(b, cx, cz, w, d, h, opt = {}) {
  const by = opt.by || 0
  const roof = opt.roof || BJ.glazeY
  const wall = opt.wall || BJ.wall
  // 殿身（四面墙，南面开门）
  const gw = opt.gateW || 0
  if (opt.hall) {
    // 空心殿堂：四面薄墙 + 南面大门洞（可入内）+ 殿内金柱/宝座/墁地
    const t = 0.7
    const g = gw || w * 0.36
    b.box(cx - w / 2, by, cz - d / 2, cx + w / 2, by + h, cz - d / 2 + t, wall, { mat: 'block' }) // 北墙
    b.box(cx - w / 2, by, cz - d / 2, cx - w / 2 + t, by + h, cz + d / 2, wall, { mat: 'block' }) // 西墙
    b.box(cx + w / 2 - t, by, cz - d / 2, cx + w / 2, by + h, cz + d / 2, wall, { mat: 'block' }) // 东墙
    b.box(cx - w / 2, by, cz + d / 2 - t, cx - g / 2, by + h, cz + d / 2, wall, { mat: 'block' }) // 南墙·左
    b.box(cx + g / 2, by, cz + d / 2 - t, cx + w / 2, by + h, cz + d / 2, wall, { mat: 'block' }) // 南墙·右
    b.box(cx - g / 2, by + h * 0.82, cz + d / 2 - t, cx + g / 2, by + h, cz + d / 2, wall, { mat: 'block' }) // 门楣
    // 金砖墁地
    b.box(cx - w / 2 + t, by + 0.05, cz - d / 2 + t, cx + w / 2 - t, by + 0.2, cz + d / 2 - t, 0x3a3228, { mat: 'block', solid: false })
    // 殿内金柱（两排）
    const cn = Math.max(2, Math.floor(w / 5.5))
    for (let i = 0; i <= cn; i++) {
      const px = cx - w / 2 + 2.4 + (i * (w - 4.8)) / cn
      b.boxC(px, by, cz - d / 4, 0.8, h - 0.4, 0.8, 0x7a1e1e, { mat: 'wood', solid: false })
      b.boxC(px, by, cz + d / 4, 0.8, h - 0.4, 0.8, 0x7a1e1e, { mat: 'wood', solid: false })
    }
    if (opt.throne) {
      // 须弥座 + 髩金宝座 + 背屏（居北，坐北朝南）
      b.box(cx - 5, by + 0.2, cz - d / 2 + 1.2, cx + 5, by + 1.1, cz - d / 2 + 5.5, BJ.gold, { solid: false })
      b.box(cx - 2.2, by + 1.1, cz - d / 2 + 2, cx + 2.2, by + 2.4, cz - d / 2 + 4.6, 0xb8860b, { mat: 'wood', solid: false })
      b.box(cx - 2.6, by + 2.4, cz - d / 2 + 1.5, cx + 2.6, by + 5.2, cz - d / 2 + 2.2, BJ.gold, { solid: false })
      b.sign('正大宝位', cx, by + 6.6, cz - d / 2 + 2, 0.9, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
    }
  } else if (gw) {
    b.box(cx - w / 2, by, cz - d / 2, cx - gw / 2, by + h, cz + d / 2, wall, { mat: 'block' })
    b.box(cx + gw / 2, by, cz - d / 2, cx + w / 2, by + h, cz + d / 2, wall, { mat: 'block' })
    b.box(cx - gw / 2, by + h * 0.75, cz - d / 2, cx + gw / 2, by + h, cz + d / 2, wall, { mat: 'block' })
  } else {
    b.box(cx - w / 2, by, cz - d / 2, cx + w / 2, by + h, cz + d / 2, wall, { mat: 'block' })
  }
  // 檐柱廊（前檐）
  if (opt.colonnade !== false) {
    const n = Math.max(2, Math.round(w / 4))
    for (let i = 0; i <= n; i++) b.boxC(cx - w / 2 + (i * w) / n, by, cz + d / 2 + 0.9, 0.55, h * 0.8, 0.55, BJ.door, { solid: false })
  }
  // 平座栏杆
  if (opt.base) {
    const bw = opt.base[0], bd = opt.base[1], bh = opt.base[2] || 1.2
    b.box(cx - bw / 2, by, cz - bd / 2, cx + bw / 2, by + bh, cz + bd / 2, BJ.marble)
    railing(b, cx - bw / 2, cz - bd / 2, cx + bw / 2, cz - bd / 2, by + bh, 1, BJ.marble, 2)
    railing(b, cx - bw / 2, cz + bd / 2, cx + bw / 2, cz + bd / 2, by + bh, 1, BJ.marble, 2)
    opt.by = by + bh
  }
  const ey = (opt.by2 != null ? opt.by2 : by + h)
  // 三重檐下檐
  b.box(cx - w / 2 - 1.8, ey, cz - d / 2 - 1.8, cx + w / 2 + 1.8, ey + 1.1, cz + d / 2 + 1.8, roof, { mat: 'roof', solid: false })
  // 上檐收进
  const uw = w * 0.72, ud = d * 0.72
  b.box(cx - uw / 2 - 1.2, ey + 2.4, cz - ud / 2 - 1.2, cx + uw / 2 + 1.2, ey + 3.3, cz + ud / 2 + 1.2, roof, { mat: 'roof', solid: false })
  const top = b.hipRoof(cx, cz, uw, ud, ey + 3.3, opt.rise || ud * 0.55, roof, { over: 1.2, minW: uw * 0.4, minD: ud * 0.35 })
  b.box(cx - w / 2 - 0.4, top, cz - 0.45, cx + w / 2 + 0.4, top + 0.8, cz + 0.45, opt.ridge || BJ.gold, { solid: false })
  // 门扇（朱漆金钉）
  if (!gw) b.box(cx - 2.2, by, cz + d / 2 + 0.05, cx + 2.2, by + h * 0.72, cz + d / 2 + 0.25, BJ.door, { mat: 'block', solid: false })
  return top + 0.8
}

// 角楼（简化十字重檐）
function cornerTower(b, x, z) {
  b.box(x - 5, 0, z - 5, x + 5, 8, z + 5, BJ.wall, { mat: 'block' })
  b.box(x - 6.5, 8, z - 6.5, x + 6.5, 8.8, z + 6.5, BJ.marble, { solid: false })
  const t1 = b.hipRoof(x, z, 9, 9, 8.8, 3, BJ.glazeY, { over: 1 })
  b.box(x - 4, t1, z - 4, x + 4, t1 + 3.5, z + 4, BJ.wall, { mat: 'block', solid: false })
  const t2 = b.hipRoof(x, z, 6.5, 6.5, t1 + 3.5, 2.6, BJ.glazeY, { over: 0.9 })
  b.boxC(x, t2, z, 0.5, 1.2, 0.5, BJ.gold, { solid: false })
}

// 城门楼（一段城台 + 城楼）
function gateTower(b, cz, w, d, h, name) {
  palaceHall(b, 0, cz, w, d, h, { gateW: 11, colonnade: true })
  if (name) b.sign(name, 0, h + 3.2, cz + d / 2 + 1.2, 1.4, 0, { bg: '#1e3a5a', fg: '#ffd76a', border: '#d9a628' })
}

// ---------------- 故宫（S 级） ----------------
// 局部坐标：+z 朝南（午门方向），中心≈(39.9158, 116.3976)。HW/HD 为城墙半幅
const HW = 88, HD = 128
export function buildGugong(b, ctx) {
  // 城墙（四面，开午门/神武门/东华门/西华门门洞，可真正穿入）
  const WH = 8
  b.box(-HW, 0, HD - 3, -6, WH, HD, BJ.wall, { mat: 'block' }) // 南墙·左（午门洞 x±6）
  b.box(6, 0, HD - 3, HW, WH, HD, BJ.wall, { mat: 'block' }) // 南墙·右
  b.box(-HW, 0, -HD, -5.5, WH, -HD + 3, BJ.wall, { mat: 'block' }) // 北墙·左（神武门洞）
  b.box(5.5, 0, -HD, HW, WH, -HD + 3, BJ.wall, { mat: 'block' }) // 北墙·右
  b.box(-HW, 0, -HD, -HW + 3, WH, -6, BJ.wall, { mat: 'block' }) // 西墙·北（西华门洞 z±6）
  b.box(-HW, 0, 6, -HW + 3, WH, HD, BJ.wall, { mat: 'block' }) // 西墙·南
  b.box(HW - 3, 0, -HD, HW, WH, -6, BJ.wall, { mat: 'block' }) // 东墙·北（东华门洞）
  b.box(HW - 3, 0, 6, HW, WH, HD, BJ.wall, { mat: 'block' }) // 东墙·南
  // 门洞券顶过梁
  b.box(-6, WH - 2.4, HD - 3, 6, WH, HD, BJ.wall, { mat: 'block' })
  b.box(-5.5, WH - 2.4, -HD, 5.5, WH, -HD + 3, BJ.wall, { mat: 'block' })
  // 墙顶黄琉璃檐口
  b.box(-HW - 1.2, WH, HD - 4.2, HW + 1.2, WH + 0.7, HD + 1.2, BJ.glazeY, { mat: 'roof', solid: false })
  b.box(-HW - 1.2, WH, -HD - 1.2, HW + 1.2, WH + 0.7, -HD + 4.2, BJ.glazeY, { mat: 'roof', solid: false })
  b.box(-HW - 1.2, WH, -HD + 4.2, -HW + 4.2, WH + 0.7, HD - 4.2, BJ.glazeY, { mat: 'roof', solid: false })
  b.box(HW - 4.2, WH, -HD + 4.2, HW + 1.2, WH + 0.7, HD - 4.2, BJ.glazeY, { mat: 'roof', solid: false })
  // 角楼
  cornerTower(b, -HW, -HD); cornerTower(b, HW, -HD); cornerTower(b, -HW, HD); cornerTower(b, HW, HD)
  // 午门：主殿 + 两阙（雁翅楼）
  b.box(-30, 0, HD, -18, WH + 2, HD + 10, BJ.wall, { mat: 'block' })
  b.box(18, 0, HD, 30, WH + 2, HD + 10, BJ.wall, { mat: 'block' })
  for (const dx of [-24, 24]) b.hipRoof(dx, HD + 5, 11, 9, WH + 2, 2.6, BJ.glazeY, { over: 0.8 })
  palaceHall(b, 0, HD + 1.5, 44, 9, 10, { gateW: 12 })
  b.sign('午门', 0, 13.5, HD + 6.4, 1.6, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  // 内金水河（午门内蜿蜒）+ 五座白石桥
  for (let x = -44; x <= 44; x += 4) { const z = HD - 34 + Math.sin(x * 0.09) * 5; b.box(x, 0.05, z - 3.5, x + 4, 0.28, z + 3.5, 0x3a6a9a, { mat: 'pond', solid: false }) }
  for (const bx of [-18, -9, 0, 9, 18]) { b.box(bx - 2.6, 0.3, HD - 42, bx + 2.6, 1.05, HD - 26, BJ.marble); railing(b, bx - 2.6, HD - 42, bx - 2.6, HD - 26, 1.05, 0.8, BJ.marble, 1.1); railing(b, bx + 2.6, HD - 42, bx + 2.6, HD - 26, 1.05, 0.8, BJ.marble, 1.1) }
  // 太和门（可通行）
  gateTower(b, HD - 62, 34, 8, 8, '太和门')
  // 三大殿：三重汉白玉须弥座
  const terr = (w, d, y, h) => { b.box(-w / 2, y, 25 - d / 2, w / 2, y + h, 25 + d / 2, BJ.marble); return y + h }
  let ty = terr(80, 62, 0, 1.3); ty = terr(68, 52, ty, 1.3); ty = terr(56, 42, ty, 1.3)
  for (const [w, d] of [[80, 62], [68, 52], [56, 42]]) {
    railing(b, -w / 2, 25 - d / 2, w / 2, 25 - d / 2, ty, 1, BJ.marble, 2.4)
    railing(b, -w / 2, 25 + d / 2, w / 2, 25 + d / 2, ty, 1, BJ.marble, 2.4)
  }
  // 南御路台阶 + 台基铜鼎陈设
  for (let k = 0; k < 4; k++) b.box(-6, k * 0.98, 25 + 20 - k * 1.3, 6, (k + 1) * 0.98, 25 + 21.5 - k * 1.3, BJ.marble, { solid: false })
  for (const dx of [-17, 17]) { b.boxC(dx, ty, 25 + 16, 1.1, 1.8, 1.1, 0x6a5a2a, { mat: 'block', solid: false }); b.boxC(dx, ty + 1.8, 25 + 16, 1.3, 0.3, 1.3, 0x5a4a20, { solid: false }) }
  // 太和殿（可入内 + 髩金宝座）
  palaceHall(b, 0, 25, 44, 26, 13, { by: ty, hall: true, throne: true })
  b.sign('太和殿', 0, ty + 16.5, 25 + 14.5, 1.8, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  for (let x = -18; x <= 18; x += 6) lantern(b, x, ty + 13.6, 25 + 14.2)
  // 体仁阁 / 弘义阁（广场两侧）
  palaceHall(b, -44, 25, 15, 11, 7, { roof: BJ.glazeY })
  palaceHall(b, 44, 25, 15, 11, 7, { roof: BJ.glazeY })
  // 中和殿（圆顶攒尖）
  b.box(-11, 0, -36, 11, 1.1, -14, BJ.marble)
  b.prism(0, -25, 1.1, 8, 7, 7, 8, BJ.wall, { rot: Math.PI / 8 })
  b.prism(0, -25, 8, 11.5, 8.5, 8.5, 8, BJ.glazeY, { rx1: 1.5, rz1: 1.5, rot: Math.PI / 8, solid: false })
  b.boxC(0, 11.5, -25, 0.6, 1.2, 0.6, BJ.gold, { solid: false })
  // 保和殿（可入内）
  b.box(-16, 0, -70, 16, 1.2, -46, BJ.marble)
  palaceHall(b, 0, -58, 28, 18, 10, { by: 1.2, hall: true })
  // 文华殿 / 武英殿（外朝两侧）
  palaceHall(b, 62, 52, 16, 12, 7, { roof: BJ.glazeY })
  palaceHall(b, -62, 52, 16, 12, 7, { roof: BJ.glazeY })
  b.sign('文华殿', 62, 8.5, 58.5, 1, 0, { bg: '#5a1a14', fg: '#ffd76a' })
  b.sign('武英殿', -62, 8.5, 58.5, 1, 0, { bg: '#5a1a14', fg: '#ffd76a' })
  // 乾清门（可通行）
  gateTower(b, -78, 24, 6, 6, '乾清门')
  // 后三宫：乾清宫（可入内+宝座）/ 交泰殿 / 坤宁宫
  palaceHall(b, 0, -92, 24, 12, 9, { hall: true, throne: true })
  palaceHall(b, 0, -104, 12, 10, 7, { roof: BJ.glazeY })
  palaceHall(b, 0, -115, 20, 10, 8, { hall: true })
  // 东西十二宫院落群（多进小殿 + 院墙）
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const z = -40 - k * 17
      palaceHall(b, s * 54, z, 13, 9, 5.5, { roof: BJ.glazeY })
      b.box(s * 42, 0, z - 7.5, s * 42 + (s > 0 ? 0.6 : -0.6), 3.2, z + 7.5, BJ.wall, { mat: 'block' })
      b.box(s * 66, 0, z - 7.5, s * 66 + (s > 0 ? -0.6 : 0.6), 3.2, z + 7.5, BJ.wall, { mat: 'block' })
      b.box(s * 42, 0, z - 7.5, s * 66, 3.2, z - 6.9, BJ.wall, { mat: 'block' })
    }
  }
  // 御花园：钦安殿 + 万春亭意象 + 山石 + 古柏
  palaceHall(b, 0, -120, 14, 9, 7, { roof: BJ.glazeY })
  b.prism(0, -127, 0, 3.5, 3, 3, 6, BJ.door, { solid: false })
  b.prism(0, -127, 3.5, 5.5, 3.6, 3.6, 6, BJ.glazeY, { rx1: 0.4, rz1: 0.4, solid: false })
  for (const [rx, rz] of [[-16, -118], [16, -118], [-12, -125], [12, -125]]) b.box(rx - 1.5, 0, rz - 1.5, rx + 1.5, 2.5 + (rx % 3), rz + 1.5, 0x8a8478, { mat: 'stone', solid: false })
  for (let i = 0; i < 5; i++) pine(b, -30 + i * 15, 0, -124 + (i % 2) * 2, 0.9)
  // 中轴御路石（甬道）
  b.box(-3, 0.02, -118, 3, 0.12, HD - 6, 0xb8b0a0, { mat: 'stone', solid: false })
  // 古柏列植（东路西路）
  for (let z = -60; z <= 90; z += 18) { roundTree(b, -HW + 10, 0, z, 0.8, BJ.tree); roundTree(b, HW - 10, 0, z, 0.8, BJ.tree) }
  // 神武门
  palaceHall(b, 0, -HD - 1.5, 30, 8, 9, { gateW: 11, by2: 0 })
  b.sign('神武门', 0, 12, -HD - 5.9, 1.4, Math.PI, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  // 互动与人流
  ctx.interact({ x: 0, z: HD + 16, r: 7, label: '午门 · 故宫博物院', type: 'info', text: '故宫又称紫禁城，明清两代二十四位皇帝的皇宫，世界现存规模最大的木结构宫殿建筑群。午门是正门，“推出午门问斩”即出于此。' })
  ctx.interact({ x: 0, z: 25, r: 6, y: ty + 2, label: '太和殿 · 金銮宝殿', type: 'info', text: '太和殿是紫禁城等级最高、体量最大的建筑，皇帝登基、大婚、册封、命将出征等重大典礼在此举行。殿内髩金雕龙宝座上方悬“正大光明”匾。' })
  ctx.interact({ x: 0, z: 25 + 34, r: 6, label: '金水桥上远眺太和殿', type: 'view' })
  ctx.interact({ x: 0, z: -92, r: 5, y: 3, label: '乾清宫 · 正大光明', type: 'info', text: '乾清宫内廷正殿，明至清初皇帝的正殿与寝宫。“正大光明”匾后曾密藏立储诏书。' })
  ctx.interact({ x: 0, z: -120, r: 5, label: '御花园 · 钦安殿', type: 'view' })
  ctx.interact({ x: 0, z: 25 + 42, r: 5, label: '🏺 景泰蓝 · 燕京八绝', type: 'culture', id: 'jingtai' })
  ctx.crowd(0, HD + 14, 24, 10, 10)
  ctx.crowd(0, 25 + 30, 30, 8, 8)
  ctx.crowd(0, -92, 18, 8, 6)
}

export function gugongLOD(b) {
  b.box(-HW, 0, -HD, HW, 6, HD, BJ.wall, { mat: 'block', solid: false })
  b.box(-HW - 2, 6, -HD - 2, HW + 2, 7, HD + 2, BJ.glazeY, { mat: 'roof', solid: false })
  b.box(-24, 7, 12, 24, 20, 40, BJ.wall, { solid: false })
  b.box(-26, 20, 10, 26, 24, 42, BJ.glazeY, { mat: 'roof', solid: false })
}

// ---------------- 天安门（S 级） ----------------
export function buildTiananmen(b, ctx) {
  // 城台（中央门洞通行）
  b.box(-17, 0, -7, -6, 9, 7, BJ.wall, { mat: 'block' })
  b.box(6, 0, -7, 17, 9, 7, BJ.wall, { mat: 'block' })
  b.box(-6, 7, -7, 6, 9, 7, BJ.wall, { mat: 'block' })
  for (const dx of [-11.5, 0, 11.5]) {
    b.box(dx - 2.2, 0, -7.2, dx + 2.2, 5.5, -6.8, BJ.door, { solid: false })
    b.box(dx - 2.2, 0, 6.8, dx + 2.2, 5.5, 7.2, BJ.door, { solid: false })
  }
  b.box(-18, 9, -8, 18, 9.9, 8, BJ.marble, { solid: false })
  // 城楼（面阔九间意象 + 双重檐黄琉璃）
  palaceHall(b, 0, 0, 32, 11, 6.5, { by: 9.9 })
  b.sign('天安门', 0, 13.6, 6.8, 1.7, 0, { bg: '#5a1a14', fg: '#ffd76a', border: '#d9a628' })
  b.sign('中华人民共和国万岁', -9, 12.2, 5.8, 0.9, 0, { bg: '#8c1f28', fg: '#ffe9b0' })
  b.sign('世界人民大团结万岁', 9, 12.2, 5.8, 0.9, 0, { bg: '#8c1f28', fg: '#ffe9b0' })
  for (let x = -12; x <= 12; x += 6) lantern(b, x, 17.5, 5.6)
  // 前后汉白玉金水桥
  b.box(-7, 0.1, 8, 7, 1, 16, BJ.marble)
  railing(b, -7, 8, -7, 16, 1, 0.9, BJ.marble, 1.2)
  railing(b, 7, 8, 7, 16, 1, 0.9, BJ.marble, 1.2)
  b.box(-7, 0.1, -16, 7, 1, -8, BJ.marble)
  // 华表一对
  for (const s of [-1, 1]) {
    b.prism(s * 11, 13, 0, 9.5, 0.7, 0.7, 8, BJ.marble)
    b.boxC(s * 11, 9.5, 13, 1.6, 0.5, 1.6, BJ.marble, { solid: false })
    b.prism(s * 11, 13, 9.5, 11, 0.55, 0.55, 8, BJ.marble, { rx1: 0.75, rz1: 0.75, solid: false })
    b.boxC(s * 11, 11.2, 13, 0.8, 0.9, 0.8, BJ.marble, { solid: false })
  }
  ctx.interact({ x: 0, z: 20, r: 7, label: '天安门城楼', type: 'info', text: '天安门始建于明永乐十五年，是皇城的正门。城楼面阔九间、进深五间，象征“九五之尊”。1949 年 10 月 1 日在此举行开国大典。' })
  ctx.crowd(0, 18, 16, 6, 10)
}

// ---------------- 天安门广场（A 级） ----------------
export function buildSquare(b, ctx) {
  // 广场铺装 + 两侧绿化带
  paving(b, -46, -64, 46, 64, 0.05, BJ.pave, 0.1)
  for (const s of [-1, 1]) b.box(s * 36 - 7, 0.1, -58, s * 36 + 7, 0.3, 58, BJ.tree, { mat: 'grass', solid: false })
  // 国旗杆（北侧）
  b.boxC(0, 0.1, -42, 2.5, 0.5, 2.5, BJ.marble)
  b.boxC(0, 0.6, -42, 0.3, 12, 0.3, 0xd8d8d0, { solid: false })
  b.box(0.2, 10.5, -42, 3, 12, -41.8, 0xc03328, { mat: 'neon', solid: false })
  // 人民英雄纪念碑（中心偏北）
  b.box(-5, 0.1, -16, 5, 1.6, -8, BJ.marble)
  b.box(-4, 1.6, -15, 4, 2.4, -9, 0xd8cfc0)
  b.box(-1.6, 2.4, -13.4, 1.6, 14, -10.6, BJ.marble)
  b.box(-2, 14, -13.8, 2, 15, -10.2, 0xd8cfc0)
  b.sign('人民英雄永垂不朽', 0, 9, -10.4, 1.1, 0, { bg: 'rgba(0,0,0,0)', fg: '#5a4a2a', px: 56 })
  // 毛主席纪念堂（南侧，简化柱廊方厅）
  b.box(-13, 0.1, 16, 13, 6.5, 28, BJ.marble)
  for (let i = 0; i <= 6; i++) b.boxC(-11 + i * (22 / 6), 6.5, 28.6, 0.8, 2.2, 0.8, 0xe8e4da, { solid: false })
  b.box(-13.5, 8.7, 15.5, 13.5, 9.4, 28.5, 0xd8d4ca, { solid: false })
  ctx.interact({ x: 0, z: -30, r: 9, label: '天安门广场', type: 'info', text: '天安门广场南北长 880 米、东西宽 500 米，是世界上最大的城市广场之一。升旗、纪念碑、纪念堂与正阳门共同构成中轴线上的国家礼仪空间。' })
  ctx.interact({ x: 0, z: -12, r: 5, label: '瞻仰人民英雄纪念碑', type: 'view' })
  ctx.crowd(0, -34, 20, 8, 12)
}
