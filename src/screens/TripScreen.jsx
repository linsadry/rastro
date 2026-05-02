import{useState}from'react'
import{C,deleteTrip,updateTrip,showToast}from'../lib/utils'
import{sb}from'../lib/supabase'
import IMG from'../lib/images'
import Icon from'../components/Icon'
import Resumo from'../tabs/Resumo'
import Despesas from'../tabs/Despesas'
import Memorias from'../tabs/Memorias'
import Mapa from'../tabs/Mapa'
const TABS=[{id:'resumo',label:'Resumo'},{id:'despesas',label:'Despesas'},{id:'memorias',label:'Memórias'},{id:'mapa',label:'Mapa'}]
const CV=['cliffs','island','abstract','beach','fish','balloon','lighthouse','objects','map']
export default function TripScreen({trip,onBack,onRefresh,onDeleted}){
const[tab,setTab]=useState('resumo')
const[editing,setEditing]=useState(false)
const[name,setName]=useState(trip.name)
const[location,setLocation]=useState(trip.location)
const[dates,setDates]=useState(trip.dates)
const[cover,setCover]=useState(trip.cover)
const[budget,setBudget]=useState(trip.budget||'')
const[participants,setParticipants]=useState((trip.participants||['Você']).join(', '))
const[saving,setSaving]=useState(false)
const[uploadingCover,setUploadingCover]=useState(false)
const coverImg=trip.coverCustom||IMG[trip.cover]||IMG.cliffs
const handleDelete=async()=>{
if(!window.confirm(`Excluir "${trip.name}"?`))return
try{await deleteTrip(trip.id);showToast('Viagem excluída');onDeleted()}
catch(e){showToast('Erro ao excluir')}}
const handleSave=async()=>{
setSaving(true)
try{
await updateTrip(trip.id,{name,location,dates,cover,coverCustom:trip.coverCustom||null,budget:parseFloat(budget)||0,participants:participants.split(',').map(p=>p.trim()).filter(Boolean),mapImg:trip.mapImg||null})
await onRefresh();setEditing(false);showToast('Viagem salva!')
}catch(e){showToast('Erro: '+e.message)}finally{setSaving(false)}}
const uploadCover=async(e)=>{
const file=e.target.files[0];if(!file)return
setUploadingCover(true)
try{
const ext=file.name.split('.').pop()
const path=`capas/${trip.id}.${ext}`
const{error:ue}=await sb.storage.from('rastro-images').upload(path,file,{upsert:true})
if(ue)throw ue
const{data}=sb.storage.from('rastro-images').getPublicUrl(path)
await updateTrip(trip.id,{name:trip.name,location:trip.location,dates:trip.dates,cover:trip.cover,coverCustom:data.publicUrl,budget:trip.budget,participants:trip.participants,mapImg:trip.mapImg||null})
await onRefresh();showToast('Capa atualizada!')
}catch(e){showToast('Erro: '+e.message)}finally{setUploadingCover(false)}}
const inp={width:'100%',padding:'10px 12px',borderRadius:10,border:`1.5px solid ${C.divider}`,fontSize:14,background:'#fff',color:C.textDark,outline:'none'}
const lbl={fontSize:11,fontWeight:700,color:C.textMid,marginBottom:4,letterSpacing:1,textTransform:'uppercase'}
return(<div style={{height:'100vh',display:'flex',flexDirection:'column',background:C.paper}}>
<div style={{position:'relative',height:220,flexShrink:0}}>
<img src={coverImg} alt={trip.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
<div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,transparent 40%,rgba(0,0,0,0.5) 100%)'}}/>
<div style={{position:'absolute',top:52,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
<button onClick={onBack} style={{background:'rgba(0,0,0,0.3)',border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="arrow-left" size={18} color="#fff"/></button>
<div style={{display:'flex',gap:8}}>
<label style={{background:'rgba(0,0,0,0.3)',border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
{uploadingCover?'...':(<Icon name="camera" size={18} color="#fff"/>)}
<input type="file" accept="image/*" style={{display:'none'}} onChange={uploadCover}/>
</label>
<button onClick={()=>setEditing(!editing)} style={{background:'rgba(0,0,0,0.3)',border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={editing?'x':'edit'} size={18} color="#fff"/></button>
<button onClick={handleDelete} style={{background:'rgba(0,0,0,0.3)',border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="trash" size={18} color="#fff"/></button>
</div></div>
{!editing&&<div style={{position:'absolute',bottom:16,left:20,right:20}}>
<div style={{fontFamily:'Playfair Display',fontSize:26,color:'#fff',fontWeight:700}}>{trip.name}</div>
<div style={{fontSize:13,color:'rgba(255,255,255,0.8)',marginTop:2}}>{trip.location}{trip.dates?` · ${trip.dates}`:''}</div>
</div>}
</div>
{editing&&<div style={{background:'#fff',padding:'16px 20px',borderBottom:`1px solid ${C.divider}`,display:'flex',flexDirection:'column',gap:10}}>
<div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:4}}>
{CV.map(c=><div key={c} onClick={()=>setCover(c)} style={{width:56,height:56,borderRadius:10,overflow:'hidden',flexShrink:0,cursor:'pointer',border:cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}><img src={IMG[c]} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}
</div>
<div><div style={lbl}>Nome</div><input style={inp} value={name} onChange={e=>setName(e.target.value)}/></div>
<div><div style={lbl}>Destino</div><input style={inp} value={location} onChange={e=>setLocation(e.target.value)}/></div>
<div><div style={lbl}>Período</div><input style={inp} value={dates} onChange={e=>setDates(e.target.value)}/></div>
<div><div style={lbl}>Participantes</div><input style={inp} value={participants} onChange={e=>setParticipants(e.target.value)} placeholder="Separe por vírgula"/></div>
<div><div style={lbl}>Orçamento R$</div><input style={inp} type="number" value={budget} onChange={e=>setBudget(e.target.value)}/></div>
<button onClick={handleSave} disabled={saving} style={{padding:'12px',borderRadius:12,background:C.terracotta,color:'#fff',border:'none',fontWeight:700,cursor:'pointer'}}>{saving?'Salvando...':'Salvar alterações'}</button>
</div>}
<div style={{display:'flex',background:'#fff',borderBottom:`1px solid ${C.divider}`,flexShrink:0}}>
{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',fontSize:12,fontWeight:700,cursor:'pointer',color:tab===t.id?C.terracotta:C.textLight,borderBottom:tab===t.id?`2px solid ${C.terracotta}`:'2px solid transparent'}}>{t.label}</button>)}
</div>
<div style={{flex:1,overflowY:'auto'}}>
{tab==='resumo'&&<Resumo trip={trip} onRefresh={onRefresh}/>}
{tab==='despesas'&&<Despesas trip={trip} onRefresh={onRefresh}/>}
{tab==='memorias'&&<Memorias trip={trip} onRefresh={onRefresh}/>}
{tab==='mapa'&&<Mapa trip={trip} onRefresh={onRefresh}/>}
</div>
</div>)}
