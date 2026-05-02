import { useState } from 'react'
import { C, addMemory, deleteMemory } from '../lib/utils'
import IMG from '../lib/images'
import Icon from '../components/Icon'

export default function Memorias({ trip, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const memories = trip.memories || []

  const handleAdd = async () => {
    const url = window.prompt('Cole a URL da imagem:')
    if (!url?.trim()) return
    setLoading(true)
    try {
      await addMemory(trip.id, url.trim())
      await onRefresh()
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMemory(id)
      await onRefresh()
    } catch(e) { console.error(e) }
  }

  return (
    <div style={{ padding: '20px 20px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: C.textDark }}>Memórias</div>
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ background: C.ocean, border: 'none', borderRadius: 20, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="plus" size={18} color="#fff"/>
        </button>
      </div>

      {memories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: C.textLight }}>
          <img src={IMG.fish} alt="" style={{ width: '70%', margin: '0 auto 16px', display: 'block', opacity: 0.4 }}/>
          <div style={{ fontSize: 14 }}>Nenhuma memória ainda</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Adicione URLs de fotos</div>
        </div>
      ) : (
        <div style={{ columns: 2, gap: 10 }}>
          {memories.map(m => (
            <div key={m.id} style={{ marginBottom: 10, breakInside: 'avoid', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
              <img
                src={m.src}
                alt=""
                style={{ width: '100%', display: 'block', borderRadius: 14 }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <button
                onClick={() => handleDelete(m.id)}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'rgba(0,0,0,0.5)', border: 'none',
                  borderRadius: '50%', width: 28, height: 28,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="x" size={12} color="#fff"/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
