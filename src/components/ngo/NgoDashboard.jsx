import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  FileStack,
  Filter,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react'
import {
  getLocalizedActivityLabel,
  getLocalizedStatus,
  getLocalizedSyncState,
  useI18n,
} from '../../localization'
import { LanguageSelector } from '../language/LanguageSelector'
import { EmptyState, GlassPanel, MetricTile, StatusPill, SyncIndicator } from '../shared/Primitives'

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((cell) => `"${`${cell ?? ''}`.replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

function getStatusTone(status) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'warning'
}

function getEvidenceSource(evidence) {
  return evidence?.remoteUrl || evidence?.dataUrl || ''
}

export function NgoDashboard({ platform, actions, isOnline, busyKey }) {
  const { language, setLanguage, t } = useI18n()
  const [activeTab, setActiveTab] = useState('queue')
  const [noteDrafts, setNoteDrafts] = useState({})
  const [regionFilter, setRegionFilter] = useState('all')

  const adminTabs = useMemo(
    () => [
      { id: 'queue', label: t('ngo.tabs.queue') },
      { id: 'guardians', label: t('ngo.tabs.guardians') },
      { id: 'exports', label: t('ngo.tabs.exports') },
    ],
    [t],
  )
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(platform.users.filter((user) => user.role === 'guardian').map((user) => user.region))]
    return [{ id: 'all', label: t('common.labels.all') }, ...uniqueRegions.map((region) => ({ id: region, label: region }))]
  }, [platform.users, t])
  const guardians = platform.derived.guardians.filter((guardian) => regionFilter === 'all' || guardian.region === regionFilter)
  const queue = platform.derived.queue.filter((activity) => regionFilter === 'all' || activity.region === regionFilter)

  const queueRows = queue.map((activity) => {
    const guardian = platform.users.find((user) => user.id === activity.userId)
    return { activity, guardian }
  })

  const exportRows = [
    [
      t('ngo.metrics.guardians'),
      t('common.fields.region'),
      t('dashboard.metrics.trustScore'),
      t('dashboard.metrics.verificationRate'),
      t('dashboard.metrics.available'),
    ],
    ...guardians.map((guardian) => [
      guardian.name,
      guardian.region,
      guardian.trustScore,
      guardian.verificationRate,
      guardian.walletBalance,
    ]),
  ]

  const applyLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    if (actions.updateLanguage) {
      void actions.updateLanguage(nextLanguage)
    }
  }

  return (
    <div className="mobile-shell admin-shell">
      <header className="top-bar">
        <div>
          <span className="eyebrow">{t('ngo.eyebrow')}</span>
          <strong>{platform.sessionUser.organization}</strong>
        </div>
        <SyncIndicator isOnline={isOnline} queueCount={platform.queue.length} isBusy={busyKey === 'review'} />
      </header>

      <div className="admin-tabs">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? 'is-active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="metric-grid">
        <MetricTile label={t('ngo.metrics.guardians')} value={guardians.length} icon={Users} tone="primary" />
        <MetricTile label={t('ngo.metrics.flagged')} value={platform.derived.flaggedCount} icon={AlertTriangle} tone="warning" />
        <MetricTile label={t('ngo.metrics.approved')} value={platform.derived.approvedCount} icon={CheckCircle2} tone="secondary" />
        <MetricTile label={t('ngo.metrics.liveQueue')} value={queue.length} icon={FileStack} tone="accent" />
      </div>

      <GlassPanel
        title={t('ngo.regionFilter.title')}
        subtitle={t('ngo.regionFilter.subtitle')}
        action={<Filter size={16} />}
      >
        <div className="filter-row">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className={`filter-chip ${region.id === regionFilter ? 'is-active' : ''}`}
              onClick={() => setRegionFilter(region.id)}
            >
              {region.label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel title={t('settings.language.title')} subtitle={t('settings.language.subtitle')}>
        <LanguageSelector value={language} onChange={applyLanguage} />
      </GlassPanel>

      {activeTab === 'queue' ? (
        <GlassPanel title={t('ngo.queue.title')} subtitle={t('ngo.queue.subtitle')}>
          <div className="queue-stack">
            {queueRows.map(({ activity, guardian }) => (
              <div key={activity.id} className="queue-card">
                <div className="queue-card__header">
                  <div>
                    <strong>{guardian?.name}</strong>
                    <span>{`${guardian?.village} · ${getLocalizedActivityLabel(activity.activityType, t, activity.activityType)}`}</span>
                  </div>
                  <StatusPill tone={getStatusTone(activity.status)}>
                    {getLocalizedStatus(activity.status, t)}
                  </StatusPill>
                </div>
                <p>{activity.notes || t('ngo.queue.noNotes')}</p>
                {(activity.beforeEvidence || activity.afterEvidence) ? (
                  <div className="queue-evidence-grid">
                    {[
                      ['beforeEvidence', t('common.fields.beforeEvidence')],
                      ['afterEvidence', t('common.fields.afterEvidence')],
                    ].map(([fieldName, label]) => {
                      const evidence = activity[fieldName]

                      if (!evidence) {
                        return (
                          <div key={fieldName} className="queue-evidence-card is-missing">
                            <span>{label}</span>
                            <strong>{t('ngo.queue.noEvidenceCaptured')}</strong>
                          </div>
                        )
                      }

                      return (
                        <div key={fieldName} className="queue-evidence-card">
                          <img src={getEvidenceSource(evidence)} alt={label} className="queue-evidence-card__image" />
                          <div className="queue-evidence-card__meta">
                            <span>{label}</span>
                            <strong>
                              {t('common.labels.capturedAt', {
                                value: evidence.capturedAt
                                  ? new Date(evidence.capturedAt).toLocaleString(language)
                                  : t('common.labels.notAvailable'),
                              }, `Captured ${evidence.capturedAt ? new Date(evidence.capturedAt).toLocaleString(language) : 'NA'}`)}
                            </strong>
                            <small>{t('ngo.queue.captureSource', { source: evidence.source || 'unknown' }, `Source: ${evidence.source || 'unknown'}`)}</small>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                <div className="queue-card__facts">
                  <span>{t('ngo.queue.rewardEstimate', { amount: activity.rewardEstimate }, `Reward estimate: ${activity.rewardEstimate} CC`)}</span>
                  <span>{t('ngo.queue.gpsAccuracy', { accuracy: activity.gps?.accuracy ?? t('common.labels.notAvailable', {}, 'NA') }, `GPS accuracy: ${activity.gps?.accuracy ?? 'NA'}m`)}</span>
                  <span>{t('ngo.queue.sync', { state: getLocalizedSyncState(activity.syncState, t) }, `Sync: ${activity.syncState}`)}</span>
                </div>
                <textarea
                  rows="3"
                  value={noteDrafts[activity.id] ?? activity.reviewerNote ?? ''}
                  onChange={(event) =>
                    setNoteDrafts((current) => ({
                      ...current,
                      [activity.id]: event.target.value,
                    }))
                  }
                  placeholder={t('common.placeholders.verificationNote')}
                />
                <div className="inline-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => actions.reviewActivity(activity.id, 'approved', noteDrafts[activity.id] ?? '')}
                  >
                    <CheckCircle2 size={16} />
                    {t('common.actions.approve')}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => actions.reviewActivity(activity.id, 'manual_review', noteDrafts[activity.id] ?? '')}
                  >
                    <Shield size={16} />
                    {t('common.actions.manualReview')}
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => actions.reviewActivity(activity.id, 'rejected', noteDrafts[activity.id] ?? '')}
                  >
                    <XCircle size={16} />
                    {t('common.actions.reject')}
                  </button>
                </div>
              </div>
            ))}
            {queueRows.length === 0 ? (
              <EmptyState title={t('ngo.queue.emptyTitle')} subtitle={t('ngo.queue.emptySubtitle')} />
            ) : null}
          </div>
        </GlassPanel>
      ) : null}

      {activeTab === 'guardians' ? (
        <>
          <GlassPanel title={t('ngo.guardianAnalytics.title')} subtitle={t('ngo.guardianAnalytics.subtitle')}>
            <div className="guardian-analytics-list">
              {guardians.map((guardian) => (
                <div key={guardian.id} className="guardian-analytics-row">
                  <div>
                    <strong>{guardian.name}</strong>
                    <span>{`${guardian.village} · ${guardian.region}`}</span>
                  </div>
                  <div className="guardian-analytics-row__stats">
                    <span>{t('ngo.guardianAnalytics.trust', { value: guardian.trustScore }, `Trust ${guardian.trustScore}`)}</span>
                    <span>{t('ngo.guardianAnalytics.verify', { value: guardian.verificationRate }, `Verify ${guardian.verificationRate}%`)}</span>
                    <span>{t('ngo.guardianAnalytics.wallet', { value: guardian.walletBalance }, `Wallet ${guardian.walletBalance} CC`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title={t('ngo.regionalLeaderboard.title')} subtitle={t('ngo.regionalLeaderboard.subtitle')}>
            <div className="leaderboard-list">
              {platform.derived.leaderboard
                .filter((entry) => regionFilter === 'all' || entry.region === regionFilter)
                .map((entry) => (
                  <div key={entry.userId} className="leaderboard-row">
                    <div>
                      <strong>#{entry.rank} {entry.name}</strong>
                      <span>{`${entry.region} · ${t('ngo.guardianAnalytics.trust', { value: entry.trustScore }, `trust ${entry.trustScore}`)}`}</span>
                    </div>
                    <span>{entry.credits} CC</span>
                  </div>
                ))}
            </div>
          </GlassPanel>
        </>
      ) : null}

      {activeTab === 'exports' ? (
        <GlassPanel title={t('ngo.exports.title')} subtitle={t('ngo.exports.subtitle')}>
          <div className="export-actions">
            <button type="button" className="primary-button" onClick={() => downloadCsv('guardian-analytics.csv', exportRows)}>
              <Download size={16} />
              {t('ngo.exports.guardianCsv')}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                downloadCsv('activity-queue.csv', [
                  [
                    t('ngo.metrics.guardians'),
                    t('common.fields.activityType'),
                    t('common.fields.region'),
                    t('common.status.pending'),
                    t('dashboard.metrics.pendingRewards'),
                    t('offline.connected'),
                  ],
                  ...queueRows.map(({ guardian, activity }) => [
                    guardian?.name,
                    getLocalizedActivityLabel(activity.activityType, t, activity.activityType),
                    activity.region,
                    getLocalizedStatus(activity.status, t),
                    activity.rewardEstimate,
                    getLocalizedSyncState(activity.syncState, t),
                  ]),
                ])
              }
            >
              <BarChart3 size={16} />
              {t('ngo.exports.queueCsv')}
            </button>
          </div>
          <div className="export-notes">
            <div>
              <Sparkles size={16} />
              <span>{t('ngo.exports.note')}</span>
            </div>
          </div>
        </GlassPanel>
      ) : null}
    </div>
  )
}
