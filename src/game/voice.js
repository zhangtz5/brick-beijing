// NPC 语音朗读（Web Speech API）：按人物身份优选原生音色，变调只做轻微补偿
// 无需外部资源；浏览器原生 SpeechSynthesis，用户按键交谈属用户手势，允许播放

// 各身份优先匹配的音色名（Edge/Win11 自带中文神经音色，音质自然）：
// 小孩→晓伊(女童声)、老人→云泽(沉稳男声)、女性→晓晓、男性→云希、解说→云扬
const VOICE_NAME_PATTERNS = {
  kid: /(Xiaoyi|晓伊|Xiaoshuang|晓双)/i,
  elder: /(Yunze|云泽|Yunjian|云健)/i,
  female: /(Xiaoxiao|晓晓|Yaoyao|瑶瑶|Huihui|惠惠)/i,
  male: /(Yunxi|云希|Yunfeng|云峰|Kangkang|康康)/i,
  narrator: /(Yunyang|云扬|Yunxi|云希|Xiaoxiao|晓晓)/i
}

let voiceCache = []

function pickVoice(pattern) {
  if (!voiceCache.length) return null
  if (pattern) {
    const hit = voiceCache.find((v) => /zh/i.test(v.lang) && pattern.test(v.name))
    if (hit) return hit
  }
  return (
    voiceCache.find((v) => /zh[-_]?CN/i.test(v.lang)) ||
    voiceCache.find((v) => /^zh/i.test(v.lang)) ||
    null
  )
}

export function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  voiceCache = window.speechSynthesis.getVoices() || []
  // 部分浏览器异步加载语音列表
  window.speechSynthesis.onvoiceschanged = () => { voiceCache = window.speechSynthesis.getVoices() || [] }
}
initVoices()

// 音色预设：voice=首选音色名 pattern；pitch/rate 收窄到自然区间（|pitch-1|≤0.3），
// 避免大幅变调产生电子音；jit=同一音色不同 NPC 间的随机偏差，防止千人一声
// tuned=true 表示已匹配到目标神经音色，可用原生质感只留极小抖动
const basePresets = {
  kid: { voice: VOICE_NAME_PATTERNS.kid, pitch: 1.18, rate: 1.1, jit: 0.06 }, // 女童声原生偏尖，微抬即可
  female: { voice: VOICE_NAME_PATTERNS.female, pitch: 1.06, rate: 1.0, jit: 0.05 },
  male: { voice: VOICE_NAME_PATTERNS.male, pitch: 0.92, rate: 0.98, jit: 0.05 },
  elder: { voice: VOICE_NAME_PATTERNS.elder, pitch: 0.86, rate: 0.88, jit: 0.04 }, // 降速比降调更像长者
  narrator: { voice: VOICE_NAME_PATTERNS.narrator, pitch: 1.0, rate: 0.99, jit: 0 }
}

// 未匹配到目标音色时，退回默认女声兜底，需加大变调幅度区分身份
const fallbackPresets = {
  kid: { pitch: 1.45, rate: 1.12 },
  female: { pitch: 1.15, rate: 1.0 },
  male: { pitch: 0.72, rate: 0.96 },
  elder: { pitch: 0.62, rate: 0.85 },
  narrator: { pitch: 1.0, rate: 1.0 }
}

function buildPreset(key) {
  const base = basePresets[key]
  const voice = pickVoice(base.voice)
  const tuned = !!voice && !!base.voice && new RegExp(base.voice).test(voice.name)
  if (tuned) return { ...base, voice, tuned: true }
  const fb = fallbackPresets[key]
  return { ...base, ...fb, voice: voice || null, tuned: false }
}

// 对外暴露的解说员预设（景点讲解/任务播报）：getter 懒构建，等语音列表加载完再匹配音色
export const VOICE_PRESETS = {
  get narrator() { return buildPreset('narrator') }
}

// 依据 NPC 身份/性别选择音色；带实例级随机偏差，让同身份 NPC 听起来不完全一样
export function voiceFor(npc) {
  const key = !npc ? 'male'
    : npc.type === 'kid' ? 'kid'
    : npc.type === 'elder' ? 'elder'
    : npc.gender === 'f' ? 'female' : 'male'
  const preset = buildPreset(key)
  if (preset.jit) {
    // 以 NPC 标识为种子的固定偏差：同一 NPC 每次发声一致，不同 NPC 有区分
    const seed = npc ? (npc.id != null ? Number(npc.id) || npc.id : (npc.name || '').length) : 0
    const h = Math.sin(seed * 127.1 + key.length * 311.7) * 43758.5453
    const r = h - Math.floor(h) // 0~1
    preset.pitch = +(preset.pitch + (r - 0.5) * 2 * preset.jit).toFixed(2)
    preset.rate = +(preset.rate + (r - 0.5) * preset.jit).toFixed(2)
  }
  return preset
}

// 长句拆开后逐条入队，句间靠标点自然停顿，比一口气读完更像说话
function toUtterances(text) {
  const parts = String(text).split(/(?<=[。！？；?!;])/).map((s) => s.trim()).filter(Boolean)
  return parts.length ? parts : [String(text)]
}

export function speak(text, preset, enabled = true) {
  if (!enabled || !text) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel() // 打断上一句，避免叠音
    for (const part of toUtterances(text)) {
      const u = new SpeechSynthesisUtterance(part)
      u.lang = 'zh-CN'
      if (preset && preset.voice) u.voice = preset.voice
      else { const v = pickVoice(); if (v) u.voice = v }
      u.pitch = preset && preset.pitch != null ? preset.pitch : 1
      u.rate = preset && preset.rate != null ? preset.rate : 1
      u.volume = 1
      window.speechSynthesis.speak(u)
    }
  } catch (e) {
    /* 语音不可用时静默降级为纯文字 */
  }
}

export function stopVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel() } catch (e) {}
  }
}

// 气泡闲聊朗读：不打断正在进行的朗读（对话/讲解），且节流避免刷屏
let lastBubble = 0
export function speakBubble(text, preset, enabled = true) {
  if (!enabled || !text) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  if (window.speechSynthesis.speaking) return
  if (Date.now() - lastBubble < 3500) return
  lastBubble = Date.now()
  speak(text, preset, enabled)
}

// 高优先级播报（任务完成/图鉴解锁）：打断当前朗读，用解说员音色
export function announce(text, enabled = true) {
  if (!enabled || !text) return
  speak(text, VOICE_PRESETS.narrator, enabled)
}

// 轻量成功音效（WebAudio 合成，无需音频文件）：success 上行三音，down 下行两音
let actx = null
export function chime(kind = 'success') {
  if (typeof window === 'undefined') return
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    actx = actx || new AC()
    if (actx.state === 'suspended') actx.resume()
    const now = actx.currentTime
    const notes = kind === 'down' ? [659.25, 523.25] : [523.25, 659.25, 783.99]
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const t = now + i * 0.085
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
      o.connect(g); g.connect(actx.destination)
      o.start(t); o.stop(t + 0.22)
    })
  } catch (e) {}
}
