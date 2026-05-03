import{useState}from'react'
import{C,formatCurrency,categoryIcon,addExpense,deleteExpense}from'../lib/utils'
import{sb}from'../lib/supabase'
import IMG from'../lib/images'
import Icon from'../components/Icon'
const CATS=['Hospedagem','Transporte','Alimentação','Passeio','Compras','Saúde','Outros']
const PAYS=['Débito','Crédito','Dinheiro','Pix']
export default function Despesas({trip,onRefresh}){
const[showing,setShowing]=useState(false)
const[editId,setEditId]=useState(null)
const[desc,setDesc]=useState('')
const[amount,setAmount]=useState('')
const[cat,setCat]=useState('Outros')
const[pay,setPay]=useState('Débito')
const[paidBy,setPaidBy]=useState(trip.participants?.[0]||'Você')
const[splitWith,setSplitWith]=useState(trip.participants||['Você'])
const[date,setDate]=useState('')
const[note,setNote]=useState('')
const[loading,setLoading]=useState(false)
const[showAcerto,setShowAcerto]=useState(false)
const parts=trip.participants||['Você']
const expenses=[...(trip.expenses||[])].sort((a,b)=>{
if(!a.date&&!b.date)return 0
if(!a.date)return 1
if(!b.date)return -1
return new Date(a.date)-new Date(b.date)})
const total=expenses.reduce((s,e)=>s+e.amount,0)
const inp={width:'100%',padding:'10px 12px',borderRadius:10,border:`1.5px solid ${C.divider}`,fontSize:14,background:'#fff',color:C.textDark,outline:'none'}
const toggleSplit=(p)=>setSplitWith(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p])
const openEdit=(e)=>{
setEditId(e.id);setDesc(e.description);setAmount(e.amount)
setCat(e.category);setPay(e.payment);setPaidBy(e.paidBy)
setSplitWith(e.withWhom||parts);setDate(e.date||'');setNote(e.note||'')
setShowing(true)}
const resetForm=()=>{
setEditId(null);setDesc('');setAmount('');setCat('Outros')
setPay('Débito');setPaidBy(parts[0]||'Você');setSplitWith(parts)
setDate('');setNote('');setShowing(false)}
const handleSave=async()=>{
if(!desc.trim()||!amount)return
setLoading(true)
try{
if(editId){
await sb.from('expenses').update({description:desc.trim(),amount:parseFloat(amount),category:cat,payment:pay,paid_by:paidBy,with_whom:splitWith,date:date||null,note:note||null}).eq('id',editId)
}else{
await addExpense(trip.id,{description:desc.trim(),amount:parseFloat(amount),category:cat,payment:pay,paidBy,withWhom:splitWith,date:date||null,note:note||null})
}
resetForm();await onRefresh()
}catch(e){console.error(e)}finally{setLoading(false)}}
const calcAcerto=()=>{
const bal={}
parts.forEach(p=>bal[p]=0)
expenses.forEach(e=>{
const sw=e.withWhom?.length?e.withWhom:parts
const share=e.amount/sw.length
sw.forEach(p=>{if(bal[p]!==undefined)bal[p]-=share})
if(bal[e.paidBy]!==undefined)bal[e.paidBy]+=e.amount})
const pos=parts.filter(p=>bal[p]>0.01).sort((a,b)=>bal[b]-bal[a])
const neg=parts.filter(p=>bal[p]<-0.01).sort((a,b)=>bal[a]-bal[b])
const trans=[];const bp={...bal}
pos.forEach(p=>{neg.forEach(n=>{if(bp[p]>0.01&&bp[n]<-0.01){const amt=Math.min(bp[p],-bp[n]);trans.push({from:n,to:p,amount:amt});bp[p]-=amt;bp[n]+=amt}})})
return trans}
const acerto=calcAcerto()
return(<div style={{padding:'20px 20px 40px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
<div><div style={{fontFamily:'Playfair Display',fontSize:20,color:C.textDark}}>Despesas</div>
<div style={{fontSize:13,color:C.terracotta,fontWeight:700}}>{formatCurrency(total)}</div></div>
<button onClick={()=>{resetForm();setShowing(!showing)}} style={{background:C.terracotta,border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
<Icon name={showing?'x':'plus'} size={18} color="#fff"/></button>
</div>
{showing&&<div style={{background:'#fff',borderRadius:16,padding:16,marginBottom:16,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',display:'flex',flexDirection:'column',gap:10}}>
<div style={{fontSize:13,fontWeight:700,color:C.textMid}}>{editId?'Editar despesa':'Nova​​​​​​​​​​​​​​​​
