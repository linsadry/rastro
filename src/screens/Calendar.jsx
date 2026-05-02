import { useState } from 'react'
import { C, formatCurrency } from '../lib/utils'
import IMG from '../lib/images'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS = ['D','S','T','Q','Q','S','S']

export default function Calendar({ trips, onOpenTrip }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1)
  const next = () => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1)

  const tripsInDay = (day) => {
    const date = new Date(year, month, day)
    return trips.filter(t => {
      if (!t.dateStart) return false
      const start = new Date(t.dateStart + 'T12:00:00')
      const end = t.dateEnd ? new Date(t.dateEnd + 'T12:00:00') : start
      return date >= start && date <= end
    })
  }

  const upcoming = trips
    .filter(t => t.dateStart && new Date(t.dateStart + 'T12:00:00') >= today)
    .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
    .slice(0, 3)

  const row = { display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

  return (
    <div style={{ minHeight: '100%', background: C.paper }}>
      <div style={{ padding: '56px 20px 20px', background: C.olive }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 28, color: '#fff', fontWeight: 700 }}>Calendário</div>
          <img src={IMG.beach} alt="" style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 10, opacity: 0.6 }}/>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: '#fff', borderRadius: 16, padding: '12px 16px' }}>
          <button onClick={prev} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.olive }}>‹</button>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 18, color: C.textDark, fontWeight: 700 }}>{MONTHS[month]} {year}</div>
          <button onClick={next} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.olive }}>›</button>
        </div>

        <div style={{ display: 'grid',
