import { useState } from 'react'
import { C, deleteTrip, showToast } from '../lib/utils'
import IMG from '../lib/images'
import Icon from '../components/Icon'
import Resumo from '../tabs/Resumo'
import Despesas from '../tabs/Despesas'
import Memorias from '../tabs/Memorias'
import Mapa from '../tabs/Mapa'

const TABS = [
  { id: 'resumo',   label: 'Resumo'   },
  { id: 'despesas', label: 'Despesas' },
  { id: 'memorias', label: 'Memórias' },
  { id: 'mapa',     label: 'Mapa'     },
]

export default function TripScreen({ trip, onBack, onRefresh, onDeleted }) {
  const [tab, setTab] = useState('resumo')
  const [deleting, setDeleting] = useState(false)

  const coverImg = trip.coverCustom || IMG[trip.cover] || IMG.cliffs

  const handleDelete = async () => {
    if (!window.confirm(`Excluir "${trip.name}"?`)) return
    setDeleting(true)
    try {
      await deleteTrip(trip.id)
      showToast('Viagem excluída')
      onDeleted()
    } catch (e) {
      showToast('Erro ao excluir')
      setDeleting(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.paper }}>
      {/* Cover */}
      <div style={{ position: 'relative', height: 220, flexShrink: 0 }}>
        <img src={coverImg} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)' }}/>
        {/* Top buttons */}
        <div style={{ position: 'absolute', top: 52, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 20, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-left" size={18} color="#fff"/>
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 20, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trash" size={18} color="#fff"/>
          </button>
        </div>
        {/* Title */}
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 26, color: '#fff', fontWeight: 700 }}>{trip.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
            {trip.location}{trip.dates ? ` · ${trip.dates}` : ''}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: `1px solid ${C.divider}`, flexShrink: 0 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '12px 4px', border: 'none', background: 'transparent',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              color: tab === t.id ? C.terracotta : C.textLight,
              borderBottom: tab === t.id ? `2px solid ${C.terracotta}` : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'resumo'   && <Resumo   trip={trip} onRefresh={onRefresh}/>}
        {tab === 'despesas' && <Despesas trip={trip} onRefresh={onRefresh}/>}
        {tab === 'memorias' && <Memorias trip={trip} onRefresh={onRefresh}/>}
        {tab === 'mapa'     && <Mapa     trip={trip} onRefresh={onRefresh}/>}
      </div>
    </div>
  )
}
