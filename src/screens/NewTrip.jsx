import{useState}from'react'
import{C,createTrip,showToast}from'../lib/utils'
import IMG from'../lib/images'
import Icon from'../components/Icon'
const CV=['cliffs','island','abstract','beach','fish','balloon','lighthouse','objects','map']
export default function NewTrip({onBack,onCreated}){
const[f,setF]=useState({name:'',location:'',ds:'',de:'',cover:'cliffs',budget:'',parts:'Você'})
const[dests,setDests]=useState([])
const[destInput,setDestInput]=useState('')
const[loading,setLoading]=useState(false)
const[err,setErr]=useState('')
const set=(k,v)=>setF(p=>({...p,[k]:v}))
const addDest=()=>{if(!destInput.trim())return;setDests(p=>[...p,destInput.trim()]);setDestInput('')}
const remDest=(i)=>setDests(p=>p.filter((_,x)=>x!==i))
const go=async()=>{
if(!f.name.trim()){setErr('Digite o nome');return}
setLoading(true);setErr('')
try{
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})
const dates=f.ds&&f.de?`${fmt(f.ds)} - ${fmt(f.de)}`:f.ds?fmt(f.ds):''
await createTrip({name:f.name.trim(),location:f.location.trim(),dates,dateStart:f.ds||null,dateEnd:f.de||null,cover:f.cover,budget:parseFloat(f.budget)||0,participants:f.parts.split(',').map(p=>p.trim()).filter(Boolean),destinations:dests})
showToast('Viagem criada!');onCreated()
}catch(e){setErr('Erro: '+e.message)}finally{setLoading(false)}}
const inp={width:'100%',padding:'12px 14px',borderRadius:12,border:`1.5px solid ${C.divider}`,fontSize:15,background:'#fff',color:C.textDark,outline:'none'}
const lbl={fontSize:12,fontWeight:700,color:C.textMid,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}
return(<div style={{height:'100dvh',background:C.paper,display:'flex',flexDirection:'column'}}>
<div style={{padding:'56px 20px 20px',background:C.olive,display:'flex',alignItems:'center',gap:12}}>
<button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer'}}><Icon name="arrow-left" size={22} color="#fff"/></button>
<div style={{fontFamily:'Playfair Display',fontSize:22,color:'#fff',fontWeight:700}}>Nova viagem</div></div>
<div style={{padding:'24px 20px 220px',display:'flex',flexDirection:'column',gap:16}}>
  <div><div style={lbl}>Capa</div><div style={{display:'flex',gap:10,overflowX:'auto'}}>
{CV.map(c=><div key={c} onClick={()=>set('cover',c)} style={{width:72,height:72,borderRadius:14,overflow:'hidden',flexShrink:0,cursor:'pointer',border:f.cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}><img src={IMG[c]} alt={c} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}</div></div>
<div><div style={lbl}>Nome *</div><input style={inp} value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: Eurotrip 2025"/></div>
<div><div style={lbl}>Destino principal</div><input style={inp} value={f.location} onChange={e=>set('location',e.target.value)} placeholder="Ex: Lisboa, Portugal"/></div>
<div><div style={lbl}>Cidades e paradas (opcional)</div>
<div style={{display:'flex',gap:8,marginBottom:8}}>
<input style={{...inp,flex:1}} value={destInput} onChange={e=>setDestInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addDest()} placeholder="Ex: Porto"/>
<button onClick={addDest} style={{background:C.terracotta,border:'none',borderRadius:12,width:44,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="plus" size={18} color="#fff"/></button>
</div>
{dests.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:8}}>
{dests.map((d,i)=><div key={i} style={{background:C.sandPale,borderRadius:20,padding:'6px 12px',fontSize:13,color:C.olive,display:'flex',alignItems:'center',gap:6}}>
{d}<button onClick={()=>remDest(i)} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex'}}><Icon name="x" size={12} color={C.textLight}/></button>
</div>)}</div>}
</div>
<div style={{display:'flex',gap:12}}>
<div style={{flex:1}}><div style={lbl}>Inicio</div><input style={inp} type="date" value={f.ds} onChange={e=>set('ds',e.target.value)}/></div>
<div style={{flex:1}}><div style={lbl}>Fim</div><input style={inp} type="date" value={f.de} onChange={e=>set('de',e.target.value)}/></div>
</div>
<div><div style={lbl}>Participantes</div><input style={inp} value={f.parts} onChange={e=>set('parts',e.target.value)} placeholder="Virgula"/></div>
<div><div style={lbl}>Orcamento R$</div><input style={inp} type="number" value={f.budget} onChange={e=>set('budget',e.target.value)} placeholder="0,00"/></div>
{err&&<div style={{color:C.terracotta,fontSize:13,fontWeight:600}}>{err}</div>}
<button onClick={go} disabled={loading} style={{width:'100%',padding:'16px',borderRadius:16,background:C.terracotta,color:'#fff',border:'none',fontSize:16,fontWeight:700,cursor:'pointer'}}>{loading?'Criando...':'Criar viagem'}</button>
</div></div>)}

