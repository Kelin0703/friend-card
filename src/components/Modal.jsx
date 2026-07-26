import { useEffect } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={`
        relative w-full max-w-md
        bg-white rounded-t-3xl sm:rounded-2xl
        max-h-[85vh] overflow-y-auto
        animate-slide-up
        ${className}
      `}>
        {title && (
          <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-border">
            <div className="text-center font-medium text-base">{title}</div>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-text-light text-xl"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
