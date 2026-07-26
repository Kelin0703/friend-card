export default function RadioGroup({
  options,
  value,
  onChange,
  label,
  required = false,
  className = '',
}) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block mb-3 text-text">
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-6">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${value === option.value
                ? 'border-primary-500'
                : 'border-gray-300 group-hover:border-gray-400'
              }
            `}>
              {value === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              )}
            </div>
            <span className="text-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
