import { useEffect, useState } from 'react'
import { Activity, CloudOff, Sparkles } from 'lucide-react'
import { useI18n } from '../../localization'

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const startValue = displayValue
    const duration = 700
    const startedAt = performance.now()

    const animate = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = startValue + (value - startValue) * eased
      setDisplayValue(nextValue)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span>
      {prefix}
      {Number(displayValue).toFixed(decimals)}
      {suffix}
    </span>
  )
}

export function GlassPanel({ title, subtitle, action, className = '', children }) {
  return (
    <section className={`glass-panel ${className}`}>
      {(title || subtitle || action) ? (
        <div className="panel-heading">
          <div>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function MetricTile({ label, value, icon: Icon, tone = 'primary', note, mono = false }) {
  return (
    <div className={`metric-tile tone-${tone}`}>
      <div className="metric-tile__icon">
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong className={mono ? 'mono' : ''}>{value}</strong>
        {note ? <small>{note}</small> : null}
      </div>
    </div>
  )
}

export function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`status-pill tone-${tone}`}>{children}</span>
}

export function SyncIndicator({ isOnline, queueCount, isBusy }) {
  const { t } = useI18n()

  return (
    <div className={`sync-indicator ${isOnline ? 'is-online' : 'is-offline'}`}>
      <div className="sync-indicator__pulse" />
      {isOnline ? <Activity size={14} /> : <CloudOff size={14} />}
      <span>{isOnline ? t('offline.connected') : t('offline.offlineFirst')}</span>
      <strong>{t('common.labels.queuedCount', { count: queueCount }, `${queueCount} queued`)}</strong>
      {isBusy ? <Sparkles size={14} className="spin-lite" /> : null}
    </div>
  )
}

export function BottomNav({ items, activeId, onSelect }) {
  return (
    <nav className="floating-nav">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            type="button"
            className={`floating-nav__item ${activeId === item.id ? 'is-active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-state__orb" />
      <strong>{title}</strong>
      <p>{subtitle}</p>
    </div>
  )
}

export function LoadingScreen() {
  const { t } = useI18n()

  return (
    <div className="loading-screen">
      <div className="loading-screen__halo" />
      <div className="loading-card">
        <span className="loading-chip">{t('common.appName')}</span>
        <h1>{t('loading.title')}</h1>
        <p>{t('loading.subtitle')}</p>
      </div>
    </div>
  )
}
