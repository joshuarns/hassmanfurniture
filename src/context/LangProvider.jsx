import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANG, LANGS, T } from '../i18n/translations'
import { LangContext } from './lang'

const KEY = 'hassman-lang'

function readLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // almacenamiento bloqueado: usar idioma por defecto
  }
  return DEFAULT_LANG
}

export default function LangProvider({ children }) {
  const [lang, setLang] = useState(readLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      // sin persistencia
    }
  }, [lang])

  const label = useCallback((obj) => obj[lang], [lang])
  const value = useMemo(() => ({ lang, setLang, t: T[lang], label }), [lang, label])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
