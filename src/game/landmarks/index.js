// 景点注册表：真实经纬度、等级、图鉴介绍、建模函数
// build 函数写法模板参考 guangzhou-main/src/game/landmarks/（Builder API：box/prism/roof/beam/sign）
import { buildGugong, gugongLOD, buildTiananmen, buildSquare } from './axis.js'
import { buildQianmen, qianmenLOD } from './qianmen.js'
import { buildTiantan, tiantanLOD } from './tiantan.js'
import { buildJingshan, buildZhonggu } from './jingshan.js'
import { buildYiheyuan, yiheyuanLOD, buildYuanmingyuan, yuanmingyuanLOD, buildXiangshan } from './xiuhu.js'
import { buildBirdsnest, birdsnestLOD, buildWatercube, watercubeLOD, buildAolinTower } from './aolin.js'
import { buildZhongguozun, zhongguozunLOD, buildCCTV, cctvLOD, buildCIDSkyline } from './cbd.js'
import { buildCCTower, cctowerLOD } from './cctower.js'
import { buildGreatWall, greatwallLOD } from './greatwall.js'
// grade: S 高度还原 / A 主要建筑 / B 区域氛围
// rect: [半宽, 半深] 城市程序化建筑避让矩形；noCity: 区域内不生成程序化建筑；lod: 远景简模函数
export const LANDMARKS = [
  // ---------- 中轴核心（D3）----------
  { id: 'gugong', name: '故宫', alias: '紫禁城', district: 'dongcheng', grade: 'S', lat: 39.9158, lon: 116.3976, rect: [95, 135], focusY: 22, photoR: 900, loadR: 1100, lod: gugongLOD, build: buildGugong,
    desc: '故宫又称紫禁城，明清两代二十四位皇帝的皇宫，占地72万平方米，是世界上现存规模最大、保存最完整的木结构宫殿建筑群。前朝三大殿（太和、中和、保和）与后廷三宫沿中轴线层层展开，红墙黄琉璃、汉白玉三台是它的标志。', tip: '从午门进，沿中轴线御路走过金水桥与三大殿；景山万春亭可俯瞰故宫全景。' },
  { id: 'tiananmen', name: '天安门', district: 'dongcheng', grade: 'S', lat: 39.9087, lon: 116.3975, rect: [20, 12], focusY: 14, photoR: 500, build: buildTiananmen,
    desc: '天安门始建于明永乐十五年（1417年），是皇城的正门。城台面阔九间、进深五间，双重檐黄琉璃，卷草与华表映衬，象征“九五之尊”。1949年10月1日在此举行开国大典。', tip: '从广场南侧正对城楼拍全景最容易出片；门洞可穿行。' },
  { id: 'tiananmensq', name: '天安门广场', district: 'dongcheng', grade: 'A', lat: 39.9005, lon: 116.3975, rect: [48, 66], focusY: 6, photoR: 600, noCity: true, build: buildSquare,
    desc: '天安门广场南北长880米、东西宽500米，是世界上最大的城市广场之一。人民英雄纪念碑、毛主席纪念堂、国旗杆与正阳门共同构成中轴线上的国家礼仪空间。', tip: '清晨看升旗方向取景，以纪念碑与天安门同框。' },
  { id: 'qianmen', name: '前门·大栅栏', alias: '正阳门', district: 'dongcheng', grade: 'S', lat: 39.8995, lon: 116.3976, rect: [70, 130], focusY: 20, photoR: 700, loadR: 1000, lod: qianmenLOD, build: buildQianmen,
    desc: '前门即正阳门，明清北京内城的正门，由城楼、箭楼、瓮城组成，“前门楼子九丈九”。城南的前门大街与大栅栏汇聚瑞蚨祥、内联升、同仁堂、全聚德等百年老字号，是最繁华的市井商街。', tip: '从箭楼南广场正拍城楼瓮城最气派；全聚德买只烤鸭可解锁挂炉技艺，大栅栏淘兔儿爷。' },
  // ---------- D4：天坛 / 景山 / 钟鼓楼 ----------
  { id: 'tiantan', name: '天坛', alias: '祈年殿', district: 'xicheng', grade: 'S', lat: 39.882, lon: 116.3945, rect: [70, 90], focusY: 26, photoR: 800, loadR: 1000, lod: tiantanLOD, build: buildTiantan,
    desc: '天坛是明清两代皇帝祭天、祈谷的场所，祈年殿以三重蓝琉璃圆檐攒尖直上、无大梁长柱，全由八根龙井柱与二十八根檐柱撑起，是“天圆地方”宇宙观的最高表达。', tip: '从西门进沿丹陛桥北上，低角度仰拍三重檐最震撼；圜丘天心石上说话有回音彩蛋。' },
  { id: 'jingshan', name: '景山公园', alias: '万春亭', district: 'dongcheng', grade: 'A', lat: 39.9272, lon: 116.3968, focusY: 50, photoR: 700, build: buildJingshan,
    desc: '景山是北京中轴线上的制高点，清代在山脊列置五亭，中亭万春亭可南向俯瞰故宫琉璃屋海与中轴全景，“景山春雪”为燕京胜景。', tip: '傍晚站在万春亭南侧俯瞰故宫金顶连绵，是全城最著名的官方机位。' },
  { id: 'zhonggu', name: '钟鼓楼', district: 'dongcheng', grade: 'A', lat: 39.9478, lon: 116.3967, rect: [20, 24], focusY: 20, photoR: 500, build: buildZhonggu,
    desc: '钟鼓楼是北京旧城的报时中心，“暮鼓晨钟”报了元明清三代京城时辰。钟楼居北悬铜钟，鼓楼居南置更鼓二十四面，红墙灰砖相对而立。', tip: '从鼓楼南广场正拍双层飞檐最稳；登钟楼可北望奥区塔群。' },
  // ---------- D5：颐和园 / 圆明园 / 香山 ----------
  { id: 'yiheyuan', name: '颐和园', alias: '昆明湖·万寿山', district: 'haidian', grade: 'S', lat: 39.9985, lon: 116.2725, rect: [90, 100], focusY: 30, photoR: 900, loadR: 1200, lod: yiheyuanLOD, build: buildYiheyuan,
    desc: '颐和园以万寿山、昆明湖为骨架，借景西山，长廊七百二十八米如彩带绕山，十七孔桥如长虹卧波，是保存最完整的皇家园林。', tip: '登佛香阁俯瞰昆明湖十七孔桥，或傍石舫拍湖光塔影；可乘环湖游船。' },
  { id: 'yuanmingyuan', name: '圆明园', alias: '大水法遗址', district: 'haidian', grade: 'A', lat: 40.0037, lon: 116.3062, rect: [40, 36], focusY: 8, photoR: 600, lod: yuanmingyuanLOD, build: buildYuanmingyuan,
    desc: '圆明园汇集南北园林之胜，曾被称作“万园之园”，1860 年遭英法联军劫焚，西洋楼残柱成为遗址的标志性剪影。', tip: '夕阳下的残柱群最出片；福海在遗址东北侧。' },
  { id: 'xiangshan', name: '香山公园', alias: '香炉峰', district: 'haidian', grade: 'A', lat: 39.991, lon: 116.194, focusY: 112, photoR: 900, build: buildXiangshan,
    desc: '香山主峰香炉峰海拔 557 米，“香山红叶”名满京华，每至深秋黄栌尽染；登顶可俯瞰北京西城，是重阳登高的老北京习俗。', tip: '十月中下旬红叶季山体最热色；峰顶观亭拍日落剪影。' },
  // ---------- D6：奥林匹克公园 / CBD / 八达岭 ----------
  { id: 'birdsnest', name: '鸟巢', alias: '国家体育场', district: 'chaoyang', grade: 'S', lat: 39.9929, lon: 116.3965, rect: [56, 62], focusY: 16, photoR: 700, loadR: 900, lod: birdsnestLOD, build: buildBirdsnest,
    desc: '国家体育场“鸟巢”由赫尔佐格与德梅隆设计，2008 北京奥运主会场。看似随意的编织钢梁实为相互支撑的马鞍形受力结构，用钢量约 11 万吨。', tip: '黄昏时编织钢梁泛暖光；从东南侧斜拍最能体现马鞍形体量。' },
  { id: 'watercube', name: '水立方', alias: '国家游泳中心', district: 'chaoyang', grade: 'S', lat: 39.9945, lon: 116.3900, rect: [36, 40], focusY: 10, photoR: 600, loadR: 900, lod: watercubeLOD, build: buildWatercube,
    desc: '国家游泳中心“水立方”外墙由 3000 多个不规则蓝色“气泡”（ETFE 膜结构）组成，灵感来自水分子泡沫与细胞结构，夜晚气泡亮时梦幻通透。', tip: '夜晚拍蓝色气泡内透光最梦幻；与鸟巢同框可取中轴广场机位。' },
  { id: 'aolintower', name: '奥林匹克塔', district: 'chaoyang', grade: 'A', lat: 39.9990, lon: 116.3920, rect: [24, 24], focusY: 60, photoR: 700, build: buildAolinTower,
    desc: '奥林匹克塔由五座“金色钉子”组成，最高塔 246.8 米，塔顶 360° 观景层可南望故宫中轴线、北眺燕山。', tip: '塔顶是俯瞰北京中轴线北端与奥区全景的绝佳机位。' },
  { id: 'zhongguozun', name: '中国尊', alias: '中信大厦', district: 'chaoyang', grade: 'S', lat: 39.9088, lon: 116.4605, rect: [34, 34], focusY: 130, photoR: 900, loadR: 1100, lod: zhongguozunLOD, build: buildZhongguozun,
    desc: '中信大厦“中国尊”高 528 米，是北京现行最高建筑。造型取自古代礼器“尊”，呈收腰外撇的花樽形，日落时通体泛金。', tip: '从东三环地面仰拍收分轮廓最震撼；黄昏金色幕墙最佳。' },
  { id: 'cctv', name: '央视总部大楼', alias: '大裤衩', district: 'chaoyang', grade: 'S', lat: 39.9093, lon: 116.4425, rect: [34, 26], focusY: 70, photoR: 800, loadR: 1000, lod: cctvLOD, build: buildCCTV,
    desc: '央视总部由雷姆·库哈斯（OMA）设计，两座倾斜塔楼在 162 米高空由 L 形悬挑结构对接成闭合环，被市民昵称“大裤衩”。', tip: '正侧面拍悬挑闭环最能体现结构奇思；东南角机位可拍“门”形剪影。' },
  { id: 'cidsky', name: '国贸天际线', district: 'chaoyang', grade: 'A', lat: 39.9086, lon: 116.4560, rect: [70, 70], focusY: 90, photoR: 900, build: buildCIDSkyline,
    desc: '北京 CBD 以国贸中心、银泰、中国尊等摩天楼群构成城市天际线，是中央商务区的现代名片。', tip: '傍晚华灯初上时拍楼群剪影与蓝调天空对比最美。' },
  { id: 'cctower', name: '中央电视塔', district: 'haidian', grade: 'A', lat: 39.9166, lon: 116.3103, rect: [30, 30], focusY: 55, photoR: 800, lod: cctowerLOD, build: buildCCTower,
    desc: '中央广播电视塔高 386 米，矗立西三环玉渊潭畔，上部球状观景台可 360° 俯瞰北京城，曾是北京最高的观景平台。', tip: '乘电梯登观景球俯瞰全城；黄昏时塔身灯光与大球最出片。' },
  { id: 'badaling', name: '八达岭长城', alias: '好汉坡', district: 'yanqing', grade: 'S', lat: 40.3597, lon: 116.0200, foundation: true, focusY: 12, photoR: 1400, loadR: 1600, lod: greatwallLOD, build: buildGreatWall,
    desc: '八达岭长城是明长城中保存最完好、最具代表性的一段，居庸关外镇。城墙随山脊起伏、敌楼相望，“不到长城非好汉”，北八楼是海拔最高的制高点。', tip: '登北八楼俯瞰城墙沿燕山蜿蜒最磅礴；深秋层林尽染时最佳。可传送抵达。' }
  // ---------- D6 ----------
]

export const GRADE_INFO = { S: '高度还原建筑', A: '主要建筑', B: '区域氛围' }
