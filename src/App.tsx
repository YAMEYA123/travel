import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, CircleDollarSign, ExternalLink, House, MapPin, Navigation, PackageCheck, PlaneTakeoff, TicketCheck, TrainFront, Wrench } from 'lucide-react'
import { bookings, days, route } from './data'
import type { Activity, Booking, TripDay } from './types'
import ExpenseLedger from './ExpenseLedger'
import Toolbox from './Toolbox'

type View = 'overview' | 'trip' | 'bookings' | 'tools'
type HomeMode = 'plan' | 'today'
type TripMode = 'plan' | 'day'
type BookingFilter = 'todo' | 'all' | 'booked'

const views: {id: View; label: string; icon: typeof House}[] = [
  {id:'overview',label:'总览',icon:House},
  {id:'trip',label:'行程',icon:CalendarDays},
  {id:'bookings',label:'预订',icon:TicketCheck},
  {id:'tools',label:'工具',icon:Wrench},
]
const countryName = {NL:'荷兰',DE:'德国',AT:'奥地利'}
const kindIcon: Record<Activity['kind'], string> = {sight:'◎',train:'↗',food:'◇',hotel:'⌂',note:'!'}
const dayGuidance: Record<number,{level:'舒缓'|'适中'|'紧凑';note:string;fallback?:string}> = {
  0:{level:'舒缓',note:'只安排机场转场和入住，保留航班延误余量。'},
  1:{level:'紧凑',note:'羊角村返程与19:00安妮之家之间缓冲有限。',fallback:'返程延误时取消九街。'},
  2:{level:'紧凑',note:'两馆后需要回酒店取行李并赶21:01列车。',fallback:'最迟19:50开始返回中央站。'},
  3:{level:'紧凑',note:'全天步行后乘坐两次换乘的晚班列车。',fallback:'持续查看DB App的站台与延误。'},
  4:{level:'适中',note:'上午晚起，下午皇宫，晚上啤酒节。'},
  5:{level:'紧凑',note:'新天鹅堡往返后继续转场萨尔茨堡。',fallback:'行李必须寄存在慕尼黑中央站。'},
  6:{level:'适中',note:'固定时段是14:00茨威格中心。'},
  7:{level:'适中',note:'湖区交通链较长，观景台按排队取舍。'},
  8:{level:'适中',note:'上午蒙德湖，下午返回取行李乘Westbahn。'},
  9:{level:'适中',note:'两馆之间留出午餐和交通时间。'},
  10:{level:'舒缓',note:'只安排美泉宫，15:00直接前往机场。'},
}

