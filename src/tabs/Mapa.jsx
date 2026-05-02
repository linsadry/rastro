import { useState } from 'react'
import { C, updateMapPoints } from '../lib/utils'
import IMG from '../lib/images'
import Icon from '../components/Icon'

export default function Mapa({ trip, onRefresh }) {
  const [points, setPoints] = useState(trip.mapPoints || [])
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateMapPoints(trip.id, points)
      await onRefresh()
      setEditing(false)
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  const addPoint = () => {
    if (!newLabel.trim()) return
    setPoints(prev => [...prev, {
      id: Date.now().toString(),
      label: newLabel.trim(),
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      date: '',
    }])
    setNewLabel('')
  }

  const removePoint = (id) => setPoints(prev => prev.filter(p => p.id !== id))

  const movePoint = (id, dx, dy) => {
    setPoints(prev => prev.map(p => p.id === id
      ? { ...p, x: Math.max(2, Math.min(96, p.x + dx)), y: Math.max(2, Math.min(96, p.y + dy)) }
      : p
    ))
  }

  return (
    <div style={{ padding: '20px 20px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: C.textDark }}>Mapa</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing && (
            <button onClick={handleSave} disabled={saving} style={{ background: C.olive, border: 'none', borderRadius: 20, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {saving ? '...' : 'Salvar'}
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            style={{ background: editing ? C.divider : C.terracotta, border: 'none', borderRadius: 20, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={editing ? 'x' : 'edit'} size={16} color={editing ? C.textMid : '#fff'}/>
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
        <img src={IMG.map} alt="Mapa" style={{ width: '100%', display: 'block' }}/>
        {points.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            transform: 'translate(-50%, -100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              background: C.terracotta, color: '#fff',
              fontSize: 10, fontWeight: 700,
              padding: '3px 8px', borderRadius: 10,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}>
              {p.label}
            </div>
            <div style={{ width: 6, height: 6, background: C.terracotta, borderRadius: '50%', marginTop: 2 }}/>
            {editing && (
              <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {[['←',-5,0],['→',5,0],['↑',0,-5],['↓',0,5]].map(([arrow, dx, dy]) => (
                  <button key={arrow} onClick={() => movePoint(p.id, dx, dy)}
                    style={{ fontSize: 10, padding: '1px 3px', border: `1px solid ${C.divider}`, borderRadius: 4, background: '#fff', cursor: 'pointer' }}>
                    {arrow}
                  </button>
                ))}
                <button onClick={() => removePoint(p.id)}
                  style={{ fontSize: 10, padding: '1px 4px', border: 'none', borderRadius: 4, background: C.terracotta, color: '#fff', cursor: 'pointer' }}>
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add point */}
      {editing && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.divider}`, fontSize: 14, outline: 'none' }}
            placeholder="Nome do lugar"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPoint()}
          />
          <butt
