import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronRight, Copy, ExternalLink, Languages, Luggage, Search, ShieldAlert, ShoppingBag, Smartphone, Stethoscope } from 'lucide-react'
import { apps, glossary, packing, quickInfo, risks, shopping, visaGroups } from './toolboxData'

const loadDone=()=>{try{return new Set<string>(JSON.parse(localStorage.getItem('travel-tool-done')||'[]'))}catch{return new Set<string>()}}

function ToolGroup({icon:Icon,title,description,children,open=false}:{icon:typeof Luggage;title:string;description:string;children:React.ReactNode;open?:boolean}){
  return <details className="tool-group" open={open}><summary><span><Icon size={19}/></span><div><h2>{title}</h2><p>{description}</p></div><ChevronRight className="summary-chevron"/></summary><div className="tool-content">{children}</div></details>
}

export default function Toolbox(){
  const [done,setDone]=useState(loadDone);const [query,setQuery]=useState('');const [copied,setCopied]=useState('')
  useEffect(()=>localStorage.setItem('travel-tool-done',JSON.stringify([...done])),[done])
  const toggle=(id:string)=>setDone(old=>{const next=new Set(old);next.has(id)?next.delete(id):next.add(id);return next})
  const copy=async(text:string)=>{await navigator.clipboard.writeText(text);setCopied(text);setTimeout(()=>setCopied(''),1200)}
  const words=useMemo(()=>glossary.filter(item=>item.join(' ').toLowerCase().includes(query.toLowerCase())),[query])
  return <section className="tool-directory">
    <div className="section-title"><div><p className="eyebrow">REFERENCE</p><h2>随身资料</h2></div><span>点击分类展开</span></div>
    <div className="tool-groups">
      <ToolGroup icon={Stethoscope} title="实用速查" description="天气、应急、支付、网络、安全和退税" open><div className="info-grid">{quickInfo.map(group=><article key={group.title}><h3>{group.title}</h3>{group.items.map(item=><p key={item}>{item}</p>)}</article>)}</div></ToolGroup>
      <ToolGroup icon={Luggage} title="行李清单" description="证件、衣物、电子设备和随身物品"><div className="check-grid">{packing.map(group=><article key={group.group}><h3>{group.group}<small>{group.items.filter((_,index)=>done.has(`pack-${group.group}-${index}`)).length}/{group.items.length}</small></h3>{group.items.map((item,index)=>{const id=`pack-${group.group}-${index}`;return <button className={done.has(id)?'done':''} onClick={()=>toggle(id)} key={item}><span>{done.has(id)&&<Check size={14}/>}</span>{item}</button>})}</article>)}</div></ToolGroup>
      <ToolGroup icon={Smartphone} title="常用 App" description="铁路、公交、翻译、退税和备用分账"><div className="app-grid">{apps.map(item=><a href={item[2]} target="_blank" rel="noreferrer" key={item[0]}><span>{item[0].slice(0,2).toUpperCase()}</span><div><h3>{item[0]}</h3><p>{item[1]}</p></div><ExternalLink size={16}/></a>)}</div></ToolGroup>
      <ToolGroup icon={Languages} title="地名与常用语" description="可搜索并复制德语交通、景点和应急表达"><label className="tool-search"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索中文、德语或用途"/></label><div className="glossary-list">{words.map(item=><article key={item[0]}><span>{item[2]}</span><div><b>{item[0]}</b><p>{item[1]}</p></div><button onClick={()=>copy(item[1])} aria-label={`复制${item[1]}`}>{copied===item[1]?<Check/>:<Copy/>}</button></article>)}</div></ToolGroup>
      <ToolGroup icon={ShoppingBag} title="购物与退税" description="五座城市的伴手礼和离境退税顺序"><div className="tax-note"><b>离境退税顺序</b><span>商户退税单 → 维也纳机场海关验货 → 托运行李 → 退税柜台</span></div><div className="shopping-grid">{shopping.map(group=><article key={group.city}><h3>{group.city}</h3>{group.items.map(item=><p key={item}>{item}</p>)}</article>)}</div></ToolGroup>
      <ToolGroup icon={ShieldAlert} title="签证与风险" description="申根材料清单和已识别的行程风险"><div className="subsection"><h3>签证材料</h3><div className="check-grid">{visaGroups.map(group=><article key={group.title}><h3>{group.title}</h3>{group.items.map((item,index)=>{const id=`visa-${group.title}-${index}`;return <button className={done.has(id)?'done':''} onClick={()=>toggle(id)} key={item}><span>{done.has(id)&&<Check size={14}/>}</span>{item}</button>})}</article>)}</div></div><div className="subsection"><h3>行程风险</h3><div className="risk-list">{risks.map((risk,index)=><article className={`risk-${risk[0]}`} key={risk[1]}><span>{risk[0]}</span><div><h3>{risk[1]}</h3><p>{risk[2]}</p></div><b>{String(index+1).padStart(2,'0')}</b></article>)}</div></div></ToolGroup>
    </div>
  </section>
}
