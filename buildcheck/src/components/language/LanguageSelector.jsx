import { CheckCircle2, Languages } from 'lucide-react'
import { useI18n } from '../../localization'

export function LanguageSelector({
  className = '',
  subtitle = '',
  title = '',
  value,
  onChange,
}) {
  const { languages, t } = useI18n()

  return (
    <div className={`language-selector ${className}`.trim()}>
      {title || subtitle ? (
        <div className="language-selector__heading">
          <div className="language-selector__heading-icon">
            <Languages size={16} />
          </div>
          <div>
            {title ? <strong>{title}</strong> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="language-selector__list" role="radiogroup" aria-label={t('settings.language.title')}>
        {languages.map((language) => {
          const selected = language.code === value

          return (
            <button
              key={language.code}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${language.nativeName} (${language.englishName})`}
              className={`language-row ${selected ? 'is-active' : ''}`}
              lang={language.code}
              dir={language.dir}
              onClick={() => onChange(language.code)}
            >
              <div className="language-row__copy">
                <strong>{language.nativeName}</strong>
                <span>{language.englishName}</span>
              </div>
              <div className="language-row__meta">
                <span>{language.code.toUpperCase()}</span>
                {selected ? <CheckCircle2 size={18} /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
