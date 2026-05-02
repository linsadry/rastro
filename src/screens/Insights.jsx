import { C, formatCurrency, categoryIcon } from '../lib/utils'
import IMG from '../lib/images'
import Donut from '../components/Donut'

const COLORS = ['#C46A3A','#4A7C8E','#6B8F7A','#E6C29A','#7AAFC0','#A8542A','#2F3E34']

export function Insights({ trips }) {
  const allExpenses = trips.flatMap(t => t.expenses || [])
  const totalGasto = allExpenses.reduce((s, e) => s + e.amount, 0)
  const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0)

  const byCategory = {}
  allExpenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
  })
  const catData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))

  const byTrip = trips.map(t => ({
    name: t.name,
    value: (t.expenses || []).reduce((s, e) => s + e.amount, 0),
  })).filter(t => t.value > 0).sort((a, b) => b.value - a.value)

  return (
    <div style={{ minHeight: '100%', background: C.paper }}>
      <div style={{ padding: '56px 20px 20px', background: C.olive }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 28, color: '#fff', fontWeight: 700 }}>Insights</div>
            <div style={{ fontSize: 13, color: C.oliveLight, marginTop: 4 }}>{trips.length} viagens registradas</div>
          </div>
          <img src={IMG.lighthouse} alt="" style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 10, opacity: 0.7 }}/>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Total cards */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Total gasto', value: formatCurrency(totalGasto), color: C.terracotta },
            { label: 'Orçamento total', value: formatCurrency(totalBudget), color: C.olive },
            { label: 'Saldo', value: formatCurrency(totalBudget - totalGasto), color: totalBudget - totalGasto >= 0 ? C.ocean : C.terracotta },
          ].map((c, i) => (
            <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: 10, color: C.textLight, marginTop: 3 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Donut */}
        {catData.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: C.textDark, marginBottom: 16 }}>Por categoria</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Donut data={catData} size={120} thickness={18}/>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catData.slice(0, 5).map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                    <div style={{ fontSize: 12, color: C.textMid, flex: 1 }}>{categoryIcon(d.name)} {d.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textDark }}>{formatCurrency(d.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* By trip */}
        {byTrip.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: C.textDark, marginBottom: 16 }}>Por viagem</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {byTrip.map((t, i) => {
                const pct = totalGasto > 0 ? t.value / totalGasto : 0
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, color: C.textDark }}>{t.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{formatCurrency(t.value)}</div>
                    </div>
                    <div style={{ height: 6, background: C.divider, borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pct * 100}%`, background: COLORS[i % COLORS.length], borderRadius: 3 }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Icon */}
        <div style={{ textAlign: 'center', paddingTop: 10 }}>
          <img src={IMG.icon} alt="" style={{ width: 60, height: 60, borderRadius: 14, opacity: 0.4 }}/>
        </div>
      </div>
    </div>
  )
}

export function Perfil({ trips }) {
  const allExpenses = trips.flatMap(t => t.expenses || [])
  const totalGasto = allExpenses.reduce((s, e) => s + e.amount, 0)
  const destinations = [...new Set(trips.map(t => t.location).filter(Boolean))]

  return (
    <div style={{ minHeight: '100%', background: C.paper }}>
      <div style={{ padding: '56px 20px 20px', background: C.olive }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 28, color: '#fff', fontWeight: 700 }}>Perfil</div>
          <img src={IMG.icon} alt="" style={{ width: 56, height: 56, borderRadius: 14, opacity: 0.8 }}/>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { label: 'Total de viagens', value: trips.length },
          { label: 'Destinos visitados', value: destinations.length },
          { label: 'Total investido', value: formatCurrency(totalGasto) },
          { label: 'Média por viagem', value: trips.length ? formatCurrency(totalGasto / trips.length) : 'R$ 0,00' },
          { label: 'Memórias guardadas', value: trips.reduce((s, t) => s + (t.memories?.length || 0), 0) },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 14, color: C.textMid }}>{stat.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.olive }}>{stat.value}</div>
          </div>
        ))}

        {destinations.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 10 }}>Destinos</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {destinations.map((d, i) => (
                <div key={i} style={{ background: C.sandPale, borderRadius: 20, padding: '6px 12px', fontSize: 12, color: C.olive, fontWeight: 600 }}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
