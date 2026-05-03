import { C, formatCurrency, categoryIcon } from '../lib/utils'
import IMG from '../lib/images'
import Donut from '../components/Donut'

const COLORS = ['#C46A3A','#4A7C8E','#6B8F7A','#E6C29A','#7AAFC0','#A8542A','#2F3E34']

export default function Resumo({ trip }) {
  const expenses = trip.expenses || []
  const totalGasto = expenses.reduce((s, e) => s + e.amount, 0)
  const pct = trip.budget > 0 ? Math.min(totalGasto / trip.budget, 1) : 0

  const byCategory = {}
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
  })
  const catData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))

  const byPerson = {}
  expenses.forEach(e => {
    byPerson[e.paidBy] = (byPerson[e.paidBy] || 0) + e.amount
  })

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Budget card */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <img src={IMG.abstract} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }}/>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: C.textLight }}>Gasto total</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.textDark }}>{formatCurrency(totalGasto)}</div>
            </div>
            {trip.budget > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: C.textLight }}>Orçamento</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.textMid }}>{formatCurrency(trip.budget)}</div>
              </div>
            )}
          </div>
          {trip.budget > 0 && (
            <>
              <div style={{ height: 8, background: C.divider, borderRadius: 4, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct * 100}%`, background: pct > 0.9 ? C.terracotta : C.olive, borderRadius: 4 }}/>
              </div>
              <div style={{ fontSize: 12, color: C.textLight }}>
                {formatCurrency(trip.budget - totalGasto)} restantes · {Math.round(pct * 100)}% usado
              </div>
            </>
          )}
        </div>
      </div>

      {/* Participants */}
      {trip.participants?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Participantes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {trip.participants.map((p, i) => (
              <div key={i} style={{ background: C.sandPale, borderRadius: 20, padding: '6px 14px', fontSize: 13, color: C.olive, fontWeight: 600 }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {trip.destinations?.length>0&&(
<div style={{background:'#fff',borderRadius:16,padding:'16px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontSize:12,color:C.textLight,marginBottom:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase'}}>Paradas</div>
<div style={{display:'flex',flexWrap:'wrap',gap:8}}>
{trip.destinations.map((d,i)=>(
<div key={i} style={{background:C.sandPale,borderRadius:20,padding:'6px 14px',fontSize:13,color:C.olive,fontWeight:600}}>{d}</div>
))}
</div>
</div>
)}


      {/* Donut */}
      {catData.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: C.textDark, marginBottom: 16 }}>Por categoria</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Donut data={catData} size={110} thickness={16}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {catData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                  <div style={{ fontSize: 12, color: C.textMid, flex: 1 }}>{categoryIcon(d.name)} {d.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.textDark }}>{formatCurrency(d.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* By person */}
      {Object.keys(byPerson).length > 1 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: C.textDark, marginBottom: 12 }}>Por pessoa</div>
          {Object.entries(byPerson).sort((a, b) => b[1] - a[1]).map(([person, value], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < Object.keys(byPerson).length - 1 ? `1px solid ${C.divider}` : 'none' }}>
              <div style={{ fontSize: 14, color: C.textDark }}>{person}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.terracotta }}>{formatCurrency(value)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Beach image */}
      <div style={{ borderRadius: 16, overflow: 'hidden', height: 120 }}>
        <img src={IMG.beach} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}/>
      </div>
    </div>
  )
}
