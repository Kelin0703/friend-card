export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  block = false,
  disabled = false,
  onClick,
  className = '',
}) {
  const baseStyles = 'font-medium rounded-full transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-b from-[#5b9dff] to-[#4a8eff] text-white shadow-btn-primary hover:from-[#4a8eff] hover:to-[#3a7aee]',
    secondary: 'bg-surface-muted text-text border border-transparent hover:bg-surface-hover',
    outline: 'bg-white text-text border border-border hover:border-primary-300 hover:text-primary-500',
    danger: 'bg-white text-status-danger border border-status-danger hover:bg-status-danger hover:text-white',
    success: 'bg-primary-500 text-white hover:bg-primary-600',
    ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-surface-muted',
  }

  const sizes = {
    small: 'px-4 py-2 text-xs',
    medium: 'px-6 py-4 text-base',
    large: 'px-8 py-5 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${block ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
