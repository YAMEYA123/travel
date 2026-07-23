import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, ExternalLink, Search } from 'lucide-react'
import { apps, glossary, packing, quickInfo, risks, shopping, visaGroups } from './toolboxData'

type Tool='quick'|'packing'|'apps'|'shopping'|'glossary'|'visa'|'risks'
const tabs:{id:Tool;label:string}[]=[{id:'quick',label:'实用速查'},{id:'packing',label:'行李'},{id:'apps',label:'必备App'},{id:'shopping',label:'购物'},{id:'glossary',label:'地名语言'},{id:'visa',label:'签证'},{id:'risks',label:'风险'}]
const loadDone=()=>{try{return new Set<string>(JSON.parse(localStorage.getItem('travel-tool-done')||'[]'))}catch{return new Set<string>()}}

export default function Toolbox(){
  const [tab,setTab]=useState<Tool>('quick');const [done,setDone]=useState(loadDone);const [query,setQuery]=useState('');const [copied,setCopied]=useState('')
  useEffect(()=>localStorage.setItem('travel-tool-done',JSON.stringify([...done])),[done])
  const toggle=(id:string)=>setDone(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n})
  const copy=async(text:string)=>{await navigator.clipboard.writeText(text);setCopied(text);setTimeout(()=>setCopied(''),1200)}
  const words=useMemo(()=>glossary.filter(x=>x.join(' ').toLowerCase().includes(query.toLowerCase())),[query])
  return <section className="tool-page"><p className="eyebrow">POCKET COMPANION</p><h1>旅行工具箱</h1><p className="intro">把原版里散落的生活信息、清单和签证资料重新装进一个适合手机查阅的护照夹。</p>
    <div className="passport-tabs">{tabs.map(t=><button className={tab===t.id?'active':''} onClick={()=>setTab(t.id)} key={t.id}>{t.label}</button>)}</div>
    {tab==='quick'&&<div className="info-grid">{quickInfo.map(g=><article key={g.title}><h2>{g.title}</h2>{g.items.map(x=><p key={x}>{x}</p>)}</article>)}</div>}
    {tab==='packing'&&<div className="check-groups">{packing.map(g=><article key={g.group}><h2>{g.group}<small>{g.items.filter((_,i)=>done.has(`pack-${g.group}-${i}`)).length}/{g.items.length}</small></h2>{g.items.map((x,i)=>{const id=`pack-${g.group}-${i}`;return <button className={done.has(id)?'done':''} onClick={()=>toggle(id)} key={x}><span>{done.has(id)&&<Check size={14}/>}</span>{x}</button>})}</article>)}</div>}
    {tab==='apps'&&<div className="app-directory">{apps.map(x=><a href={x[2]} target="_blank" rel="noreferrer" key={x[0]}><span>{x[0].slice(0,2).toUpperCase()}</span><div><h2>{x[0]}</h2><p>{x[1]}</p></div><ExternalLink size={16}/></a>)}</div>}
    {tab==='shopping'&&<><div className="tax-note"><b>离境退税顺序</b><span>商户退税单 → 维也纳机场海关验货 → 托运行李 → 退税柜台</span></div><div className="shopping-grid">{shopping.map(s=><article key={s.city}><h2>{s.city}</h2>{s.items.map(x=><p key={x}>{x}</p>)}</article>)}</div></>}
    {tab==='glossary'&&<><label className="tool-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索地点、德语或用途"/></label><div className="glossary-list">{words.map(x=><article key={x[0]}><span>{x[2]}</span><div><b>{x[0]}</b><p>{x[1]}</p></div><button onClick={()=>copy(x[1])}>{copied===x[1]?<Check/>:<Copy/>}</button></article>)}</div></>}
    {tab==='visa'&&<div className="visa-groups">{visaGroups.map(g=><article key={g.title}><h2>{g.title}</h2>{g.items.map((x,i)=>{const id=`visa-${g.title}-${i}`;return <button className={done.has(id)?'done':''} onClick={()=>toggle(id)} key={x}><span>{done.has(id)&&<Check size={14}/>}</span>{x}</button>})}</article>)}</div>}
    {tab==='risks'&&<div className="risk-list">{risks.map((r,i)=><article className={`risk-${r[0]}`} key={r[1]}><span>{r[0]}</span><div><h2>{r[1]}</h2><p>{r[2]}</p></div><b>{String(i+1).padStart(2,'0')}</b></article>)}</div>}
  </section>
}
