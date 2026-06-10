export default function Icon({ name, size = 20, color = 'currentColor' }) {
  const s = { width: size, height: size, display: 'inline-block', flexShrink: 0 }
  const icons = {
    'airplane': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
    'airplane-fill': <svg style={s} viewBox="0 0 24 24" fill={color}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
    'calendar': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    'calendar-fill': <svg style={s} viewBox="0 0 24 24" fill={color}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="1.8"/></svg>,
    'chart': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    'chart-fill': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    'person': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    'person-fill': <svg style={s} viewBox="0 0 24 24" fill={color}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    'plus': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
    'arrow-left': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
    'trash': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
    'edit': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    'check': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
    'map-pin': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0114 0c0 5-7 12.5-7 12.5z"/><circle cx="12" cy="8.5" r="2.5"/></svg>,
    'camera': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><circle cx="12" cy="14" r="3"/><path d="M16 7l-1.5-3h-5L8 7"/></svg>,
    'wallet': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h2"/></svg>,
    'grid': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    'x': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    'chevron-right': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
    'chevron-down': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
    'sun': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    'image': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
    'share': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>,
    'info': <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  }
  return icons[name] || <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/></svg>
}
