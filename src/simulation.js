import { GRID_SIZE, CORNER_STRIDE, inBounds, idx, cIdx, hash2D, generateWorld } from './mapgen.js';

export const CATALOG = {
  // Terrain & Hydrology
  ter_raise:   { id: 'ter_raise',   name: '抬升造山/筑堤', cost: 40, unlockPop: 0, unlockLevel: 1, icon: '⛰️', desc: '抬高地形造山，或在河岸筑起防洪堤坝（土方工程费较高）' },
  ter_lower:   { id: 'ter_lower',   name: '挖河开渠/造湖', cost: 45, unlockPop: 0, unlockLevel: 1, icon: '🌊', desc: '挖掘人工运河、蓄水湖泊或加深航道，水流实时涌入' },
  ter_flatten: { id: 'ter_flatten', name: '平整山城台地', cost: 30, unlockPop: 0, unlockLevel: 1, icon: '📐', desc: '按起点海拔推平坡地，打造半山台地街区' },
  ter_spring:  { id: 'ter_spring',  name: '高山水源泉眼', cost: 1200, unlockPop: 450, unlockLevel: 4, icon: '⛲', desc: '在山顶引出天然活水源头，顺山谷奔流成河' },

  // Multi-layer Roads, Viaducts, Ramps, One-Way Streets, Interchanges & Tunnels (Real upkeep pressure!)
  road_1:              { id: 'road_1',              name: '双车道街道', cost: 35, bridgeCost: 110, upkeep: 1.1, unlockPop: 0, unlockLevel: 1, category: 'road', icon: '🛣️', desc: '基础地面街道（维护 ¥1.1/格，前期切勿盲目铺太长！）' },
  road_oneway:         { id: 'road_oneway',         name: '单行快车道', cost: 28, bridgeCost: 95, upkeep: 1, unlockPop: 150, unlockLevel: 2, category: 'road', icon: '➡️', desc: '双车道单向快行街（按拖拽方向设定行车流向，消除对向顶牛！点击已建单行道可一键反向）' },
  road_2:              { id: 'road_2',              name: '四车道主干道', cost: 85, bridgeCost: 220, upkeep: 2.8, unlockPop: 350, unlockLevel: 3, category: 'road', icon: '🛤️', desc: '大容量主干道，跨水架斜拉桥（维护较高，需人口支撑）' },
  road_elev:           { id: 'road_elev',           name: '高架快速路(+1层)', cost: 160, upkeep: 4.5, unlockPop: 450, unlockLevel: 5, category: 'road', icon: '🌉', desc: '二层立体高架桥！跨越地面拥堵路口、铁路与河流' },
  road_ramp:           { id: 'road_ramp',           name: '高架上下匝道', cost: 110, upkeep: 2.2, unlockPop: 450, unlockLevel: 5, category: 'road', icon: '↗️', desc: '🛣️ 点击或直线拖拽1~3格建匝道：建在地面主干道上将自动生成【桥下不断流·两侧辅道 + 中央上下匝道】！' },
  road_tunnel:         { id: 'road_tunnel',         name: '穿山公路隧道', cost: 190, upkeep: 4.8, unlockPop: 450, unlockLevel: 5, category: 'road', icon: '🏔️', desc: '贯穿陡峭山脉的地下公路隧道' },
  interchange_diamond: { id: 'interchange_diamond', name: '菱形互通立交', cost: 1600, upkeep: 18, unlockPop: 1900, unlockLevel: 5, category: 'road', icon: '🔀', desc: '一键建造 5×5 菱形互通立交（高架直跨 + 地面四车道下穿 + 4条无冲突上下匝道，支持旋转）' },
  interchange_rbt:     { id: 'interchange_rbt',     name: '立体环岛立交', cost: 1850, upkeep: 20, unlockPop: 1900, unlockLevel: 5, category: 'road', icon: '🔁', desc: '一键建造 5×5 立体环岛立交（地面3×3四车道环岛 + 高架直跨中心 + 双向衔接匝道，支持旋转）' },

  // Bus Transit, Underground Metro & High-Speed Rail
  bus_stop:      { id: 'bus_stop',      name: '智能公交站', cost: 160, upkeep: 12, unlockPop: 150, unlockLevel: 2, category: 'rail', icon: '🚏', desc: '建在地面街道/主干道上的智慧公交亭！建成2座及以上自动开通新能源公交专线分流私家车' },
  metro_line:    { id: 'metro_line',    name: '地下地铁隧道', cost: 110, upkeep: 3.2, unlockPop: 1100, unlockLevel: 7, category: 'rail', icon: '🟣', desc: '地底地铁轨道，无视地面建筑与山河阻隔' },
  metro_station: { id: 'metro_station', name: '地铁站出入口', cost: 1800, upkeep: 55, unlockPop: 1100, unlockLevel: 7, category: 'rail', icon: '🚇', desc: '连接地铁隧道，大幅缓解路面堵车并拉升商业地价' },
  rail_track:    { id: 'rail_track',    name: '高速铁路轨道', cost: 135, bridgeCost: 260, upkeep: 3.6, unlockPop: 2200, unlockLevel: 8, category: 'rail', icon: '🚄', desc: '双线无砟高铁轨道（跨河跨路自动架设特大桥）' },
  hsr_station:   { id: 'hsr_station',   name: '高铁中央车站', cost: 4800, upkeep: 130, unlockPop: 2200, unlockLevel: 8, category: 'rail', icon: '🚉', desc: '接通城际高铁干线，复兴号停靠带来大量客流与商业税收' },

  // 6 Authentic Cities: Skylines Zones (Zoning is free in CS1, road/pipe upkeep is the real cost!)
  zone_RL: { id: 'zone_RL', name: '低密住宅(别墅)', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏡', desc: '花园独栋与洋房，厌恶工业污染与高税率' },
  zone_RH: { id: 'zone_RH', name: '高密住宅(摩天寓)', cost: 0, unlockPop: 900, unlockLevel: 5, icon: '🏢', desc: '都市高层公寓，高地价与公共服务下可升至 48 层' },
  zone_CL: { id: 'zone_CL', name: '低密商业(街铺)', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏪', desc: '社区商店餐饮，依赖工业区进货，堵车会缺货倒闭！' },
  zone_CH: { id: 'zone_CH', name: '高密商业(CBD)', cost: 0, unlockPop: 900, unlockLevel: 6, icon: '🏙️', desc: '大型商业中心至64层摩天楼，需高学历员工与通畅货运' },
  zone_I:  { id: 'zone_I',  name: '工业制造区', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏭', desc: '提供岗位与商业货源，产生重污染（切勿紧贴住宅区！）' },
  zone_O:  { id: 'zone_O',  name: '现代办公区(零污)', cost: 0, unlockPop: 1100, unlockLevel: 6, icon: '💼', desc: '零污染白领科技写字楼，必须有【理工大学】培养人才否则荒废' },
  dezone:  { id: 'dezone',  name: '取消区划', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🧹', desc: '清除规划区划' },

  // Underground Water Pipes & Sewage
  water_pipe:  { id: 'water_pipe',  name: '地下输水管道', cost: 22, upkeep: 0.45, unlockPop: 0, unlockLevel: 1, icon: '🔵', desc: '地下供水排污管道（覆盖两侧4格，过长会增加财政维护费）' },
  water_pump:  { id: 'water_pump',  name: '河畔抽水站', cost: 1400, upkeep: 42, waterOut: 360, unlockPop: 0, unlockLevel: 1, icon: '🚰', desc: '必须建在【上游洁净河岸】！吸入下游污水会导致全城重病废弃' },
  sewage_out:  { id: 'sewage_out',  name: '河道排污口', cost: 1100, upkeep: 34, sewageCap: 360, unlockPop: 0, unlockLevel: 1, icon: '🤎', desc: '向河道排放污水，务必建在抽水站的【下游】！' },
  water_treat: { id: 'water_treat', name: '生态净水中心', cost: 3400, upkeep: 88, waterOut: 240, sewageCap: 520, unlockPop: 1100, unlockLevel: 7, icon: '♻️', desc: '高阶环保净水与污水处理厂，几乎不污染河道' },

  // Power, Clean Energy & Hydroelectric Dam
  hydro_dam:     { id: 'hydro_dam',     name: '水力发电大坝', cost: 680, upkeep: 26, unlockPop: 2200, unlockLevel: 9, icon: '🏗️', desc: '横跨峡谷拦截蓄水，按上下游水位落差发出巨额清洁电力' },
  power_pylon:   { id: 'power_pylon',   name: '高压输电铁塔', cost: 45, upkeep: 0.6, unlockPop: 0, unlockLevel: 1, icon: '🗼', desc: '远距离输送大坝/电厂电力（每座接力传导 6 格）' },
  power_wind:    { id: 'power_wind',    name: '高山风力发电', cost: 950, upkeep: 24, powerOut: 115, unlockPop: 0, unlockLevel: 1, icon: '🌬️', desc: '前期清洁电源，建在高山脊风力更强（最高 ~160 MW）' },
  power_plant:   { id: 'power_plant',   name: '燃气热电厂', cost: 3200, upkeep: 95, powerOut: 580, unlockPop: 350, unlockLevel: 3, icon: '⚡', desc: '+580 MW 主力电厂，维护费高，前期可通过预算滑块省钱' },
  solar_plant:   { id: 'solar_plant',   name: '塔式熔盐光热电站', cost: 2800, upkeep: 58, powerOut: 340, unlockPop: 600, unlockLevel: 4, icon: '☀️', desc: '+340 MW 零污染光热发电塔与定日镜阵（夜间储热持续供电）' },
  nuclear_plant: { id: 'nuclear_plant', name: '核裂变发电站', cost: 9200, upkeep: 195, powerOut: 1650, unlockPop: 2200, unlockLevel: 9, icon: '☢️', desc: '+1,650 MW 零碳超级电源！必须建在水源岸边（2格内有水）抽取冷却水' },

  // Sanitation & Waste-to-Energy
  waste_plant:   { id: 'waste_plant',   name: '环保垃圾焚烧厂', cost: 2100, upkeep: 52, powerOut: 180, trashCap: 2600, unlockPop: 350, unlockLevel: 3, icon: '♻️', desc: '焚烧处理城市垃圾并产出 +180 MW 电力！缺乏垃圾处理会导致垃圾围城致病荒废' },

  // Air/Sea Trade Hubs & Tourism Wonders
  seaport:          { id: 'seaport',          name: '深水集装箱海港', cost: 4200, upkeep: 92, unlockPop: 1100, unlockLevel: 8, icon: '🚢', desc: '必须建在海湾或深水河岸！远洋货轮靠泊出口工业品，工业与商业税收 +12%' },
  airport:          { id: 'airport',          name: '国际民航机场', cost: 6400, upkeep: 145, unlockPop: 1600, unlockLevel: 10, icon: '✈️', desc: '3.8单位全长发光跑道与宽体客机起降！吸引全球游客，商业与办公税收 +15%（后方需预留5格净空跑道，可按R旋转）' },
  zoo:              { id: 'zoo',              name: '野生动物园', cost: 3800, upkeep: 68, unlockPop: 700, unlockLevel: 5, icon: '🦁', desc: '3D 珍稀动物漫步园区（雄鹿/羊驼/赤狐/长颈鹿/大熊猫）！大幅拉升旅游收入、市民幸福度与科普教育' },
  botanical_garden: { id: 'botanical_garden', name: '皇家植物园', cost: 3400, upkeep: 58, unlockPop: 500, unlockLevel: 4, icon: '🌺', desc: '维多利亚水晶玻璃温室穹顶与樱花锦鲤园！强力净化周边空气污染与交通噪音，极高地价与旅游加成' },
  museum:           { id: 'museum',           name: '城市艺术博物馆', cost: 3200, upkeep: 62, unlockPop: 700, unlockLevel: 5, icon: '🏛️', desc: '现代石材玻璃文化殿堂与水景雕塑广场，强力提升全城教育素养、旅游客流与周边地价' },
  tv_tower:         { id: 'tv_tower',         name: '东方观光电视塔', cost: 7200, upkeep: 135, unlockPop: 1400, unlockLevel: 8, icon: '🗼', desc: '超高层发光观光球体地标塔！全城旅游客流暴涨、商办税收 +10%，夜间绽放城市霓虹灯光秀' },
  amusement_park:   { id: 'amusement_park',   name: '滨海摩天轮乐园', cost: 3600, upkeep: 72, unlockPop: 900, unlockLevel: 6, icon: '🎡', desc: '巨型动态摩天轮游乐园，大幅拉升周边豪宅与商业地价、旅游客流及市民幸福度' },
  stadium:          { id: 'stadium',          name: '奥林匹克体育中心', cost: 5200, upkeep: 105, unlockPop: 1100, unlockLevel: 7, icon: '🏟️', desc: '定期举办大型球赛与演唱会，比赛日发放巨额门票分红并引爆全城幸福感！' },

  // Civic, Emergency & Landmarks
  fire_station:   { id: 'fire_station',   name: '消防总署', cost: 1500, upkeep: 48, unlockPop: 150, unlockLevel: 2, icon: '🚒', desc: '派出消防车扑灭火灾；无消防覆盖的街区极易起火烧毁！' },
  police_station: { id: 'police_station', name: '警察总局', cost: 1550, upkeep: 48, unlockPop: 150, unlockLevel: 2, icon: '🚓', desc: '压制犯罪率！治安恶化会导致商业与住宅成片废弃' },
  hospital:       { id: 'hospital',       name: '大型综合医院', cost: 2600, upkeep: 78, unlockPop: 350, unlockLevel: 3, icon: '🏥', desc: '救治污染病患、提升健康度，高密城区必备' },
  school:         { id: 'school',         name: '市立理工大学', cost: 2400, upkeep: 72, unlockPop: 600, unlockLevel: 4, icon: '🏫', desc: '提升市民学历！没有大学学历支撑，CBD与办公区无法发展' },
  park:           { id: 'park',           name: '中央景观公园', cost: 680, upkeep: 18, unlockPop: 150, unlockLevel: 2, icon: '🌳', desc: '提升周边地价与市民幸福度' },
  landmark:       { id: 'landmark',       name: '星海88层金融塔', cost: 12000, upkeep: 190, unlockPop: 2200, unlockLevel: 10, icon: '🌟', desc: '88层城市超级奇观，全城商业繁荣度与周边地价跃升' },

  // Bulldozers
  bulldoze:       { id: 'bulldoze',       name: '地面推土机', cost: 10, unlockPop: 0, unlockLevel: 1, icon: '🚜', desc: '分层智能拆除：优先拆除二层高架桥（保留地面道路），再拆地面建筑或废墟' },
  bulldoze_under: { id: 'bulldoze_under', name: '地下拆除器', cost: 8, unlockPop: 0, unlockLevel: 1, icon: '🔧', desc: '拆除或抢修震裂的地下输水管与地铁隧道' }
};

export const BUILDING_NAMES = {
  RL: [
    ['梧桐花园独栋', '溪谷木屋别墅', '晴岚山居小屋', '翠微庭院洋房'],
    ['半山观景联排', '白鹭溪畔雅墅', '枫丹花园洋房', '云栖叠拼美宅'],
    ['翡翠半山庄园', '星河湾名门望族墅', '松风山顶大宅', '听涛海岸豪墅']
  ],
  RH: [
    ['青年人才公寓(8F)', '阳光茗苑住宅(10F)', '望江公寓楼(9F)', '紫荆花园大厦(11F)'],
    ['蔚蓝海岸高尚住宅(18F)', '锦绣华庭塔楼(20F)', '星辰都市公寓(19F)', '明珠江畔花园(22F)'],
    ['御景湾高层豪庭(28F)', '翡翠城邦住宅塔(30F)', '天琴湾全景公寓(32F)', '云顶华府(29F)'],
    ['星海湾壹号超高层(38F)', '天鹅堡云端公馆(42F)', '苍穹云玺住宅大厦(40F)', '澜湾国际公寓(41F)'],
    ['云端天际48F摩天豪宅', '星耀海湾全景摩天寓(46F)', '凌霄花园超级塔楼(50F)', '寰宇天际至尊公馆(48F)']
  ],
  CL: [
    ['街角精品咖啡馆', '24H便民生活超市', '晨光烘焙书屋', '鲜果便利驿站'],
    ['邻里美食商业街', '星光社区购物坊', '汽车餐厅与超市', '海风休闲广场'],
    ['时代邻里百货中心', '新天地精品商街', '悦活生活MALL', '海湾假日集市']
  ],
  CH: [
    ['汇金商业大厦(12F)', '远洋购物中心(10F)', '环球百货大楼(14F)', '世纪商贸广场(12F)'],
    ['银泰玻璃幕墙商厦(22F)', '盛世金融商业塔(25F)', '天枢购物与酒店中心(24F)', '万象都会广场(26F)'],
    ['环贸国际广场(36F)', '蔚蓝中心摩天商厦(38F)', '星海国际酒店塔(35F)', '金茂商务大厦(39F)'],
    ['大都会双子星商厦(48F)', '云顶环球贸易塔(52F)', '深蓝海岸金融大厦(50F)', '天际商业航母塔(49F)'],
    ['环太平洋国际金融中心(64F)', '苍穹之巅世界贸易塔(62F)', '星耀60F玻璃幕墙摩天楼', '凌霄国际CBD第一高楼(66F)']
  ],
  I: [
    ['红砖轻工车间', '标准机械加工坊', '城郊建材仓库', '木材装配厂'],
    ['现代冷链物流港', '精密模具制造厂', '自动化包装基地', '重型汽配厂'],
    ['联合智能装备总厂', '大型能源机械基地', '新材料合成中心', '港口集装箱集散枢纽'],
    ['未来新能源智造园', '高精密航空部件厂', '智能机器人超级工厂', '零碳循环工业基地']
  ],
  O: [
    ['创智软件园办公楼(10F)', '青年创业孵化大厦(12F)', '数字媒体工作室(9F)', '云谷科技楼(11F)'],
    ['硅谷研发中心大厦(20F)', '互联网金融写字楼(22F)', '量子通信实验大楼(19F)', '人工智能总部园(21F)'],
    ['全球半导体设计总部(32F)', '蔚蓝科技玻璃幕墙塔(35F)', '星际航太研发大厦(34F)', '超级计算云中心(36F)'],
    ['环宇跨国科技总部塔(46F)', '未来AI数字摩天大厦(50F)', '零碳智慧金融科技塔(48F)', '星海硅谷第一总部(52F)']
  ]
};

export const MILESTONES = [
  { pop: 0, title: '初创村落', reward: 0, desc: '基础道路、水管与低密度区划' },
  { pop: 150, title: '活力小镇', reward: 4500, desc: '解锁消防局、警察局、公园与银行贷款' },
  { pop: 350, title: '繁华县城', reward: 7500, desc: '解锁四车道大道、综合医院、垃圾焚烧厂与燃气热电厂' },
  { pop: 450, title: '立体交通城', reward: 9500, desc: '解锁二层高架快速路、立交匝道与穿山隧道' },
  { pop: 600, title: '科教新城', reward: 12000, desc: '解锁市立理工大学与塔式熔盐光热电站' },
  { pop: 900, title: '高密都市', reward: 16000, desc: '解锁高密住宅(RH)、高密商业(CH)与滨海摩天轮乐园' },
  { pop: 1100, title: '轨道新都', reward: 22000, desc: '解锁地铁网络、办公区(O)、深水海港、奥体中心与净水厂' },
  { pop: 1600, title: '国际航空港', reward: 29000, desc: '解锁国际民航机场，开启全球航空商旅网络' },
  { pop: 2200, title: '山河大都会', reward: 38000, desc: '解锁水力大坝、核裂变电站、高速铁路与88层金融地标' }
];

export const MAYOR_LEVELS = [
  {
    level: 1,
    title: '初创村落',
    popReq: 0,
    xpReq: 0,
    reward: 0,
    summary: '基础双车道、地下输水管、河畔抽水站、河道排污口、高山风电、高压输电塔、低密住商工区划及地形工具'
  },
  {
    level: 2,
    title: '平安小镇',
    popReq: 180,
    xpReq: 220,
    reward: 4500,
    summary: '解锁 🚒消防总署、🚓警察总局、🌳中央景观公园、➡️单行快车道、🚏智能公交站、🏦市政小额贷款'
  },
  {
    level: 3,
    title: '民生县城',
    popReq: 480,
    xpReq: 600,
    reward: 7500,
    summary: '解锁 🛤️四车道主干道、🏥大型综合医院、♻️环保垃圾焚烧厂、⚡燃气热电厂'
  },
  {
    level: 4,
    title: '科教新城',
    popReq: 1000,
    xpReq: 1200,
    reward: 11000,
    summary: '解锁 🏫市立理工大学、☀️塔式熔盐光热电站、⛲高山水源泉眼、🏦基建发展债'
  },
  {
    level: 5,
    title: '立体交通城',
    popReq: 1900,
    xpReq: 2100,
    reward: 15000,
    summary: '解锁 🌉二层高架快速路、↗️高架上下匝道、🔀菱形/环岛立交、🏔️穿山公路隧道、🏢高密住宅(RH)'
  },
  {
    level: 6,
    title: '摩天商务都',
    popReq: 3200,
    xpReq: 3300,
    reward: 20000,
    summary: '解锁 🏙️高密商业CBD(CH)、💼零污染现代办公区(O)、🎡滨海摩天轮乐园'
  },
  {
    level: 7,
    title: '轨道新都',
    popReq: 5000,
    xpReq: 4800,
    reward: 26000,
    summary: '解锁 🟣地下地铁隧道、🚇地铁站出入口、♻️生态净水中心、🏟️奥林匹克体育中心'
  },
  {
    level: 8,
    title: '远洋枢纽城',
    popReq: 7500,
    xpReq: 6800,
    reward: 34000,
    summary: '解锁 🚢深水集装箱海港、🚄高速铁路轨道、🚉高铁中央车站'
  },
  {
    level: 9,
    title: '山河能源巨匠',
    popReq: 10500,
    xpReq: 9200,
    reward: 45000,
    summary: '解锁 ☢️核裂变发电站(+1650MW)、🏗️峡谷水力发电大坝！'
  },
  {
    level: 10,
    title: '传奇超级都会',
    popReq: 14500,
    xpReq: 12000,
    reward: 65000,
    summary: '解锁 ✈️国际民航机场(宽体客机)、🌟星海88层金融地标奇观！'
  }
];

export const MAYOR_QUESTS = [
  {
    step: 1,
    id: 'q_road',
    title: '修筑首条街道',
    tool: 'road_1',
    cat: 'road',
    rewardMoney: 2000,
    rewardXP: 90,
    tip: '从南侧高速路延伸铺设双车道街道（注意：路有维护费，前期紧凑修10~15格即可！）'
  },
  {
    step: 2,
    id: 'q_power',
    title: '点亮清洁风电',
    tool: 'power_wind',
    cat: 'power',
    rewardMoney: 2500,
    rewardXP: 110,
    tip: '在街区附近（3格内）建造【高山风力发电】；若建在远处山坡，用【高压输电铁塔】接力连入街区'
  },
  {
    step: 3,
    id: 'q_water',
    title: '上游抽水·下游排污·铺地下水管',
    tool: 'water_pipe',
    cat: 'water',
    rewardMoney: 3500,
    rewardXP: 150,
    tip: '铁律：在河道【上游】岸边建抽水站，【下游】岸边建排污口（防喝污水生病！），再铺【地下输水管】连通街道'
  },
  {
    step: 4,
    id: 'q_zones',
    title: '科学分区引市民入驻',
    tool: 'zone_RL',
    cat: 'zones',
    rewardMoney: 4000,
    rewardXP: 200,
    tip: '在通水通电街道旁划【低密住宅】与【低密商业】，下风处划【工业区】！持续扩建街区冲刺 180 人晋升 Lv.2'
  },
  {
    step: 5,
    id: 'q_civic_lv2',
    title: '达180人晋升小镇·建消防与公园 (Lv.2)',
    tool: 'fire_station',
    cat: 'civic',
    rewardMoney: 4500,
    rewardXP: 300,
    tip: '扩建住商工街区满 180 人晋升 Lv.2【平安小镇】，建造【消防总署】防起火烧毁，并在住宅旁建【景观公园】拉升地价'
  },
  {
    step: 6,
    id: 'q_waste_lv3',
    title: '达480人晋升县城·垃圾焚烧发电 (Lv.3)',
    tool: 'waste_plant',
    cat: 'water',
    rewardMoney: 5500,
    rewardXP: 440,
    tip: '扩建城区满 480 人晋升 Lv.3【民生县城】！在工业侧建造【环保垃圾焚烧厂】解决垃圾危机并白赚 +180MW 电力'
  },
  {
    step: 7,
    id: 'q_edu_lv4',
    title: '达1000人科教新城·建大学与医院 (Lv.4)',
    tool: 'school',
    cat: 'civic',
    rewardMoney: 7000,
    rewardXP: 620,
    tip: '发展街区满 1,000 人晋升 Lv.4！建造【综合医院】与【市立理工大学】，培养高学历人才支撑摩天楼升级'
  },
  {
    step: 8,
    id: 'q_viaduct_lv5',
    title: '立体高架与摩天高密区 (Lv.5–6)',
    tool: 'road_elev',
    cat: 'road',
    rewardMoney: 11000,
    rewardXP: 980,
    tip: '人口达 1,900~3,200 人解锁高架与CBD！在堵点架【二层高架+匝道】或改建【环岛】，并规划【高密住宅/商业CBD/办公区】'
  },
  {
    step: 9,
    id: 'q_transit_lv7',
    title: '轨道新都与远洋港口 (Lv.7–8)',
    tool: 'metro_station',
    cat: 'rail',
    rewardMoney: 16000,
    rewardXP: 1380,
    tip: '高密人口突破 5,000~7,500 人后，铺设【地下地铁】分流一半私家车，并在海湾建【深水海港】分流出口重卡、接通【高铁】！'
  },
  {
    step: 10,
    id: 'q_endgame_lv9',
    title: '万人都邑：核能·峡谷大坝·国际空港 (Lv.9–10)',
    tool: 'nuclear_plant',
    cat: 'power',
    rewardMoney: 30000,
    rewardXP: 1400,
    tip: '迈入万人大都会！Lv.9(10,500人)在深V急流峡谷建【水力发电大坝】或临水【核电站】；Lv.10(14,500人)建【国际机场】与88层奇观！'
  }
];

export const LOAN_OFFERS = [
  { id: 'loan_s', name: '应急周转小额贷', unlockLevel: 2, principal: 15000, totalRepay: 17400, periodPay: 290, desc: '本金 ¥15,000（利率16%，每期还 ¥290）' },
  { id: 'loan_m', name: '城市基建发展债', unlockLevel: 4, principal: 45000, totalRepay: 54000, periodPay: 750, desc: '本金 ¥45,000（利率20%，每期还 ¥750）' },
  { id: 'loan_l', name: '超级工程建设国债', unlockLevel: 7, principal: 100000, totalRepay: 125000, periodPay: 1560, desc: '本金 ¥100,000（利率25%，每期还 ¥1,560）' }
];

export const POLICY_CATALOG = [
  { id: 'greenEnergy',   icon: '🌳', name: '环保减排法',   desc: '工业污染 -35%，但工业税收 -6%' },
  { id: 'freeHigherEd',  icon: '🎓', name: '免费高等教育', desc: '全市高学历率 +18%，办公/高科税收 +15%，维护 +¥220 + 人口×0.08' },
  { id: 'freeTransit',   icon: '🚌', name: '免费公共交通', desc: '公交/地铁/高铁客流 +35%，路面车流 -22%，免除公共交通票价收入' },
  { id: 'energySubsidy', icon: '⚡', name: '工业节能补贴', desc: '全市用电用水需求 -15%，维护 +¥180 + 建筑数×1.2' },
  { id: 'bizTaxBreak',   icon: '📈', name: '招商引资减税', desc: '商/办/工需求 +28%，但商业与办公税收 -10%' }
];

export const CIVIC_EVENTS = [
  {
    id: 'tech_hq_bid',
    icon: '💻',
    title: '科技巨头申请设立区域总部',
    desc: '一家跨国人工智能集团希望在山河新城设立华东研发总部，正与市政府磋商落户方案与人才配套。',
    choices: [
      {
        label: '批准专项优惠落户（-¥1,800）',
        effectDesc: '办公与商业需求 +25%（持续3个月），市长经验 +80 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money -= 1800;
          sim.applyTempDemandBoost(0.08, 0.25, 0.25, 3);
          sim.addXP(80, '引进科技总部');
        }
      },
      {
        label: '坚持标准税率并要求公益配套（+¥1,200）',
        effectDesc: '国库增收 +¥1,200，市民幸福度 +4（持续3个月），办公需求 +10%',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 1200;
          sim.applyTempDemandBoost(0, 0.05, 0.10, 3);
          sim.applyTempHappinessBoost(4, 3);
          sim.addXP(50, '规范招商签约');
        }
      },
      {
        label: '扶持本土高校与科创小微（开启免费高教）',
        effectDesc: '启用【🎓 免费高等教育】政策，工业/科技需求 +18%（持续3个月）',
        apply(sim) {
          sim.policies.freeHigherEd = true;
          sim.applyTempDemandBoost(0.05, 0.08, 0.18, 3);
          sim.addXP(65, '本土科创扶持');
        }
      }
    ]
  },
  {
    id: 'riverfront_festival',
    icon: '🎵',
    title: '江滨国际音乐节筹办请示',
    desc: '文旅协会申请沿滨江风光带举办为期一周的国际音乐节，预计吸引数万游客打卡，如何统筹预算与市民体验？',
    choices: [
      {
        label: '市政补贴免费接驳盛大举办（-¥900）',
        effectDesc: '市民幸福度 +8（持续3个月），商业需求 +22%，市长经验 +75 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money -= 900;
          sim.applyTempDemandBoost(0.06, 0.22, 0, 3);
          sim.applyTempHappinessBoost(8, 3);
          sim.addXP(75, '成功举办江滨音乐节');
        }
      },
      {
        label: '引入商业冠名与门票分成（+¥2,400）',
        effectDesc: '财政门票分成 +¥2,400，幸福度 +3（持续2个月），商业需求 +12%',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 2400;
          sim.applyTempDemandBoost(0, 0.12, 0, 2);
          sim.applyTempHappinessBoost(3, 2);
          sim.addXP(45, '商业音乐节收益');
        }
      },
      {
        label: '改办低噪音社区滨水艺术展（¥0）',
        effectDesc: '零噪音扰民，零财政负担，幸福度 +4（持续2个月），经验 +50 XP',
        apply(sim) {
          sim.applyTempHappinessBoost(4, 2);
          sim.addXP(50, '静谧文化惠民');
        }
      }
    ]
  },
  {
    id: 'drought_hydro_dispatch',
    icon: '💧',
    title: '上游枯水期水电联合调度',
    desc: '水文气象台预警近期上游来水偏少，电网与水务调度中心提交了三套应急保供预案，请市长拍板。',
    choices: [
      {
        label: '实施节水节能补贴保供（-¥1,500）',
        effectDesc: '开启【⚡ 工业节能补贴】（水电需求 -15%），经验 +90 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money -= 1500;
          sim.policies.energySubsidy = true;
          sim.addXP(90, '枯水期节水调度');
        }
      },
      {
        label: '向周边省网紧急购电保民生（-¥2,200）',
        effectDesc: '市民幸福度 +5（持续3个月），住宅需求 +15%，确保民生零停电',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money -= 2200;
          sim.applyTempDemandBoost(0.15, 0.05, 0, 3);
          sim.applyTempHappinessBoost(5, 3);
          sim.addXP(65, '跨区购电保民生');
        }
      },
      {
        label: '倡议工业企业错峰节能生产（+¥600）',
        effectDesc: '财政节余 +¥600，工业需求短期 -10%（持续2个月），保障电网平稳',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 600;
          sim.applyTempDemandBoost(0, 0, -0.10, 2);
          sim.addXP(40, '工业错峰调度');
        }
      }
    ]
  },
  {
    id: 'ev_bus_subsidy',
    icon: '🚌',
    title: '绿色新能源公交专项补贴',
    desc: '省交通厅下发“绿色出行示范城”纯电公交采购补贴指标，市公交集团请求确定补贴使用方式。',
    choices: [
      {
        label: '申领全额补贴并推行免费公交（+¥2,800）',
        effectDesc: '获得补贴 +¥2,800，开启【🚌 免费公共交通】，幸福度 +6（持续3个月）',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 2800;
          sim.policies.freeTransit = true;
          sim.applyTempHappinessBoost(6, 3);
          sim.addXP(85, '绿色公交示范城');
        }
      },
      {
        label: '仅用于更新纯电车队保留票价（+¥1,600）',
        effectDesc: '国库入账 +¥1,600，住宅需求 +12%（持续3个月），经验 +60 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 1600;
          sim.applyTempDemandBoost(0.12, 0.08, 0, 3);
          sim.addXP(60, '纯电公交升级');
        }
      }
    ]
  },
  {
    id: 'old_street_walkable',
    icon: '🚶',
    title: '老街区步行化微更新试点',
    desc: '城市规划院提议将老城区核心街坊改造为低噪慢行街区并植入林荫口袋公园，重塑宜居烟火气。',
    choices: [
      {
        label: '市政主导精品微更新（-¥1,400）',
        effectDesc: '市民幸福度 +7（持续4个月），住宅/商业需求 +16%，经验 +100 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money -= 1400;
          sim.applyTempDemandBoost(0.16, 0.16, 0, 4);
          sim.applyTempHappinessBoost(7, 4);
          sim.addXP(100, '老街区步行微更新');
        }
      },
      {
        label: '引入社会资本商业联合改造（+¥900）',
        effectDesc: '财政入账 +¥900，商业需求 +18%（持续3个月），幸福度 +2',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 900;
          sim.applyTempDemandBoost(0.04, 0.18, 0, 3);
          sim.applyTempHappinessBoost(2, 3);
          sim.addXP(55, '政企联合街区更新');
        }
      }
    ]
  },
  {
    id: 'port_free_trade',
    icon: '🚢',
    title: '国际航运与跨境免税试点',
    desc: '商务部拟将我市纳入区域跨境贸易与航运免税试点名单，大幅提升本地商业与制造外贸辐射力。',
    choices: [
      {
        label: '高标准申报自贸免税枢纽（+¥3,200 专项）',
        effectDesc: '财政专项支持 +¥3,200，商业与工业需求 +28%（持续4个月），经验 +120 XP',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 3200;
          sim.applyTempDemandBoost(0.08, 0.28, 0.28, 4);
          sim.addXP(120, '国际自贸免税枢纽');
        }
      },
      {
        label: '稳妥推进保税物流与环保制造（+¥1,400）',
        effectDesc: '国库入账 +¥1,400，开启【🌳 环保减排法】，商/工需求 +15%（持续3个月）',
        apply(sim) {
          if (sim.difficulty !== 'sandbox') sim.money += 1400;
          sim.policies.greenEnergy = true;
          sim.applyTempDemandBoost(0, 0.15, 0.15, 3);
          sim.addXP(80, '绿色保税贸易试点');
        }
      }
    ]
  }
];

