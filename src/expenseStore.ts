export type ExpenseCurrency='EUR'|'CNY'|'USD'|'IHG'|'MARRIOTT'|'HILTON'
export type ExchangeRates={eurToCny:number;usdToCny:number}

export type Expense={
  id:string
  date:string
  title:string
  amount:number
  currency:ExpenseCurrency
  payer:string
  category:string
  bookingId?:string
  receiptName?:string
  receiptType?:string
  receiptSize?:number
}

export const CURRENCY_OPTIONS:{value:ExpenseCurrency;label:string}[]=[
  {value:'EUR',label:'欧元 EUR'},
  {value:'CNY',label:'人民币 CNY'},
  {value:'USD',label:'美元 USD'},
  {value:'IHG',label:'IHG积分'},
  {value:'MARRIOTT',label:'万豪积分'},
  {value:'HILTON',label:'希尔顿积分'},
]
export const POINT_CURRENCIES:ExpenseCurrency[]=['IHG','MARRIOTT','HILTON']
export const SPLIT_PAYER='各自支付（总额均分）'
/** 各自支付时，记录的 amount 是单人金额；其它付款人记录的是整笔金额。 */
export const expenseTotal=(amount:number,payer:string,memberCount:number)=>payer===SPLIT_PAYER?amount*Math.max(memberCount,1):amount
export const EXCHANGE_RATES_KEY='travel-exchange-rates'
export const EXCHANGE_RATES_CHANGED='travel-exchange-rates-changed'
export const DEFAULT_EXCHANGE_RATES:ExchangeRates={eurToCny:7.8,usdToCny:7.8/1.16}
export const loadExchangeRates=():ExchangeRates=>{
  try{
    const stored=JSON.parse(localStorage.getItem(EXCHANGE_RATES_KEY)||'{}') as Partial<ExchangeRates>
    return{
      eurToCny:Number(stored.eurToCny)>0?Number(stored.eurToCny):DEFAULT_EXCHANGE_RATES.eurToCny,
      usdToCny:Number(stored.usdToCny)>0?Number(stored.usdToCny):DEFAULT_EXCHANGE_RATES.usdToCny,
    }
  }catch{return DEFAULT_EXCHANGE_RATES}
}
export const saveExchangeRates=(rates:ExchangeRates)=>{
  localStorage.setItem(EXCHANGE_RATES_KEY,JSON.stringify(rates))
  window.dispatchEvent(new CustomEvent(EXCHANGE_RATES_CHANGED,{detail:rates}))
}
export const isPointCurrency=(currency:ExpenseCurrency)=>POINT_CURRENCIES.includes(currency)
export const cashToEUR=(amount:number,currency:ExpenseCurrency,rates=loadExchangeRates())=>{
  if(currency==='EUR')return amount
  if(currency==='CNY')return amount/rates.eurToCny
  if(currency==='USD')return amount*rates.usdToCny/rates.eurToCny
  return 0
}
const POINT_USD_VALUE:Partial<Record<ExpenseCurrency,number>>={
  IHG:0.005,
  MARRIOTT:0.009,
  HILTON:0.005,
}
export const expenseValueToCNY=(amount:number,currency:ExpenseCurrency,rates=loadExchangeRates())=>{
  if(currency==='CNY')return amount
  if(currency==='EUR')return amount*rates.eurToCny
  if(currency==='USD')return amount*rates.usdToCny
  return amount*(POINT_USD_VALUE[currency]||0)*rates.usdToCny
}
export const formatExpenseAmount=(amount:number,currency:ExpenseCurrency)=>{
  if(isPointCurrency(currency))return`${Math.round(amount).toLocaleString('zh-CN')} 积分`
  const symbol=currency==='EUR'?'€':currency==='USD'?'$':'¥'
  return`${symbol}${amount.toFixed(2)}`
}

export const EXPENSES_KEY='travel-split-expenses'
export const MEMBERS_KEY='travel-split-members'
export const EXPENSES_CHANGED='travel-split-expenses-changed'

export const loadStored=<T,>(key:string,fallback:T):T=>{
  try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}
}

export const loadExpenses=()=>loadStored<Expense[]>(EXPENSES_KEY,[])
export const loadMembers=()=>loadStored<string[]>(MEMBERS_KEY,['我','同伴'])

