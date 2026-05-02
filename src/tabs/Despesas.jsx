import { useState } from 'react'
import { C, formatCurrency, categoryIcon, addExpense, deleteExpense } from '../lib/utils'
import IMG from '../lib/images'
import Icon from '../components/Icon'

const CATEGORIES = ['Hospedagem','Transporte','Alimentação','Passeio','Compras','Saúde','Outros']
const PAYMENTS = ['Débito','Crédito','Dinheiro','Pix']

export default function Despesas({ trip, onRefresh }) {
  const [showing, setShowing] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Outros')
  const [payment, setPayment] = useState('Débito')
  const [paidBy, setPaidBy] = useState(trip.participants?.[0] || 'Você')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  const expenses = trip.expenses || []
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const inp = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: `1.5px solid ${C.divider}`, fontSize: 14,
    background: '#fff', color: C.textDark, outline: 'none',
  }

  const handleAdd = async () => {
    if (!desc.trim() || !amount) return
    setLoading(true)
    try {
      await addExpense(trip.id, {
        description: desc.trim(),
        amount: parseFloat(amount),
        category, payment, paidBy,
        date: date || null,
        withWhom: trip.participants || ['Você'],
      })
      setDesc(''); setAmount(''); setDate('')
      setShowing(false)
      await onRefresh()
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id)
      await onRefresh()
    } catch(e) { console.error(e) }
  }

  return (
    <div style={{ padding: '20px 20px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: C.textDark }}>Despesas</div>
          <div style={{ fontSize: 13, color: C.terracotta, fontWeight: 700 }}>{formatCurrency(total)}</div>
        </div>
        <button
          onClick={() => setShowing(!showing)}
          style={{ background: C.terracotta, border: 'none', borderRadius: 20, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={showing ? 'x' : 'plus'} size={18} color="#fff"/>
        </button>
      </div>

      {/* Form */}
      {showing && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <img src={IMG.objects} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 10, objectPosition: 'center top' }}/>
          <input style={inp} placeholder="Descrição *" value={desc} onChange={e => setDesc(e.target.value)}/>
          <input style={inp} placeholder="Valor (R$) *" type="number" value={amount} onChange={e => setAmount(e.target.value)}/>
          <input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)}/>
          <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={inp} value={payment} onChange={e => setPayment(e.target.value)}>
            {PAYMENTS.map(p => <option key={p}>{p}</option>)}
          </select>
          {trip.participants?.length > 1 && (
            <select style={inp} value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              {trip.participants.map(p => <option key={p}>{p}</option>)}
            </select>
          )}
          <button
            onClick={handleAdd}
            disabled={loading || !desc.trim() || !amount}
            style={{ padding: '12px', borderRadius: 12, background: desc.trim() && amount ? C.terracotta : C.divider, color: desc.trim() && amount ? '#fff' : C.textLight, border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      )}

      {/* List */}
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: C.textLight }}>
          <img src={IMG.balloon} alt="" style={{ width: '60%', margin: '0 auto 16px', display: 'block', opacity: 0.5 }}/>
          <div style={{ fontSize: 14 }}>Nenhuma despesa ainda</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expenses.map(e => (
            <div key={e.id} style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 24 }}>{categoryIcon(e.category)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textDark }}>{e.description}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>
                  {e.category} · {e.payment} · {e.paidBy}
                  {e.date ? ` · ${new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.terracotta }}>{formatCurrency(e.amount)}</div>
                <button onClick={() => handleDelete(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 0' }}>
                  <Icon name="trash" size={14} color={C.textLight}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
