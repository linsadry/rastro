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
return(<div style={{minHeight:'100dvh',background:C.paper}}>
<div style={{padding:'56px 20px 20px',background:C.olive,display:'flex',alignItems:'center',gap:12}}>
<button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer'}}><Icon name="arrow-left" size={22} color="#fff"/></button>
<div style={{fontFamily:'Playfair Display',fontSize:22,color:'#fff',fontWeight:700}}>Nova viagem</div></div>