export const saveExpenses=(expenses:Expense[])=>{
  localStorage.setItem(EXPENSES_KEY,JSON.stringify(expenses))
  void persistExpenses(expenses)
  window.dispatchEvent(new CustomEvent(EXPENSES_CHANGED,{detail:expenses}))
}

const DB_NAME='travel-journal-local'
const DB_VERSION=1
const EXPENSE_STORE='expenses'
const RECEIPT_STORE='receipts'
type ReceiptRecord={id:string;blob:Blob;name:string;type:string;size:number}

const openJournalDB=()=>new Promise<IDBDatabase>((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}
  const request=indexedDB.open(DB_NAME,DB_VERSION)
  request.onupgradeneeded=()=>{
    const db=request.result
    if(!db.objectStoreNames.contains(EXPENSE_STORE))db.createObjectStore(EXPENSE_STORE,{keyPath:'id'})
    if(!db.objectStoreNames.contains(RECEIPT_STORE))db.createObjectStore(RECEIPT_STORE,{keyPath:'id'})
  }
  request.onsuccess=()=>resolve(request.result)
  request.onerror=()=>reject(request.error||new Error('IndexedDB open failed'))
})

export const persistExpenses=async(expenses:Expense[])=>{
  try{
    const db=await openJournalDB()
    await new Promise<void>((resolve,reject)=>{
      const transaction=db.transaction(EXPENSE_STORE,'readwrite')
      const store=transaction.objectStore(EXPENSE_STORE)
      expenses.forEach(expense=>store.put(expense))
      transaction.oncomplete=()=>resolve()
      transaction.onerror=()=>reject(transaction.error)
    })
    db.close()
  }catch{/* localStorage remains the compatibility fallback */}
}

export const hydrateExpenses=async()=>{
  try{
    const db=await openJournalDB()
    const items=await new Promise<Expense[]>((resolve,reject)=>{
      const request=db.transaction(EXPENSE_STORE,'readonly').objectStore(EXPENSE_STORE).getAll()
      request.onsuccess=()=>resolve((request.result as Expense[]).sort((a,b)=>b.date.localeCompare(a.date)))
      request.onerror=()=>reject(request.error)
    })
    db.close()
    if(items.length){localStorage.setItem(EXPENSES_KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent(EXPENSES_CHANGED,{detail:items}))}
    return items
  }catch{return loadExpenses()}
}

export const saveReceipt=async(id:string,file:File)=>{
  const db=await openJournalDB()
  await new Promise<void>((resolve,reject)=>{
    const transaction=db.transaction(RECEIPT_STORE,'readwrite')
    transaction.objectStore(RECEIPT_STORE).put({id,blob:file,name:file.name,type:file.type,size:file.size} satisfies ReceiptRecord)
    transaction.oncomplete=()=>resolve()
    transaction.onerror=()=>reject(transaction.error)
  })
  db.close()
}

export const loadReceipt=async(id:string)=>{
  const db=await openJournalDB()
  const receipt=await new Promise<ReceiptRecord|undefined>((resolve,reject)=>{
    const request=db.transaction(RECEIPT_STORE,'readonly').objectStore(RECEIPT_STORE).get(id)
    request.onsuccess=()=>resolve(request.result as ReceiptRecord|undefined)
    request.onerror=()=>reject(request.error)
  })
  db.close()
  return receipt
}

export const removeReceipt=async(id:string)=>{
  try{
    const db=await openJournalDB()
    await new Promise<void>((resolve,reject)=>{
      const transaction=db.transaction(RECEIPT_STORE,'readwrite')
      transaction.objectStore(RECEIPT_STORE).delete(id)
      transaction.oncomplete=()=>resolve()
      transaction.onerror=()=>reject(transaction.error)
    })
    db.close()
  }catch{/* best effort cleanup */}
}

export const createExpense=(expense:Omit<Expense,'id'|'date'>)=>{
  const next=[{
    ...expense,
    id:crypto.randomUUID(),
    date:new Date().toISOString().slice(0,10),
  },...loadExpenses()]
  saveExpenses(next)
  return next[0]
}
