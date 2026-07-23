import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, Trash2, Users } from 'lucide-react'

type Expense={id:string;date:string;title:string;amount:number;currency:'EUR'|'CNY';payer:string;category:string}
const load=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}}

export default function ExpenseLedger(){
  const [members,setMembers]=useState<string[]>(()=>load('travel-split-members',['我','同伴']))
  const [expenses,setExpenses]=useState<Expense[]>(()=>load('travel-split-expenses',[]))
  const [member,setMember]=useState(''); const [title,setTitle]=useState(''); const [amount,setAmount]=useState('');
  const [payer,setPayer]=useState(members[0]||'我'); const [currency,setCurrency]=useState<'EUR'|'CNY'>('EUR'); const [category,setCategory]=useState('餐饮')
  useEffect(()=>localStorage.setItem('travel-split-members',JSON.stringify(members)),[members])
  useEffect(()=>localStorage.setItem('travel-split-expenses',JSON.stringify(expenses)),[expenses])
  const totals=useMemo(()=>expenses.reduce((a,e)=>{a[e.currency]+=e.amount;return a},{EUR:0,CNY:0}),[expenses])
  const balances=useMemo(()=>members.map(name=>{const paid=expenses.filter(e=>e.payer===name).reduce((a,e)=>a+(e.currency==='EUR'?e.amount:e.amount/7.8),0);const total=totals.EUR+totals.CNY/7.8;return{name,value:paid-total/Math.max(members.length,1)}}),[members,expenses,totals])
  const addExpense=()=>{const n=Number(amount);if(!title.trim()||!n)return;setExpenses(x=>[{id:crypto.randomUUID(),date:new Date().toISOString().slice(0,10),title:title.trim(),amount:n,currency,payer,category},...x]);setTitle('');setAmount('')}
  const addMember=()=>{const n=member.trim();if(n&&!members.includes(n)){setMembers(x=>[...x,n]);setMember('')}}
  const exportData=()=>{const blob=new Blob([JSON.stringify({members,expenses},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='europe-trip-split.json';a.click();URL.revokeObjectURL(url)}
  return <section className="split-bill"><div className="section-heading"><div><p className="eyebrow">LOCAL LEDGER</p><h2>两人分账</h2></div><button className="ghost" onClick={exportData}><Download size={16}/>导出备份</button></div>
    <p className="privacy-note">所有记录只保存在当前浏览器，不上传服务器。人民币按 €1≈¥7.8 仅用于结算估算。</p>
    <div className="member-strip"><Users size={18}/>{members.map(m=><span key={m}>{m}</span>)}<input value={member} onChange={e=>setMember(e.target.value)} placeholder="新增成员"/><button onClick={addMember}><Plus size={15}/></button></div>
    <div className="expense-form"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="消费项目"/><input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="金额"/><select value={currency} onChange={e=>setCurrency(e.target.value as 'EUR'|'CNY')}><option>EUR</option><option>CNY</option></select><select value={payer} onChange={e=>setPayer(e.target.value)}>{members.map(m=><option key={m}>{m}</option>)}</select><select value={category} onChange={e=>setCategory(e.target.value)}>{['餐饮','交通','门票','住宿','购物','其他'].map(x=><option key={x}>{x}</option>)}</select><button className="primary compact" onClick={addExpense}>记一笔</button></div>
    <div className="balance-row">{balances.map(b=><article key={b.name}><span>{b.name}</span><strong className={b.value>=0?'positive':'negative'}>{b.value>=0?'应收':'应付'} €{Math.abs(b.value).toFixed(2)}</strong></article>)}</div>
    <div className="expense-list">{expenses.length===0?<div className="empty">旅途中记下第一笔共同消费，系统会自动均分。</div>:expenses.map(e=><article key={e.id}><time>{e.date.slice(5)}</time><span className="category">{e.category}</span><div><b>{e.title}</b><small>{e.payer} 支付</small></div><strong>{e.currency==='EUR'?'€':'¥'}{e.amount.toFixed(2)}</strong><button onClick={()=>setExpenses(x=>x.filter(y=>y.id!==e.id))} aria-label="删除"><Trash2 size={15}/></button></article>)}</div>
  </section>
}
