import{useState,useRef}from'react'
import{C,updateMapPoints,updateTrip}from'../lib/utils'
import{sb}from'../lib/supabase'
import IMG from'../lib/images'
import Icon from'../components/Icon'
export default function Mapa({trip,onRefresh}){
const[points,setPoints]=useState(trip.mapPoints||[])
const[editing,setEditing]=useState(false)
const[saving,setSaving]=useState(false)
const[newLabel,setNewLabel]=useState('')
const[uploadingMap,setUploadingMap]=useState(false)
const mapRef=useRef()
const imgRef=useRef()
const mapImg=trip.mapImg||IMG.map
const save=async()=>{
setSaving(true)
try{await updateMapPoints(trip.id,points);await onRefresh();setEditing(false)}
catch(e){console.error(e)}finally{setSaving(false)}}
const add=()=>{
if(!newLabel.trim())return
setPoints(p=>[...p,{id:Date.now().toString(),label:newLabel.trim(),x:45+Math.random()*10,y:45+Math.random()*10,date:''}])
setNewLabel('')}
const rem=(id)=>setPoints(p=>p.filter(x=>x.id!==id))
const mov=(id,dx,dy)=>setPoints(p=>p.map(x=>x.id===id?{...x,x:Math.max(2,Math.min(96,x.x+dx)),y:Math.max(2,Math.min(96,x.y+dy))}:x))
const uploadMap=async(e)=>{
const file=e.target.files[0];if(!file)return
setUploadingMap(true)
try{
const ext=file.name.split('.').pop()
const path=`mapas/${trip.id}.${ext}`
const{error:ue}=await sb.storage.from('rastro-images').upload(path,file,{upsert:true})
if(ue)throw ue
const{data}=sb.storage.from('rastro-images').getPublicUrl(path)
await updateTrip(trip.id,{name:trip.name,location:trip.location,dates:trip.dates,cover:trip.cover,coverCustom:trip.coverCustom||null,budget:trip.budget,participants:trip.participants,mapImg:data.publicUrl})
await onRefresh()
}catch(e){alert('Erro: '+e.message)}finally{setUploadingMap(false)}}
const handleMapClick=(e)=>{
if(!editing)return
const rect=mapRef.current.getBoundingClientRect()
const x=((e.clientX-rect.left)/rect.width)*100
const y=((e.clientY-rect.top)/rect.height)*100
const label=window.prompt('Nome do lugar:')
if(!label?.trim())return
setPoints(p=>[...p,{id:Date.now().toString(),label:label.trim(),x,y,date:''}])}
return(<div style={{padding:'20px 20px 40px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
<div style={{fontFamily:'Playfair Display',fontSize:20,color:C.textDark}}>Mapa</div>
<div style={{display:'flex',gap:8}}>
<label style={{background:C.ocean,border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
{uploadingMap?<span style={{color:'#fff',fontSize:11}}>...</span>:<Icon name="image" size={16} color="#fff"/>}
<input ref={imgRef} type="file" accept="image/*" style={{display:'none'}} onChange={uploadMap}/>
</label>
{editing&&<button onClick={save} disabled={saving} style={{background:C.olive,border:'none',borderRadius:20,padding:'8px 16px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>{saving?'...':'Salvar'}</button>}
<button onClick={()=>setEditing(!editing)} style={{background:editing?C.divider:C.terracotta,border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
<Icon name={editing?'x':'edit'} size={16} color={editing?C.textMid:'#fff'}/></button>
</div></div>
{editing&&<div style={{fontSize:12,color:C.textMid,marginBottom:8,textAlign:'center'}}>Toque no mapa para adicionar pontos</div>}
<div ref={mapRef} onClick={handleMapClick} style={{position:'relative',borderRadius:20,overflow:'hidden',marginBottom:16,cursor:editing?'crosshair':'default'}}>
<img src={mapImg} alt="Mapa" style={{width:'100%',display:'block'}}/>
{points.map(p=>(
<div key={p.id} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%,-100%)',display:'flex',flexDirection:'column',alignItems:'center',zIndex:10}}>
<div style={{background:C.terracotta,color:'#fff',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:10,whiteSpace:'nowrap',boxShadow:'0 2px 6px rgba(0,0,0,0.3)'}}>{p.label}</div>
<div style={{width:6,height:6,background:C.terracotta,borderRadius:'50%',marginTop:2}}/>
{editing&&<div style={{display:'flex',gap:2,marginTop:4}}>
{[['←',-5,0],['→',5,0],['↑',0,-5],['↓',0,5]].map(([a,dx,dy])=>(
<button key={a} onClick={e=>{e.stopPropagation();mov(p.id,dx,dy)}} style={{fontSize:10,padding:'1px 3px',border:`1px solid ${C.divider}`,borderRadius:4,background:'#fff',cursor:'pointer'}}>{a}</button>))}
<button onClick={e=>{e.stopPropagation();rem(p.id)}} style={{fontSize:10,padding:'1px 4px',border:'none',borderRadius:4,background:C.terracotta,color:'#fff',cursor:'pointer'}}>×</button>
</div>}
</div>))}
</div>
{editing&&<div style={{display:'flex',gap:8,marginBottom:16}}>
<input style={{flex:1,padding:'10px 12px',borderRadius:10,border:`1.5px solid ${C.divider}`,fontSize:14,outline:'none'}} placeholder="Nome do lugar" value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
<button onClick={add} style={{background:C.terracotta,border:'none',borderRadius:10,width:44,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="plus" size={18} color="#fff"/></button>
</div>}
{points.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8}}>
{points.map((p,i)=>(
<div key={p.id} style={{background:'#fff',borderRadius:12,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{width:24,height:24,borderRadius:'50%',background:C.sandPale,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.terracotta,flexShrink:0}}>{i+1}</div>
<div style={{flex:1,fontSize:14,color:C.textDark}}>{p.label}</div>
<Icon name="map-pin" size={14} color={C.textLight}/>
</div>))}
</div>}
{points.length===0&&!editing&&<div style={{textAlign:'center',color:C.textLight,padding:'20px 0'}}>
<div style={{fontSize:14}}>Nenhum ponto marcado</div>
<div style={{fontSize:12,marginTop:4}}>Toque no ícone de imagem para trocar o mapa, depois no lápis para adicionar pontos</div>
</div>}
</div>)}
