export type Expense={
  id:string
  date:string
  title:string
  amount:number
  currency:'EUR'|'CNY'
  payer:string
  category:string
  bookingId?:string
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
