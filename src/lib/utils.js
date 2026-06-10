import { sb } from './supabase'

export const C = {
  terracotta: '#C46A3A',
  terra2: '#A8542A',
  sand: '#E6C29A',
  sandLight: '#EED5B5',
  sandPale: '#F5EBD8',
  paper: '#FAF7F2',
  cream: '#FAF7F2',
  olive: '#2F3E34',
  oliveMid: '#4A6355',
  oliveLight: '#6B8F7A',
  ocean: '#4A7C8E',
  oceanLight: '#7AAFC0',
  textDark: '#2F3E34',
  textMid: '#5C6E5C',
  textLight: '#8FA08F',
  divider: '#E8E2D8',
  white: '#FFFFFF',
}

let _setToast = null
export const registerToast = (fn) => { _setToast = fn }
export const showToast = (msg) => { if (_setToast) _setToast(msg) }

export async function fetchAllTrips() {
  const { data: trips, error } = await sb
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error

  const ids = trips.map(t => t.id)
  if (ids.length === 0) return []

  const [{ data: expenses }, { data: mapPoints }, { data: memories }] = await Promise.all([
    sb.from('expenses').select('*').in('trip_id', ids),
    sb.from('map_points').select('*').in('trip_id', ids).order('sort_order'),
    sb.from('memories').select('*').in('trip_id', ids).order('sort_order'),
  ])

  return trips.map(t => ({
    id: t.id,
    name: t.name,
    location: t.location || '',
    dates: t.dates || '',
    dateStart: t.date_start || '',
    dateEnd: t.date_end || '',
    cover: t.cover || 'cliffs',
    coverCustom: t.cover_custom || null,
    budget: parseFloat(t.budget) || 0,
    participants: t.participants || ['Você'],
    mapImg: t.map_img || null,
    destinations: t.destinations || [],
    mapPoints: (mapPoints || [])
      .filter(p => p.trip_id === t.id)
      .map(p => ({ id: p.id, label: p.label, x: p.x, y: p.y, date: p.date || '' })),
    expenses: (expenses || [])
      .filter(e => e.trip_id === t.id)
      .map(e => ({
        id: e.id,
        description: e.description,
        amount: parseFloat(e.amount) || 0,
        category: e.category || 'Outros',
        payment: e.payment || 'Débito',
        paidBy: e.paid_by || 'Você',
        withWhom: e.with_whom || ['Você'],
        date: e.date || '',
        note: e.note || '',
      })),
    memories: (memories || [])
      .filter(m => m.trip_id === t.id)
      .map(m => ({ id: m.id, src: m.src, sortOrder: m.sort_order })),
  }))
}

export async function createTrip(data){
  const{data:trip,error}=await sb.from('trips').insert({
    name:data.name,location:data.location,dates:data.dates,
    date_start:data.dateStart||null,date_end:data.dateEnd||null,
    cover:data.cover||'cliffs',budget:data.budget||0,
    participants:data.participants||['Você'],
  }).select().single()
  if(error)throw error
  return trip
}

export async function updateTrip(id,data){
  const{error}=await sb.from('trips').update({
    name:data.name,location:data.location,dates:data.dates,
    date_start:data.dateStart||null,date_end:data.dateEnd||null,
    cover:data.cover,cover_custom:data.coverCustom||null,
    budget:data.budget,participants:data.participants,
    destinations:data.destinations||[],map_img:data.mapImg||null,
  }).eq('id',id)
  if(error)throw error
}

export async function deleteTrip(id) {
  const { error } = await sb.from('trips').delete().eq('id', id)
  if (error) throw error
}

export async function addExpense(tripId,data){
  const{data:exp,error}=await sb.from('expenses').insert({
    trip_id:tripId,description:data.description,amount:data.amount,
    category:data.category,payment:data.payment,paid_by:data.paidBy,
    with_whom:data.withWhom,date:data.date||null,note:data.note||null,
  }).select().single()
  if(error)throw error
  return exp
}

export async function deleteExpense(id) {
  const { error } = await sb.from('expenses').delete().eq('id', id)
  if (error) throw error
}

export async function addMapPoint(tripId, point) {
  const { data, error } = await sb.from('map_points').insert({
    trip_id: tripId, label: point.label, x: point.x, y: point.y,
    date: point.date || null, sort_order: point.sortOrder || 0,
  }).select().single()
  if (error) throw error
  return data
}

export async function updateMapPoints(tripId, points) {
  await sb.from('map_points').delete().eq('trip_id', tripId)
  if (points.length === 0) return
  const { error } = await sb.from('map_points').insert(
    points.map((p, i) => ({
      trip_id: tripId, label: p.label, x: p.x, y: p.y,
      date: p.date || null, sort_order: i,
    }))
  )
  if (error) throw error
}

export async function addMemory(tripId, src) {
  const { data, error } = await sb.from('memories').insert({
    trip_id: tripId, src, sort_order: 0,
  }).select().single()
  if (error) throw error
  return data
}

export async function deleteMemory(id) {
  const { error } = await sb.from('memories').delete().eq('id', id)
  if (error) throw error
}

export function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

export function formatDate(str) {
  if (!str) return ''
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function categoryIcon(cat) {
  const icons = {
    'Hospedagem': '🏨', 'Transporte': '✈️', 'Alimentação': '🍽️',
    'Passeio': '🎭', 'Compras': '🛍️', 'Saúde': '💊', 'Outros': '📦',
  }
  return icons[cat] || '📦'
}
