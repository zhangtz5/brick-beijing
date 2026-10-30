// 游戏数据：京味美食、文化、纪念品、老字号商店、任务、NPC 北京话对白
export const FOODS = {
  roastduck: { name: '北京烤鸭', icon: '🦆', price: 128, desc: '果木挂炉烤制，皮脆肉嫩。一片鸭肉蘸甜面酱，配葱丝黄瓜，用薄饼一卷，是全聚德、便宜坊的招牌。' },
  zhajiang: { name: '炸酱面', icon: '🍜', price: 22, desc: '黄酱肉丁小火炸出油汪汪的“小碗干炸”，浇在手擀过水面上，菜码琳琅，拌开了那叫一个地道。' },
  hotpot: { name: '铜锅涮羊肉', icon: '🍲', price: 78, desc: '紫铜炭锅清水见底，手切羊肉“立盘不倒”，涮几蘸麻酱腐乳韭菜花，是老北京的冬日至味。' },
  liangxing: { name: '卤煮火烧', icon: '🥘', price: 26, desc: '小肠、肺头、豆腐、火烧一锅老汤咕嘟，蒜汁辣汤一浇，南横街的卤煮最是有名。' },
  chaogan: { name: '炒肝', icon: '🥣', price: 12, desc: '猪肝猪肠勾芡而成，蒜香浓郁、汤汁油亮。老北京喝炒肝不使勺，转着碗沿“喝”才够味儿。' },
  douzhi: { name: '豆汁焦圈', icon: '', price: 10, desc: '绿豆发酵的豆汁儿配酥脆焦圈、咸菜丝，酸香上头——爱它的人一天不喝想得慌。' },
  aiwowo: { name: '艾窝窝', icon: '🍡', price: 8, desc: '糯米做皮，核桃坚果芝麻白糖做馅，滚成雪白小球，软糯清甜，是庙会上的传统小吃。' },
  lvgama: { name: '驴打滚', icon: '', price: 9, desc: '黄米面卷红豆沙，外裹一层喷香黄豆面，撒落如“驴蹄扬尘”，故名驴打滚。' },
  tanghulu: { name: '冰糖葫芦', icon: '🍓', price: 6, desc: '山楂串成裹上晶莹糖稀，咬一口酸甜脆响。冬日里那一抹红，是胡同口最亮的风景。' },
  yangmilk: { name: '宫廷酸奶', icon: '🥛', price: 8, desc: '老北京宫廷风味奶酪，浓稠微酸，撒上白糖桂花，清凉爽口。' }
}

export const CULTURE = {
  jingju: { name: '京剧', icon: '🎭', desc: '京剧是中国的“国粹”，融唱念做打于一体，脸谱、行头、西皮二黄，徽班进京后在北京融会成型。' },
  hutong: { name: '胡同文化', icon: '🏘️', desc: '北京胡同源自元代，蛛网般街巷串联起四合院。“胡同”一词出自蒙古语“水井”，邻里其间，最有市井烟火气。' },
  siheyuan: { name: '四合院', icon: '🏠', desc: '四面房屋围合一处庭院，坐北朝南、尊卑有序，影壁垂花门、鱼缸石榴树，是老北京人家的理想居所。' },
  zhongzhou: { name: '北京中轴线', icon: '🧭', desc: '南起永定门、北至钟鼓楼，全长 7.8 公里，串联故宫、天坛、景山，是“中国理想都城秩序”的杰作，已列入世界遗产。' },
  jingtai: { name: '景泰蓝', icon: '🏺', desc: '铜胎掐丝珐琅，明代景泰年间盛行，以蓝釉著称。燕京八绝之一，工艺繁复、金碧辉煌。' },
  tueye: { name: '兔儿爷', icon: '🐰', desc: '老北京中秋的守护神与玩具，金盔金甲、骑着瑞兽，是独属于北京的节令记忆。' },
  geshao: { name: '鸽哨', icon: '🕊️', desc: '成群鸽子掠过京城天空，翅间鸽哨嗡嗡作响，是老北京最悠远的声音意象。' },
  miaohui: { name: '庙会', icon: '🎪', desc: '春节地坛、龙潭、厂甸庙会，拉洋片、抖空竹、吹糖人、卖风车，把整条街的年味都聚了起来。' },
  kaoya: { name: '挂炉烤鸭技艺', icon: '🔥', desc: '全聚德挂炉、便宜坊焖炉，皆为非遗产技艺。果木明火、不断翻烤，方得那一身枣红酥脆。' },
  erjing: { name: '大鼓与相声', icon: '🎤', desc: '天桥曾是百艺场子，京韵大鼓、单弦、相声在此扎根。“您吉祥”“吃了吗您内”，京腔京韵尽在市井。' }
}

