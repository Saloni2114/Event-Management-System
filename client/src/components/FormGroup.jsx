export default function FormGroup({ label, children }) {
  return (
    <div style={{ display:'grid', gap:'var(--space-2)' }}>
      <label style={{ fontSize:'var(--text-sm)', fontWeight:600 }}>{label}</label>
      {children}
    </div>
  )
}
