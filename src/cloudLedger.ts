import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import type { Expense } from './expenseStore'

export type CloudState={session:Session|null;tripId:string|null;inviteCode:string|null;error:string}
const TRIP_ID_KEY='travel-cloud-trip-id'
const INVITE_CODE_KEY='travel-cloud-invite-code'

export const loadCloudTrip=()=>({tripId:localStorage.getItem(TRIP_ID_KEY),inviteCode:localStorage.getItem(INVITE_CODE_KEY)})
const saveCloudTrip=(tripId:string,inviteCode:string)=>{localStorage.setItem(TRIP_ID_KEY,tripId);localStorage.setItem(INVITE_CODE_KEY,inviteCode)}

export const cloudSignIn=async(email:string)=>{
  if(!supabase)throw new Error('未配置 Supabase')
  const redirect=import.meta.env.VITE_SUPABASE_REDIRECT_URL||new URL('/travel/',location.origin).toString()
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:redirect}})
  if(error)throw error
}
export const cloudSignOut=async()=>{if(supabase)await supabase.auth.signOut()}
export const cloudSession=async()=>supabase?(await supabase.auth.getSession()).data.session:null
export const createCloudTrip=async(name='欧洲旅行 2026')=>{
  if(!supabase)throw new Error('未配置 Supabase')
  const session=await cloudSession();if(!session)throw new Error('请先登录')
  const {data,error}=await supabase.rpc('create_trip',{trip_name:name,display_name:session.user.email?.split('@')[0]||'我'}).single() as {data:{id:string;invite_code:string}|null;error:{message:string}|null}
  if(error)throw error
  if(!data)throw new Error('创建账本没有返回数据，请确认补充 SQL 已执行')
  saveCloudTrip(data.id,data.invite_code);return data
}
export const joinCloudTrip=async(code:string,name='旅伴')=>{
  if(!supabase)throw new Error('未配置 Supabase')
  const {data,error}=await supabase.rpc('join_trip',{requested_code:code.trim().toUpperCase(),display_name:name})
  if(error)throw error
  saveCloudTrip(data.id,data.invite_code);return data
}
const toRow=(expense:Expense,tripId:string,userId:string)=>({id:expense.id,trip_id:tripId,created_by:userId,expense_date:expense.date,title:expense.title,amount:expense.amount,currency:expense.currency,payer:expense.payer,category:expense.category,booking_id:expense.bookingId||null,receipt_name:expense.receiptName||null})
const fromRow=(row:Record<string,unknown>):Expense=>({id:String(row.id),date:String(row.expense_date),title:String(row.title),amount:Number(row.amount),currency:row.currency as Expense['currency'],payer:String(row.payer),category:String(row.category),bookingId:row.booking_id?String(row.booking_id):undefined,receiptName:row.receipt_name?String(row.receipt_name):undefined})
export const pullCloudExpenses=async()=>{
  if(!supabase)throw new Error('未配置 Supabase')
  const {tripId}=loadCloudTrip();if(!tripId)return []
  const {data,error}=await supabase.from('shared_expenses').select('*').eq('trip_id',tripId).order('expense_date',{ascending:false})
  if(error)throw error
  return (data||[]).map(row=>fromRow(row as Record<string,unknown>))
}
export const pushCloudExpense=async(expense:Expense)=>{
  if(!supabase)throw new Error('未配置 Supabase')
  const session=await cloudSession();const {tripId}=loadCloudTrip();if(!session||!tripId)throw new Error('请先加入旅行账本')
  const {error}=await supabase.from('shared_expenses').upsert(toRow(expense,tripId,session.user.id))
  if(error)throw error
}
export const deleteCloudExpense=async(id:string)=>{
  if(!supabase)return
  const {error}=await supabase.from('shared_expenses').delete().eq('id',id)
  if(error)throw error
}
