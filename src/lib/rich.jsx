// Convierte "Texto con *itálica*" en nodos con <em>.
export function rich(text) {
  return String(text)
    .split(/(\*[^*]+\*)/)
    .map((part, i) => (part.startsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part))
}