function createDefaultPolicies() {
  return {
    greenEnergy: false,
    freeHigherEd: false,
    freeTransit: false,
    energySubsidy: false,
    bizTaxBreak: false,
    greenCity: false,
    techBoost: false
  };
}

function createEmptyTransitStats() {
  return {
    bus:   { stops: 0, riders: 0, revenue: 0, upkeep: 0, carsSaved: 0 },
    metro: { stations: 0, riders: 0, revenue: 0, upkeep: 0, carsSaved: 0 },
    hsr:   { stations: 0, riders: 0, revenue: 0, upkeep: 0, carsSaved: 0 },
    totalRiders: 0,
    totalRevenue: 0,
    totalUpkeep: 0,
    totalCarsSaved: 0
  };
}

export class CitySimulation {
  constructor(sfx) {
    this.sfx = sfx;
    this.seed = 2026;
    this.cityName = '山河天际市';

    // Hardcore Skylines Economy & Pacing!
    this.difficulty = 'hardcore'; // 'hardcore' | 'normal' | 'sandbox'
    this.unlockAll = false;       // false = Mayor Level progression!
    this.money = 32000;
    this.taxRate = 9;
    this.budgets = { power: 100, water: 100, service: 100 }; // 50..150%
    this.activeLoans = []; // { id, name, remaining, periodPay }

    // 10-Level Mayor Progression (Dual Pop + XP) & 10-Step Guide Quests
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this._suppressPromotions = false;
    this.gridlockTimeouts = 0;
    this._lastDamBreachToastAt = 0;
    this.onLevelUp = null;
    this.onQuestComplete = null;

    // 15-Step Undo Stack
    this.undoStack = [];
    this._lastSculptUndoAt = 0;

    // 5 Strategic City Policies (+ legacy compatibility flags)
    this.policies = createDefaultPolicies();

    // Deep Strategic Telemetry, History & Dynamic Civic Decisions
    this.educatedRate = 0;
    this.transitStats = createEmptyTransitStats();
    this.lastTransitRevenue = 0;
    this.history = [];
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this._eventHistoryIdx = 0;
    this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = 0;
    this.tempHappinessMonths = 0;

    // Calm, realistic calendar & day-night flow!
    this.year = 2026;
    this.month = 3;
    this.day = 1;
    this.dayProgress = 0.36;
    this.timeMode = 'cycle';
    this.speed = 1;

    this.population = 0;
    this.maxPopReached = 0;
    this.jobsTotal = 0;
    this.unemploymentPct = 0;
    this.happiness = 75;
    this.demand = { R: 0.75, C: 0.45, I: 0.60 };

    this.powerSupply = 0;
    this.powerDemand = 0;
    this.hydroPowerMW = 0;

    this.waterSupply = 0;
    this.waterDemand = 0;
    this.sewageSupply = 0;
    this.sewageDemand = 0;
    this.waterPollutedPct = 0;
    this.trashSupply = 0;
    this.trashDemand = 0;
    this.sickCitizens = 0;
    this.abandonedCount = 0;

    this.hasSeaport = false;
    this.hasAirport = false;
    this.hasAmusementPark = false;
    this.hasStadium = false;
    this.hasZoo = false;
    this.hasBotanicalGarden = false;
    this.hasMuseum = false;
    this.hasTvTower = false;
    this.tourists = 0;
    this.tourismIncome = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;

    // Dynamic 3D Weather System (clear / cloudy / rain / storm / snow / fog)
    this.weather = {
      state: 'clear',
      mode: 'auto', // 'auto' or forced weather state
      intensity: 0,
      timer: 42,
      tempC: 22,
      lightningFlash: 0
    };

    // Custom Color-Coded Bus Routes (Cities: Skylines Transit Line Manager!)
    this.busLines = [];
    this._nextBusLineId = 1;

    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };

    this.netIncome = 0;
    this.lastTaxIncome = 0;
    this.lastUpkeep = 0;
    this.lastLoanPay = 0;
    this.milestoneIdx = 0;

    const world = generateWorld(this.seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;

    this.waterPhysics = null;
    this.terrainDirty = true;
    this.infraDirty = true;
    this.forestDirty = true;
    this.buildingDirty = true;
    this.simAccum = 0;
    this.econAccum = 0;
    this.dateAccum = 0;
    this.waterAccum = 0;
    this.recentUpgrades = [];
    this.onToast = null;
  }

  get meshDirty() {
    return Boolean(this.terrainDirty || this.infraDirty || this.forestDirty || this.buildingDirty);
  }

  set meshDirty(v) {
    const flag = Boolean(v);
    this.terrainDirty = flag;
    this.infraDirty = flag;
    this.forestDirty = flag;
    this.buildingDirty = flag;
  }

  emitToast(msg) {
    if (this.onToast) this.onToast(msg);
  }

  getFormattedDate() {
    return `${this.year}年${this.month}月${this.day}日`;
  }

  getMayorLevelInfo() {
    const lv = Math.max(1, Math.min(MAYOR_LEVELS.length, this.mayorLevel || 1));
    const current = MAYOR_LEVELS[lv - 1];
    const next = lv < MAYOR_LEVELS.length ? MAYOR_LEVELS[lv] : null;
    const xp = this.mayorXP || 0;
    const pop = this.population || 0;
    const nextXp = next ? next.xpReq : current.xpReq;
    const nextPop = next ? next.popReq : current.popReq;
    let progressPct = 100;
    if (next) {
      const xpRatio = next.xpReq > 0 ? Math.min(1, xp / next.xpReq) : 1;
      const popRatio = next.popReq > 0 ? Math.min(1, pop / next.popReq) : 1;
      progressPct = Math.max(0, Math.min(100, Math.round(Math.min(xpRatio, popRatio) * 100)));
    }
    return {
      level: lv,
      title: current.title,
      xp,
      nextXp,
      pop,
      nextPop,
      progressPct,
      current,
      next,
      pct: progressPct
    };
  }

  checkLevelPromotion(suppressCallback = false) {
    let lastUnlockedTier = null;
    while (this.mayorLevel < MAYOR_LEVELS.length) {
      const nextTier = MAYOR_LEVELS[this.mayorLevel];
      if (!nextTier) break;
      if ((this.population || 0) < (nextTier.popReq || 0) || (this.mayorXP || 0) < (nextTier.xpReq || 0)) {
        break;
      }
      this.mayorLevel = nextTier.level;
      if (this.difficulty !== 'sandbox' && nextTier.reward > 0) {
        this.money += nextTier.reward;
      }
      lastUnlockedTier = nextTier;
      this.latestChirp = {
        user: '@市政厅晋升喜报',
        text: `🎖️ 人口破 ${nextTier.popReq.toLocaleString()} 人，晋升 Lv.${nextTier.level}【${nextTier.title}】！奖励 +¥${nextTier.reward.toLocaleString()}，${nextTier.summary}`,
        mood: 'good'
      };
    }
    if (lastUnlockedTier) {
      if (!this._suppressPromotions && this.sfx && this.sfx.milestone) {
        this.sfx.milestone();
      }
      if (!suppressCallback && !this._suppressPromotions && this.onLevelUp) {
        this.onLevelUp(lastUnlockedTier);
      }
    }
    return lastUnlockedTier;
  }

  addXP(amount, reason = '', suppressCallback = false) {
    if (!amount || amount <= 0) return null;
    this.mayorXP = Math.max(0, Math.round((this.mayorXP || 0) + amount));
    return this.checkLevelPromotion(suppressCallback);
  }

