import { useToast } from './ToastContext'

export default function ToastContainer() {
  const { toasts } = useToast()
  if (!toasts.length) return null
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <strong>{t.title}</strong>
          <div style={{ fontSize:'var(--text-sm)', marginTop:4 }}>{t.message}</div>
        </div>
      ))}
    </div>
  )
}
