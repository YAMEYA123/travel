import type { Booking, TripDay } from './types'

const a = (id:string,time:string,title:string,detail:string,kind:'sight'|'train'|'food'|'hotel'|'note'='sight',extra={}) => ({id,time,title,detail,kind,...extra})

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
    a('d4-1','09:30','从酒店出发','前一晚较晚抵达，今天不早起','note'),a('d4-2','11:00','玛利亚广场报时钟','顺路看圣母教堂','sight',{important:true}),a('d4-3','12:00','维克图阿连市场','白香肠与椒盐卷饼','food'),a('d4-4','13:00–16:00','慕尼黑皇宫与珍宝馆','14天城堡套票包含','sight',{cost:'套票含',important:true}),a('d4-5','16:15','英国花园 Eisbach','观看城市冲浪'),a('d4-6','17:15','霍夫啤酒屋','晚饭后返回酒店换装','food'),a('d4-7','20:30','Oktoberfest','无预约优先尝试相对冷门帐篷','sight',{important:true})]},
  {id:'d5',day:5,date:'9月30日',weekday:'周三',city:'新天鹅堡 → 萨尔茨堡',country:'DE',title:'城堡日与跨城转场',hotel:'萨尔茨堡酒店（待预订）',note:'早晨退房后把行李寄存在慕尼黑中央站；拜仁日票不含Railjet/ICE。',activities:[
    a('d5-1','08:15','退房并寄存行李','中央站寄存后赶09:11区域列车','note',{cost:'€5–8',important:true}),a('d5-2','09:11','慕尼黑 → 菲森','拜仁日票工作日09:00后有效','train',{cost:'€44/2人'}),a('d5-3','12:30','新天鹅堡','选择Multi-Day Ticket Holder预约','sight',{cost:'€2.50预约费',important:true}),a('d5-4','14:00','玛丽安桥与菲森','16:00前返回车站'),a('d5-5','16:00','菲森 → 慕尼黑','约18:00抵达，取行李','train'),a('d5-6','19:00后','慕尼黑 → 萨尔茨堡','仅乘RE等区域列车，班次临近确认','train',{important:true,cost:'拜仁日票含'})]},
  {id:'d6',day:6,date:'10月1日',weekday:'周四',city:'萨尔茨堡',country:'AT',title:'老城、莫扎特与要塞',hotel:'萨尔茨堡酒店',activities:[
    a('d6-1','09:00','激活萨尔茨堡卡','48小时覆盖D6与D7','note'),a('d6-2','09:30','莫扎特出生地','格特雷德街，预留45分钟'),a('d6-3','10:30','莫扎特居所','步行前往，预留45分钟'),a('d6-4','11:30','霍亨萨尔茨堡要塞','缆车及要塞约1.5小时','sight',{important:true}),a('d6-5','14:00','茨威格中心','开放窗口短，午饭需简洁','sight',{cost:'€5',important:true}),a('d6-6','16:15','米拉贝尔花园','傍晚散步') ]},
  {id:'d7',day:7,date:'10月2日',weekday:'周五',city:'巴德伊舍 · 哈尔施塔特',country:'AT',title:'湖区一日游',hotel:'萨尔茨堡酒店',activities:[
    a('d7-1','08:00','萨尔茨堡 → 巴德伊舍','区域交通约1小时','train'),a('d7-2','09:30','皇帝别墅 / Zauner','内部参观与咖啡二选一，避免赶车'),a('d7-3','10:30','前往哈尔施塔特','火车加渡轮','train'),a('d7-4','11:15–15:00','哈尔施塔特','老城、湖畔与可选观景台','sight',{important:true}),a('d7-5','15:00','返回萨尔茨堡','约17:30抵达','train')]},
  {id:'d8',day:8,date:'10月3日',weekday:'周六',city:'蒙德湖 → 维也纳',country:'AT',title:'湖畔半日与Westbahn',hotel:'DoubleTree Vienna Schönbrunn',activities:[
    a('d8-1','09:00','萨尔茨堡 → 蒙德湖','Postbus 140约50分钟','train'),a('d8-2','10:00','蒙德湖教堂与湖畔','《音乐之声》婚礼教堂'),a('d8-3','13:00','返回萨尔茨堡','取行李并留出候车时间','train'),a('d8-4','18:52','Westbahn → Wien Hütteldorf','21:14抵达，之后U4两站','train',{booked:false,important:true,cost:'约¥117/人'})]},
  {id:'d9',day:9,date:'10月4日',weekday:'周日',city:'维也纳',country:'AT',title:'艺术与老城',hotel:'DoubleTree Vienna Schönbrunn',activities:[
    a('d9-1','10:00','美景宫上宫','克里姆特《吻》，预留2小时','sight',{cost:'€16',important:true}),a('d9-2','12:30','Café Central','从美景宫搭公共交通约25分钟','food'),a('d9-3','14:30','艺术史博物馆','周日开放，预留3小时','sight',{cost:'€22',important:true}),a('d9-4','18:00','格拉本与圣史蒂芬大教堂','晚餐后可选歌剧院站票')]},
  {id:'d10',day:10,date:'10月5日',weekday:'周一',city:'维也纳 → 机场',country:'AT',title:'美泉宫与返程',hotel:'今日离开',activities:[
    a('d10-1','09:30','美泉宫','酒店步行可达，预留2.5小时','sight',{cost:'€28',important:true}),a('d10-2','13:30','返回酒店取行李','不再带行李绕行市中心','note'),a('d10-3','15:00','前往VIE机场','目标16:00前抵达','train',{important:true}),a('d10-4','19:00','起飞离开欧洲','旅程结束','train')]},
]

