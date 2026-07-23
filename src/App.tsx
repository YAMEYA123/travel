import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, CircleDollarSign, Map, MapPin, Navigation, TicketCheck, TrainFront, WalletCards } from 'lucide-react'
import { bookings, days, route } from './data'
import type { Activity } from './types'

type View = 'overview' | 'days' | 'route' | 'bookings' | 'budget'
const views: {id:View;label:string;icon:typeof MapPin}[] = [
  {id:'overview',label:'总览',icon:Navigation},{id:'days',label:'日程',icon:CalendarDays},
  {id:'route',label:'路线',icon:Map},{id:'bookings',label:'预订',icon:TicketCheck},
  {id:'budget',label:'预算',icon:WalletCards},
]

const kindIcon: Record<Activity['kind'], string> = {sight:'◎',train:'↗',food:'◇',hotel:'⌂',note:'!'}
const countryName = {NL:'荷兰',DE:'德国',AT:'奥地利'}

function useStoredSet(key:string) {
  const [items,setItems] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem(key) || '[]')))
  useEffect(() => localStorage.setItem(key, JSON.stringify([...items])), [items,key])
  const toggle = (id:string) => setItems(old => { const next=new Set(old); next.has(id)?next.delete(id):next.add(id); return next })
  return [items,toggle] as const
}

function RouteBand({compact=false}:{compact?:boolean}) {
  return <div className={`route-band ${compact?'compact':''}`} aria-label="旅行路线">
    {route.map((stop,i)=><div className="route-stop" key={stop.code}>
      <div className={`station country-${stop.country}`}>{stop.code}</div>
      <div><strong>{stop.city}</strong><span>{stop.date}</span></div>
      {i<route.length-1 && <div className="rail"/>}
    </div>)}
  </div>
}

function Overview({goDays}:{goDays:()=>void}) {
  const urgent=bookings.filter(x=>x.status==='urgent').length
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">EUROPE · 2026</p><h1>一路向东，<br/>十一日旅行手册</h1>
        <p className="lede">阿姆斯特丹的水光，科隆的尖塔，巴伐利亚的城堡，最后抵达维也纳。</p>
        <button className="primary" onClick={goDays}>查看今日程 <span>→</span></button></div>
      <div className="ticket-stub"><div className="stub-top"><TrainFront/><span>已确认交通</span></div><strong>AMS <i>→</i> CGN <i>→</i> MUC</strong><p>9月27–28日 · 两段车票已购</p><div className="barcode"/></div>
    </section>
    <RouteBand/>
    <section className="pulse-grid">
      <article><span>旅行长度</span><strong>11</strong><small>天 · 3个国家</small></article>
      <article><span>下一项待办</span><strong>{urgent}</strong><small>项紧急预约</small></article>
      <article><span>已订住宿</span><strong>7</strong><small>晚已确认</small></article>
    </section>
    <section className="next-card"><div><p className="eyebrow">重要提醒</p><h2>两次换乘，不要只看纸面站台</h2><p>9月28日 18:54 从科隆出发，当天持续查看 DB App。23:34 到达慕尼黑东站后直接入住 Moxy。</p></div><span className="date-tile">SEP<b>28</b></span></section>
  </>
}

function ActivityRow({item,done,toggle}:{item:Activity;done:boolean;toggle:()=>void}) {
  return <article className={`activity ${done?'done':''} ${item.important?'important':''}`}>
    <button className="done-button" onClick={toggle} aria-label={done?'标为未完成':'标为完成'}>{done?<Check size={16}/>:kindIcon[item.kind]}</button>
    <time>{item.time}</time><div className="activity-copy"><h3>{item.title}</h3><p>{item.detail}</p>
    <div className="meta">{item.transport&&<span>{item.transport}</span>}{item.cost&&<span className="cost">{item.cost}</span>}{item.booked&&<span className="booked">已确认</span>}</div></div>
  </article>
}

function DaysView() {
  const [selected,setSelected]=useState(0); const [done,toggle]=useStoredSet('travel-activity-done')
  const day=days[selected]
  return <div className="split-layout"><aside className="day-rail"><p className="eyebrow">DAILY ROUTE</p>{days.map((d,i)=><button className={i===selected?'active':''} onClick={()=>setSelected(i)} key={d.id}><b>{String(d.day).padStart(2,'0')}</b><span>{d.date}<small>{d.city}</small></span></button>)}</aside>
    <section className="day-detail"><header className={`day-header country-${day.country}`}><div><p>{day.date} · {day.weekday} · {countryName[day.country]}</p><h1>{day.title}</h1><span><MapPin size={14}/>{day.city}</span></div><b>D{day.day}</b></header>
      {day.note&&<div className="notice"><strong>行程提示</strong><p>{day.note}</p></div>}
      <div className="timeline">{day.activities.map(x=><ActivityRow key={x.id} item={x} done={done.has(x.id)} toggle={()=>toggle(x.id)}/>)}</div>
      <footer className="hotel-footer"><span>今晚住宿</span><strong>{day.hotel}</strong></footer>
    </section></div>
}

