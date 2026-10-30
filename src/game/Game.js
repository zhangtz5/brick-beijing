// 游戏主控：渲染循环、系统调度、交互逻辑
import * as THREE from 'three'
import { CollisionWorld } from './physics.js'
import { SkySystem, WEATHERS } from './sky.js'
import { WaterSystem, buildRoads } from './world.js'
import { CityManager } from './city.js'
import { LandmarkManager } from './landmarks.js'
import { NPCManager } from './npc.js'
import { TransportSystem, InteractRegistry } from './transport.js'
import { PhotoSystem } from './photo.js'
import { Player } from './player.js'
import { Input } from './input.js'
import { makeSkinCanvas } from './character.js'
import { updateNightMaterials } from './materials.js'
import { districtAt, DISTRICTS, terrainHeight, METRO_STATIONS, PIERS, project } from './geo.js'
import { store, events, toast, banner, persist, checkTasks, ensureDaily } from './store.js'
import { SHOPS, FOODS, SOUVENIRS, CULTURE } from './data.js'
import { speak, voiceFor, stopVoice, VOICE_PRESETS, announce, chime } from './voice.js'
import { formatTime, smooth, lerp, clamp } from './util.js'
import { renderBaseMap } from './map.js'

const SP = (lat, lon) => ({ ...project(lat, lon), y: 0 })
export const SPAWNS = [
  { id: 'tiananmen', name: '天安门广场', desc: '东城区 · 中轴核心', pos: SP(39.9005, 116.3975), yaw: 0 },
  { id: 'wangfujing', name: '王府井', desc: '东城区 · 商业老街', pos: SP(39.9135, 116.412), yaw: 0 },
  { id: 'shichahai', name: '什刹海', desc: '西城区 · 后海胡同', pos: SP(39.9395, 116.3925), yaw: 0 },
  { id: 'aolin', name: '奥林匹克公园', desc: '朝阳区 · 鸟巢水立方', pos: SP(39.9925, 116.3925), yaw: 0 },
  { id: 'yiheyuan', name: '颐和园', desc: '海淀区 · 皇家园林', pos: SP(39.9985, 116.281), yaw: 0 },
  { id: 'guomao', name: '国贸 CBD', desc: '朝阳区 · 现代天际线', pos: SP(39.9085, 116.461), yaw: 0 }
]

export class Game {
  constructor(container) {
    this.container = container
    const s = store.save.settings
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(this.pixelRatio())
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = s.shadows && s.quality !== 'low'
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    container.appendChild(this.renderer.domElement)
    this.canvas = this.renderer.domElement
    this.shadows = this.renderer.shadowMap.enabled

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 4500)
    this.world = new CollisionWorld()
    this.interact = new InteractRegistry()
    this.input = new Input(this.canvas)
    this.sky = new SkySystem(this.scene, this.renderer)
    this.sky.onWeatherChange = (w) => {
      const W = WEATHERS[w]
      toast(`${W.icon} 天气变化：${W.name}`, w === 'typhoon' ? 'warn' : 'info')
      if (w === 'typhoon') banner('🌀 台风预警', '风雨较大，NPC 已陆续回家避风')
    }
    this.water = new WaterSystem(this.scene, s.reflect && s.quality === 'high')
    this.roads = buildRoads(this.scene)
    this.npcs = new NPCManager(this.scene, this.world, this)
    this.landmarks = new LandmarkManager(this.scene, this.world, this)
    this.landmarks.buildLODs()
    this.city = new CityManager(this.scene, this.world, [
      ...this.landmarks.exclusions(),
      ...METRO_STATIONS.map((m) => ({ x: m.x, z: m.z, r: 9 })),
      ...PIERS.map((p) => ({ x: p.x, z: p.z, r: 14 }))
    ])
    this.city.shadows = this.shadows
    this.transport = new TransportSystem(this.scene, this.world, this)
    for (const st of this.transport.stops) this.city.excl.push({ x: st.wx, z: st.wz, r: 7 })
    this.photo = new PhotoSystem(this.renderer)
    this.applyQuality()
    this.baseMap = renderBaseMap(this.landmarks)