export const SOUVENIRS = {
  s_badge: { name: '北京旅行纪念章', icon: '🏅', desc: '完成新手旅行任务获得。' },
  s_axis: { name: '中轴线徽章', icon: '🧭', desc: '完成中轴经典线探索。' },
  s_garden: { name: '皇家园林徽章', icon: '🏯', desc: '完成西部园林线探索。' },
  s_modern: { name: '现代北京徽章', icon: '🏙️', desc: '完成奥运与 CBD 现代线探索。' },
  s_wall: { name: '不到长城非好汉徽章', icon: '🧱', desc: '登上八达岭长城。' },
  s_foodie: { name: '“吃在北京”金筷子', icon: '🥢', desc: '品尝 6 种北京美食。' },
  s_culture: { name: '京味文化达人证书', icon: '📕', desc: '解锁 6 项京味文化图鉴。' },
  s_mask: { name: '京剧脸谱', icon: '🎭', desc: '故宫纪念品店有售，或解锁京剧文化获得。', price: 45 },
  s_rabbit: { name: '兔儿爷泥塑', icon: '🐰', desc: '老北京节令吉祥物，前门老字号有售。', price: 68 },
  s_kite: { name: '沙燕风筝', icon: '🪁', desc: '北京硬翅风筝，扎燕造型，FG 风筝博物馆同款。', price: 55 },
  s_snuff: { name: '景泰蓝小瓶', icon: '🏺', desc: '燕京八绝景泰蓝，铜胎掐丝珐琅。', price: 120 },
  s_postcard: { name: '北京明信片套装', icon: '🖼️', desc: '南锣鼓巷手信店有售。', price: 15 },
  s_tshirt: { name: '“我爱北京”T恤', icon: '👕', desc: '前门大街有售。', price: 59 },
  s_deck: { name: '中国尊观景纪念章', icon: '🏙️', desc: '登上中国尊 226 米天空观景台获得。' },
  s_cruise: { name: '昆明湖游船纪念票', icon: '🎫', desc: '乘坐昆明湖游船获得。' },
  s_card: { name: '交通联合纪念卡', icon: '💳', desc: '首次乘坐地铁获得。' }
}

export const SHOPS = {
  roastduck: { name: '全聚德烤鸭', greet: '您来啦！今儿切只枣红油亮的挂炉鸭，配饼配酱？', items: ['roastduck'] },
  bianyifang: { name: '便宜坊焖炉烤鸭', greet: '焖炉烤鸭不见火，皮儿更酥、肉更嫩，来一只？', items: ['roastduck'] },
  noodle: { name: '海碗居炸酱面', greet: '小碗干炸、手擀面、菜码儿齐——您几位？', items: ['zhajiang', 'chaogan'] },
  hotpot: { name: '东来顺涮羊肉', greet: '紫铜炭锅水开啦，手切羊肉来二两？', items: ['hotpot'] },
  liangxing: { name: '南横街卤煮', greet: '卤煮火烧，肠肺豆腐全有，加蒜汁儿不？', items: ['liangxing'] },
  snack: { name: '护国寺小吃', greet: '豆汁儿焦圈、艾窝窝、驴打滚儿，都给您备着！', items: ['douzhi', 'aiwowo', 'lvgama'] },
  chaogan: { name: '姚记炒肝', greet: '炒肝儿一碗，转着碗沿儿喝，香！', items: ['chaogan'] },
  candy: { name: '胡同口糖葫芦', greet: '冰糖葫芦——山楂、葡萄、草莓都有，来一串？', items: ['tanghulu'] },
  milk: { name: '宫廷酸奶铺', greet: '老北京宫廷酸奶，撒白糖桂花，凉丝丝的。', items: ['yangmilk'] },
  souvenir: { name: '南锣鼓巷手信', greet: '带份儿手信回去嘞，风筝、明信片都齐活！', items: ['s_kite', 's_postcard'] },
  gugong: { name: '故宫文创店', greet: '这里有家喻户晓的京剧脸谱和兔儿爷。', items: ['s_mask', 's_rabbit'] },
  qianmen: { name: '前门老字号', greet: '内联升的鞋、瑞蚨祥的绸、一得阁的墨——百年老号！', items: ['s_tshirt', 's_snuff'] }
}

