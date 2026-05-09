const TYPE_CLASSES = {
  red:       'bottle-red',
  white:     'bottle-white',
  'rosé':    'bottle-rose',
  rose:      'bottle-rose',
  orange:    'bottle-orange',
  sparkling: 'bottle-sparkling',
}

function getBottleClass(type = '') {
  return TYPE_CLASSES[type.toLowerCase()] || 'bottle-other'
}

export function getInitials(name = '') {
  const words = name
    .replace(/château|domaine|estate|tenuta/gi, '')
    .trim()
    .split(/\s+/)
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

/**
 * Small bottle illustration used on cellar cards.
 */
export default function Bottle({ type, initials, size = 'sm' }) {
  const cls = getBottleClass(type)
  const isSm = size === 'sm'

  return (
    <div
      className="flex flex-col items-center"
      style={{ width: isSm ? 36 : 52, height: isSm ? 66 : 90 }}
      aria-hidden="true"
    >
      {/* Neck */}
      <div
        className={`${cls} rounded-t border border-white/5`}
        style={{
          width:  isSm ? 12 : 16,
          height: isSm ? 20 : 26,
          borderRadius: '3px 3px 0 0',
        }}
      />
      {/* Body */}
      <div
        className={`${cls} flex items-center justify-center border border-white/5`}
        style={{
          width:  isSm ? 30 : 44,
          height: isSm ? 46 : 64,
          borderRadius: isSm ? '15px 15px 4px 4px' : '22px 22px 5px 5px',
          fontSize: isSm ? 7 : 10,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {initials}
      </div>
    </div>
  )
}
