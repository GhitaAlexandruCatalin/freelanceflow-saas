'use client'

import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

export default function LanguageSwitcher({ currentLocale = 'en' }: { currentLocale?: string }) {
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div style={{ marginTop: 'auto', marginBottom: '20px', padding: '0 24px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <Globe size={14} /> UI Language
      </label>
      <select 
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
        }}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code} style={{ background: '#1e1e2e', color: '#fff' }}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
