import { useState, useEffect } from 'react'
import { fetchAllTrips, C, showToast } from './lib/utils'
import { Loading, Splash } from './screens/Loading'
import Home from './screens/Home'
import NewTrip from './screens/NewTrip'
import TripScreen from './screens/TripScreen'
import Calendar from './screens/Calendar'
import { Insights, Perfil } from './screens/Insights'
import { Toast } from './components/Toast'
import Icon from './components/Icon'
const NAV = [
  { label: 'Viagens',    icon: 'airplane', id: 'home'     },
  { label: 'Calendário', icon: 'calendar', id: 'calendar' },
  { label: 'Insights',   icon: 'chart',    id: 'insights' },
  { label: 'Perfil',     icon: 'person',   id: 'perfil'   },
]
export default function App() {
  const [phase, setPhase]     = useState('loading')
  const [trips, setTrips]     = useState([])
  const [nav, setNav]         = useState('home')
  const [screen, setScreen]   = useState(null)
  const [activeTrip, setActiveTrip] = useState(null)
  const loadTrips = async () => {
    try {
      const data = await fetchAllTrips()
      setTrips(data)
    } catch (e) {
      console.error('Erro ao carregar viagens:', e)
    }
  }
  useEffect(() => {
    loadTrips().then(() => {
      setTimeout(() => setPhase('splash'), 1200)
    })
  }, [])
  useEffect(() => {
    if (activeTrip) {
      const updated = trips.find(t => t.id === activeTrip.id)
      if (updated) setActiveTrip(updated)
    }
  }, [trips])
  if (phase === 'loading') return <Loading/>
  if (phase === 'splash')  return <Splash onStart={() => setPhase('app')}/>
  if (screen === 'newtrip') {
    return (
      <>
        <NewTrip
          onBack={() => setScreen(null)}
          onCreated={() => { loadTrips(); setScreen(null); showToast('Viagem criada!') }}
        />
        <Toast/>
      </>
    )
  }
  if (screen === 'trip' && activeTrip) {
    return (
      <>
        <TripScreen
          trip={trips.find(t => t.id === activeTrip.id) || activeTrip}
          onBack={() => { setScreen(null); setActiveTrip(null) }}
          onRefresh={loadTrips}
          onDeleted={() => { loadTrips(); setScreen(null); setActiveTrip(null) }}
        />
        <Toast/>
      </>
    )
  }
  const openTrip = (t) => { setActiveTrip(t); setScreen('trip') }
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.paper }}>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {nav === 'home'     && <Home trips={trips} onNewTrip={() => setScreen('newtrip')} onOpenTrip={openTrip} onRefresh={loadTrips}/>}
        {nav === 'calendar' && <Calendar trips={trips} onOpenTrip={openTrip}/>}
        {nav === 'insights' && <Insights trips={trips}/>}
        {nav === 'perfil'   && <Perfil trips={trips}/>}
      </div>
      <nav style={{
        display: 'flex', background: '#fff',
        borderTop: `1px solid ${C.divider}`,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
        flexShrink: 0,
      }}>
        {NAV.map(item => {
          const active = nav === item.id
          return (
            <button key={item.id} onClick={() => setNav(item.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, padding: '10px 0 8px', border: 'none', background: 'transparent',
                cursor: 'pointer', color: active ? C.terracotta : C.textLight,
              }}>
              <Icon name={active ? item.icon + '-fill' : item.icon} size={22} color={active ? C.terracotta : C.textLight}/>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <Toast/>
    </div>
  )
}

