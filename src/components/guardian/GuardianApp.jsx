import { useMemo, useState } from 'react'
import {
  BadgeIndianRupee,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  Flame,
  Leaf,
  MapPin,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  UploadCloud,
  UserRound,
  Wallet,
} from 'lucide-react'
import {
  formatTransactionDescription,
  getLocalizedActivityLabel,
  getLocalizedModule,
  getLocalizedStatus,
  getLocalizedSyncState,
  translateRuntimeMessage,
  useI18n,
} from '../../localization'
import { CameraCaptureSheet } from './CameraCaptureSheet'
import { LanguageSelector } from '../language/LanguageSelector'
import {
  AnimatedNumber,
  BottomNav,
  EmptyState,
  GlassPanel,
  MetricTile,
  StatusPill,
  SyncIndicator,
} from '../shared/Primitives'

function unlockModule(module, overview) {
  const approvedWork = overview.leaderboard.find((entry) => entry.userId === overview.user.id)?.approvedWork ?? 0
  return (
    overview.trustScore >= module.unlockRule.minTrustScore &&
    approvedWork >= module.unlockRule.minApprovedActivities
  )
}

function getStatusTone(status) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'warning'
}

export function GuardianApp({ platform, actions, error, isOnline, busyKey }) {
  const { getLanguageMeta, getMessage, language, setLanguage, t } = useI18n()
  const [activeTab, setActiveTab] = useState('home')
  const [captureSlot, setCaptureSlot] = useState(null)
  const [activityForm, setActivityForm] = useState({
    activityType: platform.content.activities[0]?.id ?? 'forest-patrol',
    notes: '',
    beforeImage: null,
    afterImage: null,
    gps: null,
  })
  const [goalDraft, setGoalDraft] = useState({
    title: platform.savingsGoals.find((goal) => goal.userId === platform.sessionUser.id)?.title ?? 'Emergency reserve',
    targetAmount:
      platform.savingsGoals.find((goal) => goal.userId === platform.sessionUser.id)?.targetAmount ?? 800,
  })
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})

  const user = platform.sessionUser
  const derived = platform.derived
  const currentLanguageMeta = getLanguageMeta(user.language || language)
  const localizedModules = useMemo(
    () => platform.content.modules.map((module) => getLocalizedModule(module, getMessage, t)),
    [getMessage, platform.content.modules, t],
  )
  const navItems = useMemo(
    () => [
      { id: 'home', label: t('common.nav.home'), icon: Leaf },
      { id: 'field', label: t('common.nav.field'), icon: Camera },
      { id: 'wallet', label: t('common.nav.wallet'), icon: Wallet },
      { id: 'learn', label: t('common.nav.learn'), icon: BookOpen },
      { id: 'profile', label: t('common.nav.profile'), icon: UserRound },
    ],
    [t],
  )
  const userActivities = useMemo(
    () => platform.activities.filter((activity) => activity.userId === user.id),
    [platform.activities, user.id],
  )
  const savingsGoal = platform.savingsGoals.find((goal) => goal.userId === user.id)
  const currentRank = derived.leaderboard.find((entry) => entry.userId === user.id)?.rank ?? '--'
  const completedModules = platform.moduleProgress.filter(
    (entry) => entry.userId === user.id && entry.completedAt,
  )
  const selectedModule = localizedModules.find((module) => module.id === selectedModuleId) ?? null
  const savingsProgress = Math.min(
    100,
    Math.round(((savingsGoal?.savedAmount ?? 0) / (savingsGoal?.targetAmount || 1)) * 100),
  )
  const captureDetails = {
    beforeImage: {
      buttonLabel: t('common.actions.captureBefore'),
      emptyLabel: t('uploads.beforeCaptureEmpty'),
      title: t('uploads.beforeCaptureTitle'),
    },
    afterImage: {
      buttonLabel: t('common.actions.captureAfter'),
      emptyLabel: t('uploads.afterCaptureEmpty'),
      title: t('uploads.afterCaptureTitle'),
    },
  }

  const applyLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    if (actions.updateLanguage) {
      void actions.updateLanguage(nextLanguage)
    }
  }

  async function captureLocation() {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setActivityForm((current) => ({
          ...current,
          gps: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
            lockedAt: new Date().toISOString(),
          },
        }))
      },
      () => {
        setActivityForm((current) => ({
          ...current,
          gps: {
            lat: 11.0168,
            lng: 76.9558,
            accuracy: 120,
            lockedAt: new Date().toISOString(),
          },
        }))
      },
      { enableHighAccuracy: true, timeout: 5000 },
    )
  }

  async function submitActivity(event) {
    event.preventDefault()
    await actions.createActivity({
      ...activityForm,
      region: user.region,
      village: user.village,
    })
    setActivityForm({
      activityType: platform.content.activities[0]?.id ?? 'forest-patrol',
      notes: '',
      beforeImage: null,
      afterImage: null,
      gps: null,
    })
    setActiveTab('home')
  }

  function assignCapture(slot, evidence) {
    setActivityForm((current) => ({
      ...current,
      [slot]: evidence,
    }))
  }

  const homeView = (
    <div className="screen-stack">
      <div className="guardian-hero">
        <div className="guardian-hero__copy">
          <StatusPill tone="primary">{user.region}</StatusPill>
          <h1>{t('dashboard.welcomeBack', { name: user.name.split(' ')[0] })}</h1>
          <p>{t('dashboard.heroDescription')}</p>
          <div className="guardian-hero__chips">
            <SyncIndicator isOnline={isOnline} queueCount={derived.queueCount} isBusy={busyKey === 'sync'} />
            <button type="button" className="ghost-button" onClick={() => actions.syncNow()}>
              <RefreshCw size={16} />
              {t('common.actions.syncQueue')}
            </button>
          </div>
        </div>
        <div className="guardian-hero__orb">
          <span>{t('dashboard.trustLabel')}</span>
          <strong>
            <AnimatedNumber value={derived.trustScore} />
          </strong>
          <small>{t('dashboard.trustSubtitle')}</small>
        </div>
      </div>

      <div className="metric-grid">
        <MetricTile
          label={t('dashboard.metrics.liveCredits')}
          value={<AnimatedNumber value={derived.wallet.availableBalance} />}
          icon={Coins}
          tone="primary"
        />
        <MetricTile
          label={t('dashboard.metrics.pendingRewards')}
          value={<AnimatedNumber value={derived.wallet.pendingBalance} />}
          icon={UploadCloud}
          tone="warning"
        />
        <MetricTile
          label={t('dashboard.metrics.rank')}
          value={`#${currentRank}`}
          icon={Flame}
          tone="secondary"
          note={t('common.labels.guardiansCount', { count: derived.leaderboard.length }, `${derived.leaderboard.length} guardians`)}
        />
        <MetricTile
          label={t('dashboard.metrics.verificationRate')}
          value={`${derived.verificationRate}%`}
          icon={Shield}
          tone="accent"
        />
      </div>

      <div className="dashboard-grid">
        <GlassPanel
          title={t('dashboard.fieldPulse.title')}
          subtitle={t('dashboard.fieldPulse.subtitle')}
          action={
            <StatusPill tone={derived.pendingUploads > 0 ? 'warning' : 'success'}>
              {t('common.labels.unsyncedCount', { count: derived.pendingUploads }, `${derived.pendingUploads} unsynced`)}
            </StatusPill>
          }
        >
          <div className="pulse-grid">
            <div className="pulse-card">
              <span>{t('dashboard.fieldPulse.queuedUploads')}</span>
              <strong>{derived.queueCount}</strong>
            </div>
            <div className="pulse-card">
              <span>{t('dashboard.fieldPulse.awaitingReview')}</span>
              <strong>{derived.pendingApprovals}</strong>
            </div>
            <div className="pulse-card">
              <span>{t('dashboard.fieldPulse.modulesCompleted')}</span>
              <strong>{completedModules.length}</strong>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel
          title={t('dashboard.leaderboard.title')}
          subtitle={t('dashboard.leaderboard.subtitle')}
          action={<StatusPill tone="secondary">{t('dashboard.leaderboard.badge')}</StatusPill>}
        >
          <div className="leaderboard-list">
            {derived.leaderboard.slice(0, 4).map((entry) => (
              <div key={entry.userId} className={`leaderboard-row ${entry.userId === user.id ? 'is-self' : ''}`}>
                <div>
                  <strong>#{entry.rank} {entry.name}</strong>
                  <span>{`${entry.village} · ${t('common.labels.approvedCount', { count: entry.approvedWork }, `${entry.approvedWork} approved`)}`}</span>
                </div>
                <span>{entry.credits} CC</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel
        title={t('dashboard.recentActivities.title')}
        subtitle={t('dashboard.recentActivities.subtitle')}
      >
        <div className="activity-list">
          {userActivities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="activity-row">
              <div className="activity-row__icon">
                <Compass size={16} />
              </div>
              <div>
                <strong>{getLocalizedActivityLabel(activity.activityType, t, activity.activityType)}</strong>
                <span>{new Date(activity.createdAt).toLocaleString(language)}</span>
              </div>
              <div className="activity-row__meta">
                <StatusPill tone={getStatusTone(activity.status)}>
                  {getLocalizedStatus(activity.status, t)}
                </StatusPill>
                <small>{getLocalizedSyncState(activity.syncState, t)}</small>
              </div>
            </div>
          ))}
          {userActivities.length === 0 ? (
            <EmptyState
              title={t('dashboard.recentActivities.emptyTitle')}
              subtitle={t('dashboard.recentActivities.emptySubtitle')}
            />
          ) : null}
        </div>
      </GlassPanel>
    </div>
  )

  const fieldView = (
    <div className="screen-stack">
      <GlassPanel
        title={t('uploads.title')}
        subtitle={t('uploads.subtitle')}
        action={
          <button type="button" className="ghost-button" onClick={captureLocation}>
            <MapPin size={16} />
            {t('common.actions.lockGps')}
          </button>
        }
      >
        <form className="activity-form" onSubmit={submitActivity}>
          <label>
            <span>{t('common.fields.activityType')}</span>
            <select
              value={activityForm.activityType}
              onChange={(event) => setActivityForm((current) => ({ ...current, activityType: event.target.value }))}
            >
              {platform.content.activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {getLocalizedActivityLabel(activity.id, t, activity.label)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t('common.fields.fieldNotes')}</span>
            <textarea
              rows="4"
              value={activityForm.notes}
              onChange={(event) => setActivityForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder={t('common.placeholders.fieldNotes')}
            />
          </label>
          <div className="upload-grid">
            {[
              ['beforeImage', t('common.fields.beforeEvidence')],
              ['afterImage', t('common.fields.afterEvidence')],
            ].map(([fieldName, fieldLabel]) => {
              const evidence = activityForm[fieldName]
              const details = captureDetails[fieldName]

              return (
                <div key={fieldName} className="upload-card capture-card">
                  <span>{fieldLabel}</span>
                  {evidence ? (
                    <div className="capture-card__preview">
                      <img src={evidence.dataUrl} alt={fieldLabel} />
                      <div className="capture-card__details">
                        <strong>{t('common.labels.cameraOnly')}</strong>
                        <small>
                          {t('common.labels.capturedAt', {
                            value: new Date(evidence.capturedAt).toLocaleString(language),
                          }, `Captured ${new Date(evidence.capturedAt).toLocaleString(language)}`)}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="capture-card__empty">
                      <Camera size={20} />
                      <strong>{details.emptyLabel}</strong>
                      <small>{t('uploads.cameraOnlyHint')}</small>
                    </div>
                  )}
                  <div className="inline-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setCaptureSlot(fieldName)}
                    >
                      <Camera size={16} />
                      {details.buttonLabel}
                    </button>
                    {evidence ? (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => assignCapture(fieldName, null)}
                      >
                        {t('common.actions.clearCapture')}
                      </button>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="gps-lock">
            <div className={`gps-lock__orb ${activityForm.gps ? 'is-locked' : ''}`} />
            <div>
              <strong>{activityForm.gps ? t('uploads.gpsLocked') : t('uploads.gpsWaiting')}</strong>
              <span>
                {activityForm.gps
                  ? t('common.labels.gpsAccuracy', {
                      accuracy: activityForm.gps.accuracy,
                      lat: activityForm.gps.lat.toFixed(4),
                      lng: activityForm.gps.lng.toFixed(4),
                    }, `Accuracy ${activityForm.gps.accuracy}m · ${activityForm.gps.lat.toFixed(4)}, ${activityForm.gps.lng.toFixed(4)}`)
                  : t('uploads.gpsHint')}
              </span>
            </div>
          </div>
          {error ? <div className="inline-alert">{translateRuntimeMessage(error, t)}</div> : null}
          <small>{t('uploads.captureRequirementHint')}</small>
          <button
            type="submit"
            className="primary-button"
            disabled={busyKey === 'create-activity' || !activityForm.beforeImage || !activityForm.afterImage}
          >
            <UploadCloud size={16} />
            {t('common.actions.saveUpload')}
          </button>
        </form>
      </GlassPanel>

      <CameraCaptureSheet
        captureLabel={
          captureSlot === 'afterImage'
            ? t('common.fields.afterEvidence')
            : t('common.fields.beforeEvidence')
        }
        isOpen={Boolean(captureSlot)}
        language={language}
        onCapture={(evidence) => {
          if (!captureSlot) {
            return
          }
          assignCapture(captureSlot, evidence)
        }}
        onClose={() => setCaptureSlot(null)}
        t={t}
        title={
          captureSlot === 'afterImage'
            ? captureDetails.afterImage.title
            : captureDetails.beforeImage.title
        }
      />

      <GlassPanel title={t('uploads.offlineQueueTitle')} subtitle={t('uploads.offlineQueueSubtitle')}>
        <div className="activity-list">
          {userActivities.filter((activity) => activity.syncState !== 'synced').map((activity) => (
            <div key={activity.id} className="activity-row">
              <div className="activity-row__icon">
                <UploadCloud size={16} />
              </div>
              <div>
                <strong>{getLocalizedActivityLabel(activity.activityType, t, activity.activityType)}</strong>
                <span>
                  {t('common.labels.retrySummary', {
                    state: getLocalizedSyncState(activity.syncState, t),
                    count: activity.retryCount,
                  }, `${activity.syncState} · ${activity.retryCount} retries`)}
                </span>
              </div>
              <StatusPill tone="warning">{getLocalizedStatus(activity.status, t)}</StatusPill>
            </div>
          ))}
          {userActivities.filter((activity) => activity.syncState !== 'synced').length === 0 ? (
            <EmptyState title={t('uploads.queueClearTitle')} subtitle={t('uploads.queueClearSubtitle')} />
          ) : null}
        </div>
      </GlassPanel>
    </div>
  )

  const walletView = (
    <div className="screen-stack">
      <div className="metric-grid">
        <MetricTile
          label={t('dashboard.metrics.available')}
          value={<AnimatedNumber value={derived.wallet.availableBalance} />}
          icon={Wallet}
          tone="primary"
        />
        <MetricTile
          label={t('dashboard.metrics.pending')}
          value={<AnimatedNumber value={derived.wallet.pendingBalance} />}
          icon={Sparkles}
          tone="warning"
        />
        <MetricTile
          label={t('dashboard.metrics.saved')}
          value={<AnimatedNumber value={derived.wallet.savingsBalance} />}
          icon={Target}
          tone="secondary"
        />
        <MetricTile
          label={t('dashboard.metrics.goalTarget')}
          value={goalDraft.targetAmount}
          icon={BadgeIndianRupee}
          tone="accent"
          mono
        />
      </div>

      <GlassPanel title={t('rewards.savingsTitle')} subtitle={t('rewards.savingsSubtitle')}>
        <div className="savings-headline">
          <div>
            <strong>{savingsGoal?.title}</strong>
            <span>{t('common.labels.savedProgress', {
              saved: savingsGoal?.savedAmount ?? 0,
              target: savingsGoal?.targetAmount ?? 0,
            }, `${savingsGoal?.savedAmount ?? 0} of ${savingsGoal?.targetAmount ?? 0} saved`)}</span>
          </div>
          <StatusPill tone="secondary">{savingsProgress}%</StatusPill>
        </div>
        <div className="savings-bar">
          <div style={{ width: `${savingsProgress}%` }} />
        </div>
        <div className="form-grid">
          <label>
            <span>{t('common.fields.goalTitle')}</span>
            <input
              type="text"
              value={goalDraft.title}
              onChange={(event) => setGoalDraft((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label>
            <span>{t('common.fields.goalTarget')}</span>
            <input
              type="number"
              value={goalDraft.targetAmount}
              onChange={(event) => setGoalDraft((current) => ({ ...current, targetAmount: event.target.value }))}
            />
          </label>
        </div>
        <div className="inline-actions">
          <button type="button" className="secondary-button" onClick={() => actions.updateSavingsGoal(goalDraft)}>
            {t('common.actions.updateGoal')}
          </button>
          <button type="button" className="primary-button" onClick={() => actions.moveToSavings(100)}>
            {t('common.actions.moveToSavings', { amount: 100 }, 'Move 100 to savings')}
          </button>
        </div>
      </GlassPanel>

      <GlassPanel title={t('rewards.ledgerTitle')} subtitle={t('rewards.ledgerSubtitle')}>
        <div className="ledger-list">
          {derived.wallet.ledger.map((entry) => (
            <div key={entry.id} className="ledger-row">
              <div>
                <strong>{formatTransactionDescription(entry, localizedModules, platform.activities, t)}</strong>
                <span>{new Date(entry.createdAt).toLocaleString(language)}</span>
              </div>
              <div className={`ledger-row__amount ${entry.amount >= 0 ? 'is-positive' : 'is-negative'}`}>
                {entry.amount >= 0 ? '+' : ''}
                {entry.amount}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )

  const learnView = (
    <div className="screen-stack">
      {selectedModule ? (
        <GlassPanel
          title={selectedModule.title}
          subtitle={selectedModule.category}
          action={
            <button type="button" className="ghost-button" onClick={() => setSelectedModuleId(null)}>
              {t('common.actions.close')}
            </button>
          }
        >
          <div className="lesson-flow">
            {selectedModule.lessons.map((lesson, lessonIndex) => (
              <button
                key={`${selectedModule.id}-${lessonIndex}`}
                type="button"
                className="lesson-card"
                onClick={() =>
                  actions.saveModuleProgress(selectedModule.id, {
                    currentLessonIndex: lessonIndex,
                    audioProgress: Math.round(((lessonIndex + 1) / selectedModule.lessons.length) * 100),
                  })
                }
              >
                <span>{t('common.labels.lesson', { index: lessonIndex + 1 }, `Lesson ${lessonIndex + 1}`)}</span>
                <strong>{lesson}</strong>
              </button>
            ))}
            <div className="quiz-stack">
              {selectedModule.quiz.map((question, index) => (
                <div key={`${selectedModule.id}-${question.prompt}`} className="quiz-card">
                  <strong>{question.prompt}</strong>
                  <div className="quiz-options">
                    {question.answers.map((answer, answerIndex) => (
                      <button
                        key={answer}
                        type="button"
                        className={quizAnswers[`${selectedModule.id}-${index}`] === answerIndex ? 'is-active' : ''}
                        onClick={() =>
                          setQuizAnswers((current) => ({
                            ...current,
                            [`${selectedModule.id}-${index}`]: answerIndex,
                          }))
                        }
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                const correct = selectedModule.quiz.filter(
                  (question, index) => quizAnswers[`${selectedModule.id}-${index}`] === question.correctIndex,
                ).length
                const score = Math.round((correct / selectedModule.quiz.length) * 100)
                actions.completeModuleQuiz(selectedModule.id, score)
              }}
            >
              <CheckCircle2 size={16} />
              {t('common.actions.saveQuizProgress')}
            </button>
          </div>
        </GlassPanel>
      ) : null}

      <GlassPanel title={t('literacy.journeyTitle')} subtitle={t('literacy.journeySubtitle')}>
        <div className="module-grid">
          {localizedModules.map((module) => {
            const progress = platform.moduleProgress.find(
              (entry) => entry.userId === user.id && entry.moduleId === module.id,
            )
            const unlocked = unlockModule(module, { ...derived, user })
            return (
              <button
                key={module.id}
                type="button"
                className={`module-card accent-${module.accent} ${!unlocked ? 'is-locked' : ''}`}
                onClick={() => unlocked && setSelectedModuleId(module.id)}
              >
                <div className="module-card__header">
                  <StatusPill tone={progress?.completedAt ? 'success' : unlocked ? 'secondary' : 'neutral'}>
                    {progress?.completedAt ? t('literacy.completed') : unlocked ? t('literacy.unlocked') : t('literacy.locked')}
                  </StatusPill>
                  <span>{t('common.labels.minutesShort', { count: module.durationMinutes }, `${module.durationMinutes} min`)}</span>
                </div>
                <strong>{module.title}</strong>
                <p>{module.category}</p>
                <div className="module-card__footer">
                  <span>{t('common.labels.rewardUnit', { count: module.reward }, `${module.reward} CC reward`)}</span>
                  <ChevronRight size={16} />
                </div>
                <small>
                  {unlocked
                    ? t('common.labels.audioProgress', {
                        audio: progress?.audioProgress ?? 0,
                        quiz: progress?.quizScore ?? 0,
                      }, `${progress?.audioProgress ?? 0}% audio progress · best quiz ${progress?.quizScore ?? 0}%`)
                    : t('common.labels.unlockRule', {
                        approvals: module.unlockRule.minApprovedActivities,
                        trust: module.unlockRule.minTrustScore,
                      }, `Unlocks at ${module.unlockRule.minApprovedActivities} approvals and trust ${module.unlockRule.minTrustScore}+`)}
                </small>
              </button>
            )
          })}
        </div>
      </GlassPanel>
    </div>
  )

  const profileView = (
    <div className="screen-stack">
      <GlassPanel title={t('settings.profile.title')} subtitle={t('settings.profile.subtitle')}>
        <div className="profile-card">
          <div className="profile-card__identity">
            {user.profileImage ? <img src={user.profileImage} alt={user.name} /> : <div className="profile-avatar">{user.name.charAt(0)}</div>}
            <div>
              <strong>{user.name}</strong>
              <span>{user.phone}</span>
              <span>{`${user.village} · ${user.region}`}</span>
            </div>
          </div>
          <div className="profile-card__stats">
            <div>
              <span>{t('common.fields.role')}</span>
              <strong>{t(`common.roles.${user.role}`, {}, user.role)}</strong>
            </div>
            <div>
              <span>{t('common.fields.language')}</span>
              <strong>{currentLanguageMeta.nativeName}</strong>
            </div>
            <div>
              <span>{t('common.fields.community')}</span>
              <strong>{user.community}</strong>
            </div>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel title={t('settings.language.title')} subtitle={t('settings.language.subtitle')}>
        <LanguageSelector value={language} onChange={applyLanguage} />
      </GlassPanel>

      <GlassPanel title={t('settings.profile.trustTitle')} subtitle={t('settings.profile.trustSubtitle')}>
        <div className="metric-grid">
          <MetricTile label={t('dashboard.metrics.trustScore')} value={derived.trustScore} icon={Shield} tone="primary" />
          <MetricTile
            label={t('dashboard.metrics.completedModules')}
            value={completedModules.length}
            icon={BookOpen}
            tone="secondary"
          />
          <MetricTile label={t('dashboard.metrics.queuedUploads')} value={derived.queueCount} icon={UploadCloud} tone="warning" />
          <MetricTile label={t('dashboard.metrics.currentRank')} value={`#${currentRank}`} icon={Flame} tone="accent" />
        </div>
        <button type="button" className="secondary-button" onClick={() => actions.logout()}>
          {t('common.actions.signOut')}
        </button>
      </GlassPanel>
    </div>
  )

  return (
    <div className="mobile-shell">
      <header className="top-bar">
        <div>
          <span className="eyebrow">{t('dashboard.eyebrow')}</span>
          <strong>{user.organization}</strong>
        </div>
        <SyncIndicator isOnline={isOnline} queueCount={derived.queueCount} isBusy={busyKey === 'sync'} />
      </header>

      {activeTab === 'home' ? homeView : null}
      {activeTab === 'field' ? fieldView : null}
      {activeTab === 'wallet' ? walletView : null}
      {activeTab === 'learn' ? learnView : null}
      {activeTab === 'profile' ? profileView : null}

      <BottomNav items={navItems} activeId={activeTab} onSelect={setActiveTab} />
    </div>
  )
}
