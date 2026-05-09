const STATUS_OPTIONS = [
  { label: 'All',            value: 'all' },
  { label: 'Ready to Drink', value: 'drink' },
  { label: 'Needs Aging',    value: 'age' },
]

const TYPE_OPTIONS = [
  { label: 'All',    value: 'all' },
  { label: 'Red',    value: 'Red' },
  { label: 'White',  value: 'White' },
  { label: 'Rosé',   value: 'Rosé' },
  { label: 'Orange', value: 'Orange' },
]

function FilterRow({ options, activeValue, onChange }) {
  return (
    <div className="flex justify-center gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            'px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all duration-150 font-medium',
            activeValue === opt.value
              ? 'bg-wine-red border-wine-red text-white'
              : 'bg-transparent border-white/15 text-white/45 hover:text-white/80 hover:border-white/35',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function FilterBar({ activeStatus, setActiveStatus, activeType, setActiveType }) {
  return (
    <div className="sticky top-0 z-10 bg-neutral-900 px-3.5 pt-3 pb-2.5 border-b border-white/5">
      <FilterRow options={STATUS_OPTIONS} activeValue={activeStatus} onChange={setActiveStatus} />
      <div className="mt-1.5">
        <FilterRow options={TYPE_OPTIONS} activeValue={activeType} onChange={setActiveType} />
      </div>
    </div>
  )
}