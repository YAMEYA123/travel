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
