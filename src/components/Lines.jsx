// Titular dividido en líneas enmascaradas para revelarlas una a una.
// `lines`: arreglo de strings o nodos; usa <em> para las palabras en itálica.
export default function Lines({ as: Tag = 'h2', lines, className = '', delay, ...props }) {
  return (
    <Tag className={className} data-reveal="mask" data-delay={delay} {...props}>
      {lines.map((line, i) => (
        <span key={i} className="mask">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