export const bookings: Booking[] = [
  {id:'b1',date:'9月27日',title:'IC 60403 阿姆斯特丹 → 科隆',detail:'21:01–23:45，直达自由座',price:'已购',status:'booked'},
  {id:'b2',date:'9月28日',title:'科隆 → 慕尼黑东站',detail:'18:54–23:34，2次换乘',price:'¥212/人 · 已购',status:'booked'},
  {id:'b3',date:'9月28–30日',title:'Moxy Munich Ostbahnhof',detail:'两笔连续订单，入住时关联',price:'已订',status:'booked'},
  {id:'b4',date:'9月30日',title:'新天鹅堡12:30场次',detail:'持城堡套票选择Multi-Day Ticket Holder',price:'€2.50/人',status:'urgent',url:'https://www.hohenschwangau.de/en/tours-tickets/official-tickets-neuschwanstein-hohenschwangau'},
  {id:'b5',date:'出发前',title:'拜仁14天城堡套票',detail:'覆盖慕尼黑皇宫与新天鹅堡',price:'€40/人',status:'urgent',url:'https://bsv-shop.bayern.de'},
  {id:'b6',date:'9月26日',title:'安妮之家19:00',detail:'每周二开放6周后的票',price:'€16.50/人',status:'urgent',url:'https://www.annefrank.org/en/museum/tickets/'},
  {id:'b7',date:'9月27日',title:'梵高博物馆',detail:'现场不售票',price:'€25/人',status:'soon',url:'https://www.vangoghmuseum.nl/en/visit/tickets-and-opening-hours'},
  {id:'b8',date:'10月3日',title:'Westbahn 萨尔茨堡 → 维也纳',detail:'18:52–21:14',price:'约¥117/人',status:'soon',url:'https://westbahn.at/en/'},
  {id:'b9',date:'10月5日',title:'美泉宫09:30',detail:'旺季建议提前预约',price:'€28/人',status:'soon',url:'https://www.imperialtickets.com/en/schoenbrunn-palace'},
]

export const route = [
  {city:'阿姆斯特丹',code:'AMS',date:'9/25–27',country:'NL'},
  {city:'科隆',code:'CGN',date:'9/27–28',country:'DE'},
  {city:'慕尼黑',code:'MUC',date:'9/28–30',country:'DE'},
  {city:'萨尔茨堡',code:'SZG',date:'9/30–10/3',country:'AT'},
  {city:'维也纳',code:'VIE',date:'10/3–5',country:'AT'},
] as const
