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
{CV.map(c=><div key={c} onClick={()=>setCover(c)} style={{width:72,height:72,borderRadius:14,overflow:'hidden',flexShrink:0,cursor:'pointer',border:cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}><img src={IMG[c]} alt={c} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}</div></div>
{[{l:'Nome *',v:name,s:setName,p:'Ex: Portugal 2024'},{l:'Destino',v:location,s:setLocation,p:'Ex: Lisboa'},{l:'Período',v:dates,s:setDates,p:'Ex: Jul 2024'},{l:'Participantes',v:participants,s:setParticipants,p:'Vírgula'},{l:'Orçamento R$',v:budget,s:setBudget,p:'0,00',t:'number'}].map(f=><div key={f.l}><div style={lbl}>{f.l}</div><input style={inp} value={f.v} onChange={e=>f.s(e.target.value)}
