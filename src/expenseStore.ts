export type ExpenseCurrency='EUR'|'CNY'|'USD'|'IHG'|'MARRIOTT'|'HILTON'

export type Expense={
  id:string
  date:string
  title:string
  amount:number
  currency:ExpenseCurrency
  payer:string
  category:string
  bookingId?:string
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
export const isPointCurrency=(currency:ExpenseCurrency)=>POINT_CURRENCIES.includes(currency)
export const cashToEUR=(amount:number,currency:ExpenseCurrency)=>{
  if(currency==='EUR')return amount
  if(currency==='CNY')return amount/7.8
  if(currency==='USD')return amount/1.16
  return 0
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
  window.dispatchEvent(new CustomEvent(EXPENSES_CHANGED,{detail:expenses}))
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
