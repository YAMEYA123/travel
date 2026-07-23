import type { Booking, TripDay } from './types'

const a = (id:string,time:string,title:string,detail:string,kind:'sight'|'train'|'bus'|'food'|'hotel'|'note'|'drive'='sight',extra={}) => ({id,time,title,detail,kind,...extra})

export const days: TripDay[] = [
  {id:'d0',day:0,date:'9月25日',weekday:'周五',city:'阿姆斯特丹',country:'NL',title:'抵达阿姆斯特丹',hotel:'Holiday Inn Express Amsterdam - Sloterdijk',activities:[
    a('d0-1','19:00','抵达史基浦机场','航班落地；不要把落地时间当成出站时间','train'),a('d0-2','19:00–20:15','入境、取行李与进站','按60–75分钟弹性预留，延误时直接压缩晚餐','note',{important:true}),a('d0-3','20:15后','史基浦 → Sloterdijk','乘直达NS列车，不绕行中央站；下车即到酒店','train',{cost:'约€5.50'}),a('d0-4','约21:00','办理入住与简餐','附近简单晚餐，早点休息','hotel',{booked:true})]},
  {id:'d1',day:1,date:'9月26日',weekday:'周六',city:'羊角村 · 阿姆斯特丹',country:'NL',title:'水乡与安妮之家',hotel:'Holiday Inn Express Amsterdam - Sloterdijk',note:'羊角村若返程延误，直接取消九街，确保安妮之家预约。',activities:[
    a('d1-0','08:20','酒店 → 阿姆斯特丹中央站','预留换乘和找站台时间','train'),a('d1-1','09:00','中央站 → Steenwijk','NS 火车约1小时25分钟','train',{cost:'约€20'}),a('d1-1a','10:30','Steenwijk → 羊角村','换乘巴士；班次不合适时改出租车','bus'),a('d1-2','11:00–12:30','羊角村水道','优先先租船，避开午后客流','sight',{important:true}),a('d1-2a','12:30–13:15','羊角村午餐','选靠近主水道的简餐','food'),a('d1-2b','13:15–14:30','茅草屋村落漫步','步行桥、运河与经典村景','sight'),a('d1-3','14:30–16:30','返回阿姆斯特丹','抵达中央站后直接进城，不折返酒店','train'),a('d1-4','17:15–18:20','九街','仅在返程准点时安排，之后步行去安妮之家','sight'),a('d1-5','19:00','安妮之家','提前15分钟抵达预约入口','sight',{cost:'€16.50',important:true}),a('d1-6','20:30','晚餐并返回酒店','以中央站附近简餐为主','food')]},
  {id:'d2',day:2,date:'9月27日',weekday:'周日',city:'阿姆斯特丹 → 科隆',country:'NL',title:'两大博物馆与夜车',hotel:'Hilton Cologne',note:'最迟19:50返回中央站；IC 60403为自由座，建议提前上车。',activities:[
    a('d2-0','08:15','退房并寄存行李','行李寄存在Sloterdijk酒店，不带去博物馆','hotel',{important:true}),a('d2-0a','08:30','前往博物馆广场','预留约30分钟交通和入场缓冲','train'),a('d2-1','09:15–11:15','梵高博物馆','精选参观2小时，现场无票','sight',{cost:'€25',important:true}),a('d2-1a','11:20–12:05','博物馆广场简餐','避免两个博物馆之间没有午餐','food'),a('d2-2','12:15–14:30','国立博物馆','重点看《夜巡》《倒牛奶的女仆》','sight',{cost:'€21.50'}),a('d2-3','15:00–17:30','Jordaan与九街','运河散步；前一天已逛九街可缩短','sight'),a('d2-3a','17:30–18:15','提前晚餐','夜车前吃完正餐','food'),a('d2-4','18:20–19:10','回酒店取行李','从市中心返回Sloterdijk后再去中央站','note',{important:true}),a('d2-4a','19:30','抵达中央站','核对站台并提前候车','train'),a('d2-5','21:01','IC 60403 → 科隆','直达2小时44分，23:45抵达','train',{booked:true,important:true,cost:'已购 · 自由座'}),a('d2-6','23:45','入住 Hilton Cologne','车站步行约2分钟','hotel',{booked:true})]},
  {id:'d3',day:3,date:'9月28日',weekday:'周一',city:'科隆 → 慕尼黑',country:'DE',title:'科隆全天与两次换乘',hotel:'Moxy Munich Ostbahnhof',note:'18:54车票需换乘2次；当天持续查看DB App实时站台。',activities:[
    a('d3-0','08:30–09:30','早餐、退房并寄存','行李留在酒店，轻装游览','hotel'),a('d3-1','10:00–11:00','科隆大教堂','先看内部和彩窗','sight',{cost:'€8',important:true}),a('d3-1a','11:00–12:00','南塔登顶','天气或体力不佳可取消登塔','sight'),a('d3-2','12:30','霍亨索伦大桥','爱情锁与莱茵河景观'),a('d3-2a','13:00–14:00','老城午餐','避免把午餐挤到上车前','food'),a('d3-3','14:15–17:30','老城与莱茵河畔','户外为主，路德维希博物馆周一闭馆'),a('d3-4','17:45','取行李','回Hilton取寄存行李','note',{important:true}),a('d3-4a','18:10','进入中央站候车','核对两次换乘站台','train'),a('d3-5','18:54','科隆 → 慕尼黑东站','约4小时40分，23:34抵达，2次换乘','train',{booked:true,important:true,cost:'¥212/人 · 已购'}),a('d3-6','23:34','入住 Moxy','9/28–29订单已确认','hotel',{booked:true})]},
  {id:'d4',day:4,date:'9月29日',weekday:'周二',city:'慕尼黑',country:'DE',title:'皇宫与啤酒节',hotel:'Moxy Munich Ostbahnhof',note:'两晚是连续订单，首次入住时请前台关联，避免换房。',activities:[
    a('d4-0','09:30','早餐','前一晚较晚抵达，保留完整早餐时间','food'),a('d4-1','10:15','从酒店出发','搭S-Bahn前往市中心','train'),a('d4-1a','10:40','抵达玛利亚广场','提前找好报时钟观看位置','note'),a('d4-2','11:00','玛利亚广场报时钟','看完顺路经过圣母教堂','sight',{important:true}),a('d4-2a','11:25','阿萨姆教堂','室内装饰浓缩，停留约15分钟'),a('d4-2b','11:45','HARIBO门店','顺路补给伴手礼，控制在15分钟','sight'),a('d4-3','12:10–13:00','维克图阿连市场','白香肠与椒盐卷饼','food'),a('d4-4','13:15–16:15','慕尼黑皇宫与珍宝馆','9月开放至18:00，预留3小时','sight',{cost:'套票含',important:true}),a('d4-5','16:30–17:10','英国花园 Eisbach','观看城市冲浪'),a('d4-6','17:30–19:00','霍夫啤酒屋','吃完直接前往啤酒节，不折返酒店','food'),a('d4-7','19:30','抵达特蕾西娅草坪','先确认出口与返程路线','train',{important:true}),a('d4-8','19:45–21:30','啤酒帐篷体验','无预约先看入口状态；满员转小帐篷或露天座位','food',{important:true,cost:'约€20–40'}),a('d4-9','21:30–22:15','夜间园区与摩天轮','看灯光和游乐区，不再排长队项目','sight',{cost:'按项目付费'}),a('d4-10','22:15','返回 Moxy','避开闭场集中客流','train',{important:true})]},
  {id:'d5',day:5,date:'9月30日',weekday:'周三',city:'新天鹅堡 → 萨尔茨堡',country:'DE',title:'城堡日与跨城转场',hotel:'萨尔茨堡酒店（待预订）',note:'早晨退房后把行李寄存在慕尼黑中央站；拜仁日票不含Railjet/ICE。',activities:[
    a('d5-0','07:30','早餐、退房与便携补给','带水和可在返程吃的简餐','food'),a('d5-1','08:00','中央站寄存行李','完成寄存后再找站台','note',{cost:'€5–8',important:true}),a('d5-2','09:11','慕尼黑 → 菲森','拜仁日票工作日09:00后有效','train',{cost:'€44/2人'}),a('d5-2a','11:15','菲森 → 票务中心','换乘巴士；人多时预留排队','bus'),a('d5-2b','11:30–12:10','取票、上山与简餐','12:30场次前完成检票','note',{important:true}),a('d5-3','12:30','新天鹅堡','选择Multi-Day Ticket Holder预约','sight',{cost:'€2.50预约费',important:true}),a('d5-4','14:00','玛丽安桥','视天气及开放状态决定是否前往'),a('d5-4a','14:35–15:35','下山并简单用餐','最迟15:35向菲森车站移动','food'),a('d5-5','约16:00','菲森 → 慕尼黑','约18:00抵达','train'),a('d5-5a','18:00–19:00','取行李与简餐','为跨城区域列车留出弹性','note'),a('d5-6','19:00后','慕尼黑 → 萨尔茨堡','仅乘RE等区域列车，班次临近确认','train',{important:true,cost:'拜仁日票含'}),a('d5-7','约21:00','萨尔茨堡入住','不再安排夜间景点','hotel')]},
  {id:'d6',day:6,date:'10月1日',weekday:'周四',city:'萨尔茨堡 → 沃尔夫冈湖',country:'AT',title:'老城半日与自驾启程',hotel:'沃尔夫冈湖住宿（待预订）',note:'取车时核验驾照翻译件、保险、轮胎和高速票；今天以适应车辆为主。',activities:[
    a('d6-0','08:15','退房并寄存行李','轻装游览，取车前再取行李','hotel'),a('d6-2','09:00–10:00','莫扎特出生地','官方建议参观约1小时','sight'),a('d6-1','10:15–11:45','霍亨萨尔茨堡要塞','10月9:30开放，乘缆车上山并参观','sight',{important:true}),a('d6-2a','11:45–12:45','老城午餐','格特雷德街附近简餐','food'),a('d6-2b','12:45–13:20','取行李并前往租车点','给取车手续留足时间','note'),a('d6-3','14:00','萨尔茨堡取车','检查车况、保险、Vignette与异地还车规则','drive',{important:true,cost:'待报价'}),a('d6-4','15:00–16:00','蒙德湖','教堂与湖滨短停','drive'),a('d6-5','16:40–17:25','圣吉尔根','沃尔夫冈湖西岸散步','drive'),a('d6-6','18:00','圣沃尔夫冈入住','晚餐和湖畔休息，不安排夜间山路','hotel')]},
  {id:'d7',day:7,date:'10月2日',weekday:'周五',city:'哈尔施塔特 · 戈绍湖',country:'AT',title:'早到哈尔施塔特与湖畔轻徒步',hotel:'戈绍或巴德戈伊瑟恩住宿（待预订）',note:'哈尔施塔特古城禁车且P1/P2不能预约，07:15出发、目标08:15前进入停车场。',activities:[
    a('d7-1','07:15','沃尔夫冈湖出发','约1小时车程；低温或雾天放慢速度','drive',{important:true}),a('d7-2','08:15','哈尔施塔特P1/P2停车','看电子余位；停车后步行进老城','drive',{cost:'7–12小时€15'}),a('d7-3','08:30–11:30','哈尔施塔特老城与湖畔','市场广场、骨屋和经典机位','sight',{important:true}),a('d7-3a','11:30–12:15','哈尔施塔特午餐','避开最拥挤时段，选择快速简餐','food'),a('d7-3b','12:15–13:00','返回停车场并出场','为取车、排队和山路留缓冲','drive'),a('d7-4','13:30–15:30','前戈绍湖','湖畔轻徒步约1.5小时','drive'),a('d7-5','16:00','入住戈绍/巴德戈伊瑟恩','戈绍湖停车场禁止过夜','hotel')]},
  {id:'d8',day:8,date:'10月3日',weekday:'周六',city:'奥塞湖区 → 格蒙登',country:'AT',title:'秋色双湖与特劳恩湖',hotel:'格蒙登住宿（待预订）',note:'阿尔陶斯盐矿仅作为雨天替代；不要与双湖、格蒙登同时强塞。',activities:[
    a('d8-1','08:30','戈绍出发','约1小时到阿尔陶斯湖','drive'),a('d8-2','09:30–11:15','阿尔陶斯湖','优先Kurhaus P1或Seeklause P3','sight'),a('d8-3','11:45–13:30','格伦德尔湖','湖畔午餐与短距离散步','sight'),a('d8-4','13:45–15:15','前往特劳恩湖','山路按1.5小时预留，不按理想车程硬接','drive'),a('d8-4a','15:20–16:00','特劳恩基兴（可选）','天气好且停车顺利才停留','sight'),a('d8-5','16:30–17:45','格蒙登与奥尔特城堡','湖畔散步后入住，避免摸黑赶路','sight'),a('d8-6','18:00','格蒙登入住','晚餐就近解决','hotel')]},
  {id:'d9',day:9,date:'10月4日',weekday:'周日',city:'格蒙登 → 林茨 → 维也纳',country:'AT',title:'周日异地还车与维也纳半日',hotel:'DoubleTree Vienna Schönbrunn',note:'林茨周日门店营业或非营业还车必须取得租车公司书面确认；预留60–90分钟加油验车。',activities:[
    a('d9-1','08:30–09:15','早餐、退房与验车','拍摄车辆外观，09:15准时出发','food'),a('d9-1a','09:15','格蒙登 → 林茨','按周日路况预留约75分钟','drive'),a('d9-2','10:30–11:45','林茨加油并还车','拍摄车况、油表与还车凭证','drive',{important:true}),a('d9-3','12:30左右','林茨 → 维也纳','具体班次待租车落定后购买','train',{important:true,cost:'待购'}),a('d9-4','14:00左右','抵达维也纳','先入住或寄存行李','hotel'),a('d9-5','15:00–17:30','艺术史博物馆（可选）','仅在14:15前安顿好时保留，否则直接改老城','sight',{cost:'€22'}),a('d9-6','18:00','格拉本与圣史蒂芬大教堂','晚餐后返回酒店','sight')]},
  {id:'d10',day:10,date:'10月5日',weekday:'周一',city:'维也纳 → 机场',country:'AT',title:'美泉宫与返程',hotel:'今日离开',activities:[
    a('d10-0','08:30','退房并寄存行李','轻装步行去美泉宫','hotel'),a('d10-1','09:30–12:00','美泉宫','酒店步行可达，按预约时段入场','sight',{cost:'€28',important:true}),a('d10-1a','12:00–13:00','午餐','在酒店或美泉宫附近简餐','food'),a('d10-2','13:30','返回酒店取行李','不再带行李绕行市中心','note'),a('d10-3','15:00','前往VIE机场','目标16:00前抵达','train',{important:true}),a('d10-4','16:00','抵达维也纳机场','预留3小时办理值机、安检和退税','train',{important:true}),a('d10-5','19:00','起飞离开欧洲','旅程结束','train')]},
]

