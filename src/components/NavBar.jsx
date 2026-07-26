export default function NavBar({
  title,
  showBack = false,
  onBack,
  rightContent,
  className = '',
}) {
  return (
    <div className={`
      sticky top-0 z-10 bg-white
      border-b border-border
      flex items-center h-12 px-4
      ${className}
    `}>
      {showBack && (
        <button
          onClick={onBack}
          className="w-8 h-8 -ml-2 flex items-center justify-center text-text text-xl"
        >
          ‹
        </button>
      )}
      <div className="flex-1 text-center font-medium text-base">
        {title}
      </div>
      {rightContent ? (
        <div className="w-8">{rightContent}</div>
      ) : (
        <div className="w-8" />
      )}
    </div>
  )
}
