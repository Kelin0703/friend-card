export default function TabBar({
  tabs,
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div className={`
      bg-surface-muted rounded-full p-1
      flex gap-1
      ${className}
    `}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange?.(tab.key)}
          className={`
            flex-1 py-2.5 px-4 rounded-full text-sm transition-all duration-200
            ${activeTab === tab.key
              ? 'bg-white text-text font-medium shadow-sm'
              : 'text-text-muted hover:text-text'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
