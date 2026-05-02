import { useState, useEffect } from 'react'
import { registerToast } from '../lib/utils'
import { C } from '../lib/utils'

export function Toast() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    registerToast((m) => {
      setMsg(m)
      setTimeout(() => setMsg(null), 2500)
    })
  }, [])

  if (!msg) return null

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: C.olive, color: '#fff', padding: '10px 20px',
      borderRadius: 20, fontSize: 13, fontWeight: 600,
      zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      {msg}
    </div>
  )
}
