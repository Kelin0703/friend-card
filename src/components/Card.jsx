export default function Card({
  children,
  className = '',
  padding = 'normal',
}) {
  const paddingStyles = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-5',
  }

  return (
    <div className={`
      bg-surface-muted rounded-2xl
      ${paddingStyles[padding]}
      ${className}
    `}>
      {children}
    </div>
  )
}
