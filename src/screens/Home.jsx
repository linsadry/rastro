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
      <div style={{ padding: '56px 24px 20px', background: C.olive }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 12, color: C.oliveLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Bem-vinda</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 28, color: '#fff', fontWeight: 700 }}>Rastro</div>
          </div>
          <img src={IMG.fish} alt="" style={{ width: 80, height: 60, objectFit: 'cover', opacity: 0.6, borderRadius: 12 }}/>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Viagens', value: trips.length },
{ label: 'Destinos', value: new Set(trips.map(t=>t.location?.trim()).filter(Boolean)).size },
{ label: 'Gastos', value: formatCurrency(trips.reduce((s,t)=>s+(t.expenses?.reduce((a,e)=>a+e.amount,0)||0),0)) },

          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 8px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.olive }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: C.textDark }}>Suas viagens</div>
          <button onClick={handleRefresh} style={{ background: 'none', border: 'none', color: C.textLight, fontSize: 12, cursor: 'pointer' }}>
            {refreshing ? '...' : 'Atualizar'}
          </button>
        </div>

        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textLight }}>
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
                <div key={trip.id} onClick={() => onOpenTrip(trip)} style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', background: '#fff' }}>
                  <div style={{ position: 'relative', height: 160 }}>
                    <img src={coverImg(trip)} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))' }}/>
                    <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                      <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: '#fff', fontWeight: 700 }}>{trip.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{trip.location}{trip.dates ? ` · ${trip.dates}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px 16px' }}>
                    {trip.budget > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.textMid, marginBottom: 6 }}>
                          <span>{formatCurrency(totalGasto)} gastos</span>
                          <span>de {formatCurrency(trip.budget)}</span>
                        </div>
                        <div style={{ height: 4, background: C.divider, borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${pct * 100}%`, background: pct > 0.9 ? C.terracotta : C.olive, borderRadius: 2 }}/>
                        </div>
                      </>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: C.textLight }}>{trip.expenses?.length || 0} despesas</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>·</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>{trip.memories?.length || 0} memórias</div>
                      {trip.dateStart && (
                        <>
                          <div style={{ fontSize: 11, color: C.textLight }}>·</div>
                          <div style={{ fontSize: 11, color: C.textLight }}>{formatDate(trip.dateStart)}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={onNewTrip} style={{ position: 'fixed', bottom: 80, right: 20, width: 56, height: 56, borderRadius: 28, background: C.terracotta, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(196,106,58,0.4)', zIndex: 100 }}>
        <Icon name="plus" size={24} color="#fff"/>
      </button>
    </div>
  )
}