// ---------- 任务 ----------
// cond: {type, ...}  事件驱动累计
export const NOVICE = [
  { id: 'n1', title: '拍摄故宫', desc: '前往中轴线核心，用相机（C 键）拍下故宫午门与角楼。', cond: { type: 'photo', id: 'gugong' }, reward: { money: 100 } },
  { id: 'n2', title: '寻访天坛', desc: '前往天坛公园，找到三重蓝琉璃圆檐的祈年殿。', cond: { type: 'discover', id: 'tiantan' }, reward: { money: 100, item: 's_mask' } },
  { id: 'n3', title: '尝一份京味小吃', desc: '到护国寺小吃或姚记炒肝，尝一碗豆汁焦圈或炒肝。', cond: { type: 'buy', id: 'chaogan' }, reward: { money: 80 } },
  { id: 'n4', title: '登景山俯瞰中轴', desc: '登上景山万春亭，俯瞰故宫琉璃屋海与北京中轴线全景。', cond: { type: 'view', id: 'peak' }, reward: { money: 300, item: 's_badge' } }
]

export const QUESTS = [
  { id: 'q_axis', district: 'dongcheng', title: '中轴经典线', desc: '拍摄故宫、天安门、天坛、景山、钟鼓楼等中轴名胜 4 处', cond: { type: 'photoSet', ids: ['gugong', 'tiananmen', 'tiananmensq', 'tiantan', 'jingshan', 'zhonggu'], n: 4 }, reward: { money: 220, item: 's_axis' } },
  { id: 'q_garden', district: 'haidian', title: '皇家园林线', desc: '游览颐和园、圆明园、香山，拍摄其中 2 处', cond: { type: 'photoSet', ids: ['yiheyuan', 'yuanmingyuan', 'xiangshan'], n: 2 }, reward: { money: 200, item: 's_garden' } },
  { id: 'q_modern', district: 'chaoyang', title: '现代北京线', desc: '拍摄鸟巢、水立方、中国尊、央视大楼、国贸天际线 3 处', cond: { type: 'photoSet', ids: ['birdsnest', 'watercube', 'zhongguozun', 'cctv', 'cidsky'], n: 3 }, reward: { money: 220, item: 's_modern' } },
  { id: 'q_wall', district: 'yanqing', title: '长城线', desc: '乘传送抵达八达岭，登上好汉坡（可传送前往）', cond: { type: 'discover', id: 'badaling' }, reward: { money: 260, item: 's_wall' } },
  { id: 'q_hutong', district: 'dongcheng', title: '胡同市井', desc: '在什刹海、南锣鼓巷一带与 5 位老北京街坊攀谈', cond: { type: 'dailyTalk', n: 5 }, reward: { money: 160 } },
  { id: 'q_food', title: '吃在北京', desc: '品尝 6 种不同的北京美食', cond: { type: 'foodCount', n: 6 }, reward: { money: 150, item: 's_foodie' } },
  { id: 'q_culture', title: '京味文化达人', desc: '解锁 6 项京味文化图鉴', cond: { type: 'cultureCount', n: 6 }, reward: { money: 150, item: 's_culture' } }
]

export const DAILY_POOL = [
  { id: 'd_photo3', title: '今天拍摄 3 个建筑', cond: { type: 'dailyPhotos', n: 3 }, reward: { money: 60 } },
  { id: 'd_npc5', title: '找 5 位路人聊天', cond: { type: 'dailyTalk', n: 5 }, reward: { money: 50 } },
  { id: 'd_district', title: '探索 2 个新区', cond: { type: 'dailyDistricts', n: 2 }, reward: { money: 60 } },
  { id: 'd_bus', title: '乘坐一次观光巴士', cond: { type: 'dailyCount', key: 'bus', n: 1 }, reward: { money: 40 } },
  { id: 'd_metro', title: '乘坐一次地铁', cond: { type: 'dailyCount', key: 'metro', n: 1 }, reward: { money: 40 } },
  { id: 'd_food2', title: '品尝 2 种美食', cond: { type: 'dailyCount', key: 'food', n: 2 }, reward: { money: 50 } },
  { id: 'd_night', title: '夜晚拍摄一张照片', cond: { type: 'dailyCount', key: 'nightPhoto', n: 1 }, reward: { money: 50 } },
  { id: 'd_walk', title: '步行 1000 米', cond: { type: 'dailyCount', key: 'walk', n: 1000 }, reward: { money: 40 } },
  { id: 'd_culture', title: '体验一项京味文化', cond: { type: 'dailyCount', key: 'culture', n: 1 }, reward: { money: 50 } },
  { id: 'd_selfie', title: '拍一张自拍', cond: { type: 'dailyCount', key: 'selfie', n: 1 }, reward: { money: 30 } }
]

// ---------- NPC ----------
export const NPC_TYPES = {
  office: { name: '上班族', weight: 3 },
  student: { name: '学生', weight: 2 },
  elder: { name: '大爷大妈', weight: 2 },
  tourist: { name: '游客', weight: 3 },
  kid: { name: '小孩', weight: 1 },
  local: { name: '老北京', weight: 2 }
}

