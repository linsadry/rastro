import { useState } from 'react'
import { C } from '../lib/utils'
import IMG from '../lib/images'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WD = ['D','S','T','Q','Q','S','S']

export default function Calendar({ trips, onOpenTrip }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const firstDay = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const prev = () => month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1)
  const next = () => month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1)
  const tripsInDay = (day) => {
    const d = new Date(year, month, day)
    return trips.filter(t => {
      if (!t.dateStart) return false
      const s = new Date(t.dateStart+'T12:00:00')
      const e = t.dateEnd ? new Date(t.dateEnd+'T12:00:00') : s
      return d >= s && d <= e
    })
  }
  const upcoming = trips.filter(t=>t.dateStart&&new Date(t.dateStart+'T12:00:00')>=today).sort((a,b)=>new Date(a.dateStart)-new Date(b.dateStart)).slice(0,3)
  return (
    <div style={{minHeight:'100%',background:C.paper}}>
      <div style={{padding:'56px 20px 20px',background:C.olive}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div style={{fontFamily:'Playfair Display',fontSize:28,color:'#fff',fontWeight:700}}>Calendário</div>
          <img src={IMG.beach} alt="" style={{width:70,height:50,objectFit:'cover',borderRadius:10,opacity:0.6}}/>
        </div>
      </div>
      <div style={{padding:'20px 20px 100px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,background:'#fff',borderRadius:16,padding:'12px 16px'}}>
          <button onClick={prev} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:C.olive}}>‹</button>
          <div style={{fontFamily:'Playfair Display',fontSize:18,color:C.textDark,fontWeight:700}}>{MONTHS[month]} {year}</div>
          <button onClick={next} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:C.olive}}>›</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',marginBottom:8}}>
          {WD.map((d,i)=><div key={i} style={{textAlign:'center',fontSize:11,color:C.textLight,fontWeight:700,padding:'4px 0'}}>{d}</div>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:24}}>
          {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array(days).fill(null).map((_,i)=>{
            const day=i+1, dt=tripsInDay(day), isToday=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear()
            return <div key={day} onClick={()=>dt.length===1&&onOpenTrip(dt[0])} style={{aspectRatio:'1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:10,background:isToday?C.olive:dt.length>0?C.sandPale:'transparent',cursor:dt.length>0?'pointer':'default'}}>
              <span style={{fontSize:13,fontWeight:isToday?700:400,color:isToday?'#fff':C.textDark}}>{day}</span>
              {dt.length>0&&<div style={{width:5,height:5,borderRadius:'50%',background:C.terracotta,marginTop:2}}/>}
            </div>
          })}
        </div>
        {upcoming.length>0&&<>
          <div style={{fontFamily:'Playfair Display',fontSize:18,color:C.textDark,marginBottom:12}}>Próximas viagens</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {upcoming.map(trip=>(
              <div key={trip.id} onClick={()=>onOpenTrip(trip)} style={{background:'#fff',borderRadius:14,padding:'12px 16px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div style={{width:48,height:48,borderRadius:12,overflow:'hidden',flexShrink:0}}>
                  <img src={IMG[trip.cover]||IMG.cliffs} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:C.textDark}}>{trip.name}</div>
                  <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{trip.location}</div>
                </div>
                <div style={{fontSize:12,color:C.terracotta,fontWeight:700}}>{new Date(trip.dateStart+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</div>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  )
}
