import { useEffect, useMemo, useState } from 'react'
import { Download, Link2, Plus, Trash2, Users } from 'lucide-react'
import {
  createExpense,
  EXPENSES_CHANGED,
  EXPENSES_KEY,
  loadExpenses,
  loadMembers,
  MEMBERS_KEY,
  saveExpenses,
  type Expense,
} from './expenseStore'

export default function ExpenseLedger(){
  const [members,setMembers]=useState<string[]>(loadMembers)
  const [expenses,setExpenses]=useState<Expense[]>(loadExpenses)
  const [member,setMember]=useState('')
  const [title,setTitle]=useState('')
  const [amount,setAmount]=useState('')
  const [payer,setPayer]=useState(members[0]||'我')
  const [currency,setCurrency]=useState<'EUR'|'CNY'>('EUR')
  const [category,setCategory]=useState('餐饮')

  useEffect(()=>localStorage.setItem(MEMBERS_KEY,JSON.stringify(members)),[members])
  useEffect(()=>{
    const sync=(event:Event)=>setExpenses((event as CustomEvent<Expense[]>).detail||loadExpenses())
    addEventListener(EXPENSES_CHANGED,sync)
    return()=>removeEventListener(EXPENSES_CHANGED,sync)
  },[])

  const totals=useMemo(()=>expenses.reduce((a,e)=>{a[e.currency]+=e.amount;return a},{EUR:0,CNY:0}),[expenses])
  const balances=useMemo(()=>members.map(name=>{
    const paid=expenses.filter(e=>e.payer===name).reduce((a,e)=>a+(e.currency==='EUR'?e.amount:e.amount/7.8),0)
    const total=totals.EUR+totals.CNY/7.8
    return{name,value:paid-total/Math.max(members.length,1)}
  }),[members,expenses,totals])

  const addExpense=()=>{
    const value=Number(amount)
    if(!title.trim()||!value)return
    createExpense({title:title.trim(),amount:value,currency,payer,category})
    setTitle('')
    setAmount('')
  }
  const removeExpense=(id:string)=>{
    const next=expenses.filter(item=>item.id!==id)
    setExpenses(next)
    saveExpenses(next)
  }
  const addMember=()=>{
    const name=member.trim()
    if(name&&!members.includes(name)){setMembers(current=>[...current,name]);setMember('')}
  }
  const openBooking=(bookingId:string)=>{
    sessionStorage.setItem('travel-open-booking',bookingId)
    location.hash='/bookings'
  }
  const exportData=()=>{
    const blob=new Blob([JSON.stringify({members,expenses},null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const anchor=document.createElement('a')
    anchor.href=url
    anchor.download='europe-trip-split.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <section className="split-bill">
    <div className="section-heading"><div><p className="eyebrow">LOCAL LEDGER</p><h2>两人分账</h2></div><button className="ghost" onClick={exportData}><Download size={16}/>导出备份</button></div>
    <p className="privacy-note">所有记录只保存在当前浏览器，不上传服务器。人民币按 €1≈¥7.8 仅用于结算估算。</p>
    <div className="member-strip"><Users size={18}/>{members.map(name=><span key={name}>{name}</span>)}<input value={member} onChange={event=>setMember(event.target.value)} placeholder="新增成员"/><button onClick={addMember}><Plus size={15}/></button></div>
    <div className="expense-form"><input value={title} onChange={event=>setTitle(event.target.value)} placeholder="消费项目"/><input inputMode="decimal" value={amount} onChange={event=>setAmount(event.target.value)} placeholder="金额"/><select value={currency} onChange={event=>setCurrency(event.target.value as 'EUR'|'CNY')}><option>EUR</option><option>CNY</option></select><select value={payer} onChange={event=>setPayer(event.target.value)}>{members.map(name=><option key={name}>{name}</option>)}</select><select value={category} onChange={event=>setCategory(event.target.value)}>{['餐饮','交通','门票','住宿','购物','其他'].map(value=><option key={value}>{value}</option>)}</select><button className="primary compact" onClick={addExpense}>记一笔</button></div>
    <div className="balance-row">{balances.map(balance=><article key={balance.name}><span>{balance.name}</span><strong className={balance.value>=0?'positive':'negative'}>{balance.value>=0?'应收':'应付'} €{Math.abs(balance.value).toFixed(2)}</strong></article>)}</div>
    <div className="expense-list">{expenses.length===0?<div className="empty">旅途中记下第一笔共同消费，系统会自动均分。</div>:expenses.map(expense=><article className={expense.bookingId?'linked-expense':''} key={expense.id}><time>{expense.date.slice(5)}</time><span className="category">{expense.category}</span><div><b>{expense.title}</b><small>{expense.payer} 支付{expense.bookingId&&<button className="booking-link" onClick={()=>openBooking(expense.bookingId!)}><Link2/>关联预订</button>}</small></div><strong>{expense.currency==='EUR'?'€':'¥'}{expense.amount.toFixed(2)}</strong><button onClick={()=>removeExpense(expense.id)} aria-label="删除"><Trash2 size={15}/></button></article>)}</div>
  </section>
}
