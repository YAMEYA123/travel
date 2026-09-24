import { useEffect, useMemo, useState } from 'react'
import { Download, FileImage, Link2, Plus, RotateCcw, Settings2, Trash2, Upload, Users, X } from 'lucide-react'
import {
  cashToEUR,
  CURRENCY_OPTIONS,
  createExpense,
  DEFAULT_EXCHANGE_RATES,
  EXPENSES_CHANGED,
  EXPENSES_KEY,
  expenseValueToCNY,
  formatExpenseAmount,
  isPointCurrency,
  loadExchangeRates,
  loadExpenses,
  loadMembers,
  expenseConsumers,
  FIXED_MEMBERS,
  hydrateExpenses,
  loadReceipt,
  removeReceipt,
  saveReceipt,
  MEMBERS_KEY,
  saveExpenses,
  saveExchangeRates,
  SPLIT_PAYER,
  expenseTotal,
  type ExchangeRates,
  type Expense,
  type ExpenseCurrency,
} from './expenseStore'
import { cloudPasswordSignIn, cloudSession, cloudSignOut, deleteCloudExpense, ensurePrivateTrip, loadCloudTrip, pullCloudExpenses, pushCloudExpense } from './cloudLedger'
import { supabase, supabaseConfigured } from './supabaseClient'

