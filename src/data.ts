import type { Booking, TripDay } from './types'

const a = (id:string,time:string,title:string,detail:string,kind:'sight'|'train'|'food'|'hotel'|'note'|'drive'='sight',extra={}) => ({id,time,title,detail,kind,...extra})

export const days: TripDay[] = [
  {id:'d0',day:0,date:'9月25日',weekday:'周五',city:'阿姆斯特丹',country:'NL',title:'抵达阿姆斯特丹',hotel:'Holiday Inn Express Amsterdam - Sloterdijk',activities:[
    a('d0-1','19:00','抵达史基浦机场','出关及取行李约40分钟','train'),a('d0-2','19:45','前往 Sloterdijk','NS 火车约10分钟，酒店就在车站旁','train',{cost:'€5.50'}),a('d0-3','20:30','办理入住','附近简单晚餐，早点休息','hotel',{booked:true})]},
  {id:'d1',day:1,date:'9月26日',weekday:'周六',city:'羊角村 · 阿姆斯特丹',country:'NL',title:'水乡与安妮之家',hotel:'Holiday Inn Express Amsterdam - Sloterdijk',note:'羊角村若返程延误，直接取消九街，确保安妮之家预约。',activities:[
    a('d1-1','09:00','中央站 → Steenwijk','NS 火车约1小时25分钟','train',{cost:'约€20'}),a('d1-2','11:00–14:30','羊角村','租船、水道与茅草屋村落','sight',{important:true}),a('d1-3','16:30','返回阿姆斯特丹','回酒店稍作休息','train'),a('d1-4','17:30','九街','仅在返程准点时安排','sight'),a('d1-5','19:00','安妮之家','必须提前预约晚间场次','sight',{cost:'€16.50',important:true})]},
  {id:'d2',day:2,date:'9月27日',weekday:'周日',city:'阿姆斯特丹 → 科隆',country:'NL',title:'两大博物馆与夜车',hotel:'Hilton Cologne',note:'最迟19:50返回中央站；IC 60403为自由座，建议提前上车。',activities:[
    a('d2-1','09:15','梵高博物馆','预留2.5小时，现场无票','sight',{cost:'€25',important:true}),a('d2-2','12:15','国立博物馆','重点看《夜巡》《倒牛奶的女仆》','sight',{cost:'€21.50'}),a('d2-3','15:30','Jordaan与九街','运河散步及晚饭','sight'),a('d2-4','19:50','返回中央站','取行李并找站台','note',{important:true}),a('d2-5','21:01','IC 60403 → 科隆','直达2小时44分，23:45抵达','train',{booked:true,important:true,cost:'已购 · 自由座'}),a('d2-6','23:45','入住 Hilton Cologne','车站步行约2分钟','hotel',{booked:true})]},
  {id:'d3',day:3,date:'9月28日',weekday:'周一',city:'科隆 → 慕尼黑',country:'DE',title:'科隆全天与两次换乘',hotel:'Moxy Munich Ostbahnhof',note:'18:54车票需换乘2次；当天持续查看DB App实时站台。',activities:[
    a('d3-1','10:00','科隆大教堂','内部参观，之后南塔登顶','sight',{cost:'€8',important:true}),a('d3-2','12:30','霍亨索伦大桥','爱情锁与莱茵河景观'),a('d3-3','14:00','老城与莱茵河畔','户外为主，路德维希博物馆周一闭馆'),a('d3-4','18:10','取行李到中央站','核对两次换乘站台','note',{important:true}),a('d3-5','18:54','科隆 → 慕尼黑东站','约4小时40分，23:34抵达，2次换乘','train',{booked:true,important:true,cost:'¥212/人 · 已购'}),a('d3-6','23:34','入住 Moxy','9/28–29订单已确认','hotel',{booked:true})]},
  {id:'d4',day:4,date:'9月29日',weekday:'周二',city:'慕尼黑',country:'DE',title:'皇宫与啤酒节',hotel:'Moxy Munich Ostbahnhof',note:'两晚是连续订单，首次入住时请前台关联，避免换房。',activities:[
    a('d4-1','09:30','从酒店出发','前一晚较晚抵达，今天不早起','note'),a('d4-2','11:00','玛利亚广场报时钟','顺路看圣母教堂','sight',{important:true}),a('d4-3','12:00','维克图阿连市场','白香肠与椒盐卷饼','food'),a('d4-4','13:00–16:00','慕尼黑皇宫与珍宝馆','14天城堡套票包含','sight',{cost:'套票含',important:true}),a('d4-5','16:15','英国花园 Eisbach','观看城市冲浪'),a('d4-6','17:15','霍夫啤酒屋','晚饭后返回酒店换装，只带随身小包','food'),a('d4-7','20:00','抵达特蕾西娅草坪','从地铁站进入园区，先确认出口与返程路线','train',{important:true}),a('d4-8','20:10–21:45','啤酒帐篷体验','无预约先看入口状态；满员就转小帐篷或露天座位','food',{important:true,cost:'约€20–40'}),a('d4-9','21:45–22:30','夜间园区与摩天轮','看灯光、传统服饰与游乐区，不再排长队项目','sight',{cost:'按项目付费'}),a('d4-10','22:30','返回 Moxy','避开闭场集中客流，按现场指引前往地铁','train',{important:true})]},
  {id:'d5',day:5,date:'9月30日',weekday:'周三',city:'新天鹅堡 → 萨尔茨堡',country:'DE',title:'城堡日与跨城转场',hotel:'萨尔茨堡酒店（待预订）',note:'早晨退房后把行李寄存在慕尼黑中央站；拜仁日票不含Railjet/ICE。',activities:[
    a('d5-1','08:15','退房并寄存行李','中央站寄存后赶09:11区域列车','note',{cost:'€5–8',important:true}),a('d5-2','09:11','慕尼黑 → 菲森','拜仁日票工作日09:00后有效','train',{cost:'€44/2人'}),a('d5-3','12:30','新天鹅堡','选择Multi-Day Ticket Holder预约','sight',{cost:'€2.50预约费',important:true}),a('d5-4','14:00','玛丽安桥与菲森','16:00前返回车站'),a('d5-5','16:00','菲森 → 慕尼黑','约18:00抵达，取行李','train'),a('d5-6','19:00后','慕尼黑 → 萨尔茨堡','仅乘RE等区域列车，班次临近确认','train',{important:true,cost:'拜仁日票含'})]},
  {id:'d6',day:6,date:'10月1日',weekday:'周四',city:'萨尔茨堡 → 沃尔夫冈湖',country:'AT',title:'老城半日与自驾启程',hotel:'沃尔夫冈湖住宿（待预订）',note:'取车时核验驾照翻译件、保险、轮胎和高速票；今天以适应车辆为主。',activities:[
    a('d6-1','08:30–10:15','霍亨萨尔茨堡要塞','开门后优先进入，缆车与要塞约1.5小时','sight',{important:true}),a('d6-2','10:30–12:15','莫扎特出生地与老城','格特雷德街、粮食胡同和简洁午餐','sight'),a('d6-3','14:00','萨尔茨堡取车','检查车况、保险、Vignette与异地还车规则','drive',{important:true,cost:'待报价'}),a('d6-4','15:00–16:10','蒙德湖','教堂与湖滨短停；停车规则以现场为准','drive'),a('d6-5','16:40–17:30','圣吉尔根','沃尔夫冈湖西岸散步','drive'),a('d6-6','18:00','圣沃尔夫冈入住','晚餐和湖畔休息，不安排夜间山路','hotel')]},
  {id:'d7',day:7,date:'10月2日',weekday:'周五',city:'哈尔施塔特 · 戈绍湖',country:'AT',title:'早到哈尔施塔特与湖畔轻徒步',hotel:'戈绍或巴德戈伊瑟恩住宿（待预订）',note:'哈尔施塔特古城禁车且P1/P2不能预约，07:15出发、目标08:15前进入停车场。',activities:[
    a('d7-1','07:15','沃尔夫冈湖出发','约1小时车程；低温或雾天放慢速度','drive',{important:true}),a('d7-2','08:15','哈尔施塔特P1/P2停车','看电子余位；P1步行中心约20分钟、P2约15分钟','drive',{cost:'7–12小时€15'}),a('d7-3','08:30–12:30','哈尔施塔特老城与湖畔','市场广场、骨屋和经典机位；盐矿不作为刚性主线','sight',{important:true}),a('d7-4','13:15–16:00','前戈绍湖','停车场车牌识别缴费，湖畔轻徒步约1.5小时','drive'),a('d7-5','16:30','入住戈绍/巴德戈伊瑟恩','戈绍湖停车场禁止过夜，返回住宿休息','hotel')]},
  {id:'d8',day:8,date:'10月3日',weekday:'周六',city:'奥塞湖区 → 格蒙登',country:'AT',title:'秋色双湖与特劳恩湖',hotel:'格蒙登住宿（待预订）',note:'阿尔陶斯盐矿仅作为雨天替代；不要与双湖、格蒙登同时强塞。',activities:[
    a('d8-1','08:30','戈绍出发','约1小时到阿尔陶斯湖','drive'),a('d8-2','09:30–11:30','阿尔陶斯湖','优先Kurhaus P1或Seeklause P3，湖畔散步','sight'),a('d8-3','12:00–13:45','格伦德尔湖','湖畔午餐；停车费以现场为准','sight'),a('d8-4','14:00–15:30','前往特劳恩湖','经主要公路前往特劳恩基兴','drive'),a('d8-5','16:00–18:00','格蒙登与奥尔特城堡','湖畔散步后入住，避免摸黑赶路','sight')]},
  {id:'d9',day:9,date:'10月4日',weekday:'周日',city:'格蒙登 → 林茨 → 维也纳',country:'AT',title:'周日异地还车与维也纳半日',hotel:'DoubleTree Vienna Schönbrunn',note:'林茨周日门店营业或非营业还车必须取得租车公司书面确认；预留60–90分钟加油验车。',activities:[
    a('d9-1','08:30','格蒙登湖畔早餐','09:30前离开，不临时增加远距离景点','food'),a('d9-2','10:45–11:45','林茨加油并还车','拍摄车况、油表与还车凭证','drive',{important:true}),a('d9-3','12:30左右','林茨 → 维也纳','具体Railjet/Westbahn班次待租车落定后购买','train',{important:true,cost:'待购'}),a('d9-4','14:00左右','抵达维也纳','先入住或寄存行李','hotel'),a('d9-5','15:00–18:00','艺术史博物馆（可选）','周日开放；若抵达晚则直接改老城','sight',{cost:'€22'}),a('d9-6','18:15','格拉本与圣史蒂芬大教堂','晚餐后返回酒店','sight')]},
  {id:'d10',day:10,date:'10月5日',weekday:'周一',city:'维也纳 → 机场',country:'AT',title:'美泉宫与返程',hotel:'今日离开',activities:[
    a('d10-1','09:30','美泉宫','酒店步行可达，预留2.5小时','sight',{cost:'€28',important:true}),a('d10-2','13:30','返回酒店取行李','不再带行李绕行市中心','note'),a('d10-3','15:00','前往VIE机场','目标16:00前抵达','train',{important:true}),a('d10-4','19:00','起飞离开欧洲','旅程结束','train')]},
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