function useStoredSet(key:string) {
  const [items,setItems] = useState<Set<string>>(()=>{try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'))}catch{return new Set()}})
  useEffect(()=>localStorage.setItem(key,JSON.stringify([...items])),[items,key])
  const toggle=(id:string)=>setItems(old=>{const next=new Set(old);next.has(id)?next.delete(id):next.add(id);return next})
  return [items,toggle] as const
}

function Segmented<T extends string>({value,onChange,items,label}:{value:T;onChange:(value:T)=>void;items:{id:T;label:string}[];label:string}){
  return <div className="segmented" role="group" aria-label={label}>{items.map(item=><button key={item.id} className={value===item.id?'active':''} onClick={()=>onChange(item.id)}>{item.label}</button>)}</div>
}

function PageHeading({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:React.ReactNode}){
  return <header className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</header>
}

function RouteStrip(){return <div className="route-strip" aria-label="全程路线">{route.map((stop,index)=><div className="route-node" key={stop.code}><span className={`country-dot country-${stop.country}`}>{stop.code}</span><div><b>{stop.city}</b><small>{stop.date}</small></div>{index<route.length-1&&<i/>}</div>)}</div>}

function DepartureBoard(){return <article className="departure-board"><div className="board-label"><TrainFront size={18}/><span>NEXT DEPARTURE · 已购</span></div><div className="board-row"><time>21:01</time><div><strong>Amsterdam Centraal</strong><small>9月27日 · IC 60403 · 自由座</small></div></div><div className="board-track"><span/><i/><span/></div><div className="board-row"><time>23:45</time><div><strong>Köln Hbf</strong><small>直达 · 预计2小时44分</small></div></div></article>}

function PlanningHome({navigate}:{navigate:(view:View)=>void}){
  const urgent=bookings.filter(item=>item.status==='urgent')
  const confirmed=bookings.filter(item=>item.status==='booked').length
  return <>
    <section className="home-lead"><div className="lead-copy"><p className="eyebrow">25 SEP — 05 OCT 2026</p><h1>欧洲三国<br/>行程控制台</h1><p>从编排行程、确认预订，到旅途中查看下一站，所有信息保持在同一套时间线上。</p><div className="lead-actions"><button className="primary" onClick={()=>navigate('trip')}>检查完整行程</button><button className="secondary" onClick={()=>navigate('bookings')}>处理预订</button></div></div><DepartureBoard/></section>
    <RouteStrip/>
    <section className="status-grid"><article><span>行程</span><strong>11天</strong><small>5座城市 · 3个国家</small></article><article><span>准备进度</span><strong>{confirmed}/{bookings.length}</strong><small>已确认或已购买</small></article><article className="warning"><span>尽快处理</span><strong>{urgent.length}项</strong><small>住宿与固定时段优先</small></article></section>
    <section className="section-block"><div className="section-title"><div><p className="eyebrow">NEXT ACTIONS</p><h2>下一步先做这些</h2></div><button className="text-button" onClick={()=>navigate('bookings')}>查看全部 <ChevronRight size={16}/></button></div><div className="task-cards">{urgent.slice(0,3).map((item,index)=><article key={item.id}><span>0{index+1}</span><div><small>{item.date}</small><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}</div></section>
  </>
}

function TodayHome({navigate,index}:{navigate:(view:View)=>void;index:number}){
  const actual=index>=0;const day=days[actual?index:3]
  return <><section className="today-hero"><div className="today-label"><span>{actual?'今天':'模拟旅行日'}</span><b>D{day.day} · {day.date}</b></div><h1>{day.city}</h1><p>{day.title}</p><button className="primary light" onClick={()=>navigate('trip')}>打开今日时间轴</button></section><div className="today-grid"><section className="today-schedule"><div className="section-title"><div><p className="eyebrow">TODAY</p><h2>今天的关键节点</h2></div></div>{day.activities.filter(item=>item.important||item.kind==='train').map(item=><div className="compact-event" key={item.id}><time>{item.time}</time><div><b>{item.title}</b><span>{item.detail}</span></div></div>)}</section><aside className="today-side"><article><BedDouble/><span>今晚住宿</span><strong>{day.hotel}</strong></article><article className="warning"><AlertTriangle/><span>行程提醒</span><strong>{dayGuidance[day.day].fallback||dayGuidance[day.day].note}</strong></article></aside></div></>
}

function Overview({navigate}:{navigate:(view:View)=>void}){
  const tripIndex=Math.floor((new Date().setHours(0,0,0,0)-new Date('2026-09-25T00:00:00').getTime())/86400000)
  const currentIndex=tripIndex>=0&&tripIndex<days.length?tripIndex:-1
  const [mode,setMode]=useState<HomeMode>(currentIndex>=0?'today':'plan')
  return <div className="page overview-page"><div className="mode-bar"><span>查看方式</span><Segmented value={mode} onChange={setMode} label="首页查看方式" items={[{id:'plan',label:'规划全程'},{id:'today',label:'查看今天'}]}/></div>{mode==='plan'?<PlanningHome navigate={navigate}/>:<TodayHome navigate={navigate} index={currentIndex}/>}</div>
}

function ActivityRow({item,done,toggle}:{item:Activity;done:boolean;toggle:()=>void}){return <article className={`activity-row ${done?'done':''} ${item.important?'important':''}`}><button className="check-button" onClick={toggle} aria-label={done?'标为未完成':'标为已完成'}>{done?<Check size={16}/>:kindIcon[item.kind]}</button><time>{item.time}</time><div><h3>{item.title}</h3><p>{item.detail}</p><footer>{item.cost&&<span>{item.cost}</span>}{item.booked&&<span className="success">已确认</span>}</footer></div></article>}

function DayDetail({day,done,toggle}:{day:TripDay;done:Set<string>;toggle:(id:string)=>void}){
  const guide=dayGuidance[day.day]
  return <section className="day-detail"><header><div><p>{day.date} · {day.weekday} · {countryName[day.country]}</p><h2>{day.title}</h2><span><MapPin size={14}/>{day.city}</span></div><b>D{day.day}</b></header><div className={`planning-note level-${guide.level}`}><span>{guide.level}</span><div><b>{guide.note}</b>{guide.fallback&&<p>调整方案：{guide.fallback}</p>}</div></div>{day.note&&<div className="inline-notice"><AlertTriangle size={17}/><p>{day.note}</p></div>}<div className="timeline">{day.activities.map(item=><ActivityRow key={item.id} item={item} done={done.has(item.id)} toggle={()=>toggle(item.id)}/>)}</div><footer className="stay-row"><BedDouble size={20}/><span>今晚住宿</span><strong>{day.hotel}</strong></footer></section>
}

function PlanView({selectDay}:{selectDay:(index:number)=>void}){return <div className="plan-list">{days.map((day,index)=>{const guide=dayGuidance[day.day];const trains=day.activities.filter(item=>item.kind==='train').length;return <button key={day.id} onClick={()=>selectDay(index)}><time><b>D{day.day}</b><span>{day.date}<small>{day.weekday}</small></span></time><div><span className="city-line">{day.city}</span><h2>{day.title}</h2><p>{day.activities.length}项安排 · {trains}段交通 · {day.hotel}</p></div><em className={`level-${guide.level}`}>{guide.level}</em><ChevronRight/></button>})}</div>}

function TripPage(){
  const [mode,setMode]=useState<TripMode>('plan');const [selected,setSelected]=useState(0);const [done,toggle]=useStoredSet('travel-activity-done');const day=days[selected]
  const openDay=(index:number)=>{setSelected(index);setMode('day');scrollTo({top:0,behavior:'smooth'})}
  return <div className="page"><PageHeading eyebrow="ITINERARY" title="全程行程" description="行前连续检查每天的强度与转场；出发后切换到单日时间轴执行。" action={<Segmented value={mode} onChange={setMode} label="行程查看方式" items={[{id:'plan',label:'全程规划'},{id:'day',label:'单日执行'}]}/>}/>{mode==='plan'?<><RouteStrip/><PlanView selectDay={openDay}/></>:<div className="day-layout"><aside className="day-picker"><div className="day-pager"><button disabled={selected===0} onClick={()=>setSelected(value=>value-1)} aria-label="前一天"><ChevronLeft/></button><span>{selected+1} / {days.length}</span><button disabled={selected===days.length-1} onClick={()=>setSelected(value=>value+1)} aria-label="后一天"><ChevronRight/></button></div>{days.map((item,index)=><button className={index===selected?'active':''} onClick={()=>setSelected(index)} key={item.id}><b>D{item.day}</b><span>{item.date}<small>{item.city}</small></span></button>)}</aside><DayDetail day={day} done={done} toggle={toggle}/></div>}</div>
}

function bookingKind(item:Booking){if(item.title.includes('Hotel')||item.title.includes('Holiday Inn')||item.title.includes('Hilton')||item.title.includes('Moxy')||item.title.includes('住宿')||item.title.includes('DoubleTree'))return '住宿';if(item.title.includes('→')||item.title.includes('日票')||item.title.includes('Westbahn'))return '交通';return '景点'}

function BookingCard({item,done,toggle}:{item:Booking;done:boolean;toggle:()=>void}){return <article className={`booking-card status-${item.status} ${done?'done':''}`}><button className="check-button" onClick={toggle}>{done?<Check size={16}/>:<span/>}</button><div className="booking-date"><span>{bookingKind(item)}</span><time>{item.date}</time></div><div className="booking-copy"><h3>{item.title}</h3><p>{item.detail}</p><strong>{item.price}</strong></div>{item.url&&<a href={item.url} target="_blank" rel="noreferrer" aria-label={`打开${item.title}官网`}><ExternalLink size={17}/></a>}</article>}

function BookingsPage(){const [filter,setFilter]=useState<BookingFilter>('todo');const [done,toggle]=useStoredSet('travel-bookings-done');const list=bookings.filter(item=>filter==='all'||(filter==='booked'?item.status==='booked':item.status!=='booked'&&!done.has(item.id)));const urgent=bookings.filter(item=>item.status==='urgent'&&!done.has(item.id)).length;return <div className="page"><PageHeading eyebrow="PREPARATION" title="预订与准备" description="先处理固定时段和住宿，再确认车票、景点与现场购买项。"/><section className="prep-summary"><article className="warning"><AlertTriangle/><div><span>立即处理</span><strong>{urgent}项</strong></div></article><article><PackageCheck/><div><span>已确认</span><strong>{bookings.filter(item=>item.status==='booked').length}项</strong></div></article><article><TicketCheck/><div><span>全部记录</span><strong>{bookings.length}项</strong></div></article></section><div className="filter-row"><Segmented value={filter} onChange={setFilter} label="预订筛选" items={[{id:'todo',label:'待处理'},{id:'all',label:'全部'},{id:'booked',label:'已确认'}]}/></div><div className="booking-list">{list.length?list.map(item=><BookingCard key={item.id} item={item} done={done.has(item.id)} toggle={()=>toggle(item.id)}/>):<div className="empty-state"><Check/><h2>当前没有待处理事项</h2><p>可以切换到“全部”查看所有票务和住宿记录。</p></div>}</div></div>}

function ToolsPage(){return <div className="page"><PageHeading eyebrow="TRAVEL KIT" title="费用与工具" description="预算、分账和常用资料按使用场景归档，不再隐藏在多层页签中。"/><Toolbox/><section className="budget-section"><div className="section-title"><div><p className="eyebrow">BUDGET</p><h2>预算与实际支出</h2></div></div><div className="budget-overview"><article><CircleDollarSign/><span>两人可变支出</span><strong>€975–1,150</strong><small>不含国际机票与积分住宿</small></article><div className="budget-lines">{[['交通','约 €180'],['景点与城市卡','约 €245'],['餐饮','约 €550'],['待订住宿','萨尔茨堡3晚']].map(row=><div key={row[0]}><span>{row[0]}</span><b>{row[1]}</b></div>)}</div></div><ExpenseLedger/></section></div>}

export default function App(){
  const legacy:Record<string,View>={days:'trip',route:'trip',budget:'tools'}
  const hash=location.hash.replace('#/','')||'overview';const initial=(legacy[hash]||hash) as View
  const [view,setView]=useState<View>(views.some(item=>item.id===initial)?initial:'overview')
  const navigate=(next:View)=>{setView(next);history.pushState(null,'',`#/${next}`);scrollTo({top:0,behavior:'smooth'})}
  useEffect(()=>{const onHash=()=>{const value=location.hash.replace('#/','')||'overview';setView((legacy[value]||value) as View)};addEventListener('hashchange',onHash);return()=>removeEventListener('hashchange',onHash)},[])
  const page=useMemo(()=>view==='overview'?<Overview navigate={navigate}/>:view==='trip'?<TripPage/>:view==='bookings'?<BookingsPage/>:<ToolsPage/>,[view])
  return <div className="app-shell"><header className="topbar"><button className="brand" onClick={()=>navigate('overview')}><span><Navigation size={19}/></span><div><b>向东 · 欧洲旅行</b><small>规划与随行助手</small></div></button><nav>{views.map(item=>{const Icon=item.icon;return <button className={view===item.id?'active':''} onClick={()=>navigate(item.id)} key={item.id}><Icon size={17}/>{item.label}</button>})}</nav><div className="trip-date"><PlaneTakeoff size={16}/>9月25日出发</div></header><main>{page}</main><footer className="site-footer"><span>EUROPE 2026</span><p>所有勾选与分账数据只保存在当前浏览器</p></footer><nav className="mobile-nav">{views.map(item=>{const Icon=item.icon;return <button className={view===item.id?'active':''} onClick={()=>navigate(item.id)} key={item.id}><Icon/><span>{item.label}</span></button>})}</nav></div>
}
