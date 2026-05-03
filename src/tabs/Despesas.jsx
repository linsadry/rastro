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
const expenses=[...(trip.expenses||[])].sort((a,b)=>!a.date&&!b.date?0:!a.date?1:!b.date?-1:new Date(a.date)-new Date(b.date))
const total=expenses.reduce((s,e)=>s+e.amount,0)
const inp={width:'100%',padding:'10px 12px',borderRadius:10,border:`1.5px solid ${C.divider}`,fontSize:14,background:'#fff',color:C.textDark,outline:'none'}
const toggleSplit=(p)=>setSplitWith(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p])
const openEdit=(e)=>{setEditId(e.id);setDesc(e.description);setAmount(e.amount);setCat(e.category);setPay(e.payment);setPaidBy(e.paidBy);setSplitWith(e.withWhom||parts);setDate(e.date||'');setNote(e.note||'');setShowing(true)}
const resetForm=()=>{setEditId(null);setDesc('');setAmount('');setCat('Outros');setPay('Débito');setPaidBy(parts[0]||'Você');setSplitWith(parts);setDate('');setNote('');setShowing(false)}
const handleSave=async()=>{
if(!desc.trim()||!amount)return
setLoading(true)
try{
if(editId){await sb.from('expenses').update({description:desc.trim(),amount:parseFloat(amount),category:cat,payment:pay,paid_by:paidBy,with_whom:splitWith,date:date||null,note:note||null}).eq('id',editId)}
else{await addExpense(trip.id,{description:desc.trim(),amount:parseFloat(amount),category:cat,payment:pay,paidBy,withWhom:splitWith,date:date||null,note:note||null})}
resetForm();await onRefresh()
}catch(e){console.error(e)}finally{setLoading(false)}}