  onDamBreach(x, z) {
    this.latestChirp = {
      user: '@防汛抗旱总指挥部',
      text: `💥 特大事故！(${x},${z}) 水力大坝超载溃坝决口，洪峰正冲向下游！`,
      mood: 'bad'
    };
    if (this.sfx && typeof this.sfx.explosion === 'function') {
      this.sfx.explosion();
    }
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - (this._lastDamBreachToastAt || 0) > 2500) {
      this._lastDamBreachToastAt = now;
      this.emitToast(`💥 特大事故！(${x},${z}) 水力大坝超载溃坝决口，洪峰正冲向下游！`);
    }
    this.meshDirty = true;
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
  }

  repairDamSpan(x, z) {
    const startTile = this.getTile(x, z);
    if (!startTile || !startTile.dam) return { ok: false };
    const cost = this.difficulty === 'sandbox' ? 0 : 450;
    if (this.difficulty !== 'sandbox' && this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`💰 资金不足（加固抢修大坝需 ¥${cost}）`);
      return { ok: false };
    }
    if (this.difficulty !== 'sandbox') this.money -= cost;

    const visited = new Set([idx(x, z)]);
    const queue = [{ x, z }];
    let repaired = 0;
    while (queue.length > 0) {
      const cur = queue.shift();
      const ct = this.getTile(cur.x, cur.z);
      if (ct && ct.dam) {
        ct.damHealth = 100;
        ct.damStress = 0;
        repaired++;
      }
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cur.x + dx, nz = cur.z + dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (visited.has(ni)) continue;
          const nt = this.grid[ni];
          if (nt && nt.dam) {
            visited.add(ni);
            queue.push({ x: nx, z: nz });
          }
        }
      }
    }

    if (this.sfx && this.sfx.buildCivic) this.sfx.buildCivic();
    this.infraDirty = true;
    this.emitToast(`🔧 大坝全段已注浆加固抢修完毕（恢复 100% 耐久，花费 ¥${cost}）`);
    return { ok: true, repaired, cost };
  }

  getRoadIntersectionDegree(x, z) {
    const t = this.getTile(x, z);
    if (!t || !(t.roadGround === 1 || t.roadGround === 2) || t.dam) return 0;
    let deg = 0;
    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dz] of dirs4) {
      const nt = this.getTile(x + dx, z + dz);
      if (nt && (nt.roadGround > 0 || nt.ramp)) deg++;
    }
    return deg;
  }

  setJunctionMode(x, z, mode) {
    const t = this.getTile(x, z);
    if (!t || !(t.roadGround === 1 || t.roadGround === 2)) return { ok: false };
    if (!['signal', 'yield', 'roundabout'].includes(mode)) return { ok: false };
    if ((t.junctionMode || 'signal') === mode) return { ok: true, cost: 0 };

    let cost = 0;
    if (mode === 'roundabout' && !t.roundaboutPaid) {
      cost = this.difficulty === 'sandbox' ? 0 : 120;
      if (this.difficulty !== 'sandbox' && this.money < cost) {
        if (this.sfx) this.sfx.error();
        this.emitToast('💰 资金不足：改建景观环岛需 ¥120');
        return { ok: false };
      }
    }

    this.pushUndoSnapshot('路口管制模式');

    if (mode === 'roundabout' && !t.roundaboutPaid) {
      if (this.difficulty !== 'sandbox') this.money -= cost;
      t.roundaboutPaid = true;
    }

    t.junctionMode = mode;
    this.infraDirty = true;
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    if (this.sfx) {
      if (mode === 'roundabout' && this.sfx.road) this.sfx.road();
      else if (this.sfx.tap) this.sfx.tap();
    }
    return { ok: true, cost };
  }

  // ==================== 15-Step Lightweight Undo Stack ====================
  canUndo() {
    return this.undoStack.length > 0;
  }

  get undoCount() {
    return this.undoStack.length;
  }

  get lastUndoLabel() {
    return this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1].label : '';
  }

  pushUndoSnapshot(label = '城市操作') {
    const N = this.grid.length;
    const tiles = new Array(N);
    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const b = t.building;
      tiles[i] = {
        trees: t.trees,
        waterSpring: t.waterSpring,
        roadGround: t.roadGround,
        roadBridge: t.roadBridge,
        roadDir: typeof t.roadDir === 'number' ? t.roadDir : -1,
        banTrucks: Boolean(t.banTrucks),
        busStop: Boolean(t.busStop),
        junctionMode: t.junctionMode || null,
        roundaboutPaid: Boolean(t.roundaboutPaid),
        roadElevated: t.roadElevated,
        ramp: t.ramp,
        rail: t.rail,
        metro: t.metro,
        pipe: t.pipe,
        pipeBroken: t.pipeBroken,
        pylon: t.pylon,
        dam: t.dam,
        damCrest: t.damCrest,
        damOutputMW: t.damOutputMW,
        damHealth: t.damHealth,
        damStress: t.damStress,
        zone: t.zone,
        building: b ? { ...b } : null
      };
    }
    if (this.undoStack.length >= 15) {
      this.undoStack.shift();
    }
    this.undoStack.push({
      label,
      money: this.money,
      corners: new Float32Array(this.corners),
      waterDepth: new Float32Array(this.waterDepth),
      waterPoll: new Float32Array(this.waterPoll),
      tiles
    });
  }

  undoLastAction() {
    if (this.undoStack.length === 0) {
      return { ok: false };
    }
    const snap = this.undoStack.pop();
    const prevMoney = this.money;
    this.money = snap.money;
    this.corners.set(snap.corners);
    this.waterDepth.set(snap.waterDepth);
    this.waterPoll.set(snap.waterPoll);

    const N = this.grid.length;
    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const s = snap.tiles[i];
      t.trees = s.trees;
      t.waterSpring = s.waterSpring;
      t.roadGround = s.roadGround;
      t.roadBridge = s.roadBridge;
      t.roadDir = s.roadDir;
      t.banTrucks = s.banTrucks;
      t.busStop = s.busStop;
      t.junctionMode = s.junctionMode;
      t.roundaboutPaid = s.roundaboutPaid;
      t.roadElevated = s.roadElevated;
      t.ramp = s.ramp;
      t.rail = s.rail;
      t.metro = s.metro;
      t.pipe = s.pipe;
      t.pipeBroken = s.pipeBroken;
      t.pylon = s.pylon;
      t.dam = s.dam;
      t.damCrest = s.damCrest;
      t.damOutputMW = s.damOutputMW;
      t.damHealth = s.damHealth;
      t.damStress = s.damStress;
      t.zone = s.zone;
      t.building = s.building ? { ...s.building } : null;
    }

    if (this.waterPhysics && typeof this.waterPhysics.refreshCellElevations === 'function') {
      this.waterPhysics.refreshCellElevations();
    }
    this.recomputeNetworksAndFields();
    this.stepEconomy(false);
    this.money = snap.money;
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    if (this.traffic && typeof this.traffic.revalidateVehicles === 'function') {
      this.traffic.revalidateVehicles();
    } else if (this.traffic && typeof this.traffic.revalidateActiveTransport === 'function') {
      this.traffic.revalidateActiveTransport();
    }
    this.meshDirty = true;
    if (this.sfx && this.sfx.tap) this.sfx.tap();

    const moneyDelta = snap.money - prevMoney;
    return { ok: true, label: snap.label, moneyDelta };
  }

  // ==================== One-Way Streets & Heavy-Truck Ban Actions ====================
  flipOneWayDirection(x, z) {
    const t = this.getTile(x, z);
    if (!t || t.roadGround <= 0 || typeof t.roadDir !== 'number' || t.roadDir < 0) {
      return { ok: false, count: 0 };
    }
    const oldDir = t.roadDir;
    const newDir = oldDir ^ 1; // 0(N)<->1(S), 2(W)<->3(E)
    const stepX = oldDir >= 2 ? 1 : 0;
    const stepZ = oldDir < 2 ? 1 : 0;

    const segment = [t];
    for (const sign of [-1, 1]) {
      let cx = x + stepX * sign;
      let cz = z + stepZ * sign;
      while (inBounds(cx, cz)) {
        const nt = this.grid[idx(cx, cz)];
        if (nt && nt.roadGround > 0 && !nt.dam && nt.roadDir === oldDir) {
          segment.push(nt);
          cx += stepX * sign;
          cz += stepZ * sign;
        } else {
          break;
        }
      }
    }

    this.pushUndoSnapshot('反转单行方向');
    for (let i = 0; i < segment.length; i++) {
      segment[i].roadDir = newDir;
    }

    this.infraDirty = true;
    this.recomputeNetworksAndFields();
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    if (this.sfx && this.sfx.tap) this.sfx.tap();
    return { ok: true, dir: newDir, oldDir, count: segment.length };
  }

  toggleTruckBan(x, z) {
    const t = this.getTile(x, z);
    if (!t || t.roadGround < 1 || t.dam) {
      return { ok: false, banTrucks: false, count: 0 };
    }
    const nextBan = !t.banTrucks;
    const isPlainStreet = (tile) => Boolean(tile && tile.roadGround >= 1 && !tile.dam);
    const getDeg = (gx, gz) => {
      let d = 0;
      if (isPlainStreet(this.getTile(gx + 1, gz))) d++;
      if (isPlainStreet(this.getTile(gx - 1, gz))) d++;
      if (isPlainStreet(this.getTile(gx, gz + 1))) d++;
      if (isPlainStreet(this.getTile(gx, gz - 1))) d++;
      return d;
    };

    const segment = [t];
    const startDeg = getDeg(x, z);
    if (startDeg > 0 && startDeg <= 2) {
      const hasEW = isPlainStreet(this.getTile(x - 1, z)) || isPlainStreet(this.getTile(x + 1, z));
      const hasNS = isPlainStreet(this.getTile(x, z - 1)) || isPlainStreet(this.getTile(x, z + 1));
      if (hasEW !== hasNS) {
        const stepX = hasEW ? 1 : 0;
        const stepZ = hasNS ? 1 : 0;
        for (const sign of [-1, 1]) {
          let cx = x + stepX * sign;
          let cz = z + stepZ * sign;
          while (inBounds(cx, cz)) {
            const nt = this.grid[idx(cx, cz)];
            if (!isPlainStreet(nt)) break;
            const ndeg = getDeg(cx, cz);
            if (ndeg >= 3) break;
            const nEW = isPlainStreet(this.getTile(cx - 1, cz)) || isPlainStreet(this.getTile(cx + 1, cz));
            const nNS = isPlainStreet(this.getTile(cx, cz - 1)) || isPlainStreet(this.getTile(cx, cz + 1));
            if (nEW && nNS) break; // Stop at 90-degree corner
            segment.push(nt);
            cx += stepX * sign;
            cz += stepZ * sign;
          }
        }
      }
    }

    this.pushUndoSnapshot(nextBan ? '街道禁行重卡' : '解除重卡禁行');
    for (let i = 0; i < segment.length; i++) {
      segment[i].banTrucks = nextBan;
    }

    this.recomputeNetworksAndFields();
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    this.infraDirty = true;
    if (this.sfx && this.sfx.tap) this.sfx.tap();
    return { ok: true, banTrucks: nextBan, count: segment.length };
  }

  // ==================== One-Tap 5x5 3D Interchange Presets ====================
  _getInterchangeSpec(type, cx, cz, rot = 0) {
    const r = rot & 1;
    const mapUV = (u, v) => (r === 0 ? { x: cx + u, z: cz + v } : { x: cx + v, z: cz + u });
    const specs = [];

    if (type === 'interchange_diamond') {
      // Elevated highway viaduct straight across v = 0, u = -2..+2
      // Orthogonal ground 4-lane avenue u = 0, v = -2..+2
      // 4 conflict-free bridgehead ramps at (u = +-1, v = +-1)
      // 2 parallel flanking ground slip-connectors at v = +-2, u = +-1
      for (let u = -2; u <= 2; u++) {
        const p = mapUV(u, 0);
        specs.push({
          x: p.x,
          z: p.z,
          role: u === 0 ? 'overpass_crossing' : 'viaduct',
          roadGround: u === 0 ? 2 : 0,
          roadElevated: 1,
          ramp: false,
          junctionMode: 'signal'
        });
      }
      for (const v of [-2, -1, 1, 2]) {
        const p = mapUV(0, v);
        specs.push({
          x: p.x,
          z: p.z,
          role: 'avenue',
          roadGround: 2,
          roadElevated: 0,
          ramp: false,
          junctionMode: Math.abs(v) === 2 ? 'yield' : 'signal'
        });
      }
      for (const u of [-1, 1]) {
        for (const v of [-1, 1]) {
          const pr = mapUV(u, v);
          specs.push({
            x: pr.x,
            z: pr.z,
            role: 'ramp',
            roadGround: 1,
            roadElevated: 1,
            ramp: true,
            junctionMode: 'signal'
          });
          const ps = mapUV(u, v * 2);
          specs.push({
            x: ps.x,
            z: ps.z,
            role: 'slip',
            roadGround: 1,
            roadElevated: 0,
            ramp: false,
            junctionMode: 'signal'
          });
        }
      }
      return specs;
    }

    if (type === 'interchange_rbt') {
      // 3x3 ground 4-lane roundabout ring: max(|u|, |v|) === 1
      // Center (0, 0): open island underneath elevated overpass
      // Elevated overpass straight across v = 0, u = -2..+2
      // Cross arterial spokes at (0, -2) and (0, +2)
      // 2 symmetric conflict-free bridgehead ramps at (-2, -1) and (+2, +1) with slip roads at (-2,-2)/(-1,-2) & (+2,+2)/(+1,+2)
      for (let u = -2; u <= 2; u++) {
        const p = mapUV(u, 0);
        const onRing = Math.abs(u) === 1;
        specs.push({
          x: p.x,
          z: p.z,
          role: onRing ? 'roundabout_crossing' : 'viaduct',
          roadGround: onRing ? 2 : 0,
          roadElevated: 1,
          ramp: false,
          junctionMode: onRing ? 'roundabout' : 'signal'
        });
      }
      for (const v of [-1, 1]) {
        for (let u = -1; u <= 1; u++) {
          const p = mapUV(u, v);
          specs.push({
            x: p.x,
            z: p.z,
            role: 'roundabout',
            roadGround: 2,
            roadElevated: 0,
            ramp: false,
            junctionMode: 'roundabout'
          });
        }
      }
      for (const v of [-2, 2]) {
        const p = mapUV(0, v);
        specs.push({
          x: p.x,
          z: p.z,
          role: 'avenue',
          roadGround: 2,
          roadElevated: 0,
          ramp: false,
          junctionMode: 'yield'
        });
      }
      // West-North ramp & slip connector
      const r1 = mapUV(-2, -1);
      specs.push({ x: r1.x, z: r1.z, role: 'ramp', roadGround: 1, roadElevated: 1, ramp: true, junctionMode: 'signal' });
      const s1a = mapUV(-2, -2);
      specs.push({ x: s1a.x, z: s1a.z, role: 'slip', roadGround: 1, roadElevated: 0, ramp: false, junctionMode: 'signal' });
      const s1b = mapUV(-1, -2);
      specs.push({ x: s1b.x, z: s1b.z, role: 'slip', roadGround: 1, roadElevated: 0, ramp: false, junctionMode: 'signal' });
      // East-South ramp & slip connector
      const r2 = mapUV(2, 1);
      specs.push({ x: r2.x, z: r2.z, role: 'ramp', roadGround: 1, roadElevated: 1, ramp: true, junctionMode: 'signal' });
      const s2a = mapUV(2, 2);
      specs.push({ x: s2a.x, z: s2a.z, role: 'slip', roadGround: 1, roadElevated: 0, ramp: false, junctionMode: 'signal' });
      const s2b = mapUV(1, 2);
      specs.push({ x: s2b.x, z: s2b.z, role: 'slip', roadGround: 1, roadElevated: 0, ramp: false, junctionMode: 'signal' });
      return specs;
    }

    return null;
  }

  previewInterchange(type, cx, cz, rot = 0) {
    const item = CATALOG[type];
    const cost = this.difficulty === 'sandbox' ? 0 : (item?.cost || 1600);
    const specs = this._getInterchangeSpec(type, cx, cz, rot);
    if (!specs) {
      return { valid: false, reason: '未知立交预设类型', cost, tiles: [] };
    }
    const tiles = specs.map((s) => ({ x: s.x, z: s.z, role: s.role }));

    if (!this.isToolUnlocked(type)) {
      return {
        valid: false,
        reason: `需升至市长等级 Lv.${item?.unlockLevel || 5} 解锁【${item?.name || type}】`,
        cost,
        tiles
      };
    }

    // Validate full 5x5 bounding box is inside map & free of deep water / protected structures
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = cx + dx;
        const z = cz + dz;
        if (!inBounds(x, z)) {
          return { valid: false, reason: '5×5 立交范围超出地图边界', cost, tiles };
        }
      }
    }

    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      const ti = idx(s.x, s.z);
      const t = this.grid[ti];
      if (!t) {
        return { valid: false, reason: '立交超出边界', cost, tiles };
      }
      if (this.waterDepth[ti] > 0.25) {
        return { valid: false, reason: '深水区域无法直接修建地面互通立交', cost, tiles };
      }
      if (t.dam || t.roadGround === 3 || t.rail === 2) {
        return { valid: false, reason: '不可覆盖大坝或城际干线边境出入口', cost, tiles };
      }
      if (t.building && !BUILDING_NAMES[t.building.type]) {
        return { valid: false, reason: '立交区域内存在市政设施或地标建筑，请先避让或拆除', cost, tiles };
      }
      const { slope } = this.getTileMinMaxElev(s.x, s.z);
      if (slope > 1.15) {
        return { valid: false, reason: '地形过于陡峭，请先用平整工具修整台地', cost, tiles };
      }
    }

    return { valid: true, reason: '', cost, tiles };
  }

  placeInterchange(type, cx, cz, rot = 0, free = false) {
    if (!free && !this.isToolUnlocked(type)) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`🔒 需升至市长等级 Lv.${CATALOG[type]?.unlockLevel || 5} 解锁【${CATALOG[type]?.name}】！`);
      return { ok: false, reason: 'locked' };
    }

    const savedUnlock = this.unlockAll;
    if (free) this.unlockAll = true;
    const preview = this.previewInterchange(type, cx, cz, rot);
    this.unlockAll = savedUnlock;

    if (!preview.valid) {
      if (!free) {
        if (this.sfx) this.sfx.error();
        this.emitToast(`⚠️ 无法建造立交：${preview.reason}`);
      }
      return { ok: false, reason: preview.reason };
    }

    const cost = free ? 0 : preview.cost;
    if (!free && this.difficulty !== 'sandbox' && this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`💰 国库资金不足（建造【${CATALOG[type]?.name}】需 ¥${cost.toLocaleString()}）`);
      return { ok: false, reason: 'insufficient_funds' };
    }

    if (!free) {
      this.pushUndoSnapshot(CATALOG[type]?.name || '立体立交');
    }
    if (!free && this.difficulty !== 'sandbox') {
      this.money -= cost;
    }

    // Gently grade 5x5 interchange pad toward center elevation for crisp viaduct & ramp geometry
    const targetH = this.getTileElev(cx, cz);
    for (let czC = Math.max(0, cz - 2); czC <= Math.min(CORNER_STRIDE - 1, cz + 3); czC++) {
      for (let cxC = Math.max(0, cx - 2); cxC <= Math.min(CORNER_STRIDE - 1, cx + 3); cxC++) {
        if (czC >= GRID_SIZE - 1 && (Math.abs(cxC - 22.5) <= 1.6 || Math.abs(cxC - 8.5) <= 1.6)) continue;
        const ci = cIdx(cxC, czC);
        const curH = this.corners[ci];
        if (curH > 0.02) {
          this.corners[ci] = curH + (targetH - curH) * 0.72;
        }
      }
    }

    const specs = this._getInterchangeSpec(type, cx, cz, rot);
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      const t = this.grid[idx(s.x, s.z)];
      t.zone = null;
      t.building = null;
      t.pylon = false;
      t.trees = 0;
      t.roadDir = -1;
      t.banTrucks = false;
      t.busStop = false;
      t.roadGround = s.roadGround;
      t.roadBridge = s.roadGround > 0 && this.isWaterTile(s.x, s.z);
      t.roadElevated = s.roadElevated;
      t.ramp = Boolean(s.ramp);
      t.junctionMode = s.junctionMode || 'signal';
      t.roundaboutPaid = s.junctionMode === 'roundabout';
    }

    if (this.waterPhysics && typeof this.waterPhysics.refreshCellElevations === 'function') {
      this.waterPhysics.refreshCellElevations();
    }

    const prevSuppress = this._suppressPromotions;
    if (free) this._suppressPromotions = true;
    this.recomputeNetworksAndFields();
    this._suppressPromotions = prevSuppress;

    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    this.meshDirty = true;

    if (!free) {
      if (this.sfx && this.sfx.road) this.sfx.road();
      this.addXP(65, CATALOG[type]?.name || '立体立交');
      this.checkMayorQuests();
      this.emitToast(`✨ 已落成 5×5【${CATALOG[type]?.name}】，立体车流无缝立交分流！`);
    }

    return { ok: true, cost, tiles: preview.tiles };
  }

  // ==================== Rush-Hour Tidal Traffic Period Helper ====================
  getTrafficPeriodInfo() {
    const p = ((this.dayProgress % 1) + 1) % 1;
    if (p >= 0.29 && p <= 0.40) {
      return { id: 'morning_rush', icon: '🌅', label: '早高峰通勤', mult: 2.1, commuteBias: 'to_work' };
    }
    if (p >= 0.48 && p <= 0.60) {
      return { id: 'midday', icon: '☀️', label: '午间商贸潮', mult: 1.4, commuteBias: 'commercial' };
    }
    if (p >= 0.71 && p <= 0.83) {
      return { id: 'evening_rush', icon: '🌆', label: '晚高峰返家', mult: 2.1, commuteBias: 'to_home' };
    }
    if (p >= 0.94 || p < 0.21) {
      return { id: 'late_night', icon: '🌙', label: '深夜静谧', mult: 0.35, commuteBias: 'quiet' };
    }
    return { id: 'normal', icon: '🌤️', label: '平峰顺畅', mult: 1.0, commuteBias: 'balanced' };
  }

  // ==================== Strategic Policies, History & Civic Decisions ====================
  togglePolicy(key) {
    if (!key || !(key in this.policies)) return { ok: false };
    this.policies[key] = !this.policies[key];
    this.recomputeNetworksAndFields();
    this.stepEconomy(false);
    if (this.traffic && typeof this.traffic.refreshModalSplitDemand === 'function') {
      this.traffic.refreshModalSplitDemand();
    }
    if (this.sfx && this.sfx.tap) this.sfx.tap();
    return { ok: true, key, active: this.policies[key] };
  }

  applyTempDemandBoost(dR = 0, dC = 0, dI = 0, months = 3) {
    this.tempDemandBoost = {
      R: Math.max(-0.35, Math.min(0.45, (this.tempDemandBoost?.R || 0) + dR)),
      C: Math.max(-0.35, Math.min(0.45, (this.tempDemandBoost?.C || 0) + dC)),
      I: Math.max(-0.35, Math.min(0.45, (this.tempDemandBoost?.I || 0) + dI)),
      monthsLeft: Math.max(this.tempDemandBoost?.monthsLeft || 0, months)
    };
  }

  applyTempHappinessBoost(delta = 0, months = 3) {
    this.tempHappinessBoost = Math.max(-15, Math.min(18, (this.tempHappinessBoost || 0) + delta));
    this.tempHappinessMonths = Math.max(this.tempHappinessMonths || 0, months);
  }

  getAverageCongestion() {
    let sum = 0;
    let cnt = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround > 0) {
        sum += t.congestion || 0;
        cnt++;
      }
    }
    return cnt > 0 ? Math.round((sum / cnt) * 100) : 0;
  }

  recordHistorySnapshot() {
    const label = `${this.year}-${String(this.month).padStart(2, '0')}`;
    this.history.push({
      label,
      pop: this.population || 0,
      netIncome: this.netIncome || 0,
      tax: this.lastTaxIncome || 0,
      upkeep: this.lastUpkeep || 0,
      happiness: this.happiness || 75,
      avgCongestion: this.getAverageCongestion(),
      educatedRate: this.educatedRate || 0,
      transitRiders: this.transitStats?.totalRiders || 0
    });
    while (this.history.length > 24) {
      this.history.shift();
    }
  }

  seedBaselineHistory(months = 6) {
    this.history = [];
    const basePop = this.population || 0;
    const baseNet = this.netIncome || 0;
    const baseTax = this.lastTaxIncome || 0;
    const baseUpk = this.lastUpkeep || 0;
    const baseHap = this.happiness || 75;
    const baseCong = this.getAverageCongestion();
    const baseEdu = this.educatedRate || 0;
    const baseRid = this.transitStats?.totalRiders || 0;

    for (let offset = months - 1; offset >= 0; offset--) {
      let m = this.month - offset;
      let y = this.year;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const frac = months > 1 ? 0.72 + (0.28 * (months - 1 - offset)) / (months - 1) : 1.0;
      const wave = Math.sin(offset * 1.15) * 0.04;
      this.history.push({
        label: `${y}-${String(m).padStart(2, '0')}`,
        pop: Math.max(0, Math.round(basePop * frac)),
        netIncome: Math.round(baseNet * (0.85 + 0.15 * frac + wave)),
        tax: Math.max(0, Math.round(baseTax * (frac + wave))),
        upkeep: Math.max(0, Math.round(baseUpk * (0.90 + 0.10 * frac))),
        happiness: Math.max(5, Math.min(100, Math.round(baseHap - offset * 0.6))),
        avgCongestion: Math.max(0, Math.min(100, Math.round(baseCong * (0.82 + 0.18 * frac)))),
        educatedRate: Math.max(0, Math.min(100, Math.round(baseEdu * (0.85 + 0.15 * frac)))),
        transitRiders: Math.max(0, Math.round(baseRid * frac))
      });
    }
  }

  _onMonthRollover() {
    this.recordHistorySnapshot();

    if (this.tempDemandBoost && this.tempDemandBoost.monthsLeft > 0) {
      this.tempDemandBoost.monthsLeft--;
      if (this.tempDemandBoost.monthsLeft <= 0) {
        this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
      }
    }
    if (this.tempHappinessMonths > 0) {
      this.tempHappinessMonths--;
      if (this.tempHappinessMonths <= 0) {
        this.tempHappinessBoost = 0;
        this.tempHappinessMonths = 0;
      }
    }
  }

  triggerSampleEvent(eventId = null) {
    let def = null;
    if (eventId) {
      def = CIVIC_EVENTS.find((e) => e.id === eventId) || null;
    }
    if (!def) {
      def = CIVIC_EVENTS[this._eventHistoryIdx % CIVIC_EVENTS.length];
      this._eventHistoryIdx++;
    }
    this.activeEvent = {
      id: def.id,
      icon: def.icon,
      title: def.title,
      desc: def.desc,
      choices: def.choices.map((c) => ({ label: c.label, effectDesc: c.effectDesc }))
    };
    this.latestChirp = {
      user: '@市政府办公厅',
      text: `📜 市政决策待批示：${def.icon}【${def.title}】，请市长审阅并拍板！`,
      mood: 'info'
    };
    return this.activeEvent;
  }

  resolveCivicEvent(choiceIdx) {
    if (!this.activeEvent) return { ok: false };
    const def = CIVIC_EVENTS.find((e) => e.id === this.activeEvent.id);
    if (!def || choiceIdx < 0 || choiceIdx >= def.choices.length) {
      return { ok: false };
    }
    const choice = def.choices[choiceIdx];
    const eventId = def.id;
    const eventTitle = def.title;

    choice.apply(this);

    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.latestChirp = {
      user: '@市政决策快讯',
      text: `✅ 市长已批复【${eventTitle}】→「${choice.label}」(${choice.effectDesc})`,
      mood: 'good'
    };

    this.recomputeNetworksAndFields();
    this.stepEconomy(false);
    if (this.traffic && typeof this.traffic.refreshModalSplitDemand === 'function') {
      this.traffic.refreshModalSplitDemand();
    }
    if (this.sfx && this.sfx.milestone) this.sfx.milestone();

    return {
      ok: true,
      eventId,
      choiceIdx,
      choiceLabel: choice.label,
      effectDesc: choice.effectDesc
    };
  }

  onTripGridlockTimeout(v) {
    if (!v) return;
    this.gridlockTimeouts = (this.gridlockTimeouts || 0) + 1;
    const dx = v.destTile?.x ?? v.destTile?.tx;
    const dz = v.destTile?.z ?? v.destTile?.tz;
    const dtile = (typeof dx === 'number' && typeof dz === 'number') ? this.getTile(dx, dz) : null;
    const b = dtile?.building;
    if (b && !b.abandoned && !b.underConstruction) {
      if (v.tripType === 'freight' && (b.type === 'CL' || b.type === 'CH')) {
        if (this.difficulty !== 'sandbox') {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '干道严重塞车导致货车超时断货';
        }
      } else if ((v.tripLabel && v.tripLabel.includes('垃圾')) || v.tripType === 'garbage' || v.tripType === 'trash') {
        b.trashPiled = true;
        b.gridlockTrashTicks = 6;
        if (this.difficulty !== 'sandbox' && BUILDING_NAMES[b.type]) {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '垃圾车被堵在半路无法清运';
        }
      } else if (v.tripType === 'commute' && (b.type === 'I' || b.type === 'O')) {
        if (this.difficulty !== 'sandbox' && Math.random() < 0.45) {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '通勤干道瘫痪导致员工迟到减产';
        }
      }
    }
  }

  getQuestMetrics() {
    let countRoadTiles = 0;
    let elevatedCount = 0;
    let pipeCount = 0;
    let countHighDensity = 0;
    let buildingHighDensity = 0;
    const builtSet = new Set();

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround === 1 || t.roadGround === 2 || t.roadGround === 4 || t.roadElevated > 0) {
        countRoadTiles++;
      }
      if (t.roadElevated > 0) elevatedCount++;
      if (t.pipe && !t.pipeBroken) pipeCount++;

      const b = t.building;
      if (!b || b.abandoned) continue;
      if (!b.underConstruction) {
        builtSet.add(b.type);
        if (b.type === 'RH' || b.type === 'CH' || b.type === 'O') {
          countHighDensity++;
        }
      } else if (b.type === 'RH' || b.type === 'CH' || b.type === 'O') {
        buildingHighDensity++;
      }
    }

    return {
      countRoadTiles,
      elevatedCount,
      pipeCount,
      countHighDensity,
      buildingHighDensity,
      hasBuilding: (type) => builtSet.has(type)
    };
  }

  evaluateQuest(quest, m = this.getQuestMetrics()) {
    if (!quest) return { done: true, progressText: '全部指引已完成', recTool: 'pan', recCat: null };
    switch (quest.step) {
      case 1:
        return {
          done: m.countRoadTiles >= 12,
          progressText: `📊 已铺街道：${Math.min(12, m.countRoadTiles)} / 12 格`,
          recTool: 'road_1',
          recCat: 'road'
        };
      case 2:
        return {
          done: this.powerSupply >= 80,
          progressText: `📊 全市发电量：${this.powerSupply} / 80 MW`,
          recTool: 'power_wind',
          recCat: 'power'
        };
      case 3: {
        const wOk = this.waterSupply >= 200;
        const sOk = this.sewageSupply >= 200;
        const pOk = m.pipeCount >= 8;
        const cleanOk = this.waterPollutedPct < 5;
        let recTool = quest.tool;
        if (!wOk) recTool = 'water_pump';
        else if (!sOk) recTool = 'sewage_out';
        else recTool = 'water_pipe';
        return {
          done: wOk && sOk && pOk && cleanOk,
          progressText: `📊 抽水${wOk ? '✅' : `${this.waterSupply}/200`} · 排污${sOk ? '✅' : `${this.sewageSupply}/200`} · 水管${Math.min(8, m.pipeCount)}/8格${!cleanOk ? ' ⚠️水源受污!' : ''}`,
          recTool,
          recCat: 'water'
        };
      }
      case 4: {
        const recTool = (this.population >= 50 && this.jobsTotal < 25) ? 'zone_CL' : 'zone_RL';
        return {
          done: this.population >= 60 && this.jobsTotal >= 25,
          progressText: `📊 人口 ${this.population}/60 人 · 岗位 ${this.jobsTotal}/25 个`,
          recTool,
          recCat: 'zones'
        };
      }
      case 5: {
        const hasF = m.hasBuilding('fire_station');
        const hasP = m.hasBuilding('park');
        const unlocked = this.isToolUnlocked('fire_station');
        return {
          done: hasF && hasP,
          progressText: unlocked
            ? `📊 🚒消防署 ${hasF ? '✅' : '⬜'} · 🌳公园 ${hasP ? '✅' : '⬜'}`
            : `📊 升Lv.2人口 ${this.population}/180人 · 🚒消防⬜ · 🌳公园⬜`,
          recTool: !unlocked ? 'zone_RL' : (hasF ? 'park' : 'fire_station'),
          recCat: !unlocked ? 'zones' : 'civic'
        };
      }
      case 6: {
        const hasW = m.hasBuilding('waste_plant');
        const unlocked = this.isToolUnlocked('waste_plant');
        return {
          done: hasW && this.population >= 480,
          progressText: `📊 升Lv.3人口 ${Math.min(480, this.population)}/480人 · ♻️焚烧厂 ${hasW ? '✅' : '⬜'}`,
          recTool: (!unlocked || hasW) ? 'zone_RL' : 'waste_plant',
          recCat: (!unlocked || hasW) ? 'zones' : 'water'
        };
      }
      case 7: {
        const hasS = m.hasBuilding('school');
        const hasH = m.hasBuilding('hospital');
        const unlocked = this.isToolUnlocked('school');
        return {
          done: hasS && hasH,
          progressText: unlocked
            ? `📊 🏫理工大学 ${hasS ? '✅' : '⬜'} · 🏥综合医院 ${hasH ? '✅' : '⬜'}`
            : `📊 升Lv.4人口 ${this.population}/1,000人 · 🏥医院 ${hasH ? '✅' : '⬜'}`,
          recTool: !unlocked ? (hasH || !this.isToolUnlocked('hospital') ? 'zone_RL' : 'hospital') : (hasS ? 'hospital' : 'school'),
          recCat: !unlocked ? (hasH || !this.isToolUnlocked('hospital') ? 'zones' : 'civic') : 'civic'
        };
      }
      case 8: {
        const evOk = m.elevatedCount >= 4;
        const hdOk = m.countHighDensity >= 4;
        const unlocked = this.isToolUnlocked('road_elev');
        return {
          done: evOk && hdOk,
          progressText: unlocked
            ? `📊 🌉高架路 ${Math.min(4, m.elevatedCount)}/4格 · 🏙️高密/办公 ${Math.min(4, m.countHighDensity)}/4栋${m.buildingHighDensity > 0 ? ` (施工${m.buildingHighDensity})` : ''}`
            : `📊 升Lv.5人口 ${this.population}/1,900人 · 扩建住商工街区解锁高架&高密`,
          recTool: !unlocked ? 'zone_RL' : (!evOk ? 'road_elev' : 'zone_RH'),
          recCat: !unlocked ? 'zones' : (!evOk ? 'road' : 'zones')
        };
      }
      case 9: {
        const done = m.hasBuilding('metro_station') || m.hasBuilding('hsr_station') || m.hasBuilding('seaport');
        const unlocked = this.isToolUnlocked('metro_station');
        return {
          done,
          progressText: unlocked
            ? `📊 建成 🚇地铁站 / 🚢深水海港 / 🚉高铁站 任一枢纽`
            : `📊 升Lv.7人口 ${this.population}/5,000人 · 规划高密住宅(RH)冲刺轨道新都`,
          recTool: unlocked ? 'metro_station' : 'zone_RH',
          recCat: unlocked ? 'rail' : 'zones'
        };
      }
      case 10:
      default: {
        const done = m.hasBuilding('nuclear_plant') || this.hydroPowerMW > 50 || m.hasBuilding('airport');
        const unlocked = this.isToolUnlocked('nuclear_plant');
        return {
          done,
          progressText: unlocked
            ? `📊 建成 ☢️核电站 / 🏗️峡谷大坝(${Math.round(this.hydroPowerMW)}/50MW) / ✈️国际机场`
            : `📊 升Lv.9人口 ${this.population}/10,500人 · 发展摩天都市解锁核电&大坝`,
          recTool: unlocked ? 'nuclear_plant' : 'zone_RH',
          recCat: unlocked ? 'power' : 'zones'
        };
      }
    }
  }

  getCurrentQuestStatus() {
    const totalSteps = MAYOR_QUESTS.length;
    if (this.guideStep >= totalSteps) {
      return {
        completedAll: true,
        stepIndex: totalSteps,
        totalSteps,
        quest: null,
        evalResult: { done: true, progressText: '🏆 全部 10 步市长建城指引已圆满达成！', recTool: 'pan', recCat: null }
      };
    }
    const quest = MAYOR_QUESTS[this.guideStep];
    const evalResult = this.evaluateQuest(quest);
    return {
      completedAll: false,
      stepIndex: this.guideStep,
      totalSteps,
      quest,
      evalResult
    };
  }

  syncCompletedQuestsSilent() {
    const m = this.getQuestMetrics();
    while (this.guideStep < MAYOR_QUESTS.length) {
      const q = MAYOR_QUESTS[this.guideStep];
      if (!this.evaluateQuest(q, m).done) break;
      if (!this.completedQuests.includes(q.step)) {
        this.completedQuests.push(q.step);
      }
      this.guideStep++;
    }
  }

  checkMayorQuests() {
    if (this.guideStep >= MAYOR_QUESTS.length) return;
    const m = this.getQuestMetrics();
    while (this.guideStep < MAYOR_QUESTS.length) {
      const q = MAYOR_QUESTS[this.guideStep];
      if (!this.evaluateQuest(q, m).done) break;

      if (!this.completedQuests.includes(q.step)) {
        this.completedQuests.push(q.step);
      }
      this.guideStep++;

      if (this.difficulty !== 'sandbox' && q.rewardMoney > 0) {
        this.money += q.rewardMoney;
      }
      const lvUp = this.addXP(q.rewardXP, q.title, true);

      if (!lvUp) {
        if (this.sfx && this.sfx.milestone) this.sfx.milestone();
        this.latestChirp = {
          user: '@建城顾问团',
          text: `✅ 达成第${q.step}步指引【${q.title}】！国库拨款 +¥${q.rewardMoney.toLocaleString()}，经验 +${q.rewardXP} XP！`,
          mood: 'good'
        };
      }

      if (this.onQuestComplete) {
        this.onQuestComplete(q, lvUp);
      } else if (lvUp && this.onLevelUp) {
        this.onLevelUp(lvUp);
      }
    }
  }

  isToolUnlocked(toolId) {
    if (this.unlockAll || this.difficulty === 'sandbox') return true;
    const item = CATALOG[toolId];
    if (!item) return true;
    return (this.mayorLevel || 1) >= (item.unlockLevel || 1);
  }

  getTile(x, z) {
    if (!inBounds(x, z)) return null;
    return this.grid[idx(x, z)];
  }

  getTileElev(x, z) {
    if (!inBounds(x, z)) return 0;
    const c = this.corners;
    return (
      c[cIdx(x, z)] +
      c[cIdx(x + 1, z)] +
      c[cIdx(x, z + 1)] +
      c[cIdx(x + 1, z + 1)]
    ) * 0.25;
  }

  getTileMinMaxElev(x, z) {
    if (!inBounds(x, z)) return { min: 0, max: 0, slope: 0 };
    const c = this.corners;
    const h00 = c[cIdx(x, z)];
    const h10 = c[cIdx(x + 1, z)];
    const h01 = c[cIdx(x, z + 1)];
    const h11 = c[cIdx(x + 1, z + 1)];
    const min = Math.min(h00, h10, h01, h11);
    const max = Math.max(h00, h10, h01, h11);
    return { min, max, slope: max - min };
  }

  isWaterTile(x, z) {
    if (!inBounds(x, z)) return false;
    return this.waterDepth[idx(x, z)] > 0.08;
  }

  hasNearbyWater(x, z, radius = 2) {
    let bestPoll = 1;
    let found = false;
    for (let dz = -radius; dz <= radius; dz++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx, nz = z + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (this.waterDepth[ni] > 0.10) {
          found = true;
          if (this.waterPoll[ni] < bestPoll) bestPoll = this.waterPoll[ni];
        }
      }
    }
    return { found, poll: found ? bestPoll : 0 };
  }

  sculptTerrain(tx, tz, mode, flattenTarget = null, isStrokeStart = false) {
    if (!inBounds(tx, tz)) return false;
    if (!this.isToolUnlocked(mode)) {
      this.emitToast(`🔒 需升至市长等级 Lv.${CATALOG[mode]?.unlockLevel || 1} 解锁【${CATALOG[mode]?.name}】！`);
      return false;
    }
    const cost = this.difficulty === 'sandbox' ? 0 : (CATALOG[mode]?.cost || 35);
    if (this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast('💰 资金不足，土方开挖需谨慎预算（可去财政面板申请贷款）');
      return false;
    }

    if (mode === 'ter_spring') {
      this.pushUndoSnapshot(CATALOG.ter_spring?.name || '高山水源泉眼');
      const t = this.getTile(tx, tz);
      t.waterSpring = t.waterSpring > 0 ? 0 : 0.56;
      if (t.waterSpring > 0) {
        this.waterDepth[idx(tx, tz)] = Math.max(this.waterDepth[idx(tx, tz)], 0.45);
        this.emitToast('⛲ 已开启高山活水源头！泉水正顺山谷奔流而下');
        this.addXP(35, '开启高山泉眼');
      } else {
        this.emitToast('已关闭该处水源泉眼');
      }
      this.money -= cost;
      if (this.sfx) this.sfx.pipe();
      this.meshDirty = true;
      return true;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const pushedUndo = Boolean(isStrokeStart) || (now - (this._lastSculptUndoAt || 0) > 600);
    if (pushedUndo) {
      this.pushUndoSnapshot(CATALOG[mode]?.name || '地形重塑');
    }

    const R = 2.8;
    const cxCenter = tx + 0.5;
    const czCenter = tz + 0.5;
    let modified = false;

    const minCellZ = Math.max(0, tz - 4);
    const maxCellZ = Math.min(GRID_SIZE - 1, tz + 4);
    const minCellX = Math.max(0, tx - 4);
    const maxCellX = Math.min(GRID_SIZE - 1, tx + 4);
    const preElev = new Map();
    for (let z = minCellZ; z <= maxCellZ; z++) {
      for (let x = minCellX; x <= maxCellX; x++) {
        preElev.set(idx(x, z), this.getTileElev(x, z));
      }
    }

    for (let cz = Math.max(0, tz - 3); cz <= Math.min(CORNER_STRIDE - 1, tz + 4); cz++) {
      for (let cx = Math.max(0, tx - 3); cx <= Math.min(CORNER_STRIDE - 1, tx + 4); cx++) {
        // Protect South Highway & HSR outside-connection portals
        if (cz >= GRID_SIZE - 1 && (Math.abs(cx - 22.5) <= 1.6 || Math.abs(cx - 8.5) <= 1.6)) continue;
        const d = Math.hypot(cx - cxCenter, cz - czCenter);
        if (d > R) continue;
        const w = Math.cos((d / R) * Math.PI * 0.5);
        const ci = cIdx(cx, cz);
        const oldH = this.corners[ci];
        let newH = oldH;

        if (mode === 'ter_raise') newH = Math.min(3.5, oldH + 0.16 * w);
        else if (mode === 'ter_lower') newH = Math.max(-1.05, oldH - 0.18 * w);
        else if (mode === 'ter_flatten' && flattenTarget !== null) {
          newH = oldH + (flattenTarget - oldH) * (0.45 * w);
        }

        if (Math.abs(newH - oldH) > 0.001) {
          this.corners[ci] = newH;
          modified = true;
        }
      }
    }

    if (modified) {
      if (pushedUndo) this._lastSculptUndoAt = now;
      this.money -= cost;
      for (const [ti, oldE] of preElev.entries()) {
        const txCell = ti % GRID_SIZE;
        const tzCell = (ti / GRID_SIZE) | 0;
        const newE = this.getTileElev(txCell, tzCell);
        const oldW = this.waterDepth[ti];
        if (newE > oldE && oldW > 0) {
          const oldSurf = oldE + oldW;
          this.waterDepth[ti] = Math.max(0, oldSurf - newE);
        }
      }
      if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
      if (this.sfx) this.sfx.sculpt();
      this.meshDirty = true;
      if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
        this.traffic.refreshRoadGraph();
      }
    } else if (pushedUndo && this.undoStack.length > 0) {
      this.undoStack.pop();
    }
    return modified;
  }

  getBuildingDisplayName(b, x, z) {
    if (!b) return '';
    if (b.abandoned) return `🏚️ 废弃建筑（原${BUILDING_NAMES[b.type]?.[0]?.[0] || '楼宇'}）`;
    if (BUILDING_NAMES[b.type]) {
      const table = BUILDING_NAMES[b.type];
      const lvIdx = Math.min(table.length - 1, Math.max(0, (b.level || 1) - 1));
      const arr = table[lvIdx];
      return arr[(b.variant + x + z) % arr.length];
    }
    return CATALOG[b.type] ? CATALOG[b.type].name : b.type;
  }

  getMaxLevelForZone(zType) {
    if (zType === 'RL' || zType === 'CL') return 3;
    if (zType === 'I' || zType === 'O') return 4;
    return 5;
  }

  getBuildingStats(b) {
    if (!b || b.abandoned) return { pop: 0, jobs: 0, power: 0, water: 0 };
    if (b.underConstruction) return { pop: 0, jobs: 0, power: 1, water: 1 };
    const lv = b.level || 1;
    switch (b.type) {
      case 'RL': return { pop: [0, 12, 24, 42][lv] || 24, jobs: 0, power: lv * 1.8, water: lv * 2.0 };
      case 'RH': return { pop: [0, 46, 92, 168, 280, 440][lv] || 150, jobs: 0, power: lv * 3.8, water: lv * 4.0 };
      case 'CL': return { pop: 0, jobs: [0, 12, 26, 46][lv] || 20, power: lv * 2.2, water: lv * 2.0 };
      case 'CH': return { pop: 0, jobs: [0, 40, 86, 155, 260, 410][lv] || 120, power: lv * 4.5, water: lv * 3.8 };
      case 'I':  return { pop: 0, jobs: [0, 18, 40, 78, 140][lv] || 40, power: lv * 4.2, water: lv * 3.6 };
      case 'O':  return { pop: 0, jobs: [0, 32, 72, 145, 250][lv] || 70, power: lv * 3.5, water: lv * 2.6 };
      case 'landmark': return { pop: 0, jobs: 480, power: 48, water: 40 };
      case 'airport': return { pop: 0, jobs: 140, power: 36, water: 24 };
      case 'seaport': return { pop: 0, jobs: 95, power: 22, water: 14 };
      case 'zoo': return { pop: 0, jobs: 64, power: 16, water: 18 };
      case 'botanical_garden': return { pop: 0, jobs: 44, power: 14, water: 16 };
      case 'museum': return { pop: 0, jobs: 52, power: 18, water: 10 };
      case 'tv_tower': return { pop: 0, jobs: 120, power: 38, water: 18 };
      case 'stadium': return { pop: 0, jobs: 75, power: 28, water: 20 };
      case 'amusement_park': return { pop: 0, jobs: 48, power: 18, water: 12 };
      case 'hsr_station': return { pop: 0, jobs: 80, power: 26, water: 18 };
      case 'metro_station': return { pop: 0, jobs: 20, power: 14, water: 9 };
      case 'waste_plant': return { pop: 0, jobs: 28, power: 0, water: 8 };
      case 'solar_plant': return { pop: 0, jobs: 18, power: 0, water: 4 };
      case 'nuclear_plant': return { pop: 0, jobs: 65, power: 0, water: 0 };
      case 'hospital':
      case 'school':
      case 'fire_station':
      case 'police_station':
        return { pop: 0, jobs: 26, power: 10, water: 10 };
      case 'park':
        return { pop: 0, jobs: 4, power: 2, water: 3 };
      default:
        return { pop: 0, jobs: 0, power: 0, water: 0 };
    }
  }

  findRoadAccess(x, z) {
    const dirs = [
      { dx: 0, dz: 1, rot: 0 },
      { dx: 1, dz: 0, rot: 1 },
      { dx: 0, dz: -1, rot: 2 },
      { dx: -1, dz: 0, rot: 3 }
    ];
    for (const d of dirs) {
      const t = this.getTile(x + d.dx, z + d.dz);
      if (t && (t.roadGround === 1 || t.roadGround === 2)) {
        return { dist: 1, rot: d.rot, roadType: t.roadGround, rx: x + d.dx, rz: z + d.dz, roadTile: t };
      }
    }
    for (const d of dirs) {
      const t = this.getTile(x + d.dx * 2, z + d.dz * 2);
      if (t && (t.roadGround === 1 || t.roadGround === 2)) {
        return { dist: 2, rot: d.rot, roadType: t.roadGround, rx: x + d.dx * 2, rz: z + d.dz * 2, roadTile: t };
      }
    }
    return null;
  }

  computeLineOrLPath(x0, z0, x1, z1, straightOnly = false) {
    if (straightOnly) {
      const pts = [];
      let cx = x0, cz = z0;
      const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
      const dz = -Math.abs(z1 - z0), sz = z0 < z1 ? 1 : -1;
      let err = dx + dz;
      while (true) {
        if (inBounds(cx, cz)) pts.push({ x: cx, z: cz });
        if (cx === x1 && cz === z1) break;
        const e2 = 2 * err;
        if (e2 >= dz) { err += dz; cx += sx; }
        if (e2 <= dx) { err += dx; cz += sz; }
      }
      return pts;
    }

    const path = [];
    const dx = x1 - x0;
    const dz = z1 - z0;
    if (Math.abs(dx) >= Math.abs(dz)) {
      const stepX = dx >= 0 ? 1 : -1;
      for (let x = x0; x !== x1 + stepX; x += stepX) {
        if (inBounds(x, z0)) path.push({ x, z: z0 });
        if (x === x1) break;
      }
      if (dz !== 0) {
        const stepZ = dz >= 0 ? 1 : -1;
        for (let z = z0 + stepZ; z !== z1 + stepZ; z += stepZ) {
          if (inBounds(x1, z)) path.push({ x: x1, z });
          if (z === z1) break;
        }
      }
    } else {
      const stepZ = dz >= 0 ? 1 : -1;
      for (let z = z0; z !== z1 + stepZ; z += stepZ) {
        if (inBounds(x0, z)) path.push({ x: x0, z });
        if (z === z1) break;
      }
      if (dx !== 0) {
        const stepX = dx >= 0 ? 1 : -1;
        for (let x = x0 + stepX; x !== x1 + stepX; x += stepX) {
          if (inBounds(x, z1)) path.push({ x, z: z1 });
          if (x === x1) break;
        }
      }
    }
    return path;
  }

  computeRectTiles(x0, z0, x1, z1) {
    const minX = Math.max(0, Math.min(x0, x1));
    const maxX = Math.min(GRID_SIZE - 1, Math.max(x0, x1));
    const minZ = Math.max(0, Math.min(z0, z1));
    const maxZ = Math.min(GRID_SIZE - 1, Math.max(z0, z1));
    const out = [];
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) out.push({ x, z });
    }
    return out;
  }

  _isBlockedByMidSlipFlank(x, z) {
    // Check if an adjacent mid-viaduct slip-ramp (with elevated viaduct on BOTH ends) flares its side ramp across (x, z)
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nt = this.getTile(x + dx, z + dz);
      if (!nt || !nt.ramp) continue;
      if (dx !== 0) {
        if ((this.getTile(nt.x, nt.z - 1)?.roadElevated || 0) > 0 && (this.getTile(nt.x, nt.z + 1)?.roadElevated || 0) > 0) return true;
      } else {
        if ((this.getTile(nt.x - 1, nt.z)?.roadElevated || 0) > 0 && (this.getTile(nt.x + 1, nt.z)?.roadElevated || 0) > 0) return true;
      }
    }
    return false;
  }

  // Returns the 5 rotated runway clearance tiles behind an airport at (ax, az, rot)
  getAirportRunwayTiles(ax, az, rot = 0) {
    const r = ((rot || 0) % 4 + 4) % 4;
    const rc = Math.round(Math.cos(r * Math.PI * 0.5));
    const rs = Math.round(Math.sin(r * Math.PI * 0.5));
    const out = [];
    for (let lx = -2; lx <= 2; lx++) {
      out.push({ x: ax + lx * rc + (-1) * rs, z: az - lx * rs + (-1) * rc });
    }
    return out;
  }

  // Prevents pylons, roads, buildings, rails, or zones from EVER clipping onto an active airport runway!
  isBlockedByAirportRunway(x, z, ignoreAx = -1, ignoreAz = -1) {
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        const ax = x + dx, az = z + dz;
        if (!inBounds(ax, az)) continue;
        if (ax === ignoreAx && az === ignoreAz) continue;
        const at = this.grid[idx(ax, az)];
        if (!at || !at.building || at.building.type !== 'airport') continue;
        const strip = this.getAirportRunwayTiles(ax, az, at.building.rot || 0);
        for (let k = 0; k < strip.length; k++) {
          if (strip[k].x === x && strip[k].z === z) return true;
        }
      }
    }
    return false;
  }

  previewAirportFootprint(x, z, manualRot = 0) {
    const acc = this.findRoadAccess(x, z);
    const bRot = ((acc ? acc.rot : 0) + (manualRot || 0)) & 3;
    const runway = this.getAirportRunwayTiles(x, z, bRot);
    const allTiles = [{ x, z }, ...runway];
    let ok = inBounds(x, z) && !this.isWaterTile(x, z);
    let reason = '';
    if (ok) {
      const t0 = this.getTile(x, z);
      const { slope } = this.getTileMinMaxElev(x, z);
      if (!t0 || slope > 0.65 || t0.roadGround > 0 || t0.roadElevated > 0 || t0.rail > 0 || t0.dam || t0.pylon || (t0.building && !BUILDING_NAMES[t0.building.type])) {
        ok = false;
        reason = '航站楼位置受阻或坡度过陡';
      }
    } else {
      reason = '航站楼必须位于陆地上';
    }
    if (ok) {
      for (const rt of runway) {
        if (!inBounds(rt.x, rt.z)) { ok = false; reason = '后方5格跑道超出地图边界（请点击旋转）'; break; }
        const cell = this.getTile(rt.x, rt.z);
        if (!cell || this.isWaterTile(rt.x, rt.z) || cell.dam || cell.pylon || cell.roadGround > 0 || cell.roadElevated > 0 || cell.rail > 0 || (cell.building && !BUILDING_NAMES[cell.building.type])) {
          ok = false;
          reason = '后方5格跑道净空区存在铁塔/建筑/道路/水域（请旋转方向或选平坦空地）';
          break;
        }
      }
    }
    return { valid: ok, reason, rot: bRot, tiles: allTiles, runwayTiles: runway };
  }

  // ==================== Dynamic 3D Weather Engine ====================
  getWeatherInfo() {
    const w = this.weather || { state: 'clear', mode: 'auto', intensity: 0, tempC: 22 };
    const meta = {
      clear:  { id: 'clear',  icon: '☀️', label: '晴朗', solarMult: 1.15, roadMult: 1.00, tourMult: 1.15, heatMult: 1.00, happyMod: 2 },
      cloudy: { id: 'cloudy', icon: '⛅', label: '多云', solarMult: 0.88, roadMult: 1.00, tourMult: 1.00, heatMult: 1.00, happyMod: 0 },
      rain:   { id: 'rain',   icon: '🌧️', label: '阵雨', solarMult: 0.65, roadMult: 0.88, tourMult: 0.90, heatMult: 1.02, happyMod: -1 },
      storm:  { id: 'storm',  icon: '⛈️', label: '雷暴', solarMult: 0.50, roadMult: 0.82, tourMult: 0.78, heatMult: 1.05, happyMod: -3 },
      snow:   { id: 'snow',   icon: '❄️', label: '降雪', solarMult: 0.75, roadMult: 0.85, tourMult: 1.08, heatMult: 1.12, happyMod: 1 },
      fog:    { id: 'fog',    icon: '🌫️', label: '晨雾', solarMult: 0.82, roadMult: 0.92, tourMult: 0.95, heatMult: 1.02, happyMod: 0 }
    };
    const info = meta[w.state] || meta.clear;
    return { ...info, mode: w.mode || 'auto', intensity: w.intensity || 0, tempC: Math.round(w.tempC ?? 22) };
  }

  setWeatherMode(mode = 'auto') {
    const valid = ['auto', 'clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'];
    const m = valid.includes(mode) ? mode : 'auto';
    if (!this.weather) this.weather = { state: 'clear', mode: 'auto', intensity: 0, timer: 42, tempC: 22, lightningFlash: 0 };
    this.weather.mode = m;
    if (m !== 'auto') {
      this.weather.state = m;
      this.weather.intensity = (m === 'storm') ? 1.0 : ((m === 'rain' || m === 'snow' || m === 'fog') ? 0.78 : (m === 'cloudy' ? 0.45 : 0));
      this.weather.tempC = m === 'snow' ? -2 : (m === 'storm' ? 16 : (m === 'rain' ? 18 : (m === 'fog' ? 14 : (m === 'cloudy' ? 20 : 24))));
    } else {
      this.weather.timer = 18;
    }
    this.recomputeNetworksAndFields();
    return this.getWeatherInfo();
  }

  stepWeather(simDt) {
    if (!this.weather) return;
    const w = this.weather;
    if (w.lightningFlash > 0) {
      w.lightningFlash = Math.max(0, w.lightningFlash - simDt * 3.8);
    }

    if (w.mode === 'auto') {
      w.timer -= simDt;
      if (w.timer <= 0) {
        w.timer = 38 + Math.random() * 34;
        const isWinter = this.month === 12 || this.month === 1 || this.month === 2;
        const r = Math.random();
        let next = 'clear';
        if (isWinter) {
          if (r < 0.36) next = 'clear';
          else if (r < 0.56) next = 'cloudy';
          else if (r < 0.84) next = 'snow';
          else next = 'fog';
        } else {
          if (r < 0.44) next = 'clear';
          else if (r < 0.64) next = 'cloudy';
          else if (r < 0.80) next = 'rain';
          else if (r < 0.90) next = 'storm';
          else next = 'fog';
        }
        w.state = next;
      }
    }

    const targetInt = (w.state === 'storm') ? 1.0
      : (w.state === 'rain' || w.state === 'snow' || w.state === 'fog') ? 0.80
      : (w.state === 'cloudy' ? 0.45 : 0.0);
    w.intensity += (targetInt - (w.intensity || 0)) * Math.min(1, simDt * 0.85);

    const targetTemp = w.state === 'snow' ? -2 : (w.state === 'storm' ? 16 : (w.state === 'rain' ? 18 : (w.state === 'fog' ? 14 : (w.state === 'cloudy' ? 20 : 24))));
    w.tempC = (w.tempC ?? 22) + (targetTemp - (w.tempC ?? 22)) * Math.min(1, simDt * 0.25);

    // Storm occasional lightning flash
    if (w.state === 'storm' && w.lightningFlash <= 0 && Math.random() < simDt * 0.14) {
      w.lightningFlash = 1.0;
    }

    // Rain / Storm natural gameplay impact: accelerate firefighting + gentle upstream reservoir rainfall recharge!
    if ((w.state === 'rain' || w.state === 'storm') && simDt > 0) {
      const fireDamp = (w.state === 'storm' ? 0.14 : 0.07) * simDt;
      const rainFill = (w.state === 'storm' ? 0.00055 : 0.00028) * simDt;
      for (let i = 0; i < this.grid.length; i++) {
        const t = this.grid[i];
        if (t.building && t.building.fire > 0) {
          t.building.fire = Math.max(0, t.building.fire - fireDamp);
        }
        if (t.waterSpring > 0 && this.waterDepth[i] < 1.95) {
          this.waterDepth[i] = Math.min(2.2, this.waterDepth[i] + rainFill * 25);
        }
      }
    }
  }

  // ==================== Custom Colored Bus Route Manager ====================
  createBusLine(name = '', colorHex = null, stops = [], busCount = 2, fare = 2) {
    const palette = ['#0ea5e9', '#10b981', '#f97316', '#a855f7', '#ef4444', '#eab308'];
    const id = this._nextBusLineId++;
    const col = colorHex || palette[(id - 1) % palette.length];
    const cleanStops = [];
    for (const s of (stops || [])) {
      if (!s || !inBounds(s.x, s.z)) continue;
      const t = this.grid[idx(s.x, s.z)];
      if (t && t.busStop && t.roadGround > 0) {
        if (!cleanStops.some((e) => e.x === s.x && e.z === s.z)) {
          cleanStops.push({ x: s.x, z: s.z });
        }
      }
    }
    const line = {
      id,
      name: name || `${id}路 公交专线`,
      colorHex: col,
      stops: cleanStops,
      busCount: Math.max(1, Math.min(6, busCount | 0 || 2)),
      fare: Math.max(0, Math.min(5, Number(fare) || 2)),
      active: true,
      dailyRiders: 0
    };
    this.busLines.push(line);
    this.infraDirty = true;
    return line;
  }

  deleteBusLine(lineId) {
    const prevLen = this.busLines.length;
    this.busLines = this.busLines.filter((l) => l.id !== lineId);
    if (this.busLines.length !== prevLen) {
      this.infraDirty = true;
      return true;
    }
    return false;
  }

  addStopToBusLine(lineId, x, z) {
    const line = this.busLines.find((l) => l.id === lineId);
    if (!line || !inBounds(x, z)) return { ok: false, reason: '无效线路或坐标' };
    const t = this.grid[idx(x, z)];
    if (!t || !t.busStop || t.roadGround <= 0) return { ok: false, reason: '请点击已建成的【🚏 智能公交站】！' };
    if (line.stops.some((s) => s.x === x && s.z === z)) return { ok: false, reason: '该站点已在当前线路中' };
    line.stops.push({ x, z });
    this.infraDirty = true;
    return { ok: true, line };
  }

  removeStopFromBusLine(lineId, stopIdx) {
    const line = this.busLines.find((l) => l.id === lineId);
    if (!line || stopIdx < 0 || stopIdx >= line.stops.length) return false;
    line.stops.splice(stopIdx, 1);
    this.infraDirty = true;
    return true;
  }

  setBusLineConfig(lineId, patch = {}) {
    const line = this.busLines.find((l) => l.id === lineId);
    if (!line) return false;
    if (patch.name !== undefined) line.name = String(patch.name).slice(0, 24) || line.name;
    if (patch.colorHex !== undefined) line.colorHex = String(patch.colorHex);
    if (patch.busCount !== undefined) line.busCount = Math.max(1, Math.min(6, Number(patch.busCount) | 0));
    if (patch.fare !== undefined) line.fare = Math.max(0, Math.min(5, Number(patch.fare)));
    if (patch.active !== undefined) line.active = Boolean(patch.active);
    this.infraDirty = true;
    return true;
  }

  _pruneDeletedBusStops() {
    if (!Array.isArray(this.busLines) || this.busLines.length === 0) return;
    for (const line of this.busLines) {
      line.stops = (line.stops || []).filter((s) => {
        if (!inBounds(s.x, s.z)) return false;
        const t = this.grid[idx(s.x, s.z)];
        return Boolean(t && t.busStop && t.roadGround > 0);
      });
    }
  }

  // One-tap intelligent circular bus loop planner (clusters & orders all active bus stops into 1-2 scenic routes!)
  autoPlanBusLines() {
    const stops = [];
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.busStop && t.roadGround >= 1 && t.roadGround !== 4) {
        stops.push({ x: t.x, z: t.z });
      }
    }
    if (stops.length < 2) {
      return { ok: false, reason: '至少需要建设 2 座【🚏 智能公交站】才能自动规划环线！' };
    }

    // Order stops into a smooth circular tour via nearest-neighbor heuristic
    const orderTour = (pts) => {
      if (pts.length <= 2) return pts.slice();
      const rem = pts.slice();
      rem.sort((a, b) => (a.x + a.z) - (b.x + b.z));
      const tour = [rem.shift()];
      while (rem.length > 0) {
        const cur = tour[tour.length - 1];
        let bestIdx = 0, bestD = 1e9;
        for (let k = 0; k < rem.length; k++) {
          const d = Math.hypot(rem[k].x - cur.x, rem[k].z - cur.z);
          if (d < bestD) { bestD = d; bestIdx = k; }
        }
        tour.push(rem.splice(bestIdx, 1)[0]);
      }
      return tour;
    };

    this.busLines = [];
    this._nextBusLineId = 1;

    if (stops.length >= 6) {
      // Split into 2 complementary loops: North/CBD Civic Express + South/Waterfront Tourism Loop
      const sortedZ = stops.slice().sort((a, b) => a.z - b.z);
      const mid = Math.ceil(sortedZ.length / 2);
      const northStops = orderTour(sortedZ.slice(0, mid));
      const southStops = orderTour(sortedZ.slice(mid - 1)); // share 1 transfer hub stop!
      this.createBusLine('1路 中心城CBD环线', '#0ea5e9', northStops, 3, 2);
      this.createBusLine('2路 滨海文旅专线', '#10b981', southStops, 2, 2);
    } else {
      const ordered = orderTour(stops);
      this.createBusLine('1路 全城公交环线', '#0ea5e9', ordered, Math.min(4, Math.max(2, stops.length - 1)), 2);
    }

    this.infraDirty = true;
    return { ok: true, count: this.busLines.length };
  }

  _inferOneWayDirs(tiles, opts = null) {
    const dirFromDelta = (dx, dz) => {
      if (Math.abs(dx) >= Math.abs(dz)) return dx >= 0 ? 3 : 2;
      return dz >= 0 ? 1 : 0;
    };
    const dirs = new Int8Array(tiles.length);
    if (tiles.length === 1) {
      let d = 3;
      if (opts && typeof opts.dir === 'number' && opts.dir >= 0 && opts.dir <= 3) {
        d = opts.dir;
      } else {
        const p = tiles[0];
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nt = this.getTile(p.x + dx, p.z + dz);
          if (nt && nt.roadGround > 0 && typeof nt.roadDir === 'number' && nt.roadDir >= 0) {
            d = nt.roadDir;
            break;
          }
        }
      }
      dirs[0] = d;
      return dirs;
    }
    for (let k = 0; k < tiles.length; k++) {
      if (k < tiles.length - 1) {
        dirs[k] = dirFromDelta(tiles[k + 1].x - tiles[k].x, tiles[k + 1].z - tiles[k].z);
      } else {
        dirs[k] = dirFromDelta(tiles[k].x - tiles[k - 1].x, tiles[k].z - tiles[k - 1].z);
      }
    }
    return dirs;
  }

  estimateAction(toolId, tiles, opts = null) {
    let cost = 0;
    const validTiles = [];
    if (!this.isToolUnlocked(toolId)) {
      return { cost: 0, validTiles: [], lockedLevel: CATALOG[toolId]?.unlockLevel || 1 };
    }
    if ((toolId === 'interchange_diamond' || toolId === 'interchange_rbt') && tiles && tiles.length > 0) {
      const prev = this.previewInterchange(toolId, tiles[0].x, tiles[0].z, opts?.rot || 0);
      return { cost: prev.valid ? prev.cost : 0, validTiles: prev.valid ? prev.tiles : [] };
    }

    const oneWayDirs = toolId === 'road_oneway' ? this._inferOneWayDirs(tiles, opts) : null;

    for (let k = 0; k < tiles.length; k++) {
      const pos = tiles[k];
      const t = this.getTile(pos.x, pos.z);
      if (!t) continue;
      const wet = this.isWaterTile(pos.x, pos.z);
      const { slope } = this.getTileMinMaxElev(pos.x, pos.z);

      const onRunway = this.isBlockedByAirportRunway(pos.x, pos.z);

      if (toolId === 'road_1' || toolId === 'road_2') {
        const target = toolId === 'road_1' ? 1 : 2;
        if (onRunway || t.roadGround === 3 || t.dam) continue;
        if (slope > 0.72 && !wet) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        if (t.roadGround === target && (typeof t.roadDir !== 'number' || t.roadDir < 0) && (!wet || t.roadBridge)) continue;
        cost += wet ? CATALOG[toolId].bridgeCost : CATALOG[toolId].cost;
        validTiles.push(pos);
      } else if (toolId === 'road_oneway') {
        if (onRunway || t.roadGround === 3 || t.dam) continue;
        if (slope > 0.72 && !wet) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        const targetDir = oneWayDirs[k];
        if (t.roadGround === 1 && t.roadDir === targetDir && (!wet || t.roadBridge)) continue;
        cost += wet ? CATALOG.road_oneway.bridgeCost : CATALOG.road_oneway.cost;
        validTiles.push({ x: pos.x, z: pos.z, dir: targetDir });
      } else if (toolId === 'bus_stop') {
        if (t.roadGround < 1 || t.roadGround === 3 || t.roadGround === 4 || t.dam || t.ramp || t.busStop) continue;
        cost += CATALOG.bus_stop.cost;
        validTiles.push(pos);
      } else if (toolId === 'road_elev') {
        if (onRunway || t.roadElevated === 1 || t.dam) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        cost += CATALOG.road_elev.cost;
        validTiles.push(pos);
      } else if (toolId === 'road_ramp') {
        if (onRunway || t.ramp || t.dam || wet || t.roadGround === 3 || t.rail > 0 || (t.building && !BUILDING_NAMES[t.building.type])) continue;
        cost += CATALOG.road_ramp.cost;
        validTiles.push(pos);
      } else if (toolId === 'road_tunnel') {
        if (wet || t.dam || t.roadGround === 4) continue;
        cost += CATALOG.road_tunnel.cost;
        validTiles.push(pos);
      } else if (toolId === 'metro_line') {
        if (t.metro) continue;
        cost += CATALOG.metro_line.cost;
        validTiles.push(pos);
      } else if (toolId === 'rail_track') {
        if (onRunway || t.rail >= 1 || t.dam) continue;
        if (t.building && t.building.type !== 'hsr_station') continue;
        cost += wet ? CATALOG.rail_track.bridgeCost : CATALOG.rail_track.cost;
        validTiles.push(pos);
      } else if (toolId === 'water_pipe') {
        if (t.pipe && !t.pipeBroken) continue;
        cost += CATALOG.water_pipe.cost;
        validTiles.push(pos);
      } else if (toolId === 'hydro_dam') {
        if (onRunway || t.roadGround === 3 || t.rail === 2) continue;
        cost += CATALOG.hydro_dam.cost;
        validTiles.push(pos);
      } else if (toolId === 'power_pylon') {
        if (onRunway || wet || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.building || t.pylon || t.dam) continue;
        cost += CATALOG.power_pylon.cost;
        validTiles.push(pos);
      } else if (toolId.startsWith('zone_')) {
        const zType = toolId.slice(5);
        // Prevent zoning under elevated viaducts, ramps, mid-slip ramp flanks, rails, or airport runways!
        if (onRunway || wet || slope > 0.62 || t.roadGround > 0 || t.roadElevated > 0 || t.ramp || t.rail > 0 || t.dam || t.pylon) continue;
        if (this._isBlockedByMidSlipFlank(pos.x, pos.z)) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        if (t.zone === zType && (!t.building || !t.building.abandoned)) continue;
        cost += CATALOG[toolId].cost;
        validTiles.push(pos);
      } else if (toolId === 'dezone') {
        if (t.zone) validTiles.push(pos);
      } else if (toolId === 'bulldoze') {
        if (t.roadGround === 3 || t.rail === 2) continue;
        if (t.roadGround > 0 || t.roadElevated > 0 || t.ramp || t.rail > 0 || t.dam || t.pylon || t.building || t.zone || t.busStop) {
          cost += CATALOG.bulldoze.cost;
          validTiles.push(pos);
        }
      } else if (toolId === 'bulldoze_under') {
        if (t.pipe || t.metro || t.roadGround === 4) {
          cost += CATALOG.bulldoze_under.cost;
          validTiles.push(pos);
        }
      } else if (CATALOG[toolId]) {
        const hasFixedBuilding = Boolean(t.building && !BUILDING_NAMES[t.building.type]);
        if (onRunway || this._isBlockedByMidSlipFlank(pos.x, pos.z)) continue;
        if (toolId === 'airport') {
          const apPrev = this.previewAirportFootprint(pos.x, pos.z, opts?.rot || 0);
          if (!apPrev.valid) continue;
        } else if (toolId === 'water_pump' || toolId === 'sewage_out') {
          const nearW = this.hasNearbyWater(pos.x, pos.z, 2);
          if (!nearW.found || hasFixedBuilding || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.dam) continue;
        } else if (toolId === 'nuclear_plant' || toolId === 'seaport') {
          const nearW = this.hasNearbyWater(pos.x, pos.z, 2);
          if (wet || !nearW.found || hasFixedBuilding || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.dam) continue;
        } else {
          const railBlocked = t.rail > 0 && toolId !== 'hsr_station';
          if (wet || slope > 0.65 || t.roadGround > 0 || t.roadElevated > 0 || railBlocked || hasFixedBuilding || t.dam) continue;
        }
        cost += CATALOG[toolId].cost;
        validTiles.push(pos);
      }
    }

    if (this.difficulty === 'sandbox') cost = 0;
    return { cost, validTiles };
  }

  applyTool(toolId, tiles, free = false, opts = null) {
    if ((toolId === 'interchange_diamond' || toolId === 'interchange_rbt') && tiles && tiles.length > 0) {
      return this.placeInterchange(toolId, tiles[0].x, tiles[0].z, opts?.rot || 0, free);
    }

    if (!free && !this.isToolUnlocked(toolId)) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`🔒 需升至市长等级 Lv.${CATALOG[toolId]?.unlockLevel || 1} 解锁【${CATALOG[toolId]?.name}】！`);
      return { ok: false };
    }

    const savedUnlock = this.unlockAll;
    if (free) this.unlockAll = true;
    const { cost, validTiles } = this.estimateAction(toolId, tiles, opts);
    this.unlockAll = savedUnlock;

    if (validTiles.length === 0) {
      if (!free && (toolId === 'water_pump' || toolId === 'sewage_out')) {
        this.emitToast('💧 抽水站与排污口必须建在河岸或海边（2格内有水）！');
      } else if (!free && toolId === 'nuclear_plant') {
        this.emitToast('☢️ 核裂变发电站必须建在河岸或海湾陆地上（2格内有冷却水）！');
      } else if (!free && toolId === 'seaport') {
        this.emitToast('🚢 深水集装箱海港必须建在海湾或深水河岸陆地上（2格内有水域）！');
      } else if (!free && toolId === 'airport') {
        const apPrev = tiles && tiles[0] ? this.previewAirportFootprint(tiles[0].x, tiles[0].z, opts?.rot || 0) : null;
        this.emitToast(`✈️ ${apPrev?.reason || '国际机场后方需预留 5 格净空平坦跑道（点击旋转方向）！'}`);
      } else if (!free && tiles && tiles.some((p) => this.isBlockedByAirportRunway(p.x, p.z))) {
        this.emitToast('✈️ 该地块位于国际机场 5 格跑道净空区内，严禁修建铁塔、道路或建筑！');
      } else if (!free && toolId === 'bus_stop') {
        this.emitToast('🚏 智能公交站必须建在普通地面街道或主干道上（不可建在隧道/大坝/匝道上）！');
      }
      return { ok: false };
    }
    const isBulldozeTool = toolId === 'bulldoze' || toolId === 'bulldoze_under';
    if (!free && this.difficulty !== 'sandbox' && !isBulldozeTool && this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`💰 国库资金不足（需 ¥${cost.toLocaleString()}）！可前往【📊 财政】申请市政贷款`);
      return { ok: false };
    }

    if (!free) {
      this.pushUndoSnapshot(CATALOG[toolId]?.name || toolId);
    }

    if (!free && this.difficulty !== 'sandbox') {
      if (isBulldozeTool && this.money < cost) {
        this.money -= Math.max(0, Math.min(this.money, cost));
      } else {
        this.money -= cost;
      }
    }

    let uniformDamCrest = 1.2;
    if (toolId === 'hydro_dam') {
      let maxBank = 0.6;
      for (const p of validTiles) {
        const e = this.getTileElev(p.x, p.z) + this.waterDepth[idx(p.x, p.z)];
        if (e > maxBank) maxBank = e;
      }
      const first = validTiles[0];
      const last = validTiles[validTiles.length - 1];
      maxBank = Math.max(maxBank, this.getTileElev(first.x, first.z) + 0.35, this.getTileElev(last.x, last.z) + 0.35);
      uniformDamCrest = Math.min(3.2, Math.max(0.85, maxBank + 0.22));
    }

    let gradedAny = false;
    const gradeFlat = (gx, gz, strength = 0.78) => {
      if (this.isWaterTile(gx, gz)) return;
      const c = this.corners;
      const i00 = cIdx(gx, gz), i10 = cIdx(gx + 1, gz);
      const i01 = cIdx(gx, gz + 1), i11 = cIdx(gx + 1, gz + 1);
      const avg = (c[i00] + c[i10] + c[i01] + c[i11]) * 0.25;
      c[i00] += (avg - c[i00]) * strength;
      c[i10] += (avg - c[i10]) * strength;
      c[i01] += (avg - c[i01]) * strength;
      c[i11] += (avg - c[i11]) * strength;
      gradedAny = true;
    };

    // Smooth longitudinal path grading for roads, ramps & rail: eliminates terrace staircases while preserving natural uphill/downhill slopes!
    const gradeSmoothPath = (pathTiles) => {
      const c = this.corners;
      const M = pathTiles.length;
      if (M === 0) return;

      if (M === 1) {
        const { x, z } = pathTiles[0];
        if (this.isWaterTile(x, z)) return;
        const i00 = cIdx(x, z), i10 = cIdx(x + 1, z);
        const i01 = cIdx(x, z + 1), i11 = cIdx(x + 1, z + 1);
        const hasRoadX = (this.getTile(x - 1, z)?.roadGround > 0) || (this.getTile(x + 1, z)?.roadGround > 0);
        const hasRoadZ = (this.getTile(x, z - 1)?.roadGround > 0) || (this.getTile(x, z + 1)?.roadGround > 0);
        if (hasRoadX && !hasRoadZ) {
          // Preserve X longitudinal slope, gently level Z cross-tilt
          const m0 = (c[i00] + c[i01]) * 0.5;
          const m1 = (c[i10] + c[i11]) * 0.5;
          c[i00] += (m0 - c[i00]) * 0.45;
          c[i01] += (m0 - c[i01]) * 0.45;
          c[i10] += (m1 - c[i10]) * 0.45;
          c[i11] += (m1 - c[i11]) * 0.45;
        } else if (hasRoadZ && !hasRoadX) {
          // Preserve Z longitudinal slope, gently level X cross-tilt
          const m0 = (c[i00] + c[i10]) * 0.5;
          const m1 = (c[i01] + c[i11]) * 0.5;
          c[i00] += (m0 - c[i00]) * 0.45;
          c[i10] += (m0 - c[i10]) * 0.45;
          c[i01] += (m1 - c[i01]) * 0.45;
          c[i11] += (m1 - c[i11]) * 0.45;
        } else {
          // Remove quad saddle twist without flattening natural slope
          const twist = (c[i00] + c[i11] - c[i10] - c[i01]) * 0.25;
          c[i00] -= twist * 0.6;
          c[i11] -= twist * 0.6;
          c[i10] += twist * 0.6;
          c[i01] += twist * 0.6;
        }
        gradedAny = true;
        return;
      }

      const rawH = new Float32Array(M);
      for (let k = 0; k < M; k++) {
        rawH[k] = this.getTileElev(pathTiles[k].x, pathTiles[k].z);
      }
      const smoothH = new Float32Array(rawH);
      for (let pass = 0; pass < 2; pass++) {
        const tmp = new Float32Array(smoothH);
        for (let k = 1; k < M - 1; k++) {
          tmp[k] = smoothH[k - 1] * 0.25 + smoothH[k] * 0.50 + smoothH[k + 1] * 0.25;
        }
        smoothH.set(tmp);
      }

      const cornerSum = new Map();
      const cornerCnt = new Map();
      const addCornerTarget = (ci, val) => {
        cornerSum.set(ci, (cornerSum.get(ci) || 0) + val);
        cornerCnt.set(ci, (cornerCnt.get(ci) || 0) + 1);
      };

      for (let k = 0; k < M; k++) {
        const p = pathTiles[k];
        if (this.isWaterTile(p.x, p.z)) continue;
        if (toolId === 'rail_track' && this.getTile(p.x, p.z)?.roadGround > 0) continue;

        const pPrev = pathTiles[Math.max(0, k - 1)];
        const pNext = pathTiles[Math.min(M - 1, k + 1)];
        const tx = pNext.x - pPrev.x;
        const tz = pNext.z - pPrev.z;
        const tLen = Math.hypot(tx, tz) || 1;
        const ux = tx / tLen;
        const uz = tz / tLen;

        const hPrev = smoothH[Math.max(0, k - 1)];
        const hNext = smoothH[Math.min(M - 1, k + 1)];
        const dStep = (k > 0 ? Math.hypot(p.x - pPrev.x, p.z - pPrev.z) : 0) +
                      (k < M - 1 ? Math.hypot(pNext.x - p.x, pNext.z - p.z) : 0);
        const dhDs = dStep > 0.01 ? (hNext - hPrev) / dStep : 0;

        const i00 = cIdx(p.x, p.z), i10 = cIdx(p.x + 1, p.z);
        const i01 = cIdx(p.x, p.z + 1), i11 = cIdx(p.x + 1, p.z + 1);
        const gradX = ((c[i10] - c[i00]) + (c[i11] - c[i01])) * 0.5;
        const gradZ = ((c[i01] - c[i00]) + (c[i11] - c[i10])) * 0.5;
        // Keep only 35% of transverse cross-tilt so hillside road deck stays comfortably level sideways
        const crossSlope = gradX * (-uz) + gradZ * ux;

        const offsets = [
          [i00, -0.5, -0.5],
          [i10,  0.5, -0.5],
          [i01, -0.5,  0.5],
          [i11,  0.5,  0.5]
        ];
        for (const [ci, ox, oz] of offsets) {
          const sOff = ox * ux + oz * uz;
          const tOff = ox * (-uz) + oz * ux;
          const ideal = smoothH[k] + sOff * dhDs + tOff * crossSlope * 0.35;
          addCornerTarget(ci, ideal);
        }
      }

      for (const [ci, sumVal] of cornerSum.entries()) {
        const target = sumVal / cornerCnt.get(ci);
        c[ci] += (target - c[ci]) * 0.68;
        gradedAny = true;
      }
    };

    if (toolId === 'road_1' || toolId === 'road_2' || toolId === 'road_oneway' || toolId === 'road_ramp' || toolId === 'rail_track') {
      gradeSmoothPath(validTiles);
    }

    for (const pos of validTiles) {
      const t = this.getTile(pos.x, pos.z);
      if (!t) continue;

      if (toolId === 'road_1' || toolId === 'road_2') {
        t.roadGround = toolId === 'road_1' ? 1 : 2;
        t.roadDir = -1;
        t.roadBridge = this.isWaterTile(pos.x, pos.z);
        t.zone = null;
        t.building = null;
        t.pylon = false;
        t.trees = 0;
      } else if (toolId === 'road_oneway') {
        t.roadGround = 1;
        t.roadDir = typeof pos.dir === 'number' ? pos.dir : 3;
        t.roadBridge = this.isWaterTile(pos.x, pos.z);
        t.zone = null;
        t.building = null;
        t.pylon = false;
        t.trees = 0;
      } else if (toolId === 'bus_stop') {
        t.busStop = true;
      } else if (toolId === 'road_elev') {
        t.roadElevated = 1;
        if (t.building && BUILDING_NAMES[t.building.type]) t.building = null;
        t.zone = null;
        t.pylon = false;
        t.trees = 0;
      } else if (toolId === 'road_ramp') {
        if (t.roadGround === 0) t.roadGround = 2;
        t.roadDir = -1;
        t.busStop = false;
        t.roadElevated = 1;
        t.ramp = true;
        t.zone = null;
        t.building = null;
        t.pylon = false;
        t.trees = 0;
        // Clear zoned R/C/I/O parcels on immediate flanks if this ramp sits mid-viaduct (mid_slip side slip-ramps)
        const ewMid = (this.getTile(pos.x - 1, pos.z)?.roadElevated || 0) > 0 && (this.getTile(pos.x + 1, pos.z)?.roadElevated || 0) > 0;
        const nsMid = (this.getTile(pos.x, pos.z - 1)?.roadElevated || 0) > 0 && (this.getTile(pos.x, pos.z + 1)?.roadElevated || 0) > 0;
        if (ewMid || nsMid) {
          const flanks = ewMid ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]];
          for (const [fx, fz] of flanks) {
            const ft = this.getTile(pos.x + fx, pos.z + fz);
            if (ft) {
              ft.zone = null;
              if (ft.building && BUILDING_NAMES[ft.building.type]) ft.building = null;
              ft.trees = 0;
            }
          }
        }
      } else if (toolId === 'road_tunnel') {
        t.roadGround = 4;
        t.roadDir = -1;
        t.busStop = false;
        t.trees = 0;
      } else if (toolId === 'metro_line') {
        t.metro = true;
      } else if (toolId === 'rail_track') {
        t.rail = 1;
        t.zone = null;
        t.pylon = false;
        if (t.building && t.building.type !== 'hsr_station') t.building = null;
        t.trees = 0;
      } else if (toolId === 'water_pipe') {
        t.pipe = true;
        t.pipeBroken = false;
      } else if (toolId === 'hydro_dam') {
        t.dam = true;
        t.damCrest = uniformDamCrest;
        t.damHealth = 100;
        t.damStress = 0;
        t.roadGround = 2;
        t.roadDir = -1;
        t.banTrucks = false;
        t.busStop = false;
        t.zone = null;
        t.building = null;
        t.trees = 0;
      } else if (toolId === 'power_pylon') {
        t.pylon = true;
        t.zone = null;
        t.trees = 0;
      } else if (toolId.startsWith('zone_')) {
        const zType = toolId.slice(5);
        if ((t.zone !== zType || t.building?.abandoned) && t.building && BUILDING_NAMES[t.building.type]) {
          t.building = null;
        }
        t.zone = zType;
        t.trees = 0;
      } else if (toolId === 'dezone') {
        t.zone = null;
        if (t.building && BUILDING_NAMES[t.building.type]) t.building = null;
      } else if (toolId === 'bulldoze') {
        if (t.roadElevated > 0 && (t.roadGround > 0 || t.rail > 0 || t.building)) {
          // Smart Layer-Priority Bulldoze: remove elevated viaduct/ramp FIRST, preserving ground street/rail!
          t.roadElevated = 0;
          t.ramp = false;
        } else if (t.busStop && t.roadGround > 0) {
          // Remove roadside bus stop shelter first, preserving the underlying street!
          t.busStop = false;
        } else {
          if (t.roadGround !== 3) {
            t.roadGround = 0;
            t.roadBridge = false;
            t.roadDir = -1;
            t.banTrucks = false;
            t.busStop = false;
            t.junctionMode = null;
            t.roundaboutPaid = false;
          }
          t.roadElevated = 0;
          t.ramp = false;
          if (t.rail !== 2) t.rail = 0;
          t.dam = false;
          t.damOutputMW = 0;
          t.damHealth = 100;
          t.damStress = 0;
          t.pylon = false;
          if (!t.building) t.zone = null;
          t.building = null;
        }
      } else if (toolId === 'bulldoze_under') {
        t.pipe = false;
        t.pipeBroken = false;
        t.metro = false;
        if (t.roadGround === 4) t.roadGround = 0;
      } else if (CATALOG[toolId]) {
        gradeFlat(pos.x, pos.z, 0.85);
        const acc = this.findRoadAccess(pos.x, pos.z);
        t.zone = null;
        t.pylon = false;
        t.trees = 0;
        if (toolId === 'water_pump' || toolId === 'sewage_out' || toolId === 'water_treat') {
          t.pipe = true;
          t.pipeBroken = false;
        }
        if (toolId === 'metro_station') t.metro = true;
        if (toolId === 'hsr_station') t.rail = 1;
        const manualRot = (opts && typeof opts.rot === 'number') ? opts.rot : 0;
        const bRot = ((acc ? acc.rot : 0) + manualRot) & 3;
        if (toolId === 'airport') {
          // Clear trees/pylons/zones across the rotated 5-tile runway corridor & gently grade so tarmac never clips!
          const strip = this.getAirportRunwayTiles(pos.x, pos.z, bRot);
          for (const rt of strip) {
            if (!inBounds(rt.x, rt.z)) continue;
            const cell = this.grid[idx(rt.x, rt.z)];
            if (cell) {
              cell.trees = 0;
              cell.pylon = false;
              cell.zone = null;
            }
            gradeFlat(rt.x, rt.z, 0.72);
          }
          const rc = Math.round(Math.cos(bRot * Math.PI * 0.5));
          const rs = Math.round(Math.sin(bRot * Math.PI * 0.5));
          for (const lx of [-1, 1]) {
            const at = this.getTile(pos.x + lx * rc, pos.z - lx * rs);
            if (at) at.trees = 0;
          }
        }
        t.building = {
          type: toolId,
          level: 1,
          variant: Math.floor(hash2D(pos.x, pos.z, this.seed + 99) * 8),
          rot: bRot,
          underConstruction: false,
          buildProgress: 1,
          upgradeProgress: 0,
          fire: 0,
          sick: false,
          trashPiled: false,
          flooded: false,
          abandoned: false,
          distress: 0,
          abandonReason: ''
        };
      }
    }

    if (toolId === 'bulldoze') {
      this._pruneDeletedBusStops();
      const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const pos of validTiles) {
        for (const [dx, dz] of [[0, 0], ...dirs4]) {
          const nt = this.getTile(pos.x + dx, pos.z + dz);
          if (!nt || nt.roadGround <= 0) continue;
          let deg = 0;
          for (const [qx, qz] of dirs4) {
            if ((this.getTile(nt.x + qx, nt.z + qz)?.roadGround || 0) > 0) deg++;
          }
          if (deg < 3 && nt.junctionMode && nt.junctionMode !== 'signal') {
            nt.junctionMode = 'signal';
            nt.roundaboutPaid = false;
          }
        }
      }
    }

    if (gradedAny && this.waterPhysics) {
      this.waterPhysics.refreshCellElevations();
    }

    const prevSuppress = this._suppressPromotions;
    if (free) this._suppressPromotions = true;
    this.recomputeNetworksAndFields();
    this._suppressPromotions = prevSuppress;
    if (gradedAny) this.terrainDirty = true;
    if (
      toolId.startsWith('road_') || toolId === 'bus_stop' || toolId === 'rail_track' || toolId === 'water_pipe' ||
      toolId === 'metro_line' || toolId === 'power_line' || toolId === 'hydro_dam'
    ) {
      this.infraDirty = true;
      this.forestDirty = true;
      if (toolId === 'road_ramp') this.buildingDirty = true;
    } else if (toolId.startsWith('zone_') || toolId === 'dezone') {
      this.buildingDirty = true;
      this.forestDirty = true;
    } else if (toolId.startsWith('bulldoze')) {
      this.infraDirty = true;
      this.forestDirty = true;
      this.buildingDirty = true;
    } else {
      this.buildingDirty = true;
      this.forestDirty = true;
      if (toolId === 'hsr_station' || toolId === 'metro_station') this.infraDirty = true;
    }

    if (
      (toolId.startsWith('road_') || toolId === 'bus_stop' || toolId.startsWith('bulldoze') || toolId === 'hydro_dam' || toolId === 'rail_track' || toolId === 'metro_line') &&
      this.traffic && typeof this.traffic.refreshRoadGraph === 'function'
    ) {
      this.traffic.refreshRoadGraph();
    }

    if (!free && this.sfx) {
      if (toolId.startsWith('road_')) this.sfx.road();
      else if (toolId === 'water_pipe' || toolId === 'metro_line') this.sfx.pipe();
      else if (toolId === 'rail_track' || toolId === 'hsr_station') this.sfx.rail();
      else if (toolId.startsWith('zone_') || toolId === 'dezone') this.sfx.zone();
      else if (toolId.startsWith('bulldoze')) this.sfx.bulldoze();
      else this.sfx.buildCivic();
    }

    if (!free) {
      if (
        toolId === 'road_1' || toolId === 'road_2' || toolId === 'road_oneway' || toolId === 'road_elev' ||
        toolId === 'road_ramp' || toolId === 'road_tunnel' || toolId === 'water_pipe' ||
        toolId === 'metro_line' || toolId === 'rail_track' || toolId === 'power_pylon'
      ) {
        this.addXP(validTiles.length * 1, toolId);
      } else if (toolId === 'bus_stop') {
        this.addXP(validTiles.length * 15, '智能公交站');
      } else if (toolId === 'hydro_dam') {
        this.addXP(validTiles.length * 40, '水力发电大坝');
      } else if (!toolId.startsWith('zone_') && toolId !== 'dezone' && !toolId.startsWith('bulldoze') && CATALOG[toolId]) {
        const bXp = Math.min(120, Math.max(35, Math.round((CATALOG[toolId]?.cost || 1000) / 35)));
        this.addXP(bXp * validTiles.length, CATALOG[toolId]?.name || toolId);
      }
      this.checkMayorQuests();
    }

    return { ok: true, count: validTiles.length, cost };
  }

  takeLoan(loanId) {
    const offer = LOAN_OFFERS.find((l) => l.id === loanId);
    if (!offer) return false;
    if (!this.unlockAll && this.difficulty !== 'sandbox' && (this.mayorLevel || 1) < (offer.unlockLevel || 2)) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`🔒 需升至市长等级 Lv.${offer.unlockLevel || 2} 解锁【${offer.name}】！`);
      return false;
    }
    if (this.activeLoans.some((l) => l.id === loanId)) {
      this.emitToast('该项债券尚未还清，请先偿还后再借');
      return false;
    }
    this.money += offer.principal;
    this.activeLoans.push({
      id: offer.id,
      name: offer.name,
      remaining: offer.totalRepay,
      periodPay: offer.periodPay
    });
    if (this.sfx) this.sfx.buildCivic();
    this.emitToast(`🏦 已获批【${offer.name}】+¥${offer.principal.toLocaleString()}！注意每期利息扣款`);
    return true;
  }

  repayLoan(loanId) {
    const idxLoan = this.activeLoans.findIndex((l) => l.id === loanId);
    if (idxLoan === -1) return false;
    const loan = this.activeLoans[idxLoan];
    if (this.money < loan.remaining) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`资金不足以提前结清（需 ¥${loan.remaining.toLocaleString()}）`);
      return false;
    }
    this.money -= loan.remaining;
    this.activeLoans.splice(idxLoan, 1);
    if (this.sfx) this.sfx.milestone();
    this.emitToast(`✅ 已提前还清【${loan.name}】，财政无债一身轻！`);
    return true;
  }

  recomputeNetworksAndFields() {
    const N = this.grid.length;
    const svcMult = this.budgets.service / 100;
    const pwrMult = this.budgets.power / 100;
    const wtrMult = this.budgets.water / 100;
    const energyDemMult = this.policies.energySubsidy ? 0.85 : 1.0;

    let activeBusStops = 0;
    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const elev = this.getTileElev(t.x, t.z);
      const nearW = this.hasNearbyWater(t.x, t.z, 2);
      t.powered = false;
      t.watered = false;
      t.outsideConnected = false;
      t.pollution = 0;
      t.noise = 0;
      t.serviceScore = 0;
      t.education = 0;
      t.crimeSafety = 0;
      t.fireSafety = 0;
      t.landValue = 22 + (nearW.found && nearW.poll <= 0.35 ? 14 : 0) + (elev > 0.7 && elev < 2.0 ? 9 : 0);
      if (t.busStop && t.roadGround >= 1 && t.roadGround !== 3 && t.roadGround !== 4 && !t.dam && !t.ramp) {
        activeBusStops++;
      }
    }

    // ==================== PHASE A: Power Generation & HV Power Grid BFS ====================
    const powerSources = [];
    let totalPowerOut = (this.hydroPowerMW || 0) * pwrMult;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.dam) powerSources.push({ x, z });

        const b = t.building;
        if (!b || b.abandoned || b.underConstruction || b.flooded || b.fire > 0.3) continue;

        if (b.type === 'power_wind') {
          const elevBoost = Math.min(1.4, 0.9 + Math.max(0, this.getTileElev(x, z)) * 0.22);
          totalPowerOut += CATALOG.power_wind.powerOut * elevBoost * pwrMult;
          powerSources.push({ x, z });
        } else if (b.type === 'solar_plant') {
          totalPowerOut += CATALOG.solar_plant.powerOut * pwrMult;
          powerSources.push({ x, z });
        } else if (b.type === 'power_plant') {
          if (this.findRoadAccess(x, z)) {
            totalPowerOut += CATALOG.power_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        } else if (b.type === 'nuclear_plant') {
          if (this.findRoadAccess(x, z) && this.hasNearbyWater(x, z, 2).found) {
            totalPowerOut += CATALOG.nuclear_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        } else if (b.type === 'waste_plant') {
          if (this.findRoadAccess(x, z)) {
            totalPowerOut += CATALOG.waste_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        }
      }
    }

    this.powerSupply = Math.round(totalPowerOut);
    if (powerSources.length > 0 && totalPowerOut > 0) {
      const pVis = new Uint8Array(N);
      const pQueue = [];
      for (const s of powerSources) {
        const si = idx(s.x, s.z);
        if (!pVis[si]) {
          pVis[si] = 1;
          pQueue.push(si);
        }
      }

      let head = 0;
      let pUsed = 0;
      while (head < pQueue.length) {
        const ci = pQueue[head++];
        const ct = this.grid[ci];
        const need = (this.getBuildingStats(ct.building).power || 0) * energyDemMult;

        if (pUsed + need <= totalPowerOut) {
          ct.powered = true;
          pUsed += need;
        } else if (need === 0) {
          ct.powered = true;
        }

        const rad = ct.pylon ? 6 : 3;
        const r2 = rad * rad;
        for (let dz = -rad; dz <= rad; dz++) {
          for (let dx = -rad; dx <= rad; dx++) {
            if (dx * dx + dz * dz > r2) continue;
            const nx = ct.x + dx, nz = ct.z + dz;
            if (!inBounds(nx, nz)) continue;
            const ni = idx(nx, nz);
            if (pVis[ni]) continue;
            const nt = this.grid[ni];
            if (nt.pylon || nt.building || nt.zone || nt.dam) {
              pVis[ni] = 1;
              pQueue.push(ni);
            }
          }
        }
      }
    }

    // ==================== Intercity Outside Connection 2-Layer Road BFS ====================
    {
      const visG = new Uint8Array(N);
      const visE = new Uint8Array(N);
      const outQ = [];
      let portalCount = 0;
      let hubSeedCount = 0;

      for (let i = 0; i < N; i++) {
        const t = this.grid[i];
        if (t.roadGround === 3) {
          portalCount++;
          if (!visG[i]) {
            visG[i] = 1;
            outQ.push(i * 2);
          }
        }
        const b = t.building;
        if (
          b && !b.abandoned && !b.underConstruction && !b.flooded && !(b.fire > 0.3) && t.powered &&
          (b.type === 'hsr_station' || b.type === 'airport' || (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found))
        ) {
          const acc = this.findRoadAccess(t.x, t.z);
          if (acc) {
            const ri = idx(acc.rx, acc.rz);
            hubSeedCount++;
            if (!visG[ri]) {
              visG[ri] = 1;
              outQ.push(ri * 2);
            }
          }
        }
      }

      if (portalCount === 0 && hubSeedCount === 0) {
        // Safety fallback for synthetic unit test maps without highway portals
        for (let i = 0; i < N; i++) {
          const t = this.grid[i];
          if (t.roadGround > 0 || t.roadElevated > 0) t.outsideConnected = true;
        }
      } else {
        const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let oHead = 0;
        while (oHead < outQ.length) {
          const code = outQ[oHead++];
          const ci = code >> 1;
          const layer = code & 1;
          const ct = this.grid[ci];

          if (ct.ramp) {
            if (layer === 0 && ct.roadElevated > 0 && !visE[ci]) {
              visE[ci] = 1;
              outQ.push(ci * 2 + 1);
            } else if (layer === 1 && ct.roadGround > 0 && !visG[ci]) {
              visG[ci] = 1;
              outQ.push(ci * 2);
            }
          }

          for (const [dx, dz] of dirs4) {
            const nx = ct.x + dx, nz = ct.z + dz;
            if (!inBounds(nx, nz)) continue;
            const ni = idx(nx, nz);
            const nt = this.grid[ni];
            if (layer === 0) {
              if (nt.roadGround > 0 && !visG[ni]) {
                visG[ni] = 1;
                outQ.push(ni * 2);
              }
            } else if (nt.roadElevated > 0 && !visE[ni]) {
              visE[ni] = 1;
              outQ.push(ni * 2 + 1);
            }
          }
        }

        for (let i = 0; i < N; i++) {
          const t = this.grid[i];
          if (t.roadGround > 0) t.outsideConnected = Boolean(visG[i]);
          else if (t.roadElevated > 0) t.outsideConnected = Boolean(visE[i]);
        }
      }
    }

    // ==================== Polluted Riverbank Odor Seepage ====================
    {
      const seepPol = new Float32Array(N);
      const seepLV = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        if (this.waterDepth[i] > 0.08 && this.waterPoll[i] > 0.38) {
          const wp = this.waterPoll[i];
          const wx = i % GRID_SIZE;
          const wz = (i / GRID_SIZE) | 0;
          const basePol = Math.round(wp * 22);
          for (let dz = -2; dz <= 2; dz++) {
            for (let dx = -2; dx <= 2; dx++) {
              const d2 = dx * dx + dz * dz;
              if (d2 > 5) continue;
              const nx = wx + dx, nz = wz + dz;
              if (!inBounds(nx, nz)) continue;
              const falloff = 1 - Math.sqrt(d2) / 2.8;
              const ni = idx(nx, nz);
              seepPol[ni] = Math.min(36, seepPol[ni] + basePol * falloff);
              seepLV[ni] = Math.max(-22, seepLV[ni] - 10 * falloff);
            }
          }
        }
      }
      for (let i = 0; i < N; i++) {
        if (seepPol[i] > 0 || seepLV[i] < 0) {
          this.grid[i].pollution += seepPol[i];
          this.grid[i].landValue += seepLV[i];
        }
      }
    }

    // ==================== PHASE B: Powered Water/Sewage/Waste, Acoustic Noise & Road-Reachable Civic Services ====================
    const waterNodes = [];
    let totalWaterOut = 0;
    let totalSewageCap = 0;
    let totalTrashCap = 0;
    let pollutedWaterIntake = 0;
    let landmarkBonus = 0;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.roadGround === 2) this.addRadialField(x, z, 3, 5, 0, 0, 0, 0, 0);

        // Acoustic Noise Map: roads, viaducts, highways (truck-ban cuts road noise by 55%!) & forest buffers
        if (t.roadGround === 3 || t.roadElevated > 0) {
          this.addNoiseField(x, z, 3, 26);
        }
        if (t.roadGround >= 1 && t.roadGround !== 4) {
          let rdNoise = (t.roadGround >= 2 ? 12 : 6) + 30 * (t.congestion || 0);
          if (t.banTrucks) rdNoise *= 0.45; // -55% heavy truck acoustic noise reduction!
          this.addNoiseField(x, z, t.roadGround >= 2 ? 3 : 2, rdNoise);
        }
        if (t.trees > 0) {
          this.addNoiseField(x, z, 2, -(4 + t.trees * 2));
        }
        if (activeBusStops >= 2 && t.busStop && t.roadGround >= 1 && t.roadGround !== 3 && t.roadGround !== 4 && !t.dam && !t.ramp) {
          this.addRadialField(x, z, 4, 6, 0, 10, 0, 0, 0);
        }

        const b = t.building;
        if (!b) continue;

        if (b.abandoned) {
          // Abandoned ruins drag down surrounding land value & breed crime!
          this.addRadialField(x, z, 4, -16, 4, 0, 0, 0, -15);
          continue;
        }

        const operational = !b.underConstruction && !b.flooded && !(b.fire > 0.3);

        if (b.type === 'power_plant') {
          if (operational && this.findRoadAccess(x, z)) {
            this.addRadialField(x, z, 6, -18, 36, 0, 0, 0, 0);
            this.addNoiseField(x, z, 4, 24);
          }
        } else if (b.type === 'solar_plant') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 5, 4, 0, 8, 0, 0, 0);
          }
        } else if (b.type === 'nuclear_plant') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 6, -6, 0, 10, 0, 0, 0);
          }
        } else if (b.type === 'waste_plant') {
          const hasRd = Boolean(this.findRoadAccess(x, z));
          if (operational && t.powered && hasRd) {
            totalTrashCap += CATALOG.waste_plant.trashCap * svcMult;
          }
          const wPolMult = (this.policies.greenEnergy ? 0.75 : 1.0) * (this.policies.greenCity ? 0.65 : 1.0);
          const wPol = Math.round(16 * Math.max(0.45, wPolMult));
          this.addRadialField(x, z, 5, -10, wPol, (operational && t.powered && hasRd) ? 14 * svcMult : 0, 0, 0, 0);
          if (operational && t.powered && hasRd) {
            this.addNoiseField(x, z, 4, 20);
          }
        } else if (b.type === 'water_pump') {
          if (operational && t.powered) {
            const nw = this.hasNearbyWater(x, z, 2);
            if (nw.found) {
              const out = CATALOG.water_pump.waterOut * wtrMult;
              totalWaterOut += out;
              pollutedWaterIntake += out * nw.poll;
              waterNodes.push({ x, z });
            }
          }
        } else if (b.type === 'sewage_out') {
          if (operational && t.powered) {
            const nw = this.hasNearbyWater(x, z, 2);
            if (nw.found) {
              totalSewageCap += CATALOG.sewage_out.sewageCap * wtrMult;
              waterNodes.push({ x, z });
              this.addRadialField(x, z, 5, -20, 30, 0, 0, 0, 0);
            }
          }
        } else if (b.type === 'water_treat') {
          if (operational && t.powered) {
            totalWaterOut += CATALOG.water_treat.waterOut * wtrMult;
            totalSewageCap += CATALOG.water_treat.sewageCap * wtrMult;
            waterNodes.push({ x, z });
          }
        } else if (b.type === 'fire_station') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(12 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 8, 12 * svcMult, 70 * svcMult, 0, 0);
          }
        } else if (b.type === 'police_station') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(13 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 14, 18 * svcMult, 0, 0, 75 * svcMult);
          }
        } else if (b.type === 'hospital') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(14 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 20, 30 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'school') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(15 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 18, 26 * svcMult, 0, 78 * svcMult, 0);
          }
        } else if (b.type === 'park') {
          this.addRadialField(x, z, 7, 24, -8, 18, 0, 0, 0);
          this.addNoiseField(x, z, 5, -22);
        } else if (b.type === 'metro_station') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 9, 22, 0, 24, 0, 0, 0);
          }
        } else if (b.type === 'hsr_station') {
          if (operational && t.powered) {
            landmarkBonus += 0.14;
            this.addRadialField(x, z, 14, 28, 0, 25, 0, 0, 0);
          }
        } else if (b.type === 'seaport') {
          if (operational && t.powered && this.hasNearbyWater(x, z, 2).found) {
            landmarkBonus += 0.10;
            this.addRadialField(x, z, 10, 12, 8, 20, 0, 0, 0);
            this.addNoiseField(x, z, 5, 28);
          }
        } else if (b.type === 'airport') {
          if (operational && t.powered) {
            landmarkBonus += 0.16;
            this.addRadialField(x, z, 14, 22, 6, 26, 0, 0, 0);
            this.addNoiseField(x, z, 9, 55);
          }
        } else if (b.type === 'amusement_park') {
          if (operational && t.powered) {
            landmarkBonus += 0.12;
            this.addRadialField(x, z, 14, 34, 0, 30 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'zoo') {
          if (operational && t.powered) {
            landmarkBonus += 0.14;
            this.addRadialField(x, z, 13, 30, 0, 32 * svcMult, 0, 15, 0);
            this.addNoiseField(x, z, 4, -14);
          }
        } else if (b.type === 'botanical_garden') {
          if (operational && t.powered) {
            landmarkBonus += 0.13;
            this.addRadialField(x, z, 12, 34, -22, 30 * svcMult, 0, 10, 0);
            this.addNoiseField(x, z, 5, -30);
          }
        } else if (b.type === 'museum') {
          if (operational && t.powered) {
            landmarkBonus += 0.11;
            this.addRadialField(x, z, 12, 28, 0, 26 * svcMult, 0, 28, 0);
          }
        } else if (b.type === 'tv_tower') {
          if (operational && t.powered) {
            landmarkBonus += 0.20;
            this.addRadialField(x, z, 16, 42, 0, 34 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'stadium') {
          if (operational && t.powered) {
            landmarkBonus += 0.14;
            this.addRadialField(x, z, 15, 30, 0, 32 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'landmark') {
          if (operational && t.powered) {
            landmarkBonus += 0.22;
            this.addRadialField(x, z, 18, 38, 0, 34, 0, 0, 0);
          }
        } else if (b.type === 'I' && !b.underConstruction) {
          const greenPolMult = (this.policies.greenEnergy ? 0.65 : 1.0) * (this.policies.greenCity ? 0.65 : 1.0);
          const pol = Math.round((22 + b.level * 7) * Math.max(0.45, greenPolMult));
          this.addRadialField(x, z, 6, -Math.round(pol * 0.55), pol, 0, 0, 0, 0);
          this.addNoiseField(x, z, 5, 42);
        }
      }
    }

    if (this.policies.greenCity || this.policies.greenEnergy) {
      const lvBoost = this.policies.greenCity ? 7 : 3;
      for (let i = 0; i < N; i++) this.grid[i].landValue = Math.min(100, this.grid[i].landValue + lvBoost);
    }

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      t.pollution = Math.max(0, Math.min(100, t.pollution));
      t.noise = Math.round(Math.max(0, Math.min(100, t.noise || 0)));
      t.serviceScore = Math.max(0, Math.min(100, t.serviceScore));
      t.fireSafety = Math.max(0, Math.min(100, t.fireSafety));
      t.education = Math.max(0, Math.min(100, t.education || 0));
      t.crimeSafety = Math.max(0, Math.min(100, t.crimeSafety || 0));
      let lv = t.landValue - t.pollution * 0.45;
      const isResTile = t.zone === 'RL' || t.zone === 'RH' || t.building?.type === 'RL' || t.building?.type === 'RH';
      if (isResTile && t.noise > 55) {
        lv -= (t.noise - 55) * 0.45;
      }
      t.landValue = Math.max(5, Math.min(100, lv));
    }

    // Underground Water Pipe BFS + 4-Tile Coverage
    this.waterSupply = Math.round(totalWaterOut);
    this.sewageSupply = Math.round(totalSewageCap);
    this.waterPollutedPct = totalWaterOut > 0 ? Math.round((pollutedWaterIntake / totalWaterOut) * 100) : 0;

    if (waterNodes.length > 0 && totalWaterOut > 0) {
      const pipeVis = new Uint8Array(N);
      const q = [];
      for (const wn of waterNodes) {
        const wi = idx(wn.x, wn.z);
        if (!this.grid[wi].pipeBroken) {
          pipeVis[wi] = 1;
          q.push(wi);
        }
      }

      let head = 0;
      const dirs8 = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      while (head < q.length) {
        const ci = q[head++];
        const cx = ci % GRID_SIZE;
        const cz = (ci / GRID_SIZE) | 0;
        for (const [dx, dz] of dirs8) {
          const nx = cx + dx, nz = cz + dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (pipeVis[ni]) continue;
          const nt = this.grid[ni];
          if (nt.pipe && !nt.pipeBroken) {
            pipeVis[ni] = 1;
            q.push(ni);
          }
        }
      }

      let wUsed = 0;
      const covered = new Uint8Array(N);
      for (let i = 0; i < q.length; i++) {
        const pi = q[i];
        const px = pi % GRID_SIZE;
        const pz = (pi / GRID_SIZE) | 0;
        for (let dz = -4; dz <= 4; dz++) {
          for (let dx = -4; dx <= 4; dx++) {
            if (dx * dx + dz * dz > 18) continue;
            const nx = px + dx, nz = pz + dz;
            if (!inBounds(nx, nz)) continue;
            covered[idx(nx, nz)] = 1;
          }
        }
      }

      for (let i = 0; i < N; i++) {
        if (!covered[i]) continue;
        const t = this.grid[i];
        const need = (this.getBuildingStats(t.building).water || 0) * energyDemMult;
        if (wUsed + need <= totalWaterOut) {
          t.watered = true;
          wUsed += need;
        } else if (need === 0) {
          t.watered = true;
        }
      }
    }

    // Aggregate City Totals & Active Hubs/Wonders
    let totalPDemand = 0;
    let totalWDemand = 0;
    let pop = 0;
    let jobs = 0;
    let happySum = 0;
    let resCount = 0;
    let eduWeightedSum = 0;
    let eduPopWeight = 0;
    let sickCount = 0;
    let abandoned = 0;
    let hasSeaport = false;
    let hasAirport = false;
    let hasAmusementPark = false;
    let hasStadium = false;
    let hasZoo = false;
    let hasBotanicalGarden = false;
    let hasMuseum = false;
    let hasTvTower = false;
    let touristBase = 0;
    const weatherInfo = this.getWeatherInfo();
    const heatMult = weatherInfo.heatMult || 1.0;

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b) continue;
      if (b.abandoned) {
        b.trashPiled = false;
        b.sewageBackedUp = false;
        abandoned++;
        continue;
      }
      const st = this.getBuildingStats(b);
      totalPDemand += st.power * energyDemMult * heatMult;
      totalWDemand += st.water * energyDemMult;

      const active = t.powered && t.watered && !b.flooded && !(b.fire > 0.3);
      pop += active ? st.pop : Math.round(st.pop * 0.25);
      jobs += active ? st.jobs : Math.round(st.jobs * 0.25);

      if (!b.underConstruction && t.powered && !b.flooded && !(b.fire > 0.3)) {
        if (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found) { hasSeaport = true; touristBase += 95; }
        else if (b.type === 'airport') { hasAirport = true; touristBase += 260; }
        else if (b.type === 'hsr_station') { touristBase += 140; }
        else if (b.type === 'amusement_park') { hasAmusementPark = true; touristBase += 210; }
        else if (b.type === 'stadium') { hasStadium = true; touristBase += 180; }
        else if (b.type === 'zoo') { hasZoo = true; touristBase += 280; }
        else if (b.type === 'botanical_garden') { hasBotanicalGarden = true; touristBase += 220; }
        else if (b.type === 'museum') { hasMuseum = true; touristBase += 190; }
        else if (b.type === 'tv_tower') { hasTvTower = true; touristBase += 420; }
        else if (b.type === 'landmark') { touristBase += 240; }
      }
    }

    this.hasSeaport = hasSeaport;
    this.hasAirport = hasAirport;
    this.hasAmusementPark = hasAmusementPark;
    this.hasStadium = hasStadium;
    this.hasZoo = hasZoo;
    this.hasBotanicalGarden = hasBotanicalGarden;
    this.hasMuseum = hasMuseum;
    this.hasTvTower = hasTvTower;
    const gatewayMult = 1.0 + (hasAirport ? 0.35 : 0) + (hasSeaport ? 0.15 : 0);
    this.tourists = Math.round(touristBase * gatewayMult * (weatherInfo.tourMult || 1.0));

    this.powerDemand = Math.ceil(totalPDemand);
    this.waterDemand = Math.ceil(totalWDemand);
    this.sewageDemand = this.waterDemand;

    // Sanitation, Sewage Backup & Waste-to-Energy balance
    this.trashSupply = Math.round(totalTrashCap);
    this.trashDemand = Math.ceil(pop * 0.42 + jobs * 0.30);
    const trashCrisis = pop >= 380 && this.trashDemand > this.trashSupply * 1.15;
    const trashOverload = trashCrisis
      ? Math.min(1, (this.trashDemand - this.trashSupply) / Math.max(200, this.trashDemand))
      : 0;

    const sewageCrisis = pop >= 120 && this.waterDemand > this.sewageSupply * 1.15;
    const sewageOverload = sewageCrisis
      ? Math.min(1, (this.waterDemand - this.sewageSupply) / Math.max(120, this.waterDemand))
      : 0;

    const wonderHappyBoost =
      (hasAmusementPark ? 4 : 0) +
      (hasStadium ? 3 : 0) +
      (hasZoo ? 4 : 0) +
      (hasBotanicalGarden ? 4 : 0) +
      (hasMuseum ? 2 : 0) +
      (hasTvTower ? 3 : 0) +
      (weatherInfo.happyMod || 0) +
      (this.matchDayBoostTimer > 0 ? 8 : 0) +
      (this.tempHappinessBoost || 0);

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b || b.abandoned) continue;

      if (trashCrisis && BUILDING_NAMES[b.type] && !b.underConstruction) {
        const hVal = hash2D(t.x, t.z, 313);
        b.trashPiled = hVal < Math.min(0.95, 0.38 + trashOverload * 0.72);
        if (b.trashPiled) {
          t.landValue = Math.max(5, t.landValue - 15);
        }
      } else if ((b.gridlockTrashTicks || 0) > 0) {
        b.trashPiled = true;
        t.landValue = Math.max(5, t.landValue - 12);
      } else {
        b.trashPiled = false;
      }

      if (sewageCrisis && t.watered && BUILDING_NAMES[b.type] && !b.underConstruction) {
        const sVal = hash2D(t.x, t.z, 619);
        b.sewageBackedUp = sVal < Math.min(0.95, 0.40 + sewageOverload * 0.72);
        if (b.sewageBackedUp) {
          t.landValue = Math.max(5, t.landValue - 14);
        }
      } else {
        b.sewageBackedUp = false;
      }

      const st = this.getBuildingStats(b);
      const pollutedHome = (b.type === 'RL' || b.type === 'RH') && t.pollution > 28;
      b.sick = (
        (t.watered && this.waterPollutedPct >= 10) ||
        pollutedHome ||
        b.sewageBackedUp
      ) && (b.type === 'RL' || b.type === 'RH');
      if (b.sick) sickCount += Math.round(st.pop * 0.45);
      else if (b.trashPiled && (b.type === 'RL' || b.type === 'RH')) sickCount += Math.round(st.pop * 0.20);

      if ((b.type === 'RL' || b.type === 'RH') && !b.underConstruction) {
        const popW = Math.max(1, st.pop);
        eduWeightedSum += (t.education || 0) * popW;
        eduPopWeight += popW;

        let h = 56 + t.landValue * 0.26 + t.serviceScore * 0.25 - t.pollution * 0.65 - (this.taxRate - 9) * 3.8 + wonderHappyBoost;
        if (t.noise > 55) h -= (t.noise - 55) * 0.48;
        if (!t.powered) h -= 32;
        if (!t.watered) h -= 32;
        if (b.sick) h -= 38;
        if (b.sewageBackedUp) h -= 22;
        if (b.trashPiled) h -= 24;
        if (b.flooded) h -= 35;
        if (totalWDemand > totalSewageCap + 50) h -= 18;
        if (pop > 250 && t.crimeSafety < 15) h -= 16;
        happySum += Math.max(5, Math.min(100, h));
        resCount++;
      }
    }

    const baseEduRate = eduPopWeight > 0 ? (eduWeightedSum / eduPopWeight) : 0;
    this.educatedRate = Math.round(Math.max(0, Math.min(100, baseEduRate + (this.policies.freeHigherEd ? 18 : 0))));

    this.population = pop;
    if (pop > this.maxPopReached) this.maxPopReached = pop;
    this.jobsTotal = jobs;
    this.sickCitizens = sickCount;
    this.abandonedCount = abandoned;
    this.happiness = resCount > 0 ? Math.round(happySum / resCount) : 75;

    const workforce = Math.round(pop * 0.58);
    this.unemploymentPct = workforce > 0 ? Math.max(0, Math.round(((workforce - jobs) / workforce) * 100)) : 0;

    // Strict RCI Demand sensitive to Taxes, Unemployment, Goods, Happiness, Policies & Civic Decisions!
    const taxPenalty = this.taxRate > 11 ? (this.taxRate - 11) * 0.14 : (9 - this.taxRate) * 0.04;
    const workerNeed = (jobs - workforce + 35) / Math.max(100, workforce + 60);
    const cJobs = this.countZoneJobs(['CL', 'CH']);
    const indJobs = this.countZoneJobs(['I']);
    const ioJobs = indJobs + this.countZoneJobs(['O']);

    // Commercial needs BOTH population shoppers AND industrial goods supply!
    const shopperGap = (pop * 0.35 + 20 - cJobs) / Math.max(80, pop * 0.4 + 50);
    const indGap = (workforce * 0.52 + 25 - ioJobs) / Math.max(80, workforce * 0.5 + 50);
    const bizBoost = this.policies.bizTaxBreak ? 0.28 : 0;
    const tdb = this.tempDemandBoost || { R: 0, C: 0, I: 0 };

    this.demand.R = Math.max(0.0, Math.min(1.0, 0.45 + workerNeed * 0.65 + taxPenalty + (this.happiness - 65) * 0.008 + (tdb.R || 0)));
    this.demand.C = Math.max(0.0, Math.min(1.0, 0.35 + shopperGap * 0.68 + taxPenalty + landmarkBonus + bizBoost + (tdb.C || 0)));
    this.demand.I = Math.max(0.0, Math.min(1.0, 0.40 + indGap * 0.68 + taxPenalty + (this.policies.techBoost ? 0.10 : 0) + bizBoost + (tdb.I || 0)));

    while (
      this.milestoneIdx + 1 < MILESTONES.length &&
      this.population >= MILESTONES[this.milestoneIdx + 1].pop
    ) {
      this.milestoneIdx++;
    }

    if (!this._suppressPromotions) {
      this.checkLevelPromotion();
    }
  }

  countZoneJobs(types) {
    let sum = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const b = this.grid[i].building;
      if (b && !b.abandoned && types.includes(b.type) && !b.underConstruction) {
        sum += this.getBuildingStats(b).jobs;
      }
    }
    return sum;
  }

  _computeRoadServiceCoverage(startRx, startRz, maxSteps) {
    if (!inBounds(startRx, startRz) || maxSteps <= 0) return [];
    const N = this.grid.length;
    if (!this._svcDistG || this._svcDistG.length !== N) {
      this._svcDistG = new Float32Array(N);
      this._svcDistE = new Float32Array(N);
      this._svcBestFalloff = new Float32Array(N);
    }
    const distG = this._svcDistG;
    const distE = this._svcDistE;
    const bestFalloff = this._svcBestFalloff;
    distG.fill(1e9);
    distE.fill(1e9);

    const startIdx = idx(startRx, startRz);
    const startTile = this.grid[startIdx];
    if (!startTile || (startTile.roadGround <= 0 && startTile.roadElevated <= 0)) return [];

    const q = [];
    const reachedGround = [];
    if (startTile.roadGround > 0) {
      distG[startIdx] = 0;
      q.push(startIdx * 2);
      reachedGround.push(startIdx);
    } else if (startTile.roadElevated > 0) {
      distE[startIdx] = 0;
      q.push(startIdx * 2 + 1);
    }

    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let head = 0;
    while (head < q.length) {
      const code = q[head++];
      const ci = code >> 1;
      const layer = code & 1;
      const curD = layer === 0 ? distG[ci] : distE[ci];
      if (curD > maxSteps) continue;
      const ct = this.grid[ci];

      if (ct.ramp) {
        const rampD = curD + 0.35;
        if (layer === 0 && ct.roadElevated > 0 && rampD <= maxSteps && rampD < distE[ci] - 0.01) {
          distE[ci] = rampD;
          q.push(ci * 2 + 1);
        } else if (layer === 1 && ct.roadGround > 0 && rampD <= maxSteps && rampD < distG[ci] - 0.01) {
          if (distG[ci] >= 1e8) reachedGround.push(ci);
          distG[ci] = rampD;
          q.push(ci * 2);
        }
      }

      for (const [dx, dz] of dirs4) {
        const nx = ct.x + dx, nz = ct.z + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        const nt = this.grid[ni];
        if (layer === 0) {
          if (nt.roadGround > 0) {
            const stepCost = 1.0 + (nt.congestion || 0) * 1.3;
            const nd = curD + stepCost;
            if (nd <= maxSteps && nd < distG[ni] - 0.01) {
              if (distG[ni] >= 1e8) reachedGround.push(ni);
              distG[ni] = nd;
              q.push(ni * 2);
            }
          }
        } else if (nt.roadElevated > 0) {
          const stepCost = 0.9 + (nt.congestion || 0) * 1.1;
          const nd = curD + stepCost;
          if (nd <= maxSteps && nd < distE[ni] - 0.01) {
            distE[ni] = nd;
            q.push(ni * 2 + 1);
          }
        }
      }
    }

    const touchedTargets = [];
    const denom = maxSteps + 3;

    for (let k = 0; k < reachedGround.length; k++) {
      const ri = reachedGround[k];
      const rDist = distG[ri];
      if (rDist > maxSteps) continue;
      const rx = ri % GRID_SIZE;
      const rz = (ri / GRID_SIZE) | 0;

      for (let dz = -3; dz <= 3; dz++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d2 = dx * dx + dz * dz;
          if (d2 > 10) continue;
          const tx = rx + dx, tz = rz + dz;
          if (!inBounds(tx, tz)) continue;

          // Prevent curbside service jump across unbridged rivers/creeks!
          const steps = Math.max(Math.abs(dx), Math.abs(dz));
          if (steps >= 2) {
            let waterBlocked = false;
            for (let s = 1; s < steps; s++) {
              const mx = rx + Math.round((dx * s) / steps);
              const mz = rz + Math.round((dz * s) / steps);
              if (this.isWaterTile(mx, mz) && !this.grid[idx(mx, mz)].roadBridge) {
                waterBlocked = true;
                break;
              }
            }
            if (waterBlocked) continue;
          }

          const totDist = rDist + Math.sqrt(d2);
          const falloff = 1 - totDist / denom;
          if (falloff <= 0) continue;

          const ti = idx(tx, tz);
          if (bestFalloff[ti] === 0) touchedTargets.push(ti);
          if (falloff > bestFalloff[ti]) bestFalloff[ti] = falloff;
        }
      }
    }

    const results = new Array(touchedTargets.length);
    for (let k = 0; k < touchedTargets.length; k++) {
      const ti = touchedTargets[k];
      const f = bestFalloff[ti];
      bestFalloff[ti] = 0;
      results[k] = { ti, x: ti % GRID_SIZE, z: (ti / GRID_SIZE) | 0, falloff: f };
    }
    return results;
  }

  propagateServiceAlongRoads(startRx, startRz, maxSteps, dLandVal, dService, dFire, dEdu, dCrime) {
    const cov = this._computeRoadServiceCoverage(startRx, startRz, maxSteps);
    for (let k = 0; k < cov.length; k++) {
      const c = cov[k];
      const f = c.falloff;
      const t = this.grid[c.ti];
      t.landValue += dLandVal * f;
      t.serviceScore += dService * f;
      t.fireSafety += dFire * f;
      t.education = (t.education || 0) + dEdu * f;
      t.crimeSafety = (t.crimeSafety || 0) + dCrime * f;
    }
  }

  previewServiceCoverage(toolId, x, z) {
    const label = CATALOG[toolId]?.name || toolId || '';
    if (!inBounds(x, z)) {
      return { tiles: [], affectedBuildings: 0, roadConnected: false, label };
    }
    const svcMult = (this.budgets?.service || 100) / 100;
    const roadTools = {
      fire_station: 12,
      police_station: 13,
      hospital: 14,
      school: 15,
      waste_plant: 10
    };
    const radialTools = {
      park: 7,
      metro_station: 9,
      zoo: 13,
      botanical_garden: 12,
      museum: 12,
      tv_tower: 16,
      amusement_park: 14,
      stadium: 15
    };

    const tiles = [];
    let roadConnected = false;

    if (toolId in roadTools) {
      const acc = this.findRoadAccess(x, z);
      roadConnected = Boolean(acc);
      if (acc) {
        const r = Math.round(roadTools[toolId] * svcMult);
        const cov = this._computeRoadServiceCoverage(acc.rx, acc.rz, r * 1.45);
        for (let i = 0; i < cov.length; i++) {
          const c = cov[i];
          tiles.push({
            x: c.x,
            z: c.z,
            strength: Math.max(0.15, Math.min(1.0, c.falloff))
          });
        }
      }
    } else if (toolId === 'bus_stop') {
      const t = this.getTile(x, z);
      roadConnected = Boolean(t && t.roadGround >= 1 && t.roadGround !== 3 && t.roadGround !== 4 && !t.dam && !t.ramp);
      if (roadConnected) {
        const cov = this._computeRoadServiceCoverage(x, z, 6.5);
        for (let i = 0; i < cov.length; i++) {
          const c = cov[i];
          tiles.push({
            x: c.x,
            z: c.z,
            strength: Math.max(0.15, Math.min(1.0, c.falloff))
          });
        }
      }
    } else if (toolId === 'power_pylon') {
      roadConnected = true;
      const rad = 6;
      const r2 = rad * rad;
      const minX = Math.max(0, x - rad);
      const maxX = Math.min(GRID_SIZE - 1, x + rad);
      const minZ = Math.max(0, z - rad);
      const maxZ = Math.min(GRID_SIZE - 1, z + rad);
      for (let gz = minZ; gz <= maxZ; gz++) {
        for (let gx = minX; gx <= maxX; gx++) {
          const d2 = (gx - x) * (gx - x) + (gz - z) * (gz - z);
          if (d2 > r2) continue;
          const falloff = 1 - Math.sqrt(d2) / (rad + 0.5);
          tiles.push({
            x: gx,
            z: gz,
            strength: Math.max(0.15, Math.min(1.0, falloff))
          });
        }
      }
    } else if (toolId in radialTools) {
      roadConnected = Boolean(this.findRoadAccess(x, z));
      const rad = radialTools[toolId];
      const r2 = rad * rad;
      const minX = Math.max(0, x - rad);
      const maxX = Math.min(GRID_SIZE - 1, x + rad);
      const minZ = Math.max(0, z - rad);
      const maxZ = Math.min(GRID_SIZE - 1, z + rad);
      for (let gz = minZ; gz <= maxZ; gz++) {
        for (let gx = minX; gx <= maxX; gx++) {
          const d2 = (gx - x) * (gx - x) + (gz - z) * (gz - z);
          if (d2 > r2) continue;
          const falloff = 1 - Math.sqrt(d2) / (rad + 0.5);
          tiles.push({
            x: gx,
            z: gz,
            strength: Math.max(0.15, Math.min(1.0, falloff))
          });
        }
      }
    } else {
      return { tiles: [], affectedBuildings: 0, roadConnected: false, label };
    }

    let affectedBuildings = 0;
    for (let i = 0; i < tiles.length; i++) {
      const pt = tiles[i];
      if (pt.x === x && pt.z === z) continue;
      const b = this.grid[idx(pt.x, pt.z)].building;
      if (b && !b.abandoned) affectedBuildings++;
    }

    return { tiles, affectedBuildings, roadConnected, label };
  }

  addNoiseField(cx, cz, radius, delta) {
    if (radius <= 0 || delta === 0) return;
    const r2 = radius * radius;
    const minX = Math.max(0, cx - radius);
    const maxX = Math.min(GRID_SIZE - 1, cx + radius);
    const minZ = Math.max(0, cz - radius);
    const maxZ = Math.min(GRID_SIZE - 1, cz + radius);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const d2 = (x - cx) * (x - cx) + (z - cz) * (z - cz);
        if (d2 > r2) continue;
        const falloff = 1 - Math.sqrt(d2) / (radius + 0.5);
        this.grid[idx(x, z)].noise += delta * falloff;
      }
    }
  }

  addRadialField(cx, cz, radius, dLandVal, dPollution, dService, dFire, dEdu, dCrime) {
    if (radius <= 0) return;
    const r2 = radius * radius;
    const minX = Math.max(0, cx - radius);
    const maxX = Math.min(GRID_SIZE - 1, cx + radius);
    const minZ = Math.max(0, cz - radius);
    const maxZ = Math.min(GRID_SIZE - 1, cz + radius);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const d2 = (x - cx) * (x - cx) + (z - cz) * (z - cz);
        if (d2 > r2) continue;
        const falloff = 1 - Math.sqrt(d2) / (radius + 0.5);
        const t = this.grid[idx(x, z)];
        t.landValue += dLandVal * falloff;
        t.pollution += dPollution * falloff;
        t.serviceScore += dService * falloff;
        t.fireSafety += dFire * falloff;
        t.education = (t.education || 0) + dEdu * falloff;
        t.crimeSafety = (t.crimeSafety || 0) + dCrime * falloff;
      }
    }
  }

  stepWaterFacilities() {
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        const b = t.building;
        if (!b || b.abandoned || b.underConstruction || !t.powered) continue;
        if (b.type === 'sewage_out' || b.type === 'water_treat') {
          const pollAdd = b.type === 'sewage_out' ? 0.26 : 0.02;
          const pollCap = b.type === 'sewage_out' ? 1.0 : 0.18;
          for (let dz = -2; dz <= 2; dz++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx, nz = z + dz;
              if (!inBounds(nx, nz)) continue;
              const ni = idx(nx, nz);
              if (this.waterDepth[ni] > 0.08) {
                this.waterDepth[ni] = Math.min(3.5, this.waterDepth[ni] + 0.015);
                if (this.waterPoll[ni] < pollCap) {
                  this.waterPoll[ni] = Math.min(pollCap, this.waterPoll[ni] + pollAdd);
                }
                dz = 9; break;
              }
            }
          }
        }
      }
    }
  }

  update(dt) {
    for (let i = this.recentUpgrades.length - 1; i >= 0; i--) {
      this.recentUpgrades[i].ttl -= dt;
      if (this.recentUpgrades[i].ttl <= 0) this.recentUpgrades.splice(i, 1);
    }

    if (this.speed === 0) return;
    const simDt = dt * this.speed;

    // 5x Calmer, Majestic Day-Night Cycle (~7.5 minutes per full day-night cycle at 1x!)
    if (this.timeMode === 'cycle') {
      this.dayProgress += simDt * 0.0022;
      if (this.dayProgress >= 1) this.dayProgress -= 1;
    } else if (this.timeMode === 'day') this.dayProgress = 0.42;
    else if (this.timeMode === 'sunset') this.dayProgress = 0.755;
    else if (this.timeMode === 'night') this.dayProgress = 0.02;

    // Dynamic 3D Weather progression & gameplay effects (rain reservoir recharge, fire damping, lightning)
    this.stepWeather(simDt);

    // Calendar advances smoothly (1 calendar day every 4.5s at 1x)
    this.dateAccum += simDt;
    if (this.dateAccum >= 4.5) {
      this.dateAccum -= 4.5;
      this.day++;
      if (this.day > 30) {
        this.day = 1;
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
        }
        this._onMonthRollover();
      }
    }

    // Dynamic Civic Decision Event Timer (~2.5 in-game months when pop >= 120)
    if (this.population >= 120 && !this.activeEvent) {
      this._eventMonthAccum = (this._eventMonthAccum || 0) + simDt / (30 * 4.5);
      if (this._eventMonthAccum >= 2.5) {
        this._eventMonthAccum = 0;
        this.triggerSampleEvent();
      }
    }

    // Real-time Shallow Water Physics
    if (this.waterPhysics) {
      this.waterAccum += Math.min(0.10, dt * Math.min(2.2, 0.65 + this.speed * 0.35));
      while (this.waterAccum >= 0.05) {
        this.waterAccum -= 0.05;
        this.stepWaterFacilities();
        this.waterPhysics.step();
      }
    }

    // Slower, realistic construction crane buildup (~6-7s per building at 1x)
    let finishedCount = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const b = this.grid[i].building;
      if (b && b.underConstruction) {
        b.buildProgress += simDt * 0.15;
        if (b.buildProgress >= 1) {
          b.buildProgress = 1;
          b.underConstruction = false;
          finishedCount++;
        }
      }
    }
    if (finishedCount > 0) {
      this.recomputeNetworksAndFields();
      this.addXP(finishedCount * 12, '新建筑落成');
      this.checkMayorQuests();
      this.buildingDirty = true;
    }

    // City growth & Distress/Abandonment check every 2.2s sim time
    this.simAccum += simDt;
    if (this.simAccum >= 2.2) {
      this.simAccum = 0;
      this.stepCityGrowthAndAbandonment();
      this.recomputeNetworksAndFields();
      this.checkMayorQuests();
    }

    // Fiscal Budget & Loan Tick every 6.0s sim time
    this.econAccum += simDt;
    if (this.econAccum >= 6.0) {
      this.econAccum = 0;
      this.stepEconomy();
    }

    // Olympic Stadium Match Day (~45s sim time when powered)
    if (this.matchDayBoostTimer > 0) {
      this.matchDayBoostTimer = Math.max(0, this.matchDayBoostTimer - simDt);
    }
    if (this.hasStadium) {
      this.stadiumTimer += simDt;
      if (this.stadiumTimer >= 45.0) {
        this.stadiumTimer = 0;
        this.matchDayBoostTimer = 18.0;
        const events = ['山河超级杯足球决赛', '世界巡回巨星演唱会', '奥林匹克田径钻石赛', '全明星冠军德比之夜'];
        const evName = events[(this.day + this.month) % events.length];
        const ticketBonus = 1200;
        this.money += ticketBonus;
        if (this.sfx && this.sfx.milestone) this.sfx.milestone();
        this.latestChirp = {
          user: '@奥体中心快讯',
          text: `🏟️ 【${evName}】盛大举行！发放门票分红 +¥${ticketBonus.toLocaleString()}，全城幸福感飙升！`,
          mood: 'good'
        };
        this.recomputeNetworksAndFields();
      }
    }

    // Citizen Chirper dynamic live feed (~9.0s sim time)
    this.chirpTimer += simDt;
    if (this.chirpTimer >= 9.0) {
      this.chirpTimer = 0;
      this.stepChirper();
    }
  }

  stepChirper() {
    const urgent = [];
    const positive = [];

    let congestedTiles = 0;
    let hasDam = this.hydroPowerMW > 20;
    let hasHSR = false;
    let metroStations = 0;
    let hasNuclear = false;
    let hasSolar = false;
    let hasSkyscraper = false;

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround > 0 && t.congestion > 0.68) congestedTiles++;
      if (t.dam) hasDam = true;
      const b = t.building;
      if (!b || b.abandoned || b.underConstruction) continue;
      if (b.type === 'hsr_station' && t.powered) hasHSR = true;
      else if (b.type === 'metro_station' && t.powered) metroStations++;
      else if (b.type === 'nuclear_plant' && t.powered && this.hasNearbyWater(t.x, t.z, 2).found) hasNuclear = true;
      else if (b.type === 'solar_plant' && t.powered) hasSolar = true;
      else if (b.type === 'landmark' || ((b.type === 'CH' || b.type === 'RH' || b.type === 'O') && b.level >= 4)) {
        hasSkyscraper = true;
      }
    }

    // 1. Live Urgent City Complaints
    if (this.waterPollutedPct >= 10 || this.sickCitizens > 35) {
      urgent.push({
        user: '@宝妈林女士',
        text: '救命啊！家里水龙头流出来的全是发臭的褐色污水🤢！是不是抽水站建在排污口下游了？！',
        mood: 'bad'
      });
    }
    if (this.population >= 380 && this.trashDemand > this.trashSupply * 1.15) {
      urgent.push({
        user: '@便利店老王',
        text: `街角垃圾桶堆成小山臭气熏天🪰！全市垃圾产出 ${this.trashDemand} 吨却处理不过来，快建【环保垃圾焚烧厂】吧！`,
        mood: 'bad'
      });
    }
    if (this.powerDemand > this.powerSupply && this.population > 40) {
      urgent.push({
        user: '@程序员阿杰',
        text: `写字楼又停电跳闸了⚡（缺口 ${this.powerDemand - this.powerSupply} MW）！求市长快建电站或架设高压输电塔！`,
        mood: 'bad'
      });
    }
    if (this.waterDemand > this.waterSupply && this.population > 40) {
      urgent.push({
        user: '@住户周阿姨',
        text: '做饭做一半停水啦🚿！地下输水管和抽水站供水量跟不上新区发展了！',
        mood: 'warn'
      });
    }
    if (this.population >= 120 && this.waterDemand > this.sewageSupply * 1.15) {
      urgent.push({
        user: '@一楼住户老孙',
        text: `救命！全市下水道彻底爆满（污水 ${this.waterDemand} > 排污 ${this.sewageSupply}），地漏往外冒脏水了🚱！快建【排污口】或【生态净水中心】！`,
        mood: 'bad'
      });
    }
    if (this.taxRate >= 12) {
      urgent.push({
        user: '@创业者老赵',
        text: `税率高达 ${this.taxRate}% 实在喘不过气💸！再不降税我们公司只能搬离这座城市了！`,
        mood: 'warn'
      });
    }
    if (congestedTiles >= 6) {
      urgent.push({
        user: '@出租车刘师傅',
        text: '主干道十字路口堵成停车场啦🚗💢！建议架设二层【高架快速路】或开通【地下地铁】分流！',
        mood: 'warn'
      });
    }
    if (this.abandonedCount >= 4) {
      urgent.push({
        user: '@房产中介小吴',
        text: `附近有 ${this.abandonedCount} 栋废弃荒楼🏚️严重拉低片区房价，期盼市政推土机清理重建！`,
        mood: 'warn'
      });
    }

    // 2. Live City Praise & Landmarks
    if (hasDam) {
      positive.push({
        user: '@风光摄影师老韩',
        text: `西北峡谷的【水力发电大坝】太壮观了🏗️！高峡出平湖，澎湃清洁水电点亮全城！`,
        mood: 'good'
      });
    }
    if (hasHSR) {
      positive.push({
        user: '@商务旅客陆总',
        text: '刚乘复兴号高速列车跨过特大桥抵达中央车站🚄，山河大都会的立体交通太震撼了！',
        mood: 'good'
      });
    }
    if (this.hasAirport) {
      positive.push({
        user: '@环球旅行家Mia',
        text: '在【国际民航机场】看着宽体大客机呼啸冲上云霄✈️，全球商务客与游客络绎不绝！',
        mood: 'good'
      });
    }
    if (this.hasSeaport) {
      positive.push({
        user: '@远洋船长老郑',
        text: '万吨集装箱巨轮稳稳靠泊东南海湾【深水海港】🚢，本地智造商品正源源不断出口海外！',
        mood: 'good'
      });
    }
    if (this.hasAmusementPark) {
      const isNight = this.dayProgress < 0.22 || this.dayProgress > 0.72;
      positive.push({
        user: '@情侣小鹿',
        text: isNight
          ? '夜晚的【滨海摩天轮乐园】霓虹璀璨太浪漫啦🎡✨！升到最高点俯瞰全城万家灯火美哭了！'
          : '周末来【滨海摩天轮乐园】打卡巨型摩天轮🎡，海风拂面欢声笑语，幸福感拉满！',
        mood: 'good'
      });
    }
    if (this.hasStadium) {
      positive.push({
        user: '@体育解说大鹏',
        text: '【奥林匹克体育中心】圣火辉映🏟️！每逢比赛日全城沸腾，文体商业一片繁荣！',
        mood: 'good'
      });
    }
    if (hasNuclear) {
      positive.push({
        user: '@核能工程师林博',
        text: '岸畔【核裂变发电站】安全满发☢️，+1,650 MW 零碳清洁基荷电力让工业与CBD火力全开！',
        mood: 'good'
      });
    }
    if (hasSolar) {
      positive.push({
        user: '@科普博主阿星',
        text: '【塔式熔盐光热电站】定日镜阵璀璨夺目☀️，连夜晚都能靠熔盐储热持续清洁供电！',
        mood: 'good'
      });
    }
    if (metroStations >= 2) {
      positive.push({
        user: '@通勤白领小苏',
        text: '地下地铁环线准点又凉快🚇！再也不用挤早高峰红绿灯，出站就是写字楼！',
        mood: 'good'
      });
    }
    if (hasSkyscraper) {
      positive.push({
        user: '@天际线迷小陈',
        text: '仰望CBD六十层玻璃幕墙摩天群与88层星海金融塔🌟，这城市天际线简直是世界级奇观！',
        mood: 'good'
      });
    }

    positive.push({
      user: '@市民小张',
      text: `咱们${this.cityName}已有 ${this.population.toLocaleString()} 位居民安居乐业🏡，市民幸福度 ${this.happiness}%！`,
      mood: this.happiness >= 75 ? 'good' : 'info'
    });

    const pool = (urgent.length > 0 && Math.random() < 0.72) ? urgent : positive;
    const filtered = pool.length > 1 ? pool.filter((c) => c.text !== this.latestChirp?.text) : pool;
    this.latestChirp = filtered[(Math.random() * filtered.length) | 0] || pool[0];
  }

  stepCityGrowthAndAbandonment() {
    let changed = false;
    const demandMap = {
      RL: this.demand.R,
      RH: this.demand.R,
      CL: this.demand.C,
      CH: this.demand.C,
      I: this.demand.I,
      O: this.demand.I
    };

    // 1. Spawn at most 1-2 buildings per tick so growth feels deliberate & organic
    const candidates = { RL: [], RH: [], CL: [], CH: [], I: [], O: [] };
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.zone && !t.building && !this.isWaterTile(x, z)) {
          const acc = this.findRoadAccess(x, z);
          if (acc && acc.roadTile?.outsideConnected === true) {
            candidates[t.zone].push({ t, acc });
          }
        }
      }
    }

    for (const zType of Object.keys(candidates)) {
      const list = candidates[zType];
      const dem = demandMap[zType] || 0;
      if (list.length === 0 || dem < 0.18) continue;
      // Office (O) won't even spawn if education is zero!
      if (zType === 'O' && Math.random() < 0.7) {
        const sample = list[0].t;
        if ((sample.education || 0) < 15) continue;
      }
      if (Math.random() > dem) continue;
      const pick = list[(Math.random() * list.length) | 0];
      pick.t.building = {
        type: zType,
        level: 1,
        variant: Math.floor(hash2D(pick.t.x, pick.t.z, this.seed + this.day) * 8),
        rot: pick.acc.rot,
        underConstruction: true,
        buildProgress: 0.04,
        upgradeProgress: 0,
        fire: 0,
        sick: false,
        trashPiled: false,
        flooded: false,
        abandoned: false,
        distress: 0,
        abandonReason: ''
      };
      changed = true;
    }

    // Check city-wide labor shortage ratio & goods supply (Seaport container freight supplements local industry!)
    const workforce = Math.round(this.population * 0.58);
    const severeLaborShortage = this.jobsTotal > 80 && workforce < this.jobsTotal * 0.45;
    const indJobs = this.countZoneJobs(['I']) + (this.hasSeaport ? 900 : 0);
    const comJobs = this.countZoneJobs(['CL', 'CH']);
    const severeGoodsShortage = comJobs > 90 && indJobs < comJobs * 0.25;
    const trashCrisisNow = this.population >= 380 && this.trashDemand > this.trashSupply * 1.15;

    // 2. Check Distress -> Abandonment (Punishes careless planning!) & Earned Upgrades
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b || b.underConstruction || !BUILDING_NAMES[b.type]) continue;

      // Occasional auto-redevelopment of abandoned buildings ONLY if all problems are solved & high demand
      if (b.abandoned) {
        const acc = this.findRoadAccess(t.x, t.z);
        if (acc && acc.roadTile?.outsideConnected && t.powered && t.watered && !trashCrisisNow && !b.sewageBackedUp && t.pollution < 20 && this.taxRate <= 10 && (demandMap[b.type] || 0) > 0.72 && Math.random() < 0.04) {
          b.abandoned = false;
          b.trashPiled = false;
          b.sewageBackedUp = false;
          b.level = 1;
          b.distress = 0;
          b.underConstruction = true;
          b.buildProgress = 0.1;
          changed = true;
        }
        continue;
      }

      const acc = this.findRoadAccess(t.x, t.z);
      const roadCong = acc?.roadTile?.congestion || 0;
      if ((b.gridlockTrashTicks || 0) > 0 && roadCong < 0.55) {
        b.gridlockTrashTicks = Math.max(0, b.gridlockTrashTicks - 1);
      }

      // Evaluate urban planning failures!
      let problem = '';
      if (!acc) problem = '道路被切断';
      else if ((b.type === 'CL' || b.type === 'CH' || b.type === 'I') && acc.roadTile && !acc.roadTile.outsideConnected) problem = '与城际高速/港站道路断联';
      else if (!t.powered) problem = '长期断电';
      else if (!t.watered) problem = '未铺设地下输水管';
      else if (b.flooded) problem = '洪水淹没';
      else if (b.sewageBackedUp) problem = '排污管网超载导致污水倒灌';
      else if (b.sick) problem = '饮用污水或工业毒气致病';
      else if (b.trashPiled && Math.random() < 0.75) problem = '垃圾围城无人清运';
      else if ((b.type === 'RL' || b.type === 'RH') && t.pollution > 32) problem = '紧邻重污染源居民逃离';
      else if (this.taxRate >= 14) problem = '苛捐杂税过高企业市民撤离';
      else if (roadCong > 0.78 && (b.type === 'CL' || b.type === 'CH' || b.type === 'I')) problem = '道路严重瘫痪导致断货倒闭';
      else if (severeLaborShortage && (b.type === 'I' || b.type === 'CL' || b.type === 'CH') && Math.random() < 0.45) problem = '住宅人口不足引发严重用工荒';
      else if (severeGoodsShortage && (b.type === 'CL' || b.type === 'CH') && Math.random() < 0.35) problem = '缺乏工业区供货导致商场断货';
      else if (b.type === 'O' && (t.education || 0) < 18 && this.educatedRate < 28) problem = '缺乏大学高学历人才写字楼空置';
      else if (b.type === 'I' && b.level >= 4 && this.educatedRate < 28 && Math.random() < 0.35) problem = '缺乏高学历研发人才高科厂减产';

      if (problem && this.difficulty !== 'sandbox') {
        b.distress = (b.distress || 0) + 1;
        b.abandonReason = problem;
        if (b.distress >= 7) {
          b.abandoned = true;
          b.upgradeProgress = 0;
          changed = true;
          this.latestChirp = {
            user: '@城建监察播报',
            text: `🏚️ 警报：(${t.x},${t.z}) 建筑因【${problem}】已荒废！可点击顶部「🔔 问题」一键跳转定位处理`,
            mood: 'bad'
          };
        }
        continue;
      } else {
        b.distress = Math.max(0, (b.distress || 0) - 1);
        b.abandonReason = '';
      }

      // Earned Upgrades (Much stricter requirements for high-rise skyscrapers!)
      const maxLv = this.getMaxLevelForZone(b.type);
      if (b.level >= maxLv) continue;

      b.rot = acc.rot;
      // High-density Lv.3+ requires Education + Healthcare/Service + Low Congestion!
      if ((b.type === 'RH' || b.type === 'CH' || b.type === 'O') && b.level >= 2 && (t.education || 0) < 20 && this.educatedRate < 40) continue;

      const aveBonus = acc.roadType >= 2 ? 10 : 0;
      const eduBonus = (t.education || 0) * 0.22 + ((b.type === 'O' || (b.type === 'I' && b.level >= 3)) && this.educatedRate >= 60 ? 10 : 0);
      const noisePen = ((b.type === 'RL' || b.type === 'RH') && (t.noise || 0) > 55) ? ((t.noise - 55) * 0.35) : 0;
      const score = (b.type === 'I')
        ? 18 + t.serviceScore * 0.65 + eduBonus + aveBonus - roadCong * 28
        : t.landValue * 0.62 + t.serviceScore * 0.48 + eduBonus + aveBonus - t.pollution * 0.55 - noisePen - roadCong * 25;

      const thresholds = [0, 28, 46, 64, 80];
      const needed = thresholds[b.level] || 78;
      const dem = demandMap[b.type] || 0.25;

      if (score >= needed && dem > 0.22) {
        // Authentic multi-year skyscraper progression (~2x slower steady pace)
        b.upgradeProgress = (b.upgradeProgress || 0) + 3.2 + (score - needed) * 0.12;
        if (b.upgradeProgress >= 100) {
          b.level++;
          b.upgradeProgress = 0;
          this.recentUpgrades.push({ x: t.x, z: t.z, ttl: 1.5 });
          if (this.sfx && typeof this.sfx.upgrade === 'function') this.sfx.upgrade();
          this.addXP(18 * b.level, '楼宇升级');
          changed = true;
        }
      }
    }

    // Periodic healthy governance XP tick
    if (this.population > 30 && this.happiness >= 65) {
      this.addXP(Math.min(45, Math.floor(5 + this.population * 0.015)), '良政执政');
    }

    if (changed) this.buildingDirty = true;
  }

  stepEconomy(applyCash = true) {
    let infraUpkeep = 0;
    let pwrUpkeep = 0;
    let wtrUpkeep = 0;
    let svcUpkeep = 0;
    let grossTax = 0;
    let activeBuildings = 0;

    const busStopCoords = [];
    const metroStationCoords = [];
    let hsrStationCount = 0;
    let metroTrackCount = 0;
    let railTrackCount = 0;

    const workforce = Math.round(this.population * 0.58);
    // Labor efficiency: if you over-zone C/I without enough R workers, factories & shops run half-empty!
    const laborEff = this.jobsTotal > 0 ? Math.min(1.0, (workforce + 25) / this.jobsTotal) : 1.0;
    const seaportTradeMult = this.hasSeaport ? 1.12 : 1.0;
    const airportTradeMult = this.hasAirport ? 1.15 : 1.0;

    // Education -> High-Tech Office & Industry Productivity Multiplier
    let highTechEduMult = 1.0;
    if (this.educatedRate >= 60) {
      highTechEduMult = 1.12 + ((this.educatedRate - 60) / 40) * 0.10; // up to +22%
    } else if (this.educatedRate < 28) {
      highTechEduMult = 0.72; // -28% efficiency penalty
    } else {
      highTechEduMult = 0.85 + ((this.educatedRate - 28) / 32) * 0.25;
    }

    const greenIndTaxMult = this.policies.greenEnergy ? 0.94 : 1.0;      // -6% ind tax
    const higherEdTechMult = this.policies.freeHigherEd ? 1.15 : 1.0;    // +15% office/tech tax
    const bizBreakMult = this.policies.bizTaxBreak ? 0.90 : 1.0;         // -10% commercial/office tax

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround === 1) {
        infraUpkeep += (typeof t.roadDir === 'number' && t.roadDir >= 0) ? CATALOG.road_oneway.upkeep : CATALOG.road_1.upkeep;
      } else if (t.roadGround === 2) {
        infraUpkeep += CATALOG.road_2.upkeep;
      } else if (t.roadGround === 4) {
        infraUpkeep += CATALOG.road_tunnel.upkeep;
      }
      if (t.roadElevated > 0) infraUpkeep += CATALOG.road_elev.upkeep;
      if (t.ramp) infraUpkeep += CATALOG.road_ramp.upkeep;
      if (t.rail === 1) {
        infraUpkeep += CATALOG.rail_track.upkeep;
        railTrackCount++;
      }
      if (t.metro) {
        infraUpkeep += CATALOG.metro_line.upkeep;
        metroTrackCount++;
      }
      if (t.pipe) infraUpkeep += CATALOG.water_pipe.upkeep;
      if (t.pylon) infraUpkeep += CATALOG.power_pylon.upkeep;
      if (t.dam) pwrUpkeep += CATALOG.hydro_dam.upkeep * 0.35;
      if (t.busStop && t.roadGround >= 1 && t.roadGround !== 3 && t.roadGround !== 4 && !t.dam && !t.ramp) {
        svcUpkeep += CATALOG.bus_stop.upkeep;
        busStopCoords.push({ x: t.x, z: t.z });
      }

      const b = t.building;
      if (!b || b.underConstruction || b.abandoned) continue;
      activeBuildings++;

      const u = CATALOG[b.type]?.upkeep || 0;
      if (b.type === 'power_wind' || b.type === 'power_plant' || b.type === 'solar_plant' || b.type === 'nuclear_plant') pwrUpkeep += u;
      else if (b.type === 'water_pump' || b.type === 'sewage_out' || b.type === 'water_treat') wtrUpkeep += u;
      else if (u > 0) svcUpkeep += u;

      if (t.powered && !b.flooded && !(b.fire > 0.2)) {
        if (b.type === 'metro_station') metroStationCoords.push({ x: t.x, z: t.z });
        else if (b.type === 'hsr_station') hsrStationCount++;
      }

      if (!t.powered || !t.watered || b.flooded || b.fire > 0.2) continue;

      const acc = this.findRoadAccess(t.x, t.z);
      const congPenalty = acc?.roadTile ? Math.max(0.35, 1 - acc.roadTile.congestion * 0.75) : 0.3;
      const sickPenalty = b.sick ? 0.35 : (b.trashPiled ? 0.75 : 1.0);

      if (b.type === 'RL') grossTax += (2.4 + b.level * 2.8) * sickPenalty;
      else if (b.type === 'RH') grossTax += (5.8 + b.level * 6.5) * sickPenalty;
      else if (b.type === 'CL') grossTax += (3.2 + b.level * 3.6) * laborEff * congPenalty * seaportTradeMult * airportTradeMult * bizBreakMult;
      else if (b.type === 'CH') grossTax += (7.5 + b.level * 8.2) * laborEff * congPenalty * seaportTradeMult * airportTradeMult * bizBreakMult;
      else if (b.type === 'I') {
        const isHighTech = b.level >= 4;
        const indMult = greenIndTaxMult * (isHighTech ? highTechEduMult * higherEdTechMult : 1.0);
        grossTax += (3.8 + b.level * 4.2) * laborEff * congPenalty * seaportTradeMult * indMult;
      } else if (b.type === 'O') {
        grossTax += (6.5 + b.level * 7.2) * laborEff * airportTradeMult * highTechEduMult * higherEdTechMult * bizBreakMult;
      } else if (b.type === 'landmark') grossTax += 85;
      else if (b.type === 'hsr_station') grossTax += 58;
      else if (b.type === 'airport') grossTax += 95;
      else if (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found) grossTax += 65;
      else if (b.type === 'stadium') grossTax += 55;
      else if (b.type === 'amusement_park') grossTax += 48;
      else if (b.type === 'zoo') grossTax += 64;
      else if (b.type === 'botanical_garden') grossTax += 52;
      else if (b.type === 'museum') grossTax += 48;
      else if (b.type === 'tv_tower') grossTax += 110;
    }

    // Live City Tourism Ticket & Hospitality Revenue (scaled by weather & attractions!)
    const tvBonus = this.hasTvTower ? 1.10 : 1.0;
    this.tourismIncome = Math.round((this.tourists || 0) * 0.16 * tvBonus);
    grossTax += this.tourismIncome;

    // ==================== Live Public Transit Ridership & P&L Telemetry ====================
    const freeTransitMult = this.policies.freeTransit ? 1.35 : 1.0;
    const svcBudgetRatio = this.budgets.service / 100;

    let busCatchment = 0;
    let metroCatchment = 0;
    if (busStopCoords.length >= 2 || metroStationCoords.length >= 2) {
      for (let i = 0; i < this.grid.length; i++) {
        const t = this.grid[i];
        const b = t.building;
        if (!b || b.abandoned || b.underConstruction) continue;
        const st = this.getBuildingStats(b);
        const weight = (st.pop || 0) + (st.jobs || 0);
        if (weight <= 0) continue;

        if (busStopCoords.length >= 2) {
          for (let k = 0; k < busStopCoords.length; k++) {
            const bs = busStopCoords[k];
            if (Math.abs(t.x - bs.x) + Math.abs(t.z - bs.z) <= 6) {
              busCatchment += weight;
              break;
            }
          }
        }
        if (metroStationCoords.length >= 2) {
          for (let k = 0; k < metroStationCoords.length; k++) {
            const ms = metroStationCoords[k];
            if (Math.abs(t.x - ms.x) + Math.abs(t.z - ms.z) <= 9) {
              metroCatchment += weight;
              break;
            }
          }
        }
      }
    }

    const busStops = busStopCoords.length;
    const busUpkeep = Math.round(busStops * CATALOG.bus_stop.upkeep * svcBudgetRatio);
    const busRiders = busStops >= 2
      ? Math.round((busStops * 18 + busCatchment * 0.28) * Math.min(1.65, 0.65 + busStops * 0.14) * freeTransitMult)
      : 0;
    const busRevenue = this.policies.freeTransit ? 0 : Math.round(busRiders * 0.24);
    const busCarsSaved = Math.round(busRiders * 0.42);

    const metroStations = metroStationCoords.length;
    const metroUpkeep = Math.round(metroStations * CATALOG.metro_station.upkeep * svcBudgetRatio + metroTrackCount * CATALOG.metro_line.upkeep);
    const metroRiders = metroStations >= 2
      ? Math.round((metroStations * 55 + metroCatchment * 0.48) * Math.min(2.0, 0.75 + metroStations * 0.18) * freeTransitMult)
      : 0;
    const metroRevenue = this.policies.freeTransit ? 0 : Math.round(metroRiders * 0.34);
    const metroCarsSaved = Math.round(metroRiders * 0.58);

    const hsrUpkeep = Math.round(hsrStationCount * CATALOG.hsr_station.upkeep * svcBudgetRatio + railTrackCount * CATALOG.rail_track.upkeep);
    const hsrRiders = hsrStationCount >= 1
      ? Math.round((hsrStationCount * 90 + (this.population + this.jobsTotal) * 0.12) * Math.min(1.8, 0.8 + hsrStationCount * 0.25) * freeTransitMult)
      : 0;
    const hsrRevenue = this.policies.freeTransit ? 0 : Math.round(hsrRiders * 0.45);
    const hsrCarsSaved = Math.round(hsrRiders * 0.35);

    const totalRiders = busRiders + metroRiders + hsrRiders;
    const totalTransitRevenue = busRevenue + metroRevenue + hsrRevenue;
    const totalTransitUpkeep = busUpkeep + metroUpkeep + hsrUpkeep;
    const totalCarsSaved = busCarsSaved + metroCarsSaved + hsrCarsSaved;

    this.transitStats = {
      bus:   { stops: busStops, riders: busRiders, revenue: busRevenue, upkeep: busUpkeep, carsSaved: busCarsSaved },
      metro: { stations: metroStations, riders: metroRiders, revenue: metroRevenue, upkeep: metroUpkeep, carsSaved: metroCarsSaved },
      hsr:   { stations: hsrStationCount, riders: hsrRiders, revenue: hsrRevenue, upkeep: hsrUpkeep, carsSaved: hsrCarsSaved },
      totalRiders,
      totalRevenue: totalTransitRevenue,
      totalUpkeep: totalTransitUpkeep,
      totalCarsSaved
    };

    // Department budget scaling
    const totalDeptUpkeep =
      infraUpkeep +
      pwrUpkeep * (this.budgets.power / 100) +
      wtrUpkeep * (this.budgets.water / 100) +
      svcUpkeep * svcBudgetRatio;

    let policyCost = 0;
    if (this.policies.freeTransit) policyCost += 25 + this.population * 0.018;
    if (this.policies.freeHigherEd) policyCost += 220 + this.population * 0.08;
    if (this.policies.energySubsidy) policyCost += 180 + activeBuildings * 1.2;
    if (this.policies.greenCity) policyCost += 20 + this.population * 0.014;
    if (this.policies.techBoost) policyCost += 28 + this.jobsTotal * 0.018;

    // Loan repayments
    let loanPay = 0;
    if (applyCash) {
      for (let i = this.activeLoans.length - 1; i >= 0; i--) {
        const ln = this.activeLoans[i];
        const pay = Math.min(ln.remaining, ln.periodPay);
        ln.remaining -= pay;
        loanPay += pay;
        if (ln.remaining <= 0) {
          this.latestChirp = {
            user: '@市政财政局',
            text: `🎉 债券【${ln.name}】已全额结清，财政利息负担解除！`,
            mood: 'good'
          };
          this.activeLoans.splice(i, 1);
        }
      }
    } else {
      for (let i = 0; i < this.activeLoans.length; i++) {
        loanPay += Math.min(this.activeLoans[i].remaining, this.activeLoans[i].periodPay);
      }
    }

    const diffTaxMult = this.difficulty === 'hardcore' ? 1.04 : 1.32;
    const boost = this.policies.techBoost ? 1.15 : 1.0;
    const taxIncome = Math.round(grossTax * (this.taxRate / 9) * diffTaxMult * boost);
    const totalUpkeep = Math.round(totalDeptUpkeep + policyCost);

    this.lastTaxIncome = taxIncome;
    this.lastTransitRevenue = totalTransitRevenue;
    this.lastUpkeep = totalUpkeep;
    this.lastLoanPay = loanPay;
    this.netIncome = taxIncome + totalTransitRevenue - totalUpkeep - loanPay;

    if (applyCash && this.difficulty !== 'sandbox') {
      this.money += this.netIncome;
      if (this.money < -3000) {
        this.latestChirp = {
          user: '@财政赤字预警',
          text: '🚨 国库严重赤字！请点顶部「📊 财政」调低水电预算、清理冗余道路或申请银行应急贷款！',
          mood: 'bad'
        };
      }
    }
  }

  getCityIssues() {
    const categories = {
      utility: [],
      sanitation: [],
      economy: [],
      disaster: []
    };

    const powerShort = this.powerDemand > this.powerSupply;
    const waterShort = this.waterDemand > this.waterSupply;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];

        if (t.dam && (t.damHealth ?? 100) < 75) {
          const nearReported = categories.disaster.some(
            (it) => it.title === '水力发电大坝结构受损' && Math.hypot(it.x - x, it.z - z) <= 5
          );
          if (!nearReported) {
            const hp = Math.round(t.damHealth ?? 100);
            categories.disaster.push({
              category: 'disaster',
              icon: '⚠️',
              title: '水力发电大坝结构受损',
              reason: `⚠️ 大坝结构受损 (${hp}%)，有溃坝风险！`,
              actionTip: '立即跳转点击大坝执行【🔧 加固抢修大坝 (¥450)】，并在财政面板保持电力预算 ≥ 80%',
              x,
              z,
              severity: hp < 40 ? 5 : 4
            });
          }
        }

        if (t.pipe && t.pipeBroken) {
          categories.utility.push({
            category: 'utility',
            icon: '🔴',
            title: '地下输水管道破裂',
            reason: '地震或灾害震裂地下输水管，导致周边街区断水',
            actionTip: '跳转后选择【地下输水管道】重铺该格即可修复',
            x,
            z,
            severity: 4
          });
        }

        if (t.roadGround > 0 && (t.congestion || 0) > 0.72) {
          categories.economy.push({
            category: 'economy',
            icon: '🚦',
            title: t.roadGround >= 2 ? '四车道主干道严重拥堵' : '双车道街道瘫痪拥堵',
            reason: `当前路段拥堵率高达 ${Math.round(t.congestion * 100)}%，严重阻碍商铺进货与市民通勤`,
            actionTip: '点击该路口切换【🛑 主路优先】或【🔄 改建环岛】，或拓宽四车道/架设二层高架',
            x,
            z,
            severity: 2
          });
        }

        const b = t.building;
        if (!b) continue;
        const bName = this.getBuildingDisplayName(b, x, z);

        // 1. Disasters & Abandoned Ruins
        if (b.fire > 0) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🔥',
            title: bName,
            reason: '建筑正在起火燃烧！若无消防车及时扑救将化为废墟',
            actionTip: '确保该街区道路连通已通电的【消防总署】',
            x,
            z,
            severity: 5
          });
          continue;
        }

        if (b.abandoned) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🏚️',
            title: bName,
            reason: `建筑已荒废停摆（原因：${b.abandonReason || '市政配套缺失或灾害损毁'}），拉低地价并滋生犯罪`,
            actionTip: '可点上方【🚜 一键清理全城废弃楼】，或跳转后改善配套并用【地面推土机】清理',
            x,
            z,
            severity: 2
          });
          continue;
        }

        if (b.flooded) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🌊',
            title: bName,
            reason: '河水泛滥或海啸漫灌淹没建筑',
            actionTip: '用【抬升造山/筑堤】在岸边筑防洪堤，或在上游峡谷建【水力发电大坝】控水',
            x,
            z,
            severity: 4
          });
          continue;
        }

        if (b.underConstruction) continue;

        // 2. Utility: Shore water check + Power + Water
        if (
          (b.type === 'nuclear_plant' || b.type === 'seaport' || b.type === 'water_pump' || b.type === 'sewage_out') &&
          !this.hasNearbyWater(x, z, 2).found
        ) {
          categories.utility.push({
            category: 'utility',
            icon: '💧',
            title: bName,
            reason: '周边2格内水体干涸或无水源，设施停机无法运行',
            actionTip: '用【挖河开渠】引水至岸边，或迁建至河岸/海湾沿岸',
            x,
            z,
            severity: 3
          });
          continue;
        }

        const st = this.getBuildingStats(b);
        let hasUtilityOrSanitationIssue = false;

        const needsRoadStaff = (
          b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant' ||
          b.type === 'fire_station' || b.type === 'police_station' || b.type === 'hospital' || b.type === 'school'
        );
        if (needsRoadStaff && !this.findRoadAccess(x, z)) {
          const isEnergyOrWaste = b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant';
          categories.utility.push({
            category: 'utility',
            icon: '🚧',
            title: bName,
            reason: isEnergyOrWaste
              ? '🚧 能源/环卫设施未连通道路，燃料与垃圾车无法进出'
              : '🚧 市政服务设施未连通道路，执勤车辆无法驶出覆盖街区',
            actionTip: '在该设施周边2格内修筑【双车道街道】或【四车道主干道】连通城市路网',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (!t.powered && (st.power > 0 || BUILDING_NAMES[b.type])) {
          categories.utility.push({
            category: 'utility',
            icon: '⚡',
            title: bName,
            reason: powerShort
              ? `全市发电量不足（需求 ${this.powerDemand} MW > 供给 ${this.powerSupply} MW）`
              : '未接入高压电网传导范围，建筑处于断电状态',
            actionTip: powerShort
              ? '增建风电/光热/燃气/核电站，或在【📊 财政】调高电力预算'
              : '在电厂与该街区之间架设【高压输电铁塔】接力供电',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (!t.watered && (st.water > 0 || BUILDING_NAMES[b.type])) {
          categories.utility.push({
            category: 'utility',
            icon: '🔵',
            title: bName,
            reason: waterShort
              ? `全市供水量不足（需求 ${this.waterDemand} > 供给 ${this.waterSupply}）`
              : '周边4格内未铺设连通抽水站的地下输水管',
            actionTip: waterShort
              ? '在上游洁净河岸增建已通电的【河畔抽水站】或【生态净水中心】'
              : '选择【地下输水管道】从已通电的抽水站铺设管道覆盖此街区',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        // 3. Sanitation, Sewage Backup & Pollution Health
        if (b.sewageBackedUp) {
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🚱',
            title: `🚱 排污能力不足·污水倒灌（${bName}）`,
            reason: `全市用水排污量 (${this.waterDemand}) 超过排污上限 (${this.sewageSupply})，下水道超载导致污水倒灌`,
            actionTip: '在下游河岸增建通电的【河道排污口】或建造零污染【生态净水中心】扩容排污',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (b.sick && (!b.sewageBackedUp || this.waterPollutedPct >= 10 || t.pollution > 28)) {
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🤢',
            title: bName,
            reason: this.waterPollutedPct >= 10
              ? `抽水站吸入下游污水（水源污染 ${this.waterPollutedPct}%）导致居民集体患病`
              : '住宅区紧邻重工业、燃气电厂或发臭黑水河岸，毒雾臭气导致居民患病',
            actionTip: this.waterPollutedPct >= 10
              ? '立即拆除下游抽水站，改在【上游洁净河岸】取水或建【生态净水中心】'
              : '增建通电通车的【大型综合医院】，并将重工业/排污口迁离住宅区',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (b.trashPiled) {
          const gridlockBlocked = (b.gridlockTrashTicks || 0) > 0 && this.trashDemand <= this.trashSupply * 1.15;
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🗑️',
            title: bName,
            reason: gridlockBlocked
              ? '垃圾车被堵在半路无法清运，导致街区垃圾堆积'
              : `垃圾堆积需增建垃圾焚烧厂（全市垃圾产出 ${this.trashDemand} > 处理力 ${this.trashSupply}）`,
            actionTip: gridlockBlocked
              ? '疏通沿途拥堵路口（改建环岛/主路优先或拓宽四车道）让垃圾车顺利进入'
              : '在远离住宅区的道路旁增建通车的【环保垃圾焚烧厂】清运垃圾并产出电力',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        // 4. High-Tech Workforce Education Shortage (educatedRate < 28% on O or I Lv.4+)
        if (this.educatedRate < 28 && (b.type === 'O' || (b.type === 'I' && b.level >= 4))) {
          categories.economy.push({
            category: 'economy',
            icon: '🎓',
            title: `🎓 缺乏高学历人才（${bName}）`,
            reason: `当前全市高学历率仅 ${this.educatedRate}%（低于 28%），办公区与高科工业效率 -28%`,
            actionTip: '在住宅区连通道路旁增建通电的【市立理工大学】，或在财政政策面板开启【🎓 免费高等教育】',
            x,
            z,
            severity: 3
          });
        }

        // 5. Economy & Operating Distress Warnings (deduplicated from utility/sanitation)
        if (!hasUtilityOrSanitationIssue && (b.distress > 0 || b.abandonReason)) {
          const reason = b.abandonReason || '周边经营环境恶化';
          let tip = '改善周边道路交通、降低税率或补充市政服务设施';
          if (reason.includes('城际高速') || reason.includes('断联')) tip = '修筑道路或匝道将该街区连通至南侧(22,55)城际高速，或接入通电的高铁站/海港/机场';
          else if (reason.includes('道路被切断')) tip = '在该建筑2格内补修地面街道以恢复交通连接';
          else if (reason.includes('污水倒灌')) tip = '在下游河岸增建通电的【河道排污口】或建造【生态净水中心】扩容排污';
          else if (reason.includes('大学') || reason.includes('学历')) tip = '在连通道路旁建造通电的【市立理工大学】培养高学历白领人才';
          else if (reason.includes('税')) tip = '打开顶部【📊 财政】面板，将综合税率调回 9%~11%';
          else if (reason.includes('用工荒')) tip = '增划低密/高密【住宅区】吸引市民迁入补充劳动力';
          else if (reason.includes('供货') || reason.includes('断货')) tip = '增划【工业制造区】、建造【深水海港】或疏通拥堵道路';
          else if (reason.includes('污染')) tip = '清理周边高污染工厂，或在财政面板开启【绿色环保城市条例】';

          categories.economy.push({
            category: 'economy',
            icon: '⚠️',
            title: bName,
            reason: `经营预警：${reason}（恶化度 ${b.distress || 1}/7）`,
            actionTip: tip,
            x,
            z,
            severity: b.distress >= 4 ? 3 : 2
          });
        }
      }
    }

    for (const key of Object.keys(categories)) {
      categories[key].sort((a, b) => b.severity - a.severity);
    }

    const total =
      categories.utility.length +
      categories.sanitation.length +
      categories.economy.length +
      categories.disaster.length;

    return { total, categories };
  }

  clearAllAbandoned() {
    let hasAny = false;
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i].building && this.grid[i].building.abandoned) {
        hasAny = true;
        break;
      }
    }
    if (hasAny) {
      this.pushUndoSnapshot('清理废弃建筑');
    }
    let cleared = 0;
    let cost = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.building && t.building.abandoned) {
        t.building = null;
        cleared++;
        if (this.difficulty !== 'sandbox' && this.money >= cost + 5) {
          cost += 5;
        }
      }
    }
    if (cleared > 0) {
      if (this.difficulty !== 'sandbox' && cost > 0) {
        this.money -= cost;
      }
      if (this.sfx && this.sfx.bulldoze) this.sfx.bulldoze();
      this.recomputeNetworksAndFields();
      this.stepEconomy(false);
      this.buildingDirty = true;
    }
    return { cleared, cost };
  }

  getUpgradeHint(t) {
    if (!t) return '';
    if (t.dam) {
      const hp = Math.round(t.damHealth ?? 100);
      if (hp < 75) {
        return `⚠️ 警告：坝体健康度已降至 ${hp}%！请立即点击下方【🔧 加固抢修大坝】并保证电力预算充足防溃坝！`;
      }
      return `🏗️ 水力发电大坝：单段出力 ${t.damOutputMW || 0} MW（全坝总计 ${this.hydroPowerMW} MW · 结构健康 ${hp}%）`;
    }
    const b = t.building;
    if (!b) return '';
    if (b.abandoned) return `🏚️ 已废弃（原因：${b.abandonReason || '环境恶化'}）！请用【推土机】清理或改善条件重建`;
    if (b.fire > 0) return '🔥 正在着火！需道路连通已通电的【消防总署】并保证通水灭火！';
    if (b.flooded) return '🌊 遭受水淹！请用【抬升造山】筑防洪堤或在上游建大坝控水';
    if (b.sewageBackedUp) return '🚱 污水倒灌危机！全市排污量超出上限，请立即在下游增建通电的【排污口】或【生态净水中心】！';
    if (b.sick) return '🤢 居民生病！请检查抽水站是否吸入下游污水，或住宅是否紧邻工厂/电厂/黑臭河岸！';
    if (b.trashPiled) return '🗑️ 垃圾围城无人清运！请尽快在道路旁建造【环保垃圾焚烧厂】提升环卫处理能力！';
    if (
      (b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant' ||
       b.type === 'fire_station' || b.type === 'police_station' || b.type === 'hospital' || b.type === 'school') &&
      !this.findRoadAccess(t.x, t.z)
    ) {
      return '🚧 设施未连通地面道路（当前无法运转）！请在周边2格内修筑街道接入城市路网';
    }
    if ((b.type === 'water_pump' || b.type === 'sewage_out' || b.type === 'water_treat') && !t.powered) {
      return '⚡ 水务设施断电停机（当前供水/排污出力为 0）！请架设【高压输电铁塔】接入电网';
    }
    if (b.type === 'nuclear_plant' && !this.hasNearbyWater(t.x, t.z, 2).found) return '☢️ 缺少冷却水源！核裂变电站2格内必须有河水或海水才能发电';
    if (b.type === 'seaport' && !this.hasNearbyWater(t.x, t.z, 2).found) return '🚢 航道干涸！海港2格内必须紧邻海湾或深水河道才能靠泊货轮';
    if ((b.type === 'O' || (b.type === 'I' && b.level >= 4)) && this.educatedRate < 28) {
      return `🎓 缺乏高学历人才（全市高学历率 ${this.educatedRate}% < 28%，效率 -28%）！请建【市立理工大学】或开启【免费高等教育】`;
    }
    if ((b.type === 'RL' || b.type === 'RH') && (t.noise || 0) > 55) {
      return `🔊 周边声学噪音过高（${t.noise} dB）拖累幸福度与地价！建议在临街道路开启【禁行重卡】或增建【中央景观公园】隔音`;
    }
    if (b.abandonReason) return `⚠️ 经营预警：${b.abandonReason}（持续恶化将导致荒废倒闭！）`;
    if (b.underConstruction) return '🏗️ 塔吊正在施工中...';
    if (!BUILDING_NAMES[b.type]) return CATALOG[b.type]?.desc || '';
    if (!t.powered) return '⚡ 未通电！请建风电/电厂，远距离需架设【高压输电铁塔】';
    if (!t.watered) return '🔵 未通水！请切换【地下输水管】铺设管道连接上游抽水站';
    const maxLv = this.getMaxLevelForZone(b.type);
    if (b.level >= maxLv) return `🏆 已达该区划封顶等级 Lv.${maxLv}！`;
    if ((b.type === 'RH' || b.type === 'CH' || b.type === 'O') && b.level >= 2 && (t.education || 0) < 20) {
      return '🏫 升级受阻：高层大厦急需【市立理工大学】提供高学历人才！';
    }
    return `📈 保持低拥堵，增建【公园 / 医院 / 大学 / 地铁站】拉升地价即可升至 Lv.${b.level + 1}`;
  }

  // ==================== Preset 0: Beginner Guided Tutorial City (Clean Map + ¥42,000) ====================
  setupTutorialCity(seed = 2026) {
    this.seed = seed;
    this.cityName = '新星教学城';
    this.difficulty = 'normal';
    this.unlockAll = false;
    this.money = 42000;
    this.taxRate = 9;
    this.budgets = { power: 90, water: 90, service: 100 };
    this.activeLoans = [];
    this.undoStack = [];
    this._lastSculptUndoAt = 0;
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = 0;
    this.tempHappinessMonths = 0;
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.38;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@建城总顾问',
      text: '🎓 欢迎来到新手建城教学！请跟随左上角《📋 建城指引》从第 1 步修筑街道开始规划吧！',
      mood: 'info'
    };
    this.policies = createDefaultPolicies();

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this.stepEconomy();
    this.seedBaselineHistory(6);
    this.meshDirty = true;
  }

  _placePylonChain(x0, z0, x1, z1) {
    let curX = x0;
    let curZ = z0;
    let curIsPylon = Boolean(this.getTile(curX, curZ)?.pylon);

    for (let step = 0; step < 24; step++) {
      const reachR = curIsPylon ? 6 : 3;
      const dxEnd = x1 - curX;
      const dzEnd = z1 - curZ;
      if (dxEnd * dxEnd + dzEnd * dzEnd <= reachR * reachR) break;

      const curDist = Math.hypot(dxEnd, dzEnd);
      let best = null;
      let bestScore = curDist;

      for (let dz = -reachR; dz <= reachR; dz++) {
        for (let dx = -reachR; dx <= reachR; dx++) {
          if (dx * dx + dz * dz > reachR * reachR) continue;
          const nx = curX + dx, nz = curZ + dz;
          if (!inBounds(nx, nz)) continue;
          const nt = this.grid[idx(nx, nz)];
          const canUseExistingPylon = nt.pylon;
          const canPlaceNewPylon = (
            !this.isWaterTile(nx, nz) &&
            nt.roadGround === 0 &&
            nt.roadElevated === 0 &&
            nt.rail === 0 &&
            !nt.building &&
            !nt.dam &&
            !nt.zone
          );
          if (!canUseExistingPylon && !canPlaceNewPylon) continue;
          const remDist = Math.hypot(x1 - nx, z1 - nz) - (canUseExistingPylon ? 0.15 : 0);
          if (remDist < bestScore - 0.1) {
            bestScore = remDist;
            best = { x: nx, z: nz, existing: canUseExistingPylon };
          }
        }
      }

      if (!best) break;
      if (!best.existing) {
        this.applyTool('power_pylon', [{ x: best.x, z: best.z }], true);
      }
      curX = best.x;
      curZ = best.z;
      curIsPylon = true;
    }
  }

  _ensurePowerTo(targetX, targetZ) {
    this.recomputeNetworksAndFields();
    const targetTile = this.getTile(targetX, targetZ);
    if (!targetTile || targetTile.powered) return;

    let bestSrc = null;
    let bestDist = 1e9;
    for (let i = 0; i < this.grid.length; i++) {
      const st = this.grid[i];
      if (!st.powered) continue;
      if (!(st.pylon || st.building || st.zone || st.dam)) continue;
      const d = Math.hypot(st.x - targetX, st.z - targetZ) - (st.pylon ? 2.5 : 0);
      if (d < bestDist) {
        bestDist = d;
        bestSrc = st;
      }
    }
    if (bestSrc) {
      this._placePylonChain(bestSrc.x, bestSrc.z, targetX, targetZ);
      this.recomputeNetworksAndFields();
    }
  }

  _ensureRoadTo(targetX, targetZ, roadTool = 'road_1') {
    this.recomputeNetworksAndFields();
    const curAcc = this.findRoadAccess(targetX, targetZ);
    if (curAcc && curAcc.roadTile?.outsideConnected) return;

    const N = this.grid.length;
    const prev = new Int32Array(N);
    prev.fill(-1);
    const vis = new Uint8Array(N);
    const q = [];

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      if ((t.roadGround === 1 || t.roadGround === 2 || t.roadGround === 3) && t.outsideConnected) {
        vis[i] = 1;
        q.push(i);
      }
    }
    if (q.length === 0) return;

    const isGoal = (gx, gz) => {
      const adx = Math.abs(gx - targetX);
      const adz = Math.abs(gz - targetZ);
      return (adx === 0 && (adz === 1 || adz === 2)) || (adz === 0 && (adx === 1 || adx === 2));
    };

    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let foundIdx = -1;
    let head = 0;
    while (head < q.length) {
      const ci = q[head++];
      const cx = ci % GRID_SIZE;
      const cz = (ci / GRID_SIZE) | 0;
      if (isGoal(cx, cz) && !this.isWaterTile(cx, cz)) {
        foundIdx = ci;
        break;
      }
      for (const [dx, dz] of dirs4) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz) || (nx === targetX && nz === targetZ)) continue;
        const ni = idx(nx, nz);
        if (vis[ni]) continue;
        const nt = this.grid[ni];
        if (nt.dam || nt.roadGround === 3 || nt.rail > 0 || nt.pylon) continue;
        if (nt.building || nt.zone) continue;
        const wet = this.isWaterTile(nx, nz);
        const { slope } = this.getTileMinMaxElev(nx, nz);
        if (slope > 0.72 && !wet) continue;
        vis[ni] = 1;
        prev[ni] = ci;
        q.push(ni);
      }
    }

    if (foundIdx >= 0) {
      const path = [];
      let cur = foundIdx;
      while (cur >= 0) {
        const t = this.grid[cur];
        if (t.roadGround === 0) {
          path.push({ x: cur % GRID_SIZE, z: (cur / GRID_SIZE) | 0 });
        }
        cur = prev[cur];
      }
      path.reverse();
      if (path.length > 0) {
        this.applyTool(roadTool, path, true);
      }
      this.recomputeNetworksAndFields();
    }
  }

  // ==================== Preset 1: Hardcore Starter Town (Real Challenge!) ====================
  setupStarterTown(seed = 2026) {
    this.seed = seed;
    this.cityName = '山河天际市';
    this.difficulty = 'hardcore';
    this.unlockAll = false;
    this.money = 32000;
    this.taxRate = 9;
    this.budgets = { power: 80, water: 80, service: 100 }; // Smart frugal startup budget!
    this.activeLoans = [];
    this.undoStack = [];
    this._lastSculptUndoAt = 0;
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = 0;
    this.tempHappinessMonths = 0;
    this._suppressPromotions = true;
    this.mayorLevel = 1;
    this.mayorXP = 95;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.36;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };
    this.policies = createDefaultPolicies();

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();

    // Modest, realistic starter connection from South Highway (x=22, z=52->43)
    this.applyTool('road_1', this.computeLineOrLPath(22, 52, 22, 43), true);
    this.applyTool('road_1', this.computeLineOrLPath(16, 46, 27, 46), true);
    this.applyTool('road_1', this.computeLineOrLPath(17, 43, 25, 43), true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 50, 28, 50), true);

    // 1 Wind Turbine on starter hill (adjacent to z=46 road)
    this.applyTool('power_wind', [{ x: 16, z: 45 }], true);

    // Clean Upstream River Pump & Downstream Sewage Outfall (pick nearest dry bank spots!)
    let pumpPos = { x: 25, z: 35 };
    let bestPumpDist = 1e9;
    for (let z = 29; z <= 36; z++) {
      for (let x = 23; x <= 35; x++) {
        if (!this.isWaterTile(x, z) && this.hasNearbyWater(x, z, 1).found && this.getTileMinMaxElev(x, z).slope <= 0.62) {
          const d = Math.hypot(x - 24, z - 38);
          if (d < bestPumpDist) {
            bestPumpDist = d;
            pumpPos = { x, z };
          }
        }
      }
    }
    let sewPos = { x: 36, z: 43 };
    let bestSewDist = 1e9;
    for (let z = 40; z <= 47; z++) {
      for (let x = 34; x <= 46; x++) {
        if (!this.isWaterTile(x, z) && this.hasNearbyWater(x, z, 1).found && this.getTileMinMaxElev(x, z).slope <= 0.62) {
          const d = Math.hypot(x - 33, z - 45);
          if (d < bestSewDist) {
            bestSewDist = d;
            sewPos = { x, z };
          }
        }
      }
    }

    this.applyTool('water_pump', [pumpPos], true);
    this.applyTool('sewage_out', [sewPos], true);

    // Zone residential AWAY from industrial! (RL on west, CL in middle, I on southeast downwind/away!)
    this.applyTool('zone_RL', this.computeRectTiles(17, 44, 21, 45), true);
    this.applyTool('zone_CL', this.computeRectTiles(23, 44, 24, 45), true);
    this.applyTool('zone_I',  this.computeRectTiles(25, 49, 28, 51), true);

    // Connect service streets to pump & sewage outfall routing around zoned blocks
    this._ensureRoadTo(pumpPos.x, pumpPos.z, 'road_1');
    this._ensureRoadTo(sewPos.x, sewPos.z, 'road_1');

    this.applyTool('water_pipe', this.computeLineOrLPath(pumpPos.x, pumpPos.z, 22, 45, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(17, 45, 22, 45, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(22, 45, sewPos.x, sewPos.z, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(22, 45, 27, 50, false), true);

    for (const [bx, bz, bt] of [[18,44,'RL'],[19,44,'RL'],[20,45,'RL'],[23,44,'CL'],[26,49,'I'],[27,49,'I']]) {
      const t = this.getTile(bx, bz);
      const acc = this.findRoadAccess(bx, bz);
      if (t && acc) {
        t.building = {
          type: bt, level: 1, variant: (bx + bz) % 5, rot: acc.rot,
          underConstruction: false, buildProgress: 1, upgradeProgress: 10,
          fire: 0, sick: false, trashPiled: false, sewageBackedUp: false,
          flooded: false, abandoned: false, distress: 0, abandonReason: ''
        };
      }
    }

    // Guarantee HV Power Pylons reach industrial park, upstream pump, and downstream sewage outfall at frame 0!
    this._placePylonChain(24, 45, 26, 49);
    this._ensurePowerTo(26, 49);
    this._ensurePowerTo(pumpPos.x, pumpPos.z);
    this._ensurePowerTo(sewPos.x, sewPos.z);

    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    this.syncCompletedQuestsSilent();
    this.stepEconomy();
    this.seedBaselineHistory(6);
    this.meshDirty = true;
  }

  // ==================== Preset 2: Pure Blank Canyon Challenge ====================
  setupBlankMap(seed = Math.floor(1000 + Math.random() * 8999)) {
    this.seed = seed;
    this.cityName = '未名山河城';
    this.difficulty = 'hardcore';
    this.unlockAll = false;
    this.money = 38000;
    this.taxRate = 9;
    this.budgets = { power: 80, water: 80, service: 90 };
    this.activeLoans = [];
    this.undoStack = [];
    this._lastSculptUndoAt = 0;
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = 0;
    this.tempHappinessMonths = 0;
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.38;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };
    this.policies = createDefaultPolicies();

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this.stepEconomy();
    this.history = [];
    this.recordHistorySnapshot();
    this.meshDirty = true;
  }

  // ==================== Preset 3: Grand 3D Showcase (All Systems Unlocked!) ====================
  setupMetropolisShowcase() {
    this._suppressPromotions = true;
    this.seed = 2026;
    this.cityName = '山河立体大都会';
    this.difficulty = 'normal';
    this.unlockAll = true;
    this.money = 185000;
    this.taxRate = 9;
    this.budgets = { power: 110, water: 110, service: 110 };
    this.activeLoans = [];
    this.undoStack = [];
    this._lastSculptUndoAt = 0;
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.tempDemandBoost = { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = 0;
    this.tempHappinessMonths = 0;
    this.mayorLevel = 10;
    this.mayorXP = 15000;
    this.gridlockTimeouts = 0;
    this.guideStep = MAYOR_QUESTS.length;
    this.completedQuests = MAYOR_QUESTS.map((q) => q.step);
    this.year = 2032; this.month = 8; this.day = 15;
    this.dayProgress = 0.40;
    this.milestoneIdx = MILESTONES.length - 1;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.policies = Object.assign(createDefaultPolicies(), {
      freeTransit: true,
      greenEnergy: true,
      freeHigherEd: true,
      greenCity: true,
      techBoost: true
    });

    const world = generateWorld(this.seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();

    // 1. NW Alpine Canyon Hydroelectric Dam + Impounded Reservoir + HV Pylons!
    const damSpan = this.computeLineOrLPath(10, 16, 16, 10, true);
    this.applyTool('hydro_dam', damSpan, true);
    for (let z = 2; z <= 15; z++) {
      for (let x = 2; x <= 15; x++) {
        if ((x + z) < 26 && !this.grid[idx(x, z)].dam) {
          const elev = this.getTileElev(x, z);
          if (elev < 1.55) {
            this.waterDepth[idx(x, z)] = Math.max(this.waterDepth[idx(x, z)], 1.52 - elev);
          }
        }
      }
    }
    // Route HV transmission line cleanly along West foothills (x=11..12), 100% clear of the International Airport runway!
    for (const py of [[11, 18], [11, 22], [11, 26], [12, 30]]) {
      this.applyTool('power_pylon', [{ x: py[0], z: py[1] }], true);
    }

    // 2. Road Network + River Bridges + Mountain Ridge Tunnel
    this.applyTool('road_2', this.computeLineOrLPath(22, 52, 22, 14), true);
    this.applyTool('road_2', this.computeLineOrLPath(12, 38, 36, 38), true);
    this.applyTool('road_2', this.computeLineOrLPath(12, 32, 34, 32), true);
    this.applyTool('road_1', this.computeLineOrLPath(12, 44, 34, 44), true);
    for (const x of [12, 17, 27, 33]) {
      this.applyTool('road_1', this.computeLineOrLPath(x, 32, x, 46), true);
    }
    const rbtTile = this.getTile(17, 44);
    if (rbtTile) { rbtTile.junctionMode = 'roundabout'; rbtTile.roundaboutPaid = true; }
    const yldTile = this.getTile(27, 38);
    if (yldTile) { yldTile.junctionMode = 'yield'; }

    this.applyTool('road_2', this.computeLineOrLPath(22, 19, 31, 19), true);
    this.applyTool('road_tunnel', this.computeLineOrLPath(32, 19, 41, 19, true), true);
    this.applyTool('road_2', this.computeLineOrLPath(42, 19, 46, 26), true);

    // 3. Elevated Highway Viaducts (+1 Layer) + Smooth Multi-Tile Ramp + Over-Avenue Median Ramp!
    this.applyTool('road_2', this.computeLineOrLPath(9, 35, 12, 35), true);
    this.applyTool('road_ramp', [{ x: 10, z: 35 }, { x: 11, z: 35 }], true);
    this.applyTool('road_elev', this.computeLineOrLPath(12, 35, 34, 35, true), true);
    this.applyTool('road_2', this.computeLineOrLPath(33, 35, 35, 35), true);
    this.applyTool('road_ramp', [{ x: 35, z: 35 }], true);

    this.applyTool('road_1', [{ x: 25, z: 46 }, { x: 24, z: 46 }, { x: 23, z: 46 }, { x: 22, z: 46 }], true);
    this.applyTool('road_ramp', [{ x: 25, z: 47 }], true);
    this.applyTool('road_elev', this.computeLineOrLPath(25, 46, 25, 29, true), true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 28, 25, 28), true);
    this.applyTool('road_ramp', [{ x: 25, z: 28 }], true);

    // Over-Avenue Median Ramp along the z=38 4-lane Boulevard (keeps ground avenue flowing on both sides!)
    this.applyTool('road_elev', this.computeLineOrLPath(25, 38, 29, 38, true), true);
    this.applyTool('road_ramp', [{ x: 30, z: 38 }, { x: 31, z: 38 }], true);

    // 4. High-Speed Rail Mainline + HSR Viaduct Bridge + 2 HSR Central Stations
    this.applyTool('rail_track', this.computeLineOrLPath(8, 52, 8, 36), true);
    this.applyTool('hsr_station', [{ x: 8, z: 35 }], true);
    this.applyTool('road_1', this.computeLineOrLPath(8, 36, 12, 36), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(8, 35, 10, 33, false), true);
    this.applyTool('power_pylon', [{ x: 11, z: 34 }], true);
    this.applyTool('rail_track', this.computeLineOrLPath(8, 34, 8, 24), true);
    this.applyTool('rail_track', this.computeLineOrLPath(8, 24, 33, 24), true);
    this.applyTool('hsr_station', [{ x: 34, z: 24 }], true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 25, 34, 25), true);
    this.applyTool('road_1', this.computeLineOrLPath(34, 25, 34, 32), true);
    this.applyTool('power_pylon', [{ x: 38, z: 24 }], true);

    // 5. Underground Metro Loop + 4 Stations
    this.applyTool('metro_line', this.computeLineOrLPath(14, 33, 31, 33), true);
    this.applyTool('metro_line', this.computeLineOrLPath(31, 33, 31, 43), true);
    this.applyTool('metro_line', this.computeLineOrLPath(31, 43, 14, 43), true);
    this.applyTool('metro_line', this.computeLineOrLPath(14, 43, 14, 33), true);
    this.applyTool('metro_station', [{ x: 14, z: 33 }], true);
    this.applyTool('metro_station', [{ x: 23, z: 33 }], true);
    this.applyTool('metro_station', [{ x: 31, z: 39 }], true);
    this.applyTool('metro_station', [{ x: 18, z: 43 }], true);

    // 6. Water Treatment + Underground Pipe Grid + Backup Power (full road & pipe coverage x=9..39!)
    this.applyTool('road_1', this.computeLineOrLPath(9, 50, 39, 50), true);
    this.applyTool('road_1', this.computeLineOrLPath(12, 46, 12, 50), true);
    for (const x of [11, 13, 15, 17, 19, 21, 23, 25, 27]) {
      this.applyTool('water_treat', [{ x, z: 48 }], true);
    }
    this.applyTool('water_pipe', this.computeLineOrLPath(9, 48, 46, 48), true);
    for (const z of [22, 26, 33, 39, 45]) {
      this.applyTool('water_pipe', this.computeLineOrLPath(10, z, 46, z), true);
    }
    this.applyTool('water_pipe', this.computeLineOrLPath(18, 48, 18, 22), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(32, 48, 32, 22), true);

    this.applyTool('power_plant', [{ x: 36, z: 49 }], true);
    this.applyTool('power_plant', [{ x: 38, z: 49 }], true);
    this.applyTool('water_pipe', this.computeLineOrLPath(9, 50, 42, 50), true);
    this.applyTool('power_pylon', [{ x: 20, z: 45 }], true);

    // Eco Waste-to-Energy Plants (2x initial + auto-scaled below) & Molten Salt Solar Plant
    this.applyTool('waste_plant', [{ x: 24, z: 51 }], true);
    this.applyTool('waste_plant', [{ x: 26, z: 51 }], true);
    this.applyTool('solar_plant', [{ x: 33, z: 51 }], true);

    // 7. Full Civic Coverage + Olympic Stadium + Waterfront Ferris Wheel + Airport + Seaport
    this.applyTool('landmark', [{ x: 21, z: 33 }], true);
    this.applyTool('fire_station', [{ x: 16, z: 39 }], true);
    this.applyTool('fire_station', [{ x: 28, z: 39 }], true);
    this.applyTool('police_station', [{ x: 20, z: 39 }], true);
    this.applyTool('hospital', [{ x: 23, z: 37 }], true);
    this.applyTool('school', [{ x: 19, z: 37 }], true);
    this.applyTool('school', [{ x: 24, z: 42 }], true);
    this.applyTool('park', [{ x: 20, z: 33 }], true);
    this.applyTool('park', [{ x: 24, z: 33 }], true);
    this.applyTool('park', [{ x: 44, z: 24 }], true);

    // Olympic Sports Center along North CBD Avenue (z=32)
    for (const sx of [18, 19, 17, 16, 20, 27]) {
      if (!this.isWaterTile(sx, 31) && !this.getTile(sx, 31)?.building) {
        if (this.applyTool('stadium', [{ x: sx, z: 31 }], true).ok) break;
      }
    }

    // Coastal/Waterfront Ferris Wheel Amusement Park
    let placedAmusement = false;
    for (const cand of [
      { x: 30, z: 39 }, { x: 29, z: 39 }, { x: 34, z: 37 },
      { x: 35, z: 37 }, { x: 34, z: 39 }, { x: 27, z: 31 }
    ]) {
      if (!this.isWaterTile(cand.x, cand.z) && this.applyTool('amusement_park', [cand], true).ok) {
        placedAmusement = true;
        break;
      }
    }
    if (!placedAmusement) {
      for (let z = 36; z <= 42 && !placedAmusement; z++) {
        for (let x = 28; x <= 36 && !placedAmusement; x++) {
          if (!this.isWaterTile(x, z) && this.findRoadAccess(x, z) && this.applyTool('amusement_park', [{ x, z }], true).ok) {
            placedAmusement = true;
          }
        }
      }
    }

    // International Civil Airport in open flat area with unobstructed 3.8-unit E-W runway corridor (z-1, x-2..x+2)
    let airportPos = null;
    let bestScore = 999;
    for (let z = 27; z <= 30; z++) {
      for (let x = 15; x <= 20; x++) {
        const t = this.getTile(x, z);
        if (!t || this.isWaterTile(x, z) || this.hasNearbyWater(x, z, 1).found) continue;
        if (t.building || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.pylon) continue;
        let corridorClear = true;
        for (let rx = x - 2; rx <= x + 2; rx++) {
          const rt = this.getTile(rx, z - 1);
          if (!rt || this.isWaterTile(rx, z - 1) || rt.building || rt.roadGround > 0 || rt.roadElevated > 0 || rt.rail > 0 || rt.pylon) {
            corridorClear = false;
            break;
          }
        }
        const { slope } = this.getTileMinMaxElev(x, z);
        const score = slope + (corridorClear ? 0 : 2.0);
        if (score < bestScore) {
          bestScore = score;
          airportPos = { x, z };
        }
      }
    }
    if (!airportPos) airportPos = { x: 17, z: 28 };
    // Clear any stray trees along the runway safety strip north of the terminal (z-1, x-2..x+2)
    for (let rx = airportPos.x - 2; rx <= airportPos.x + 2; rx++) {
      const rt = this.getTile(rx, airportPos.z - 1);
      if (rt) rt.trees = 0;
    }
    const apRoadZ = Math.min(31, airportPos.z + 1);
    this.applyTool('road_2', this.computeLineOrLPath(airportPos.x, apRoadZ, 22, apRoadZ), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(18, 28, airportPos.x, airportPos.z, false), true);
    this.applyTool('airport', [airportPos], true);
    this.applyTool('power_pylon', [{ x: Math.max(12, airportPos.x - 1), z: Math.min(31, airportPos.z + 2) }], true);

    // Deep-Water Container Seaport on SE Sea Bay coastal shore (z >= 40, x >= 36)
    const oceanWet = new Uint8Array(GRID_SIZE * GRID_SIZE);
    const oq = [];
    for (let z = 46; z < GRID_SIZE; z++) {
      for (let x = 46; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        if (this.waterDepth[i] > 0.12) {
          oceanWet[i] = 1;
          oq.push(i);
        }
      }
    }
    let oHead = 0;
    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (oHead < oq.length) {
      const ci = oq[oHead++];
      const cx = ci % GRID_SIZE, cz = (ci / GRID_SIZE) | 0;
      for (const [dx, dz] of dirs4) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (!oceanWet[ni] && this.waterDepth[ni] > 0.12) {
          oceanWet[ni] = 1;
          oq.push(ni);
        }
      }
    }

    let seaportPos = null;
    let bestPortDist = 9999;
    for (let z = 40; z <= 51; z++) {
      for (let x = 36; x <= 51; x++) {
        const t = this.getTile(x, z);
        if (!t || this.isWaterTile(x, z) || t.building || t.roadGround > 0 || t.dam) continue;
        if (!this.hasNearbyWater(x, z, 2).found) continue;
        let touchesBay = false;
        for (let dz = -2; dz <= 2 && !touchesBay; dz++) {
          for (let dx = -2; dx <= 2 && !touchesBay; dx++) {
            const nx = x + dx, nz = z + dz;
            if (inBounds(nx, nz) && oceanWet[idx(nx, nz)]) touchesBay = true;
          }
        }
        if (!touchesBay && oq.length > 0) continue;
        const d = Math.hypot(x - 38, z - 45);
        if (d < bestPortDist) {
          bestPortDist = d;
          seaportPos = { x, z };
        }
      }
    }
    if (seaportPos) {
      this.applyTool('seaport', [seaportPos], true);
      // Connect road & water pipe & power pylons to Seaport
      const roadTarget = !this.isWaterTile(seaportPos.x - 1, seaportPos.z)
        ? { x: seaportPos.x - 1, z: seaportPos.z }
        : { x: seaportPos.x, z: Math.max(40, seaportPos.z - 1) };
      this.applyTool('road_1', this.computeLineOrLPath(34, 44, roadTarget.x, roadTarget.z), true);
      this.applyTool('water_pipe', this.computeLineOrLPath(32, 45, seaportPos.x, seaportPos.z, false), true);
      const portPylons = this.computeLineOrLPath(38, 48, seaportPos.x, seaportPos.z, true);
      for (let k = 2; k < portPylons.length - 1; k += 3) {
        this.applyTool('power_pylon', [portPylons[k]], true);
      }
    }

    // 8. Balanced Zones (with Industrial well separated in South-East!)
    this.applyTool('zone_CH', this.computeRectTiles(18, 33, 26, 37), true);
    this.applyTool('zone_O',  this.computeRectTiles(13, 33, 16, 37), true);
    this.applyTool('zone_RH', this.computeRectTiles(13, 39, 25, 43), true);
    this.applyTool('zone_CL', this.computeRectTiles(28, 33, 32, 37), true);
    this.applyTool('zone_I',  this.computeRectTiles(28, 46, 36, 48), true);
    this.applyTool('zone_RL', this.computeRectTiles(43, 20, 47, 26), true);
    this.applyTool('power_wind', [{ x: 41, z: 21 }], true);
    this.applyTool('power_pylon', [{ x: 41, z: 24 }], true);
    this.applyTool('water_pipe', this.computeLineOrLPath(42, 22, 45, 25, false), true);

    if (this.waterPhysics) {
      for (let k = 0; k < 25; k++) this.waterPhysics.step();
    }
    this.recomputeNetworksAndFields();

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (!t.zone || this.isWaterTile(x, z)) continue;
        const acc = this.findRoadAccess(x, z);
        if (!acc) continue;
        const maxLv = this.getMaxLevelForZone(t.zone);
        const r = hash2D(x, z, 777);
        const lv = Math.max(2, Math.min(maxLv, Math.round(maxLv * (0.65 + r * 0.35))));
        t.building = {
          type: t.zone,
          level: lv,
          variant: Math.floor(r * 8),
          rot: acc.rot,
          underConstruction: false,
          buildProgress: 1,
          upgradeProgress: 50,
          fire: 0,
          sick: false,
          trashPiled: false,
          flooded: false,
          abandoned: false,
          distress: 0,
          abandonReason: ''
        };
      }
    }

    this.recomputeNetworksAndFields();

    // Ensure 100% surplus on Trash, Water, Sewage, Power & Road/Grid Connectivity for Showcase Metropolis!
    const extraWasteSpots = [{ x: 28, z: 51 }, { x: 30, z: 51 }, { x: 20, z: 51 }, { x: 18, z: 51 }, { x: 16, z: 51 }];
    for (const wp of extraWasteSpots) {
      if (this.trashSupply > this.trashDemand * 1.65) break;
      this.applyTool('waste_plant', [wp], true);
      this.recomputeNetworksAndFields();
    }
    const extraWaterSpots = [
      { x: 29, z: 48 }, { x: 9, z: 48 }, { x: 14, z: 51 },
      { x: 12, z: 51 }, { x: 10, z: 51 }, { x: 31, z: 51 },
      { x: 22, z: 51 }, { x: 15, z: 51 }
    ];
    for (const wt of extraWaterSpots) {
      if (this.waterSupply > this.waterDemand * 1.48 && this.sewageSupply > this.waterDemand * 1.55) break;
      this.applyTool('water_treat', [wt], true);
      this.applyTool('water_pipe', [{ x: wt.x, z: wt.z }], true);
      this._ensurePowerTo(wt.x, wt.z);
    }
    const extraSolarSpots = [{ x: 35, z: 51 }, { x: 37, z: 51 }, { x: 39, z: 51 }, { x: 40, z: 49 }];
    for (const sp of extraSolarSpots) {
      if (this.powerSupply > this.powerDemand * 1.38) break;
      this.applyTool('solar_plant', [sp], true);
      this.recomputeNetworksAndFields();
    }

    // Place Iconic Tourism Attractions in Metropolis Showcase: Oriental TV Tower, Wildlife Zoo, Botanical Garden & Art Museum!
    for (const spot of [{ x: 24, z: 34 }, { x: 25, z: 33 }, { x: 20, z: 34 }]) {
      if (this.applyTool('tv_tower', [spot], true).ok) {
        this.applyTool('water_pipe', [{ x: spot.x, z: spot.z }], true);
        break;
      }
    }
    for (const spot of [{ x: 35, z: 34 }, { x: 35, z: 33 }, { x: 35, z: 36 }, { x: 29, z: 31 }]) {
      if (this.applyTool('zoo', [spot], true).ok) {
        this.applyTool('water_pipe', this.computeLineOrLPath(32, 34, spot.x, spot.z, false), true);
        break;
      }
    }
    for (const spot of [{ x: 25, z: 31 }, { x: 26, z: 31 }, { x: 30, z: 31 }, { x: 14, z: 33 }]) {
      if (this.applyTool('botanical_garden', [spot], true).ok) {
        this.applyTool('water_pipe', this.computeLineOrLPath(22, 32, spot.x, spot.z, false), true);
        break;
      }
    }
    for (const spot of [{ x: 19, z: 33 }, { x: 25, z: 37 }, { x: 28, z: 34 }]) {
      if (this.applyTool('museum', [spot], true).ok) {
        this.applyTool('water_pipe', [{ x: spot.x, z: spot.z }], true);
        break;
      }
    }

    // Final facility audit pass: ensure every civic/utility/transit hub has outside road & HV power!
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const b = this.grid[idx(x, z)].building;
        if (!b || BUILDING_NAMES[b.type]) continue;
        this._ensureRoadTo(x, z, 'road_1');
        this._ensurePowerTo(x, z);
      }
    }

    // Place 6 EV Bus Stops along showcase avenues & auto-plan 2 colored live Bus Routes!
    for (const bs of [
      { x: 15, z: 38 }, { x: 22, z: 38 }, { x: 32, z: 38 },
      { x: 15, z: 44 }, { x: 29, z: 44 }, { x: 22, z: 32 }
    ]) {
      this.applyTool('bus_stop', [bs], true);
    }
    this.autoPlanBusLines();

    this.milestoneIdx = MILESTONES.length - 1;
    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    this.stepEconomy();
    this.seedBaselineHistory(6);
    this.stepChirper();
    this.meshDirty = true;
  }

  toJSON() {
    return {
      v: 4,
      seed: this.seed,
      cityName: this.cityName,
      difficulty: this.difficulty,
      unlockAll: this.unlockAll,
      money: this.money,
      taxRate: this.taxRate,
      budgets: this.budgets,
      activeLoans: this.activeLoans,
      policies: this.policies,
      educatedRate: this.educatedRate,
      tempDemandBoost: this.tempDemandBoost,
      tempHappinessBoost: this.tempHappinessBoost,
      tempHappinessMonths: this.tempHappinessMonths,
      history: Array.isArray(this.history) ? this.history.slice(-24) : [],
      year: this.year,
      month: this.month,
      day: this.day,
      dayProgress: this.dayProgress,
      timeMode: this.timeMode,
      weather: this.weather ? { state: this.weather.state, mode: this.weather.mode, tempC: Math.round(this.weather.tempC ?? 22) } : undefined,
      busLines: Array.isArray(this.busLines) ? this.busLines.map((l) => ({
        id: l.id, name: l.name, colorHex: l.colorHex, stops: l.stops, busCount: l.busCount, fare: l.fare, active: l.active
      })) : [],
      milestoneIdx: this.milestoneIdx,
      maxPopReached: this.maxPopReached,
      mayorLevel: this.mayorLevel,
      mayorXP: this.mayorXP,
      guideStep: this.guideStep,
      completedQuests: this.completedQuests,
      corners: Array.from(this.corners, (v) => Number(v.toFixed(3))),
      water: Array.from(this.waterDepth, (v) => Number(v.toFixed(3))),
      tiles: this.grid.map((t) => ({
        rg: t.roadGround || undefined,
        rb: t.roadBridge ? 1 : undefined,
        rd: (typeof t.roadDir === 'number' && t.roadDir >= 0) ? t.roadDir : undefined,
        bt: t.banTrucks ? 1 : undefined,
        bs: t.busStop ? 1 : undefined,
        jm: t.junctionMode || undefined,
        rbp: t.roundaboutPaid ? 1 : undefined,
        re: t.roadElevated || undefined,
        rp: t.ramp ? 1 : undefined,
        rl: t.rail || undefined,
        mt: t.metro ? 1 : undefined,
        pp: t.pipe ? 1 : undefined,
        pb: t.pipeBroken ? 1 : undefined,
        py: t.pylon ? 1 : undefined,
        dm: t.dam ? Number(t.damCrest.toFixed(2)) : undefined,
        dmh: t.dam && t.damHealth !== undefined && t.damHealth < 100 ? Math.round(t.damHealth) : undefined,
        ws: t.waterSpring ? Number(t.waterSpring.toFixed(2)) : undefined,
        tr: t.trees || undefined,
        z: t.zone || undefined,
        b: t.building
          ? {
              t: t.building.type,
              l: t.building.level,
              v: t.building.variant,
              rt: t.building.rot,
              ab: t.building.abandoned ? 1 : undefined,
              ar: t.building.abandonReason || undefined,
              f: t.building.fire ? Number(t.building.fire.toFixed(2)) : undefined
            }
          : undefined
      }))
    };
  }

  fromJSON(data) {
    if (!data || (data.v !== 3 && data.v !== 4 && data.v !== 5) || !Array.isArray(data.tiles) || data.tiles.length !== GRID_SIZE * GRID_SIZE) {
      return false;
    }
    this._suppressPromotions = true;
    this.undoStack = [];
    this._lastSculptUndoAt = 0;
    this.activeEvent = null;
    this._eventMonthAccum = 0;
    this.seed = data.seed || 2026;
    this.cityName = data.cityName || '山河天际市';
    this.difficulty = data.difficulty || 'hardcore';
    this.unlockAll = Boolean(data.unlockAll);
    this.money = typeof data.money === 'number' ? data.money : 32000;
    this.taxRate = data.taxRate || 9;
    this.budgets = Object.assign({ power: 100, water: 100, service: 100 }, data.budgets || {});
    this.activeLoans = Array.isArray(data.activeLoans) ? data.activeLoans : [];
    this.policies = Object.assign(createDefaultPolicies(), data.policies || {});
    this.educatedRate = typeof data.educatedRate === 'number' ? data.educatedRate : 0;
    this.tempDemandBoost = data.tempDemandBoost
      ? Object.assign({ R: 0, C: 0, I: 0, monthsLeft: 0 }, data.tempDemandBoost)
      : { R: 0, C: 0, I: 0, monthsLeft: 0 };
    this.tempHappinessBoost = typeof data.tempHappinessBoost === 'number' ? data.tempHappinessBoost : 0;
    this.tempHappinessMonths = typeof data.tempHappinessMonths === 'number' ? data.tempHappinessMonths : 0;
    this.history = Array.isArray(data.history) ? data.history.slice(-24) : [];
    this.year = data.year || 2026;
    this.month = data.month || 3;
    this.day = data.day || 1;
    this.dayProgress = typeof data.dayProgress === 'number' ? data.dayProgress : 0.36;
    this.timeMode = data.timeMode || 'cycle';
    this.weather = data.weather
      ? { state: data.weather.state || 'clear', mode: data.weather.mode || 'auto', intensity: 0, timer: 42, tempC: data.weather.tempC ?? 22, lightningFlash: 0 }
      : { state: 'clear', mode: 'auto', intensity: 0, timer: 42, tempC: 22, lightningFlash: 0 };
    this.busLines = Array.isArray(data.busLines) ? data.busLines.map((l) => ({
      id: l.id || 1,
      name: l.name || '1路 公交专线',
      colorHex: l.colorHex || '#0ea5e9',
      stops: Array.isArray(l.stops) ? l.stops.map((s) => ({ x: s.x, z: s.z })) : [],
      busCount: Math.max(1, Math.min(6, l.busCount || 2)),
      fare: Math.max(0, Math.min(5, l.fare ?? 2)),
      active: l.active !== false,
      dailyRiders: 0
    })) : [];
    this._nextBusLineId = this.busLines.reduce((m, l) => Math.max(m, (l.id || 0) + 1), 1);
    this.milestoneIdx = data.milestoneIdx || 0;
    this.maxPopReached = data.maxPopReached || 0;
    this.gridlockTimeouts = 0;
    let fallbackLv = 1;
    for (const tier of MAYOR_LEVELS) {
      if ((this.maxPopReached || 0) >= tier.popReq) fallbackLv = tier.level;
    }
    this.mayorLevel = typeof data.mayorLevel === 'number' ? Math.max(1, Math.min(10, data.mayorLevel)) : fallbackLv;
    this.mayorXP = typeof data.mayorXP === 'number'
      ? Math.max(0, data.mayorXP)
      : (MAYOR_LEVELS[this.mayorLevel - 1]?.xpReq || 0);
    this.guideStep = typeof data.guideStep === 'number' ? Math.max(0, data.guideStep) : 0;
    this.completedQuests = Array.isArray(data.completedQuests) ? data.completedQuests.slice() : [];

    const world = generateWorld(this.seed);
    this.corners = data.corners && data.corners.length === CORNER_STRIDE * CORNER_STRIDE
      ? new Float32Array(data.corners)
      : world.corners;
    this.waterDepth = data.water && data.water.length === GRID_SIZE * GRID_SIZE
      ? new Float32Array(data.water)
      : world.waterDepth;
    this.waterPoll = new Float32Array(GRID_SIZE * GRID_SIZE);
    this.grid = world.grid;

    for (let i = 0; i < this.grid.length; i++) {
      const s = data.tiles[i];
      const t = this.grid[i];
      t.roadGround = s.rg || 0;
      t.roadBridge = s.rb !== undefined ? Boolean(s.rb) : (Boolean(s.rg === 1 || s.rg === 2) && this.waterDepth[i] > 0.08);
      t.roadDir = typeof s.rd === 'number' ? s.rd : -1;
      t.banTrucks = Boolean(s.bt);
      t.busStop = Boolean(s.bs);
      t.junctionMode = s.jm || null;
      t.roundaboutPaid = Boolean(s.rbp || s.jm === 'roundabout');
      t.roadElevated = s.re || 0;
      t.ramp = Boolean(s.rp);
      t.rail = s.rl || 0;
      t.metro = Boolean(s.mt);
      t.pipe = Boolean(s.pp);
      t.pipeBroken = Boolean(s.pb);
      t.pylon = Boolean(s.py);
      t.dam = s.dm !== undefined;
      t.damCrest = s.dm || 0;
      t.damHealth = t.dam ? (typeof s.dmh === 'number' ? s.dmh : 100) : 100;
      t.damStress = 0;
      t.waterSpring = s.ws || 0;
      t.trees = s.tr || 0;
      t.zone = s.z || null;
      t.building = s.b
        ? {
            type: s.b.t,
            level: s.b.l || 1,
            variant: s.b.v || 0,
            rot: s.b.rt || 0,
            underConstruction: false,
            buildProgress: 1,
            upgradeProgress: 20,
            fire: s.b.f || 0,
            sick: false,
            trashPiled: false,
            flooded: false,
            abandoned: Boolean(s.b.ab),
            distress: 0,
            abandonReason: s.b.ar || ''
          }
        : null;
    }

    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    if (typeof data.guideStep !== 'number') {
      this.syncCompletedQuestsSilent();
    }
    this.stepEconomy(false);
    if (this.history.length === 0) {
      this.seedBaselineHistory(6);
    }
    this.meshDirty = true;
    return true;
  }
}
