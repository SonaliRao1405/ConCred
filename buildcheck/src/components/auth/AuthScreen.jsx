import { useMemo, useState } from 'react'
import { LockKeyhole, Phone, Shield, Sprout, UserRound } from 'lucide-react'
import { useI18n, translateRuntimeMessage } from '../../localization'
import { LanguageSelector } from '../language/LanguageSelector'
import { GlassPanel, StatusPill } from '../shared/Primitives'

const initialSignupState = {
  role: 'guardian',
  name: '',
  phone: '',
  pin: '',
  language: 'en',
  village: '',
  community: '',
  region: '',
  organization: '',
  adminId: '',
  profileImage: null,
}

const initialLoginState = {
  phone: '',
  pin: '',
}

export function AuthScreen({ actions, busyKey, error }) {
  const { language, t, setLanguage } = useI18n()
  const [mode, setMode] = useState('login')
  const [signupForm, setSignupForm] = useState(() => ({ ...initialSignupState, language }))
  const [loginForm, setLoginForm] = useState(initialLoginState)

  const submitting = useMemo(() => busyKey === 'login' || busyKey === 'signup', [busyKey])

  const applyLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    setSignupForm((current) => ({ ...current, language: nextLanguage }))
  }

  const submitSignup = async (event) => {
    event.preventDefault()
    await actions.signup({ ...signupForm, language: signupForm.language || language })
  }

  const submitLogin = async (event) => {
    event.preventDefault()
    await actions.login(loginForm)
  }

  return (
    <div className="auth-shell">
      <div className="forest-particles" />
      <div className="auth-layout">
        <div className="auth-hero">
          <StatusPill tone="primary">{t('onboarding.heroPill')}</StatusPill>
          <h1>{t('common.appName')}</h1>
          <p>{t('onboarding.heroDescription')}</p>
          <div className="auth-hero__features">
            <div>
              <Shield size={18} />
              <span>{t('onboarding.features.trust')}</span>
            </div>
            <div>
              <Sprout size={18} />
              <span>{t('onboarding.features.rewards')}</span>
            </div>
            <div>
              <Phone size={18} />
              <span>{t('onboarding.features.sync')}</span>
            </div>
          </div>
        </div>

        <GlassPanel className="auth-panel">
          <LanguageSelector
            title={t('onboarding.languageTitle')}
            subtitle={t('onboarding.languageSubtitle')}
            value={language}
            onChange={applyLanguage}
          />

          <div className="auth-tabs">
            <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>
              {t('common.actions.login')}
            </button>
            <button type="button" className={mode === 'signup' ? 'is-active' : ''} onClick={() => setMode('signup')}>
              {t('common.actions.createAccount')}
            </button>
          </div>

          {error ? <div className="inline-alert">{translateRuntimeMessage(error, t)}</div> : null}

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={submitLogin}>
              <label>
                <span>{t('common.fields.phoneNumber')}</span>
                <input
                  type="tel"
                  value={loginForm.phone}
                  onChange={(event) => setLoginForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder={t('common.placeholders.phone')}
                />
              </label>
              <label>
                <span>{t('common.fields.passcode')}</span>
                <input
                  type="password"
                  value={loginForm.pin}
                  onChange={(event) => setLoginForm((current) => ({ ...current, pin: event.target.value }))}
                  placeholder={t('common.placeholders.loginPasscode')}
                />
              </label>
              <button type="submit" className="primary-button" disabled={submitting}>
                <LockKeyhole size={16} />
                {t('common.actions.enterWorkspace')}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={submitSignup}>
              <div className="segmented-role">
                <button
                  type="button"
                  className={signupForm.role === 'guardian' ? 'is-active' : ''}
                  onClick={() => setSignupForm((current) => ({ ...current, role: 'guardian' }))}
                >
                  {t('common.roles.guardian')}
                </button>
                <button
                  type="button"
                  className={signupForm.role === 'ngo_admin' ? 'is-active' : ''}
                  onClick={() => setSignupForm((current) => ({ ...current, role: 'ngo_admin' }))}
                >
                  {t('common.roles.ngo_admin')}
                </button>
              </div>

              <div className="auth-grid">
                <label>
                  <span>{t('common.fields.fullName')}</span>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(event) => setSignupForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder={t('common.placeholders.fullName')}
                  />
                </label>
                <label>
                  <span>{t('common.fields.phoneNumber')}</span>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(event) => setSignupForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder={t('common.placeholders.phone')}
                  />
                </label>
              </div>

              <label>
                <span>{t('common.fields.passcode')}</span>
                <input
                  type="password"
                  value={signupForm.pin}
                  onChange={(event) => setSignupForm((current) => ({ ...current, pin: event.target.value }))}
                  placeholder={t('common.placeholders.signupPasscode')}
                />
              </label>

              {signupForm.role === 'guardian' ? (
                <>
                  <div className="auth-grid">
                    <label>
                      <span>{t('common.fields.village')}</span>
                      <input
                        type="text"
                        value={signupForm.village}
                        onChange={(event) => setSignupForm((current) => ({ ...current, village: event.target.value }))}
                        placeholder={t('common.placeholders.village')}
                      />
                    </label>
                    <label>
                      <span>{t('common.fields.community')}</span>
                      <input
                        type="text"
                        value={signupForm.community}
                        onChange={(event) => setSignupForm((current) => ({ ...current, community: event.target.value }))}
                        placeholder={t('common.placeholders.community')}
                      />
                    </label>
                  </div>
                  <label>
                    <span>{t('common.fields.region')}</span>
                    <input
                      type="text"
                      value={signupForm.region}
                      onChange={(event) => setSignupForm((current) => ({ ...current, region: event.target.value }))}
                      placeholder={t('common.placeholders.guardianRegion')}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="auth-grid">
                    <label>
                      <span>{t('common.fields.organization')}</span>
                      <input
                        type="text"
                        value={signupForm.organization}
                        onChange={(event) => setSignupForm((current) => ({ ...current, organization: event.target.value }))}
                        placeholder={t('common.placeholders.organization')}
                      />
                    </label>
                    <label>
                      <span>{t('common.fields.region')}</span>
                      <input
                        type="text"
                        value={signupForm.region}
                        onChange={(event) => setSignupForm((current) => ({ ...current, region: event.target.value }))}
                        placeholder={t('common.placeholders.ngoRegion')}
                      />
                    </label>
                  </div>
                  <label>
                    <span>{t('common.fields.adminId')}</span>
                    <input
                      type="text"
                      value={signupForm.adminId}
                      onChange={(event) => setSignupForm((current) => ({ ...current, adminId: event.target.value }))}
                      placeholder={t('common.placeholders.adminId')}
                    />
                  </label>
                </>
              )}

              <label>
                <span>{t('common.fields.profileImage')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      profileImage: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>

              <button type="submit" className="primary-button" disabled={submitting}>
                <UserRound size={16} />
                {t('common.actions.createWorkspace')}
              </button>
            </form>
          )}
        </GlassPanel>
      </div>
    </div>
  )
}
