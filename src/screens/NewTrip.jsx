import { useState } from 'react'
import { C, createTrip } from '../lib/utils'
import IMG from '../lib/images'
import Icon from '../components/Icon'

const COVERS = ['cliffs','island','abstract','beach','fish','balloon','lighthouse','objects','map']

export default function NewTrip({ onBack, onCreated }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [dates, setDates] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [cover, setCover] = useState('cliffs')
  const [budget, setBudget] = useState('')
  const [participants, setParticipants] = useState('Você')
  const [loading, setLoading] = useState(false)
  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await createTrip({ name:name.trim(), location:location.trim(), dates:dates.trim(), dateStart, dateEnd, cover, budget:parseFloat(budget)||0, participants:participants.split(',').map(p=>p.trim()).filter(Boolean) })
      onCreated()
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }
  const inp = {width:'100%',padding:'12px 14px',borderRadius:12,border:`1.5px solid ${C.divider}`,fontSize:15,background:'#fff',color:C.textDark,outline:'none'}
  return (
    <div style={{minHeight:'100vh',background:C.paper}}>
      <div style={{padding:'56px 20px 20px',background:C.olive,display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',padding:4}}><Icon name="arrow-left" size={22} color="#fff"/></button>
        <div style={{fontFa

      <div style={{padding:'24px 20px 100px',display:'flex',flexDirection:'column',gap:16}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:10,letterSpacing:1,textTransform:'uppercase'}}>Capa</div>
          <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:4}}>
            {COVERS.map(c=>(
              <div key={c} onClick={()=>setCover(c)} style={{width:72,height:72,borderRadius:14,overflow:'hidden',flexShrink:0,cursor:'pointer',border:cover===c?`3px solid ${C.terracotta}`:'3px solid transparent'}}>
                <img src={IMG[c]} alt={c} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
            ))}
          </div>
        </div>
        {[
          {label:'Nome *',value:name,set:setName,placeholder:'Ex: Portugal 2024'},
          {label:'Destino',value:location,set:setLocation,placeholder:'Ex: Lisboa, Portugal'},
          {label:'Período',value:dates,set:setDates,placeholder:'Ex: Jul 2024'},
          {label:'Participantes',value:participants,set:setParticipants,placeholder:'Separe por vírgula'},
          {label:'Orçamento (R$)',value:budget,set:setBudget,placeholder:'0,00',type:'number'},
        ].map(f=>(
          <div key={f.label}>
            <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}}>{f.label}</div>
            <input style={inp} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} type={f.type||'text'}/>
          </div>
        ))}
        <div style={{display:'flex',gap:12}}>
          {[{label:'Início',value:dateStart,set:setDateStart},{label:'Fim',value:dateEnd,set:setDateEnd}].map(f=>(
            <div key={f.label} style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}}>{f.label}</div>
              <input style={inp} type="date" value={f.value} onChange={e=>f.set(e.target.value)}/>
            </div>
          ))}
        </div>
        <button onClick={handleCreate} disabled={loading||!name.trim()} style={{marginTop:8,padding:'16px',borderRadius:16,background:name.trim()?C.terracotta:C.divider,color:name.trim()?'#fff':C.textLight,border:'none',fontSize:16,fontWeight:700,cursor:name.trim()?'pointer':'default'}}>
          {loading?'Criando...':'Criar viagem'}
        </button>
      </div>
    </div>
  )
}               