    // 玩家
    const prof = store.save.profile
    this.player = new Player(this.scene, this.world, this.profileSkin(prof), [])
    this.clock = new THREE.Clock()
    this.time = 0
    this.hudT = 0
    this.lastDistrict = null
    this.running = false
    this.captureReq = null
    this.fovTarget = 65
    this.waypointMesh = this.makeWaypoint()
    this.scene.add(this.waypointMesh)
    this.walkAcc = 0

    this.input.onKey = (code) => this.onKey(code)
    this.onBusArrive = (st) => {
      if (this.player.ride && this.player.ride.type === 'bus') toast(`🚌 到站：${st.name}站（按 E 下车）`, 'info', 5000)
    }
    this._resize = () => this.resize()
    window.addEventListener('resize', this._resize)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.canvas.addEventListener('click', () => {
      if (!store.ui.panel && !store.ui.dialog && !store.ui.mobile) {
        if (store.ui.photoMode) this.shutter()
        else this.input.requestLock()
      }
    })
    document.addEventListener('pointerlockchange', () => (store.ui.pointerLocked = document.pointerLockElement === this.canvas))
    ensureDaily()
  }
  pixelRatio() {
    const q = store.save.settings.quality
    const dpr = window.devicePixelRatio || 1
    return q === 'low' ? Math.min(dpr, 0.8) : q === 'medium' ? Math.min(dpr, 1) : Math.min(dpr, 1.5)
  }
  applyQuality() {
    const s = store.save.settings
    const q = s.quality
    this.renderer.setPixelRatio(this.pixelRatio())
    this.city.viewR = q === 'low' ? 620 : q === 'medium' ? 950 : 1250
    this.city.detailR = q === 'low' ? 300 : q === 'medium' ? 460 : 600
    this.npcs.max = q === 'low' ? 18 : q === 'medium' ? 34 : 52
    this.npcs.shadow = q === 'high' // NPC 投影仅高档开（shadow pass 会使 Draw Call 翻倍）
    this.water.setReflect(s.reflect && q === 'high') // 平面反射最贵，仅极致档
    const sh = s.shadows && q !== 'low'
    const sd = this.sky.dir.shadow
    const ms = q === 'high' ? 2048 : 1024 // 阴影贴图分档
    if (sd.mapSize.x !== ms) {
      sd.mapSize.set(ms, ms)
      if (sd.map) { sd.map.dispose(); sd.map = null }
    }
    const extent = q === 'high' ? 150 : 118 // 收紧阴影相机范围→更清晰且剔除远处投影
    const sc = sd.camera
    sc.left = -extent; sc.right = extent; sc.top = extent; sc.bottom = -extent; sc.updateProjectionMatrix()
    if (sh !== this.renderer.shadowMap.enabled) {
      this.renderer.shadowMap.enabled = sh
      this.scene.traverse((o) => o.material && (o.material.needsUpdate = true))
    }
    this.sky.dir.castShadow = sh
    this.shadows = sh
    this.city.shadows = sh
    this.sky.speed = (24 / (20 * 60)) * (s.timeSpeed || 1)
    this.resize()
  }
  profileSkin(prof) {
    if (prof && prof.customSkin) {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const img = new Image()
      img.onload = () => {
        c.getContext('2d').drawImage(img, 0, 0, 64, 64)
        this.player && this.player.setSkin(c)
        if (this.player) this.player.char.mat.map.needsUpdate = true
      }
      img.src = prof.customSkin
      return c
    }
    return makeSkinCanvas(prof && prof.skinParams ? prof.skinParams : { gender: 'm', seed: 1 })
  }
  refreshSkin() {
    this.player.setSkin(this.profileSkin(store.save.profile))
  }
  makeWaypoint() {
    const g = new THREE.Group()
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 400, 1.2), new THREE.MeshBasicMaterial({ color: 0xffd040, transparent: true, opacity: 0.35, depthWrite: false, fog: false }))
    m.position.y = 200
    g.add(m)
    g.visible = false
    return g
  }
  setWaypoint(wp) {
    store.ui.waypoint = wp
    this.waypointMesh.visible = !!wp
    if (wp) this.waypointMesh.position.set(wp.x, 0, wp.z)
  }
  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (this.photo) this.photo.resize()
  }
  // 预加载出生点附近
  async spawnAt(spawn, onProgress) {
    let x, y, z, yaw
    if (spawn.pos) {
      ;({ x, y, z } = spawn.pos)
      yaw = spawn.yaw || 0
    } else {
      const p = this.landmarks.toWorld(spawn.lm, ...spawn.off)
      x = p.x
      z = p.z
      y = p.y
      yaw = spawn.yaw
    }
    this.player.teleport(x, y + 0.2, z, yaw)
    await this.preload(x, z, onProgress)
    this.player.pos.y = Math.max(this.player.groundAt(x, z, y + 3), y)
    this.lastDistrict = null
  }
  async preload(x, z, onProgress) {
    const frame = () => new Promise((r) => setTimeout(r, 0))
    let total = this.landmarks.pending(x, z) + 1
    let n = 0
    while (this.landmarks.pending(x, z) > 0) {
      this.landmarks.update(0, 0, x, z, 0, 1)
      n++
      onProgress && onProgress(Math.min(0.6, (n / total) * 0.6), '正在搭建景点…')
      await frame()
    }
    const saveR = this.city.viewR
    this.city.viewR = Math.min(saveR, 700)
    let left = 999, k = 0
    while (left > 0 && k < 400) {
      left = this.city.update(x, z, 3)
      k++
      onProgress && onProgress(0.6 + Math.min(0.39, k / 120), '正在生成城市街区…')
      await frame()
    }
    this.city.viewR = saveR
  }
  start() {
    if (this.running) return
    this.running = true
    this.clock.start()
    const loop = () => {
      if (!this.running) return
      this.raf = requestAnimationFrame(loop)
      this.frame()
    }
    loop()
  }
  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }
  dispose() {
    this.stop()
    window.removeEventListener('resize', this._resize)
    this.ro.disconnect()
    this.input.dispose()
    this.renderer.dispose()
    this.canvas.remove()
  }
  frame() {
    const dt = Math.min(0.05, this.clock.getDelta())
    this.time += dt
    const ui = store.ui
    const blocking = !!ui.panel || !!ui.dialog || ui.fade
    this.input.enabled = !blocking
    const p = this.player
    p.sensitivity = store.save.settings.sensitivity || 1
    // 天空/天气
    const skyRes = this.sky.update(dt, this.camera, p.pos)
    const night = skyRes.night
    updateNightMaterials(night)
    this.renderer.toneMappingExposure = 1.05 + night * 0.45
    // 玩家
    const prevPos = p.pos.clone()
    if (!blocking) p.update(dt, this.input, this.sky)
    else {
      this.input.consumeLook()
      p.char.update(dt, 0)
    }
    if (ui.photoMode && p.view === 'selfie') {
      p.char.setAnim(this.selfiePose || 'pose')
      p.char.showAccessory('umbrella', false)
    }
    const moved = Math.hypot(p.pos.x - prevPos.x, p.pos.z - prevPos.z)
    if (!p.ride && !p.scripted && moved < 5) {
      this.walkAcc += moved * 2.5
      if (this.walkAcc > 50) {
        events.count('walk', Math.round(this.walkAcc))
        this.walkAcc = 0
      }
    }
    // 世界流式加载
    this.landmarks.update(dt, this.time, p.pos.x, p.pos.z, night, 1)
    this.city.update(p.pos.x, p.pos.z, 1)
    this.npcs.update(dt, p)
    const boat = this.transport.update(dt, p.pos.x, p.pos.z)
    if (boat === 'done' && p.ride && p.ride.type === 'cruise') this.endCruise()
    this.water.update(this.time, this.camera, this.scene.fog, night)
    // 相机
    this.fovTarget = ui.photoMode ? this.photoFov || 55 : 65
    this.camera.fov += (this.fovTarget - this.camera.fov) * Math.min(1, dt * 8)
    this.camera.updateProjectionMatrix()
    p.updateCamera(this.camera, dt)
    if (this.debugCam) {
      const d = this.debugCam
      this.camera.position.set(d[0], d[1], d[2])
      this.camera.lookAt(d[3], d[4], d[5])
    }
    if (this.sky.weather === 'typhoon' && !ui.photoMode) {
      this.camera.position.x += Math.sin(this.time * 13) * 0.04
      this.camera.position.y += Math.sin(this.time * 17) * 0.03
    }
    // 交互提示 & 发现
    this.updateInteractions()
    this.checkDiscovery()
    // 渲染
    this.photo.filter = ui.photoMode ? ui.filter : 'none'
    this.photo.render(this.scene, this.camera, this.time)
    if (this.captureReq) {
      const req = this.captureReq
      this.captureReq = null
      this.finishCapture(req)
    }
    // HUD
    this.hudT -= dt
    if (this.hudT <= 0) {
      this.hudT = 0.2
      this.updateHUD(dt)
    }
    this.input.endFrame()
  }
  updateHUD(dt) {
    const p = this.player
    const h = store.ui.hud
    const d = districtAt(p.pos.x, p.pos.z)
    h.district = DISTRICTS[d] ? DISTRICTS[d].name : ''
    const lm = this.landmarks.nearest(p.pos.x, p.pos.z, 160)
    h.place = lm ? lm.def.name : ''
    h.time = formatTime(this.sky.hour)
    h.period = this.sky.period
    h.weather = this.sky.weather
    h.weatherName = WEATHERS[this.sky.weather].name
    h.weatherIcon = this.sky.night > 0.5 && this.sky.weather === 'sunny' ? '🌙' : WEATHERS[this.sky.weather].icon
    h.fps = Math.round(1 / Math.max(0.001, dt))
    h.heading = this.player.camYaw
    h.x = p.pos.x
    h.z = p.pos.z
    h.alt = Math.round(p.pos.y * 2.5)
    if (d !== this.lastDistrict) {
      if (this.lastDistrict !== null || true) {
        const D = DISTRICTS[d]
        if (D) banner(`进入 ${D.name}`, D.theme)
        events.district(d)
      }
      this.lastDistrict = d
    }
    if (p.ride && p.ride.type === 'bus') {
      const st = this.transport.stops[this.transport.busStopIdx]
      h.ride = this.transport.busWait > 0 ? `🚌 停靠 ${st.name}站 · 按 E 下车` : '🚌 观光巴士行驶中…'
    } else if (p.ride && p.ride.type === 'cruise') h.ride = '🚢 昆明湖游船中 · WASD 在甲板走动 · C 拍照 · E 提前下船'
    else if (p.scripted && this.rideLabel) h.ride = this.rideLabel()
    else h.ride = null
    // 每30秒保存位置
    this.saveT = (this.saveT || 0) + 0.2
    if (this.saveT > 15 && !p.ride && !p.scripted) {
      this.saveT = 0
      store.save.lastPos = { x: p.pos.x, y: p.pos.y, z: p.pos.z, yaw: p.camYaw }
      persist()
    }
  }
  checkDiscovery() {
    const p = this.player
    for (const it of this.landmarks.items) {
      if (it.def.hidden) continue
      const R = (it.def.rect ? Math.max(it.def.rect[0], it.def.rect[1]) : 20) + 25
      if (Math.abs(it.x - p.pos.x) > R || Math.abs(it.z - p.pos.z) > R) continue
      if (Math.hypot(it.x - p.pos.x, it.z - p.pos.z) < R) {
        if (events.discover(it.def.id)) {
          banner(`📍 发现新景点：${it.def.name}`, `${it.def.grade}级 · ${DISTRICTS[it.def.district].name} · 按 C 拍照收集`)
          chime('success')
          if (store.save.settings.voice !== false) announce(`发现新景点：${it.def.name}`)
        }
      }
    }
  }
  updateInteractions() {
    const ui = store.ui
    const p = this.player
    if (ui.panel || ui.dialog || ui.photoMode) {
      ui.prompt = null
      return
    }
    if (p.ride) {
      ui.prompt = p.ride.type === 'bus' ? (this.transport.busWait > 0 ? { label: '下车' } : null) : { label: '下船' }
      this.currentInteract = null
      return
    }
    if (p.scripted) {
      ui.prompt = null
      return
    }
    const it = this.interact.nearest(p.pos.x, p.pos.y, p.pos.z)
    const npc = this.npcs.nearestTo(p.pos.x, p.pos.z, 2.6)
    let target = null
    if (npc && (!it || Math.hypot(npc.x - p.pos.x, npc.z - p.pos.z) < Math.hypot(it.x - p.pos.x, it.z - p.pos.z))) target = { npc }
    else if (it) target = { it }
    this.currentInteract = target
    if (!target) ui.prompt = null
    else if (target.npc) ui.prompt = { label: `与 ${target.npc.name}（${target.npc.typeName}）聊天` }
    else ui.prompt = { label: target.it.label }
  }
  onKey(code) {
    const ui = store.ui
    if (ui.screen !== 'game') return
    if (code === 'Escape') {
      if (ui.dialog) this.closeDialog()
      else if (ui.panel) ui.panel = null
      else if (ui.photoMode) this.togglePhoto(false)
      return
    }
    if (ui.dialog) {
      if (code === 'KeyE' || code === 'Enter') {
        const o = ui.dialog.options && ui.dialog.options[0]
        if (o) o.action()
        else this.closeDialog()
      }
      return
    }
    const panels = { KeyM: 'map', KeyB: 'bag', KeyP: 'album', KeyN: 'dex', KeyJ: 'tasks', KeyH: 'help' }
    if (panels[code]) {
      ui.panel = ui.panel === panels[code] ? null : panels[code]
      if (ui.panel) this.input.exitLock()
      return
    }
    if (ui.panel) return
    if (code === 'KeyC') this.togglePhoto()
    else if (code === 'KeyV') {
      if (ui.photoMode) this.cyclePhotoView()
      else this.player.view = this.player.view === 'first' ? 'third' : 'first'
    } else if (code === 'KeyE') this.doInteract()
    else if (ui.photoMode && (code === 'Enter' || code === 'KeyF')) this.shutter()
    else if (ui.photoMode && /^Digit[1-6]$/.test(code)) {
      const f = ['none', 'beijing', 'night', 'fresh', 'bw', 'pixel'][Number(code.slice(5)) - 1]
      ui.filter = f
    } else if (code === 'KeyT') {
      // 快速时间：跳到下一个时段
      this.sky.hour = (Math.floor(this.sky.hour / 6) * 6 + 6) % 24 + 0.5
      toast(`⏰ 时间跳转到 ${formatTime(this.sky.hour)}`)
    }
  }
  // ---------- 摄影 ----------
  togglePhoto(v) {
    const ui = store.ui
    const on = v != null ? v : !ui.photoMode
    ui.photoMode = on
    if (on) {
      this.prevView = this.player.view
      this.player.view = ui.photoView || 'third'
      this.player.char.showAccessory('camera', true)
      this.photoFov = 55
    } else {
      this.player.view = this.prevView === 'selfie' ? 'third' : this.prevView || 'third'
      this.player.char.showAccessory('camera', false)
      this.player.char.setAnim('idle')
    }
  }
  setPhotoView(v) {
    store.ui.photoView = v
    this.player.view = v
    if (v === 'selfie') this.player.camYaw = this.player.modelYaw
  }
  cyclePhotoView() {
    const order = ['third', 'first', 'selfie']
    const i = order.indexOf(store.ui.photoView)
    this.setPhotoView(order[(i + 1) % 3])
  }
  shutter() {
    if (!store.ui.photoMode || this.captureReq) return
    this.captureReq = { view: store.ui.photoView, filter: store.ui.filter }
  }
  finishCapture(req) {
    const found = this.photo.recognize(this.camera, this.landmarks.items.filter((i) => i.loaded || i.lodGroup), this.world)
    const p = this.player
    const d = DISTRICTS[districtAt(p.pos.x, p.pos.z)]
    const night = this.sky.night > 0.5
    const names = found.map((f) => f.def.name)
    const title = names.length ? names.slice(0, 3).join(' · ') : store.ui.hud.place || d.name
    const sub = `${d.name} · ${formatTime(this.sky.hour)} ${this.sky.period} · ${WEATHERS[this.sky.weather].name} · 砖写北京`
    const img = this.photo.capture(this.canvas, { title, sub })
    store.ui.flash = true
    setTimeout(() => (store.ui.flash = false), 180)
    const rec = { id: Date.now(), full: img.full, thumb: img.thumb, title, sub, landmarks: found.map((f) => f.def.id), filter: req.filter, view: req.view, night, district: d.name }
    this.photo.savePhoto(rec)
    store.ui.lastPhoto = { thumb: img.thumb, title }
    setTimeout(() => {
      if (store.ui.lastPhoto && store.ui.lastPhoto.thumb === img.thumb) store.ui.lastPhoto = null
    }, 3500)
    const fresh = events.photo(rec.landmarks, { night, selfie: req.view === 'selfie' })
    chime('success') // 打卡成功音效
    if (fresh.length) {
      for (const id of fresh) toast(`📖 图鉴解锁·建筑：${this.landmarks.byId[id].def.name}`, 'dex', 4500)
      if (store.save.settings.voice !== false) announce(`恭喜解锁图鉴：${this.landmarks.byId[fresh[0]].def.name}`)
    } else if (!found.length) toast('📷 已保存到相册（画面中没有识别到景点，靠近一些试试）')
    else toast('📷 已保存到相册：' + title)
  }
  // ---------- 交互 ----------
  dialog(d) {
    store.ui.dialog = d
    if (d.speak && d.text) speak(d.text, VOICE_PRESETS.narrator, store.save.settings.voice !== false)
    this.input.exitLock()
  }
  closeDialog() {
    const d = store.ui.dialog
    store.ui.dialog = null
    stopVoice()
    if (d && d.onClose) d.onClose()
  }
  doInteract() {
    const p = this.player
    if (p.ride) {
      if (p.ride.type === 'bus') {
        if (this.transport.busWait > 0) this.alightBus()
        else toast('巴士行驶中，请到站后再下车')
      } else if (p.ride.type === 'cruise') this.endCruise()
      return
    }
    const t = this.currentInteract
    if (!t) return
    if (t.npc) return this.talkNPC(t.npc)
    const it = t.it
    switch (it.type) {
      case 'elevator': {
        const dy = it.deckY || 210
        return this.dialog({
          title: it.elevLabel || '观光电梯', text: `高速观光电梯约数秒直达 ${Math.round(dy * 2.5)} 米观景台（游戏中加速）。请选择：`,
          options: [
            { label: `${Math.round(dy * 2.5)}米 · 登顶观景`, action: () => this.rideElevator(it, dy) },
            { label: '取消', action: () => this.closeDialog() }
          ]
        })
      }
      case 'elevatorTop': {
        const dy = it.deckY || 210
        return this.dialog({
          title: it.elevLabel || '观景台', text: '你已登上高空观景台，脚下与眼前是整座北京城。按 C 拍照。',
          options: [
            { label: '乘电梯返回地面', action: () => this.rideElevator(it, 0) },
            { label: '继续观景', action: () => this.closeDialog() }
          ]
        })
      }
      case 'enter': {
        const tw = this.landmarks.byId[it.landmark]
        if (!tw) return
        const ex = it.tx != null ? it.tx : it.x, ez = it.tz != null ? it.tz : it.z
        this.fade(it.fadeText || '🚶 进入中…', () => {
          const p = this.player
          p.teleport(ex, tw.y + (it.ty || 2), ez, it.yaw || 0)
          p.pos.y = Math.max(p.groundAt(ex, ez, tw.y + (it.ty || 2) + 3), tw.y + (it.ty || 2))
          events.count(it.enterKey || 'enter')
          if (it.banner) banner(it.banner[0], it.banner[1])
        })
        return
      }
      case 'shop':
        store.ui.shop = { id: it.shop, ...SHOPS[it.shop] }
        store.ui.panel = 'shop'
        this.input.exitLock()
        return
      case 'culture': {
        const c = CULTURE[it.id]
        events.culture(it.id)
        return this.dialog({ title: `${c.icon} ${c.name}`, text: c.desc, speak: true, options: [{ label: '好的', action: () => this.closeDialog() }] })
      }
      case 'info':
        return this.dialog({ title: it.label, text: it.text, speak: true, options: [{ label: '知道了', action: () => this.closeDialog() }] })
      case 'view': {
        events.view(it.id)
        const lm = this.landmarks.byId[it.landmark]
        return this.dialog({ title: it.label, text: (lm ? lm.def.desc : '') + '\n\n小贴士：按 C 进入摄影模式拍下眼前的风景。', speak: true, options: [{ label: '拍照', action: () => { this.closeDialog(); this.togglePhoto(true) } }, { label: '关闭', action: () => this.closeDialog() }] })
      }
      case 'metro':
        store.ui.metroFrom = it.station
        store.ui.panel = 'metro'
        this.input.exitLock()
        return
      case 'bus':
        return this.busInteract(it.stop)
      case 'cruise':
        return this.dialog({
          title: '🚢 昆明湖游船', text: `从${PIERS.find((x) => x.id === it.pier).name}登船，环游昆明湖，途经十七孔桥、南湖岛、石舫，仰望万寿山佛香阁，是颐和园落日的最佳机位。\n船票 ¥60（黄昏体验最佳）。`,
          options: [
            { label: '购票登船（¥60）', action: () => this.startCruise(it) },
            { label: '取消', action: () => this.closeDialog() }
          ]
        })
    }
  }
  talkNPC(n) {
    n.talkingToPlayer = true
    const first = !n.talked
    n.talked = true
    if (first) events.talk()
    const show = () => {
      const line = this.npcs.talkLine(n)
      speak(line, voiceFor(n), store.save.settings.voice !== false)
      this.dialog({
        title: `${n.name}`,
        sub: n.typeName,
        text: line,
        npc: n,
        options: [
          { label: '再聊聊', action: () => show() },
          { label: '一起合影', action: () => { this.closeDialog(); this.togglePhoto(true); this.setPhotoView('selfie'); n.talkingToPlayer = true; setTimeout(() => (n.talkingToPlayer = false), 8000) } },
          { label: '拜拜', action: () => this.closeDialog() }
        ],
        onClose: () => { n.talkingToPlayer = false; stopVoice() }
      })
    }
    show()
  }
  buy(id) {
    const item = FOODS[id] || SOUVENIRS[id]
    const price = item.price || 0
    if (store.save.money < price) return toast('💸 钱不够了，完成任务可以获得奖励', 'warn')
    if (events.buy(id, price)) toast(`购买成功：${item.icon} ${item.name}  -¥${price}`)
  }
  // ---------- 地铁 ----------
  metroTravel(st) {
    store.ui.panel = null
    const from = store.ui.metroFrom
    if (from && from.id === st.id) return
    this.fade(`🚇 北京地铁 ${st.lines.join(' / ')} · 开往 ${st.name}`, async () => {
      const y = terrainHeight(st.x, st.z)
      this.player.teleport(st.x, y + 0.3, st.z + 6, Math.PI)
      await this.preload(st.x, st.z + 6)
      this.player.pos.y = this.player.groundAt(st.x, st.z + 6, y + 3)
      events.count('metro')
      toast(`已到达 ${st.name}`)
    })
  }
  fade(text, fn) {
    const ui = store.ui
    ui.fade = true
    ui.fadeText = text
    setTimeout(async () => {
      await fn()
      setTimeout(() => (ui.fade = false), 600)
    }, 900)
  }
  // ---------- 巴士 ----------
  busInteract(stop) {
    if (this.transport.busAt(stop)) {
      if (store.save.money < 2) return toast('车费不足', 'warn')
      store.save.money -= 2
      const p = this.player
      p.ride = { type: 'bus', obj: this.transport.bus, local: new THREE.Vector3(0.7, 3.35, 1.4), sit: true, faceYaw: 0 }
      p.view = 'third'
      p.camDist = 9
      events.count('bus')
      toast('🚌 已上车（¥2）。到站后按 E 下车')
    } else {
      const eta = this.transport.busETA(stop)
      this.dialog({ title: '🚌 观光巴士 1 路', text: `线路：西单 ⇄ 天安门  王府井 ⇄ 前门 ⇄ 国贸\n下一班车预计 ${eta} 秒后到达 ${stop.name}站，请在站台稍候。`, options: [{ label: '好的', action: () => this.closeDialog() }] })
    }
  }
  alightBus() {
    const st = this.transport.stops[this.transport.busStopIdx]
    const p = this.player
    p.ride = null
    p.teleport(st.wx, 0.2, st.wz, p.camYaw)
    p.pos.y = p.groundAt(st.wx, st.wz, 3)
    toast(`已在 ${st.name}站 下车`)
  }
  // ---------- 夜游 ----------
  startCruise(it) {
    this.closeDialog()
    if (store.save.money < 60) return toast('船票需要 ¥60', 'warn')
    store.save.money -= 60
    this.cruisePier = PIERS.find((x) => x.id === it.pier)
    this.fade('🚢 登船中…', () => {
      const boat = this.transport.startCruise(this.cruisePier)
      const p = this.player
      p.ride = { type: 'cruise', obj: boat, local: new THREE.Vector3(0, 6.95, -6), free: true, bounds: [-2.7, 2.7, -9.8, 3.8] }
      p.view = 'third'
      events.count('cruise')
      if (this.sky.night < 0.5) toast('💡 提示：夜晚乘船可赏昆明湖夜色与万寿山佛香阁灯火（按 T 快进时间）', 'info', 6000)
    })
  }
  endCruise() {
    const pier = this.cruisePier || PIERS[0]
    this.transport.boatState.active = false
    this.fade('🚢 靠岸下船…', () => {
      const p = this.player
      p.ride = null
      const it = this.interact.items.find((i) => i.type === 'cruise' && i.pier === pier.id)
      const x = it ? it.x : pier.x, z = it ? it.z : pier.z
      p.teleport(x, 0.5, z, p.camYaw)
      p.pos.y = p.groundAt(x, z, 3)
      this.transport.placeIdleBoat()
      toast('感谢乘坐昆明湖游船！')
    })
  }
  // ---------- 登塔观光电梯（任意塔楼通用） ----------
  rideElevator(it, targetY) {
    this.closeDialog()
    const tw = this.landmarks.byId[it.landmark]
    if (!tw) return
    const baseR = it.baseR || 16
    const deckY = it.deckY || 210
    const cx = tw.x, cz = tw.z + baseR + 2
    const p = this.player
    const y0 = p.pos.y, y1 = targetY ? tw.y + deckY + 0.6 : tw.y + 0.6
    const dur = Math.max(4, Math.abs(y1 - y0) / 36)
    let t = 0
    const cab = this.transport.elevatorCab
    cab.visible = true
    p.view = 'third'
    p.camDist = 7
    const label = it.elevLabel || '观光电梯'
    this.rideLabel = () => `🛗 ${label} · ${Math.round((p.pos.y - tw.y) * 2.5)} 米`
    p.scripted = (dt, pl) => {
      t += dt
      const k = smooth(clamp(t / dur, 0, 1))
      pl.pos.set(cx, lerp(y0, y1, k), cz)
      pl.modelYaw = 0
      cab.position.set(cx, pl.pos.y - 0.2, cz)
      if (t >= dur) {
        pl.scripted = null
        cab.visible = false
        this.rideLabel = null
        if (targetY) {
          pl.teleport(tw.x, tw.y + deckY + 0.8, tw.z, Math.PI)
          events.deck()
          if (it.banner) banner(it.banner[0], it.banner[1])
        } else {
          pl.teleport(tw.x, tw.y + 0.6, tw.z + baseR + 10, 0)
        }
      }
    }
  }
}
