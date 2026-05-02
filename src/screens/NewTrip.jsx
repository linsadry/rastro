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
