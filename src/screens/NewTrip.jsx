import{useState}from'react'
import{C,createTrip,showToast}from'../lib/utils'
import IMG from'../lib/images'
import Icon from'../components/Icon'
const CV=['cliffs','island','abstract','beach','fish','balloon','lighthouse','objects','map']
export default function NewTrip({onBack,onCreated}){
const[f,setF]=useState({name:'',location:'',ds:'',de:'',cover:'cliffs',budget:'',parts:'Você'})
const[loading,setLoading]=useState(false)
const[err,setErr]=useState('')
const set=(k,v)=>setF(p=>({...p,[k]:v}))
const go=async()=>{
if(!f.name.trim()){setErr('Digite o nome');return}
setLoading(true);setErr('')
try{
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})
const dates=f.ds&&f.de?`${fmt(f.ds)} – ${fmt(f.de)}`:f.ds?fmt(f.ds):''
await createTrip({name:f.name.trim(),location:f.location.trim(),dates,dateStart:f.ds||null,dateEnd:f.de||null,cover:f.cover,budget:parseFloat(f.budget)||0,participants:f.parts.split(',').map(p=>p.trim()).filter(Boolean)})
showToast('Viagem criada!');onCreated()
}catch(e){setErr('Erro: '+e.message)}finally{setLoading(false)}}
const inp={width:'100%',padding:'12px 14px',borderRadius:12,border:`1.5px solid ${C.divider}`,fontSize:15,background:'#fff',color:C.textDark,outline:'none'}
const lbl={fontSize:12,fontWeight:700,color:C.textMid,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}
return(<div style={{minHeight:'100dvh',background:C.paper}}>
<div style={{padding:'56px 20px 20px',background:C.olive,display:'flex',alignItems:'center',gap:12}}>
<button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer'}}><Icon name="arrow-left" size={22} color="#fff"/></button>
<div style={{fontFamily:'Playfair Display',fontSize:22,color:'#fff',fontWeight:700}}>Nova viagem</div></div>
<div style={{padding:'24px 20px 100px',display:'flex',flexDirection:'column',gap:16}}>
<div><div style={lbl}>Capa</div><div style={{display:'flex',gap:10,overflowX:'auto'}}>
{CV.map(c=><div key={c} onClick={()=>set('cover',c)} style={{width:72,height:72,borderRadius:14,overflow:'hidden',flexShrink:0,cursor:'pointer',border:f.cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}><img src={IMG[c]} alt={c} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}</div></div>
<div><div style={lbl}>Nome *</div><input style={inp} value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: Portugal 2025"/></div>
<div><div style={lbl}>Destino</div><input style={inp} value={f.location} onChange={e=>set('location',e.target.value)} placeholder="Ex: Lisboa, Portugal"/></div>
<div style={{display:'flex',gap:12}}>
<div style={{flex:1}}><div style={lbl}>Início</div><input style={inp} type="date" value={f.ds} onChange={e=>set('ds',e.target.value)}/></div>
<div style={{flex:1}}><div style={lbl}>Fim</div><input style={inp} type="date" value={f.de} onChange={e=>set('de',e.target.value)}/></div></div>
<div><div style={lbl}>Participantes</div><input style={inp} value={f.parts} onChange={e=>set('parts',e.target.value)} placeholder="Vírgula"/></div>
<div><div style={lbl}>Orçamento R$</div><input style={inp} type="number" value={f.budget} onChange={e=>set('budget',e.target.value)} placeholder="0,00"/></div>
{err&&<div style={{color:C.terracotta,fontSize:13,fontWeight:600}}>{err}</div>}
<button onClick={go} disabled={loading} style={{padding:'16px',borderRadius:16,background:C.terracotta,color:'#fff',border:'none',fontSize:16,fontWeight:700,cursor:'pointer'}}>{loading?'Criando...':'Criar viagem'}</button>
</div></div>)}
