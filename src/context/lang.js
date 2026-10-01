import { createContext, useContext } from 'react'

export const LangContext = createContext(null)

// { lang, setLang, t, label(obj) } — label() devuelve obj.es / obj.en según el idioma.
export const useLang = () => useContext(LangContext)
