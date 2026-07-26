export default function Input({
  label,
  required = false,
  placeholder = '',
  value,
  onChange,
  type = 'text',
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-surface-muted rounded-full text-text placeholder:text-text-light focus:ring-2 focus:ring-primary-200 transition-all"
      />
    </div>
  )
}
