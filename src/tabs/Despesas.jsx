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
<Icon name={showing?'x':'plus'} size={18} color="#fff"/></button></div>
{showing&&<div style={{background:'#fff',borderRadius:16,padding:16,marginBottom:16,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',display:'flex',flexDirection:'column',gap:10}}>
<div style={{fontSize:13,fontWeight:700,color:C.textMid}}>{editId?'Editar despesa':'Nova despesa'}</div>
<input style={inp} placeholder="Descricao *" value={desc} onChange={e=>setDesc(e.target.value)}/>
<input style={inp} placeholder="Valor R$ *" type="number" value={amount} onChange={e=>setAmount(e.target.value)}/>
<input style={inp} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
<select style={inp} value={cat} onChange={e=>setCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
<select style={inp} value={pay} onChange={e=>setPay(e.target.value)}>{PAYS.map(p=><option key={p}>{p}</option>)}</select>
<input style={inp} placeholder="Observacao (opcional)" value={note} onChange={e=>setNote(e.target.value)}/>
{parts.length>1&&<>
<div style={{fontSize:12,fontWeight:700,color:C.textMid}}>PAGO POR</div>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
{parts.map(p=><button key={p} onClick={()=>setPaidBy(p)} style={{padding:'6px 14px',borderRadius:20,border:'none',background:paidBy===p?C.terracotta:C.divider,color:paidBy===p?'#fff':C.textDark,fontSize:13,cursor:'pointer'}}>{p}</button>)}</div>
<div style={{fontSize:12,fontWeight:700,color:C.textMid}}>DIVIDIR COM</div>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
{parts.map(p=><button key={p} onClick={()=>toggleSplit(p)} style={{padding:'6px 14px',borderRadius:20,border:'none',background:splitWith.includes(p)?C.ocean:C.divider,color:splitWith.includes(p)?'#fff':C.textDark,fontSize:13,cursor:'pointer'}}>{p}</button>)}</div>
{amount&&splitWith.length>0&&<div style={{fontSize:12,color:C.textMid,background:C.sandPale,padding:'8px 12px',borderRadius:8}}>Cada um paga: {formatCurrency(parseFloat(amount)/splitWith.length)}</div>}
</>}
<div style={{display:'flex',gap:8}}>
<button onClick={resetForm} style={{flex:1,padding:'12px',borderRadius:12,background:C.divider,color:C.textMid,border:'none',fontWeight:700,cursor:'pointer'}}>Cancelar</button>
<button onClick={handleSave} disabled={loading||!desc.trim()||!amount} style={{flex:2,padding:'12px',borderRadius:12,background:desc.trim()&&amount?C.terracotta:C.divider,color:desc.trim()&&amount?'#fff':C.textLight,border:'none',fontWeight:700,cursor:'pointer'}}>
{loading?'Salvando...':editId?'Salvar edicao':'Adicionar'}</button></div></div>}
{parts.length>1&&acerto.length>0&&<div style={{marginBottom:16}}>
<button onClick={()=>setShowAcerto(!showAcerto)} style={{width:'100%',padding:'12px',borderRadius:12,background:C.olive,color:'#fff',border:'none',fontWeight:700,cursor:'pointer',fontSize:14}}>
{showAcerto?'Fechar acerto':'Calcular acerto'}</button>
{showAcerto&&<div style={{background:'#fff',borderRadius:12,padding:16,marginTop:8,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
{acerto.map((t,i)=><div key={i} style={{padding:'8px 0',borderBottom:i<acerto.length-1?`1px solid ${C.divider}`:'none',fontSize:14}}>
<span style={{fontWeight:700,color:C.terracotta}}>{t.from}</span> deve pagar <span style={{fontWeight:700,color:C.olive}}>{formatCurrency(t.amount)}</span> para <span style={{fontWeight:700,color:C.ocean}}>{t.to}</span>
</div>)}</div>}</div>}
{expenses.length===0?(<div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
<img src={IMG.balloon} alt="" style={{width:'60%',margin:'0 auto 16px',display:'block',opacity:0.5}}/>
<div style={{fontSize:14}}>Nenhuma despesa ainda</div></div>):(
<div style={{display:'flex',flexDirection:'column',gap:10}}>
{expenses.map(e=>(
<div key={e.id} style={{background:'#fff',borderRadius:14,padding:'12px 14px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{display:'flex',alignItems:'center',gap:12}}>
<div style={{fontSize:24}}>{categoryIcon(e.category)}</div>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:600,color:C.textDark}}>{e.description}</div>
<div style={{fontSize:11,color:C.textLight,marginTop:2}}>{e.category} · {e.payment} · {e.paidBy}{e.date?` · ${new Date(e.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}`:''}</div>
{parts.length>1&&e.withWhom?.length>0&&<div style={{fontSize:11,color:C.ocean,marginTop:2}}>div {e.withWhom.join(', ')} · {formatCurrency(e.amount/e.withWhom.length)} cada</div>}
{e.note&&<div style={{fontSize:12,color:C.textMid,marginTop:4,fontStyle:'italic'}}>obs: {e.note}</div>}
</div>
<div style={{textAlign:'right',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
<div style={{fontSize:15,fontWeight:700,color:C.terracotta}}>{formatCurrency(e.amount)}</div>
<div style={{display:'flex',gap:6}}>
<button onClick={()=>openEdit(e)} style={{background:'none',border:'none',cursor:'pointer',padding:2}}><Icon name="edit" size={14} color={C.ocean}/></button>
<button onClick={()=>deleteExpense(e.id).then(onRefresh)} style={{background:'none',border:'none',cursor:'pointer',padding:2}}><Icon name="trash" size={14} color={C.textLight}/></button>
</div></div></div></div>))}
</div>)}
</div>)}
