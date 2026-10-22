import { useEffect, useRef } from 'react'
import useLockBody from '../hooks/useLockBody'
import { useLang } from '../context/lang'
import './Drawer.css'

// Panel lateral con fondo oscurecido. Se monta sólo mientras está abierto.
export default function Drawer({ side = 'left', label, onClose, head, children }) {
  const { t } = useLang()
  const panelRef = useRef(null)

  useLockBody(true)

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="dw-back" onClick={onClose} aria-hidden="true" />
      <div className={`dw dw--${side}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={panelRef}>
        <div className="dw__head">
          <button type="button" className="dw__close ui" onClick={onClose}>
            <span aria-hidden="true">×</span> {t.close}
          </button>
          {head}
        </div>
        {children}
      </div>
    </>
  )
}