export default function ExpenseLedger(){
  const [members,setMembers]=useState<string[]>(loadMembers)
  const [expenses,setExpenses]=useState<Expense[]>(loadExpenses)
  const [title,setTitle]=useState('')
  const [amount,setAmount]=useState('')
  const [payer,setPayer]=useState(members[0]||'我')
  const [consumers,setConsumers]=useState<string[]>([...FIXED_MEMBERS])
  const [currency,setCurrency]=useState<ExpenseCurrency>('EUR')
  const [category,setCategory]=useState('餐饮')
  const [rates,setRates]=useState<ExchangeRates>(loadExchangeRates)
  const [rateDraft,setRateDraft]=useState({eurToCny:String(rates.eurToCny),usdToCny:String(Number(rates.usdToCny.toFixed(4)))})
  const [ratesSaved,setRatesSaved]=useState(false)
  const [receiptError,setReceiptError]=useState('')
  const [receiptBusy,setReceiptBusy]=useState<string|null>(null)
  const [cloudEmail,setCloudEmail]=useState('')
  const [cloudPassword,setCloudPassword]=useState('')
  const [cloudMessage,setCloudMessage]=useState('')
  const [cloudSessionEmail,setCloudSessionEmail]=useState<string|null>(null)
  const [cloudTripReady,setCloudTripReady]=useState(false)
  const expenseOwed=(expense:Expense,name:string)=>{const people=expenseConsumers(expense);if(!people.includes(name))return 0;return expense.payer===SPLIT_PAYER?expense.amount:expense.amount/people.length}

  useEffect(()=>localStorage.setItem(MEMBERS_KEY,JSON.stringify(members)),[members])
  useEffect(()=>{
    void hydrateExpenses()
    const sync=(event:Event)=>setExpenses((event as CustomEvent<Expense[]>).detail||loadExpenses())
    addEventListener(EXPENSES_CHANGED,sync)
    return()=>removeEventListener(EXPENSES_CHANGED,sync)
  },[])
  useEffect(()=>{
    if(!supabase)return
    const syncSession=(session:{user?:{email?:string}|null}|null)=>{setCloudSessionEmail(session?.user?.email||null);setCloudTripReady(false);if(session)void Promise.race([ensurePrivateTrip(),new Promise<never>((_,reject)=>window.setTimeout(()=>reject(new Error('私有账本初始化超时，请检查 Supabase SQL 与网络连接')),12000))]).then(()=>{setCloudTripReady(true);setCloudMessage('私有账本已就绪，云端同步已开启')}).catch(error=>setCloudMessage(describeCloudError(error,'私有账本初始化失败')))}
    void cloudSession().then(syncSession)
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>syncSession(session))
    return()=>data.subscription.unsubscribe()
  },[])
  useEffect(()=>{
    if(!cloudSessionEmail||!cloudTripReady||!loadCloudTrip().tripId)return
    const refresh=async()=>{try{const remote=await pullCloudExpenses();if(remote.length){setExpenses(remote);saveExpenses(remote)}}catch(error){setCloudMessage(describeCloudError(error,'云端同步暂时失败，仍可继续使用本地账目'))}}
    void refresh();const timer=window.setInterval(refresh,30000);return()=>window.clearInterval(timer)
  },[cloudSessionEmail,cloudTripReady])

  const cashTotal=useMemo(()=>expenses.reduce((sum,expense)=>sum+cashToEUR(expenseTotal(expense.amount,expense.payer,members.length,expenseConsumers(expense).length),expense.currency,rates),0),[expenses,rates,members.length])
  const totalValueCNY=useMemo(()=>expenses.reduce((sum,expense)=>sum+expenseValueToCNY(expenseTotal(expense.amount,expense.payer,members.length,expenseConsumers(expense).length),expense.currency,rates),0),[expenses,rates,members.length])
  const pointValueCNY=useMemo(()=>expenses.filter(expense=>isPointCurrency(expense.currency)).reduce((sum,expense)=>sum+expenseValueToCNY(expenseTotal(expense.amount,expense.payer,members.length,expenseConsumers(expense).length),expense.currency,rates),0),[expenses,rates,members.length])
  const cashValueCNY=totalValueCNY-pointValueCNY
  const pointSettlements=useMemo(()=>CURRENCY_OPTIONS.filter(option=>isPointCurrency(option.value)).map(option=>{
    const pointExpenses=expenses.filter(expense=>expense.currency===option.value)
    const total=pointExpenses.reduce((sum,expense)=>sum+expenseTotal(expense.amount,expense.payer,members.length,expenseConsumers(expense).length),0)
    return{
      ...option,
      total,
      balances:members.map(name=>{
        const paid=pointExpenses.reduce((sum,expense)=>{
          if(expense.payer===name)return sum+expense.amount
          if(expense.payer===SPLIT_PAYER)return sum+expense.amount
          return sum
        },0)
        const owed=pointExpenses.reduce((sum,expense)=>sum+expenseOwed(expense,name),0)
        return{name,paid,value:paid-owed}
      }),
    }
  }).filter(item=>item.total>0),[expenses,members])
  const balances=useMemo(()=>members.map(name=>{
    const paid=expenses.reduce((sum,expense)=>{
      const amountInEUR=cashToEUR(expense.amount,expense.currency,rates)
      if(expense.payer===name)return sum+amountInEUR
      if(expense.payer===SPLIT_PAYER)return sum+amountInEUR
      return sum
    },0)
    const owed=expenses.reduce((sum,expense)=>sum+cashToEUR(expenseOwed(expense,name),expense.currency,rates),0)
    return{name,paid,value:paid-owed}
  }),[members,expenses,cashTotal,rates])

  const applyRates=()=>{
    const eur=Number(rateDraft.eurToCny)
    const usd=Number(rateDraft.usdToCny)
    const next={eurToCny:eur>0?eur:DEFAULT_EXCHANGE_RATES.eurToCny,usdToCny:usd>0?usd:DEFAULT_EXCHANGE_RATES.usdToCny}
    setRates(next)
    setRateDraft({eurToCny:String(next.eurToCny),usdToCny:String(Number(next.usdToCny.toFixed(4)))})
    saveExchangeRates(next)
    setRatesSaved(true)
  }
  const resetRates=()=>{
    setRates(DEFAULT_EXCHANGE_RATES)
    setRateDraft({eurToCny:String(DEFAULT_EXCHANGE_RATES.eurToCny),usdToCny:String(Number(DEFAULT_EXCHANGE_RATES.usdToCny.toFixed(4)))})
    saveExchangeRates(DEFAULT_EXCHANGE_RATES)
    setRatesSaved(true)
  }

  const addExpense=()=>{
    const value=Number(amount)
    if(!title.trim()||!value)return
    if(!consumers.length)return
    const created=createExpense({title:title.trim(),amount:value,currency,payer,consumers,category})
    if(cloudSessionEmail&&cloudTripReady)void pushCloudExpense(created).catch(error=>setCloudMessage(describeCloudError(error,'已保存到本机，但云端同步失败')))
    setTitle('')
    setAmount('')
  }
  const removeExpense=(id:string)=>{
    const next=expenses.filter(item=>item.id!==id)
    setExpenses(next)
    saveExpenses(next)
    void removeReceipt(id)
    if(cloudSessionEmail&&cloudTripReady)void deleteCloudExpense(id).catch(error=>setCloudMessage(describeCloudError(error,'本机已删除，但云端删除失败')))
  }
  const attachReceipt=async(expense:Expense,file:File)=>{
    setReceiptError('')
    if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)){setReceiptError('仅支持 JPG、PNG、WebP 或 PDF 票据');return}
    if(file.size>8*1024*1024){setReceiptError('票据文件不能超过 8MB');return}
    setReceiptBusy(expense.id)
    try{
      await saveReceipt(expense.id,file)
      const next=expenses.map(item=>item.id===expense.id?{...item,receiptName:file.name,receiptType:file.type,receiptSize:file.size}:item)
      setExpenses(next);saveExpenses(next)
    }catch{setReceiptError('票据保存失败，请检查浏览器是否允许本地存储')}
    finally{setReceiptBusy(null)}
  }
  const openReceipt=async(expense:Expense)=>{
    try{
      const receipt=await loadReceipt(expense.id)
      if(!receipt){setReceiptError('找不到这张票据，可能已清理浏览器数据');return}
      const url=URL.createObjectURL(receipt.blob)
      const anchor=document.createElement('a');anchor.href=url;anchor.download=receipt.name;anchor.target='_blank';anchor.click()
      setTimeout(()=>URL.revokeObjectURL(url),1000)
    }catch{setReceiptError('票据读取失败')}
  }
  const detachReceipt=async(expense:Expense)=>{
    await removeReceipt(expense.id)
    const next=expenses.map(item=>item.id===expense.id?(({receiptName,receiptType,receiptSize,...rest})=>rest)(item):item)
    setExpenses(next);saveExpenses(next)
  }
  const openBooking=(bookingId:string)=>{
    sessionStorage.setItem('travel-open-booking',bookingId)
    location.hash='/bookings'
  }
  const exportData=()=>{
    const blob=new Blob([JSON.stringify({members:FIXED_MEMBERS,expenses},null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const anchor=document.createElement('a')
    anchor.href=url
    anchor.download='europe-trip-split.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  const describeCloudError=(error:unknown,fallback:string)=>{if(error instanceof Error&&error.message)return`${fallback}：${error.message}`;if(error&&typeof error==='object'){const value=error as {message?:unknown;code?:unknown;details?:unknown;hint?:unknown};const parts=[value.message,value.code&&`代码 ${value.code}`,value.details,value.hint].filter(item=>typeof item==='string'&&item);if(parts.length)return`${fallback}：${parts.join(' · ')}`}return fallback}
  const sendLogin=async()=>{try{await cloudPasswordSignIn(cloudEmail.trim(),cloudPassword);setCloudMessage('登录成功，正在同步私有账本')}catch(error){setCloudMessage(describeCloudError(error,'登录失败'))}}

  return <section className="split-bill">
    <div className="section-heading"><div><p className="eyebrow">LOCAL LEDGER</p><h2>两人分账</h2></div><button className="ghost" onClick={exportData}><Download size={16}/>导出备份</button></div>
    <section className="expense-overview" aria-label="总花销">
      <div className="expense-total"><small>当前总花销估值</small><strong>¥{Math.round(totalValueCNY).toLocaleString('zh-CN')}</strong><span>{expenses.length} 笔记录 · 含积分估值</span></div>
      <div className="expense-breakdown"><article><span>现金支出</span><b>¥{Math.round(cashValueCNY).toLocaleString('zh-CN')}</b><small>约 €{cashTotal.toFixed(2)}</small></article><article><span>积分估值</span><b>¥{Math.round(pointValueCNY).toLocaleString('zh-CN')}</b><small>按当前设定比例</small></article></div>
    </section>
    <details className="rate-settings">
      <summary><span><Settings2/><b>汇率设置</b></span><small>€1=¥{rates.eurToCny.toFixed(2)} · $1=¥{rates.usdToCny.toFixed(2)}</small></summary>
      <div><label><span>1 欧元兑人民币</span><input inputMode="decimal" value={rateDraft.eurToCny} onChange={event=>{setRateDraft(current=>({...current,eurToCny:event.target.value}));setRatesSaved(false)}} placeholder={String(DEFAULT_EXCHANGE_RATES.eurToCny)}/></label><label><span>1 美元兑人民币</span><input inputMode="decimal" value={rateDraft.usdToCny} onChange={event=>{setRateDraft(current=>({...current,usdToCny:event.target.value}));setRatesSaved(false)}} placeholder={DEFAULT_EXCHANGE_RATES.usdToCny.toFixed(4)}/></label><button className="rate-reset" onClick={resetRates}><RotateCcw/>恢复默认</button><button className="rate-save" onClick={applyRates}>{ratesSaved?'已应用':'应用汇率'}</button></div>
    </details>
    <section className="cloud-ledger"><header><b>共享账本</b><span>{supabaseConfigured?'Supabase 云同步':'尚未配置云同步'}</span></header>{!supabaseConfigured?<p>当前仍使用本机保存。</p>:!cloudSessionEmail?<div className="cloud-row"><input value={cloudEmail} onChange={event=>setCloudEmail(event.target.value)} placeholder="邮箱地址" type="email"/><input value={cloudPassword} onChange={event=>setCloudPassword(event.target.value)} placeholder="密码" type="password"/><button onClick={()=>void sendLogin()}>登录</button></div>:<><p>已登录：{cloudSessionEmail} · 私有账本</p><div className="cloud-row"><button className="cloud-secondary" onClick={()=>void cloudSignOut()}>退出登录</button></div></>}{cloudMessage&&<small>{cloudMessage}</small>}</section>
    <p className="privacy-note">未加入共享账本前，账目和票据只保存在当前浏览器；加入后账目同步到 Supabase，票据文件仍需后续绑定私有 Storage。建议定期导出账目备份。</p>
    <div className="member-strip"><Users size={18}/>{FIXED_MEMBERS.map(name=><span key={name}>{name}</span>)}</div>
    <div className="expense-form"><input value={title} onChange={event=>setTitle(event.target.value)} placeholder="消费项目"/><input inputMode="decimal" value={amount} onChange={event=>setAmount(event.target.value)} placeholder={payer===SPLIT_PAYER?'单人价格':isPointCurrency(currency)?'积分数量':'金额'}/><select value={currency} onChange={event=>setCurrency(event.target.value as ExpenseCurrency)}>{CURRENCY_OPTIONS.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select><div className="consumer-picker"><small>消费人</small>{FIXED_MEMBERS.map(name=><label key={name}><input type="checkbox" checked={consumers.includes(name)} onChange={()=>setConsumers(current=>current.includes(name)?current.filter(item=>item!==name):[...current,name])}/>{name}</label>)}</div><select value={payer} onChange={event=>setPayer(event.target.value)}><option value={SPLIT_PAYER}>各自支付（单人价格）</option>{members.map(name=><option key={name}>{name}</option>)}</select><select value={category} onChange={event=>setCategory(event.target.value)}>{['餐饮','交通','门票','住宿','购物','其他'].map(value=><option key={value}>{value}</option>)}</select><button className="primary compact" onClick={addExpense}>记一笔</button></div>
    <div className="balance-row">{balances.map(balance=><article key={balance.name}><span><b>{balance.name}</b><small>个人现金支出 €{balance.paid.toFixed(2)}</small></span><strong className={balance.value>=0?'positive':'negative'}>{balance.value>=0?'应收':'应付'} €{Math.abs(balance.value).toFixed(2)}</strong></article>)}</div>
    {pointSettlements.length>0&&<section className="points-settlement"><header><b>积分分账</b><small>不同酒店积分分别结算，不互相换算</small></header><div>{pointSettlements.map(item=><article key={item.value}><header><span>{item.label}</span><b>共 {Math.round(item.total).toLocaleString('zh-CN')}</b></header>{item.balances.map(balance=><p key={balance.name}><span><b>{balance.name}</b><small>已付 {Math.round(balance.paid).toLocaleString('zh-CN')}</small></span><strong className={balance.value>=0?'positive':'negative'}>{balance.value>=0?'应收':'应付'} {Math.round(Math.abs(balance.value)).toLocaleString('zh-CN')}</strong></p>)}</article>)}</div></section>}
    {receiptError&&<p className="receipt-error" role="alert">{receiptError}<button onClick={()=>setReceiptError('')} aria-label="关闭"><X size={14}/></button></p>}
    <div className="expense-list">{expenses.length===0?<div className="empty">旅途中记下第一笔共同消费，系统会自动均分。</div>:expenses.map(expense=><article className={`${expense.bookingId?'linked-expense ':''}${isPointCurrency(expense.currency)?'points-expense':''}`} key={expense.id}><time>{expense.date.slice(5)}</time><span className="category">{expense.category}</span><div><b>{expense.title}</b><small>{expense.payer===SPLIT_PAYER?`各自支付 · 每人 ${formatExpenseAmount(expense.amount,expense.currency)}`:`${expense.payer} 支付`}{expense.bookingId&&<button className="booking-link" onClick={()=>openBooking(expense.bookingId!)}><Link2/>关联预订</button>}</small><span className="receipt-actions">{expense.receiptName?<><button className="receipt-link" onClick={()=>void openReceipt(expense)}><FileImage size={13}/>查看票据</button><button className="receipt-remove" onClick={()=>void detachReceipt(expense)} aria-label="移除票据"><X size={13}/></button></>:<label className="receipt-link"><Upload size={13}/>{receiptBusy===expense.id?'保存中':'上传票据'}<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={event=>{const file=event.target.files?.[0];if(file)void attachReceipt(expense,file);event.currentTarget.value=''}} hidden/></label>}</span></div><strong>{formatExpenseAmount(expenseTotal(expense.amount,expense.payer,members.length),expense.currency)}</strong><button onClick={()=>removeExpense(expense.id)} aria-label="删除"><Trash2 size={15}/></button></article>)}</div>
  </section>
}
