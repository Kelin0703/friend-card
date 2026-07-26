export default function StatusTag({ status }) {
  const statusConfig = {
    pending: {
      label: '待审核',
      bgClass: 'bg-status-pending-bg',
      textClass: 'text-status-pending-text',
    },
    approved: {
      label: '已授权',
      bgClass: 'bg-status-approved-bg',
      textClass: 'text-status-approved-text',
    },
    revoked: {
      label: '已撤销',
      bgClass: 'bg-status-revoked-bg',
      textClass: 'text-status-revoked-text',
    },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`
      inline-block px-3 py-1 rounded-full text-xs font-medium
      ${config.bgClass} ${config.textClass}
    `}>
      {config.label}
    </span>
  )
}