export const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡']
export const NICK = { office: ['先生', '小姐', '经理', '工'], student: ['同学'], elder: ['大爷', '大妈', '爷爷', '奶奶'], tourist: ['游客'], kid: ['小孩', '妹妹'], local: ['师傅', '大哥', '大姐', '哥们'] }

export const DIALOG = {
  office: ['今儿国贸又堵得慌，我还是坐十号线吧。', '在金融街上班，忙起来一口炸酱面就得解决。', '您猜怎么着？项目黄了，回头咱涮羊肉去去火。', '长安街沿线地铁早高峰，那叫一个挤。', '加完班上景山看看夜景，缓解缓解。'],
  student: ['我们学校在海淀，放学常去五道口撸串儿。', '周末想去颐和园划船，您给指个路呗？', '历史老师讲中轴线申遗成功，特有面子！', '我就爱在南锣鼓巷拍照，古色古香的。', '明儿月考，先复习去，回见您呐！'],
  elder: ['以前这一片儿全是胡同、四合院。', '您吃了没？没吃家里凑一口去。', '我年轻那会儿，天上全是鸽子，鸽哨嗡——那叫一个舒坦。', '京剧啊，得空去湖广会馆听两段儿。', '什刹海冬天滑冰车，那才叫乐子。', '如今楼是高了，可老北京那股子劲儿不能丢。'],
  tourist: ['头一回来北京，故宫长城得先安排上！', '香山的红叶是不是这个季节最好看？', '听说烤鸭得去全聚德，您给推荐推荐？', '八达岭长城真壮观，不到长城非好汉呐！', '麻烦帮我在这儿拍张照，谢谢您嘞！'],
  kid: ['我想要一串冰糖葫芦！', '大爷大爷，兔儿爷长什么样啊？', '爸爸说明儿带我去鸟巢看烟花！', '艾窝窝甜甜的，我可喜欢吃啦！'],
  local: ['老北京打招呼，讲究一句“吃了吗您内”。', '起风扬沙，出门记着戴口罩围巾。', '夏天北京爱下暴雨，出门看天气预报。', '这儿的炒肝儿地道，转着碗沿儿喝！', '坐地铁去哪儿都齐活儿，方便！', '咱北京简称“京”，是三千年古都，也是双奥之城。']
}

export const WEATHER_LINES = {
  rain: ['落雨啦，前门楼子都氤氲成一幅画。', '北京这雨说来就来，找地方避避。', '下雨天，来碗热乎的卤煮最舒坦。'],
  typhoon: ['外头风大得邪乎，没啥事别硬扛！', '这妖风把路边摊都掀了，收好伞和帽子。'],
  night: ['夜里的长安街灯火通明，去景山看看？', '宵夜走起——涮肉还是烤串儿？', '鸟巢水立方的灯光，夜里最好看！']
}

export const LANDMARK_LINES = {
  gugong: ['故宫旧称紫禁城，明清二十四位皇帝的皇宫。', '角楼九梁十八柱七十二条脊，巧夺天工。'],
  tiananmen: ['天安门是皇城的正门，面阔九间象征九五之尊。', '1949 年 10 月 1 日，开国大典就在这里举行。'],
  tiantan: ['祈年殿三重蓝琉璃圆檐，是“天圆地方”的写照。', '圜丘的天心石上说话，回音层层——特别神。'],
  jingshan: ['景山万春亭是北京中轴线的制高点。', '站这儿往南看，整座故宫金顶尽收眼底。'],
  zhonggu: ['钟鼓楼“暮鼓晨钟”，报了元明清三代时辰。', '老北京说“钟鼓楼的时辰到了”，就是这话。'],
  yiheyuan: ['颐和园借景西山，长廊十七孔桥最出片。', '昆明湖落日时分，佛香阁金光一片。'],
  yuanmingyuan: ['大水法的西洋楼残柱，是万园之园的印记。', '圆明园警示后人，勿忘历史。'],
  xiangshan: ['香山红叶深秋最盛，层林尽染。', '香炉峰顶看日落，是北京人的重阳节目。'],
  birdsnest: ['鸟巢的编织钢梁，看着随意其实受力讲究。', '08 年奥运会就在这儿开的，记忆犹新！'],
  watercube: ['水立方的蓝色气泡，夜里亮起来跟梦幻似的。', '从“水立方”到“冰立方”，双奥场馆独一份。'],
  zhongguozun: ['中国尊 528 米，北京现在最高的楼。', '造型取自礼器“尊”，收腰外撇，日落泛金。'],
  cctv: ['央视“大裤衩”是悬挑闭环结构，颠覆了摩天楼。', '库哈斯设计，正侧面拍最能看出门道。'],
  badaling: ['不到长城非好汉，八达岭这段最经典。', '北八楼是制高点，城墙沿燕山蜿蜒，壮观！']
}
