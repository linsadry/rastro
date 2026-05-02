import{useState,useRef}from'react'
import{C,addMemory,deleteMemory}from'../lib/utils'
import{sb}from'../lib/supabase'
import Icon from'../components/Icon'
const BUCKET='rastro-images'
export default function Memorias({trip,onRefresh}){
const[loading,setLoading]=useState(false)
const ref=useRef()
const memories=trip.memories||[]
const upload=async(e)=>{
const files=[...e.target.files]
if(!files.length)return
setLoading(true)
try{
for(const file of files){
const ext=file.name.split('.').pop()
const path=`memorias/${trip.id}/${Date.now()}.${ext}`
const{error:ue}=await sb.storage.from(BUCKET).upload(path,file,{upsert:true})
if(ue)throw ue
const{data}=sb.storage.from(BUCKET).getPublicUrl(path)
await addMemory(trip.id,data.publicUrl)
}
await onRefresh()
}catch(e){console.error(e);alert('Erro ao fazer upload: '+e.message)}
finally{setLoading(false);ref.current.value=''}
}
const del=async(id,src)=>{
try{
if(src.includes(BUCKET)){
const path=src.split(BUCKET+'/')[1]
await sb.storage.from(BUCKET).remove([path])
}
await deleteMemory(id)
await onRefresh()
}catch(e){console.error(e)}}
return(<div style={{padding:'20px 20px 40px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
<div style={{fontFamily:'Playfair Display',fontSize:20,color:C.textDark}}>Memórias</div>
<button onClick={()=>ref.current.click()} disabled={loading} style={{background:C.ocean,border:'none',borderRadius:20,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
<Icon name="plus" size={18} color="#fff"/></button>
</div>
<input ref={ref} type="file" accept="image/*" multiple style={{display:'none'}} onChange={upload}/>
{loading&&<div style={{textAlign:'center',padding:'20px',color:C.textMid,fontSize:13}}>Enviando fotos...</div>}
{memories.length===0&&!loading?(
<div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
<div style={{fontSize:14}}>Nenhuma memória ainda</div>
<div style={{fontSize:12,marginTop:4}}>Toque em + para adicionar fotos</div>
</div>
):(
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
{memories.map(m=>(
<div key={m.id} style={{position:'relative',aspectRatio:'1',borderRadius:10,overflow:'hidden'}}>
<img src={m.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.opacity='0.3'}/>
<button onClick={()=>del(m.id,m.src)} style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'50%',width:24,height:24,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
<Icon name="x" size={10} color="#fff"/></button>
</div>
))}
</div>
)}
</div>)}
