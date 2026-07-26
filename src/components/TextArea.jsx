export default function TextArea({
  label,
  required = false,
  placeholder = '',
  value,
  onChange,
  rows = 4,
  className = '',
}) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block mb-2 text-text">
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3.5 bg-surface-muted rounded-2xl text-text placeholder:text-text-light resize-none focus:ring-2 focus:ring-primary-200 transition-all"
      />
    </div>
  )
}