function RouteView() { return <section className="route-page"><p className="eyebrow">RAILWAY ATLAS</p><h1>五座城，一条向东的线</h1><p className="intro">跨城交通与住宿节点集中在这里。城市间的线条表达旅行顺序，不代表精确铁路走向。</p><div className="route-canvas"><div className="route-line"/>{route.map((s,i)=><article className={`map-stop stop-${i} country-${s.country}`} key={s.code}><span>{i+1}</span><div><small>{s.code} · {s.date}</small><h2>{s.city}</h2><p>{countryName[s.country]}</p></div></article>)}</div>
    <div className="confirmed-legs"><h2>已确认的跨城段</h2><div><TrainFront/><p><b>9/27 · IC 60403</b><span>Amsterdam Centraal 21:01 → Köln Hbf 23:45</span></p><em>直达</em></div><div><TrainFront/><p><b>9/28 · DB Super Sparpreis</b><span>Köln Hbf 18:54 → München Ost 23:34</span></p><em>2次换乘</em></div></div></section> }

function BookingsView() {
  const [done,toggle]=useStoredSet('travel-bookings-done')
  return <section className="list-page"><p className="eyebrow">BOOKING DESK</p><h1>预订与票务</h1><p className="intro">只展示仍需要行动或值得随身确认的项目。勾选状态保存在当前浏览器。</p>
    <div className="booking-list">{bookings.map(b=><article key={b.id} className={`booking ${b.status} ${done.has(b.id)?'done':''}`}><button onClick={()=>toggle(b.id)}>{done.has(b.id)?<Check/>:<span/>}</button><time>{b.date}</time><div><h2>{b.title}</h2><p>{b.detail}</p></div><strong>{b.price}</strong>{b.url&&<a href={b.url} target="_blank" rel="noreferrer">官网 ↗</a>}</article>)}</div></section>
}

function BudgetView() {
  const rows=[['城际与市内交通','约 €180','含已购DB/NS车票'],['景点与城市卡','约 €245','含两人城堡套票'],['餐饮','约 €550','按两人每日€50估算'],['已确认积分住宿','积分兑换','阿姆斯特丹、科隆、慕尼黑、维也纳'],['待订住宿','3晚','萨尔茨堡']]
  return <section className="budget-page"><p className="eyebrow">TRIP LEDGER</p><h1>预算概览</h1><div className="budget-hero"><CircleDollarSign/><div><span>两人可变支出参考</span><strong>€975–1,150</strong><small>不含国际机票与积分住宿</small></div></div><div className="ledger">{rows.map((r,i)=><div key={r[0]}><span>{String(i+1).padStart(2,'0')}</span><b>{r[0]}</b><strong>{r[1]}</strong><small>{r[2]}</small></div>)}</div><p className="budget-note">价格会随预约时间和实际消费变化；详细逐项预算仍保留在文字版攻略中。</p></section>
}

export default function App() {
  const hash=(location.hash.replace('#/','')||'overview') as View
  const [view,setView]=useState<View>(views.some(v=>v.id===hash)?hash:'overview')
  const navigate=(next:View)=>{setView(next);history.replaceState(null,'',`#/${next}`);scrollTo({top:0,behavior:'smooth'})}
  useEffect(()=>{const fn=()=>setView((location.hash.replace('#/','')||'overview') as View);addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn)},[])
  const page=useMemo(()=>view==='overview'?<Overview goDays={()=>navigate('days')}/>:view==='days'?<DaysView/>:view==='route'?<RouteView/>:view==='bookings'?<BookingsView/>:<BudgetView/>,[view])
  return <div className="app-shell"><header className="topbar"><a className="brand" href="#/overview" onClick={()=>navigate('overview')}><span>向东</span><div><b>欧洲旅行手册</b><small>25 SEP — 05 OCT 2026</small></div></a><nav>{views.map(v=>{const Icon=v.icon;return <button className={view===v.id?'active':''} onClick={()=>navigate(v.id)} key={v.id}><Icon size={17}/>{v.label}</button>})}</nav></header><main>{page}</main><footer className="site-footer"><span>EUROPE 2026</span><p>行程数据以《欧洲旅游攻略_2026.md》为基准</p></footer><nav className="mobile-nav">{views.map(v=>{const Icon=v.icon;return <button className={view===v.id?'active':''} onClick={()=>navigate(v.id)} key={v.id}><Icon/><span>{v.label}</span></button>})}</nav></div>
}
