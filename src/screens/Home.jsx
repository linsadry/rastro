import { useState } from 'react'
import IMG from '../lib/images'
import { C, formatCurrency, formatDate } from '../lib/utils'
import Icon from '../components/Icon'

export default function Home({ trips, onNewTrip, onOpenTrip, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const coverImg = (trip) => {
    if (trip.coverCustom) return trip.coverCustom
    return IMG[trip.cover] || IMG.cliffs
  }

  return (
    <div style={{ minHeight: '100%', background: C.paper }}>
      {/* Header */}
      <div style={{
        padding: '56px 24px 20px',
        background: C.olive,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 12, color: C.oliveLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Bem-vinda
            </div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 28, color: '#fff', fontWeight: 700 }}>
              Rastro
            </div>
          </div>
          <img src={IMG.fish} alt="" style={{ width: 80, height: 60, objectFit: 'cover', opacity: 0.6, borderRadius: 12 }}/>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 100px' }}>
        {/* Stats bar */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 24,
        }}>
          {[
            { label: 'Viagens', value: trips.length },
            { label: 'Países', value: new Set(trips.map(t => t.location?.split(',').pop()?.trim()).filter(Boolean)).size },
            { label: 'Gastos', value: formatCurrency(trips.reduce((s, t) => s + (t.expenses?.reduce((a, e) => a + e.amount, 0) || 0), 0)) },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, background: '#fff', borderRadius: 14,
              padding: '12px 8px', textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.olive }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trips list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: C.textDark }}>
            Suas viagens
          </div>
          <button onClick={handleRefresh} style={{ background: 'none', border: 'none', color: C.textLight, fontSize: 12, cursor: 'pointer' }}>
            {refreshing ? '...' : 'Atualizar'}
          </button>
        </div>

        {trips.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: C.textLight,
          }}>
            <img src={IMG.cliffs} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 20, marginBottom: 20, opacity: 0.5 }}/>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nenhuma viagem ainda</div>
            <div style={{ fontSize: 13 }}>Crie sua primeira viagem abaixo</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trips.map(trip => {
              const totalGasto = trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0
              const pct = trip.budget > 0 ? Math.min(totalGasto / trip.budget, 1) : 0
              return (
