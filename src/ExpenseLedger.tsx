import { useEffect, useMemo, useState } from 'react'
import { Download, Link2, Plus, Trash2, Users } from 'lucide-react'
import {
  cashToEUR,
  CURRENCY_OPTIONS,
  createExpense,
  EXPENSES_CHANGED,
  EXPENSES_KEY,
  formatExpenseAmount,
  isPointCurrency,
  loadExpenses,
  loadMembers,
  MEMBERS_KEY,
  saveExpenses,
  SPLIT_PAYER,
  type Expense,
  type ExpenseCurrency,
} from './expenseStore'

export default function ExpenseLedger(){
  const [members,setMembers]=useState<string[]>(loadMembers)
  const [expenses,setExpenses]=useState<Expense[]>(loadExpenses)
  const [member,setMember]=useState('')
  const [title,setTitle]=useState('')
  const [amount,setAmount]=useState('')
  const [payer,setPayer]=useState(members[0]||'我')
  const [currency,setCurrency]=useState<ExpenseCurrency>('EUR')
  const [category,setCategory]=useState('餐饮')

  useEffect(()=>localStorage.setItem(MEMBERS_KEY,JSON.stringify(members)),[members])
  useEffect(()=>{
    const sync=(event:Event)=>setExpenses((event as CustomEvent<Expense[]>).detail||loadExpenses())
    addEventListener(EXPENSES_CHANGED,sync)
    return()=>removeEventListener(EXPENSES_CHANGED,sync)
  },[])

  const cashTotal=useMemo(()=>expenses.reduce((sum,expense)=>sum+cashToEUR(expense.amount,expense.currency),0),[expenses])
  const pointSettlements=useMemo(()=>CURRENCY_OPTIONS.filter(option=>isPointCurrency(option.value)).map(option=>{
    const pointExpenses=expenses.filter(expense=>expense.currency===option.value)
    const total=pointExpenses.reduce((sum,expense)=>sum+expense.amount,0)
    return{
      ...option,
      total,
      balances:members.map(name=>{
        const paid=pointExpenses.reduce((sum,expense)=>{
          if(expense.payer===name)return sum+expense.amount
          if(expense.payer===SPLIT_PAYER)return sum+expense.amount/2
          return sum
        },0)
        return{name,paid,value:paid-total/Math.max(members.length,1)}
      }),
    }
  }).filter(item=>item.total>0),[expenses,members])
  const balances=useMemo(()=>members.map(name=>{
    const paid=expenses.reduce((sum,expense)=>{
      const amountInEUR=cashToEUR(expense.amount,expense.currency)
      if(expense.payer===name)return sum+amountInEUR
      if(expense.payer===SPLIT_PAYER)return sum+amountInEUR/2
      return sum
    },0)
    return{name,paid,value:paid-cashTotal/Math.max(members.length,1)}
  }),[members,expenses,cashTotal])

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
    <p className="privacy-note">记录只保存在当前浏览器。现金按 €1≈¥7.8、€1≈$1.16 估算结算；IHG、万豪和希尔顿积分分别作为独立单位均分并计算应收应付。</p>
    <div className="member-strip"><Users size={18}/>{members.map(name=><span key={name}>{name}</span>)}<input value={member} onChange={event=>setMember(event.target.value)} placeholder="新增成员"/><button onClick={addMember}><Plus size={15}/></button></div>
    <div className="expense-form"><input value={title} onChange={event=>setTitle(event.target.value)} placeholder="消费项目"/><input inputMode="decimal" value={amount} onChange={event=>setAmount(event.target.value)} placeholder={isPointCurrency(currency)?'积分数量':'金额'}/><select value={currency} onChange={event=>setCurrency(event.target.value as ExpenseCurrency)}>{CURRENCY_OPTIONS.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select><select value={payer} onChange={event=>setPayer(event.target.value)}><option value={SPLIT_PAYER}>{SPLIT_PAYER}</option>{members.map(name=><option key={name}>{name}</option>)}</select><select value={category} onChange={event=>setCategory(event.target.value)}>{['餐饮','交通','门票','住宿','购物','其他'].map(value=><option key={value}>{value}</option>)}</select><button className="primary compact" onClick={addExpense}>记一笔</button></div>
    <div className="balance-row">{balances.map(balance=><article key={balance.name}><span><b>{balance.name}</b><small>个人现金支出 €{balance.paid.toFixed(2)}</small></span><strong className={balance.value>=0?'positive':'negative'}>{balance.value>=0?'应收':'应付'} €{Math.abs(balance.value).toFixed(2)}</strong></article>)}</div>
    {pointSettlements.length>0&&<section className="points-settlement"><header><b>积分分账</b><small>不同酒店积分分别结算，不互相换算</small></header><div>{pointSettlements.map(item=><article key={item.value}><header><span>{item.label}</span><b>共 {Math.round(item.total).toLocaleString('zh-CN')}</b></header>{item.balances.map(balance=><p key={balance.name}><span><b>{balance.name}</b><small>已付 {Math.round(balance.paid).toLocaleString('zh-CN')}</small></span><strong className={balance.value>=0?'positive':'negative'}>{balance.value>=0?'应收':'应付'} {Math.round(Math.abs(balance.value)).toLocaleString('zh-CN')}</strong></p>)}</article>)}</div></section>}
    <div className="expense-list">{expenses.length===0?<div className="empty">旅途中记下第一笔共同消费，系统会自动均分。</div>:expenses.map(expense=><article className={`${expense.bookingId?'linked-expense ':''}${isPointCurrency(expense.currency)?'points-expense':''}`} key={expense.id}><time>{expense.date.slice(5)}</time><span className="category">{expense.category}</span><div><b>{expense.title}</b><small>{expense.payer===SPLIT_PAYER?`各自支付 · 每人 ${formatExpenseAmount(expense.amount/2,expense.currency)}`:`${expense.payer} 支付`}{expense.bookingId&&<button className="booking-link" onClick={()=>openBooking(expense.bookingId!)}><Link2/>关联预订</button>}</small></div><strong>{formatExpenseAmount(expense.amount,expense.currency)}</strong><button onClick={()=>removeExpense(expense.id)} aria-label="删除"><Trash2 size={15}/></button></article>)}</div>
  </section>
}