export const bookings: Booking[] = [
  {id:'b0a',date:'9月25–27日',title:'Holiday Inn Express Amsterdam - Sloterdijk',detail:'2晚，机场和中央站均可直达',price:'已订',status:'booked'},
  {id:'b0b',date:'9月27–28日',title:'Hilton Cologne',detail:'1晚，科隆中央站旁',price:'已订',status:'booked'},
  {id:'b1',date:'9月27日',title:'IC 60403 阿姆斯特丹 → 科隆',detail:'21:01–23:45，直达自由座',price:'已购',status:'booked'},
  {id:'b2',date:'9月28日',title:'科隆 → 慕尼黑东站',detail:'18:54–23:34，2次换乘',price:'¥212/人 · 已购',status:'booked'},
  {id:'b3',date:'9月28–30日',title:'Moxy Munich Ostbahnhof',detail:'两笔连续订单，入住时关联',price:'已订',status:'booked'},
  {id:'b3a',date:'9月30–10月1日',title:'萨尔茨堡住宿',detail:'1晚；次日下午取车前退房并带走行李',price:'待订',status:'urgent'},
  {id:'b3c',date:'10月1–2日',title:'沃尔夫冈湖住宿',detail:'优先圣吉尔根或圣沃尔夫冈，含停车位',price:'待订',status:'urgent'},
  {id:'b3d',date:'10月2–3日',title:'戈绍/巴德戈伊瑟恩住宿',detail:'戈绍湖停车场禁止过夜，住宿必须有停车位',price:'待订',status:'urgent'},
  {id:'b3e',date:'10月3–4日',title:'格蒙登住宿',detail:'优先湖畔或次日便于驶向林茨的区域',price:'待订',status:'urgent'},
  {id:'b3b',date:'原10月3–5日',title:'DoubleTree Vienna Schönbrunn',detail:'自驾方案需改为10月4日入住；先确认原订单可改期或取消',price:'日期待调整',status:'urgent'},
  {id:'b4',date:'9月30日',title:'新天鹅堡12:30场次',detail:'持城堡套票选择Multi-Day Ticket Holder',price:'€2.50/人',status:'urgent',url:'https://www.hohenschwangau.de/en/tours-tickets/official-tickets-neuschwanstein-hohenschwangau'},
  {id:'b5',date:'出发前',title:'拜仁14天城堡套票',detail:'覆盖慕尼黑皇宫与新天鹅堡',price:'€40/人',status:'urgent',url:'https://bsv-shop.bayern.de'},
  {id:'b6',date:'9月26日',title:'安妮之家19:00',detail:'每周二开放6周后的票',price:'€16.50/人',status:'urgent',url:'https://www.annefrank.org/en/museum/tickets/'},
  {id:'b7',date:'9月27日',title:'梵高博物馆',detail:'现场不售票',price:'€25/人',status:'soon',url:'https://www.vangoghmuseum.nl/en/visit/tickets-and-opening-hours'},
  {id:'b7a',date:'9月27日',title:'荷兰国立博物馆',detail:'建议预约12:15时段',price:'€21.50/人',status:'soon',url:'https://www.rijksmuseum.nl/en/tickets'},
  {id:'b7b',date:'9月30日',title:'拜仁日票',detail:'两人票；工作日09:00后乘区域列车',price:'约€44/2人',status:'soon',url:'https://int.bahn.de/en/offers/regional/regional-day-ticket-bavaria'},
  {id:'b7c',date:'10月1日',title:'萨尔茨堡卡24小时（可选）',detail:'仅半日市区，先核算要塞与莫扎特出生地单买价格',price:'可选',status:'optional',url:'https://www.salzburg.info/en/hotels-offers/salzburg-card'},
  {id:'b8a',date:'10月1–4日',title:'湖区异地还车租车',detail:'萨尔茨堡取、林茨还；自动挡、全险、停车与高速票需确认',price:'待报价',status:'urgent'},
  {id:'b8b',date:'出发前',title:'中国驾照与认可翻译件',detail:'原件同行；先取得租车公司对具体翻译形式的书面确认',price:'待办理',status:'urgent'},
  {id:'b8',date:'10月4日',title:'林茨 → 维也纳火车',detail:'还车时段确认后再购票，目标中午出发',price:'待购',status:'soon',url:'https://www.oebb.at/en/'},
  {id:'b9',date:'10月5日',title:'美泉宫09:30',detail:'旺季建议提前预约',price:'€28/人',status:'soon',url:'https://www.imperialtickets.com/en/schoenbrunn-palace'},
]

export const route = [
  {city:'阿姆斯特丹',code:'AMS',date:'9/25–27',country:'NL'},
  {city:'科隆',code:'CGN',date:'9/27–28',country:'DE'},
  {city:'慕尼黑',code:'MUC',date:'9/28–30',country:'DE'},
  {city:'萨尔茨堡·湖区',code:'SZG',date:'9/30–10/4',country:'AT'},
  {city:'维也纳',code:'VIE',date:'10/4–5',country:'AT'},
] as const
