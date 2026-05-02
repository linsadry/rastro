import{useState}from'react'
import{C,createTrip}from'../lib/utils'
import IMG from'../lib/images'
import Icon from'../components/Icon'
const CV=['cliffs','island','abstract','beach','fish','balloon','lighthouse','objects','map']
export default function NewTrip({onBack,onCreated}){
const[name,setName]=useState('')
const[location,setLocation]=useState('')
const[dates,setDates]=useState('')
const[dateStart,setDateStart]=useState('')
const[dateEnd,setDateEnd]=useState('')
const[cover,setCover]=useState('cliffs')
const[budget,setBudget]=useState('')
const[participants,setParticipants]=useState('Você')
const[loading,setLoading]=useState(false)
const go=async()=>{if(!name.trim())return;setLoading(true);try{await createTrip({name:name.trim(),location:location.trim(),dates:dates.trim(),dateStart,dateEnd,cover,budget:parseFloat(budget)||0,participants:participants.split(',').map(p=>p.trim()).filter(Boolean)});onCreated()}catch(e){console.error(e)}finally{setLoading(false)}}
const inp={width:'100%',padding:'12px 14px',borderRadius:12,border:`1.5px solid ${C.divider}`,fontSize:15,background:'#fff',color:C.textDark,outline:'none'}
const lbl={fontSize:12,fontWeight:700,color:C.textMid,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}
return(<div style={{minHeight:'100vh',background:C.paper}}>
<div style={{padding:'56px 20px 20px',background:C.olive,display:'flex',alignItems:'center',gap:12}}>
<button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer'}}><Icon name="arrow-left" size={22} color="#fff"/></button>
<div style={{fontFamily:'Playfair Display',fontSize:22,color:'#fff',fontWeight:700}}>Nova viagem</div></div>
<div style={{padding:'24px 20px 100px',display:'flex',flexDirection:'column',gap:16}}>
<div><div style={lbl}>Capa</div><div style={{display:'flex',gap:10,overflowX:'auto'}}>
{CV.map(c=><div key={c} onClick={()=>setCover(c)} style={{width:72,height:72,borderRadius:14,overflow:'hidden',flexShrink:0,cursor:'pointer',border:cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}><img src={IMG[c]} alt={c} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}
</div></div>
<div><div style={lbl}>Nome *</div><input style={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Portugal 2024"/></div>
<div><div style={lbl}>Destino</div><input style={inp} value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ex: Lisboa, Portugal"/></div>
<div><div style={lbl}>Período (texto livre)</div><input style={inp} value={dates} onChange={e=>setDates(e.target.value)} placeholder="Ex: Jul 2024 · 10 dias"/></div>
<div><div style={lbl}>Participantes</div><input style={inp} value={participants} onChange={e=>setParticipants(e.target.value)} placeholder="Separe por vírgula"/></div>
<div><div style={lbl}>Orçamento R$</div><input style={inp} type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="0,00"/></div>
<div style={{display:'flex',gap:12}}>
<div style={{flex:1}}><div style={lbl}>Data início</div><input style={inp} type="date" value={dateStart} onChange={e=>setDateStart(e.target.value)}/></div>
<div style={{flex:1}}><div style={lbl}>Data fim</div><input style={inp} type="date" value={dateEnd} onChange={e=>setDateEnd(e.target.value)}/></div>
</div>
<button onClick={go} disabled={loading||!name.trim()} style={{padding:'16px',borderRadius:16,background:name.trim()?C.terracotta:C.divider,color:name.trim()?'#fff':C.textLight,border:'none',fontSize:16,fontWeight:700,cursor:'pointer'}}>
{loading?'Criando...':'Criar viagem'}</button>
</div></div>)}
