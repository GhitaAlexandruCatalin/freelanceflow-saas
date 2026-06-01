'use client'

import { useState, useTransition } from 'react'
import { Building2, Mail, DollarSign, Check, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateBusinessSettings, updateEmailSettings } from './actions'
import styles from './settings.module.css'

type Profile = {
  full_name: string | null
  business_name: string | null
  business_email: string | null
  business_phone: string | null
  business_address: string | null
  default_currency: string | null
  default_tax_rate: number | null
  payment_terms: string | null
  default_language: string | null
  smtp_email: string | null
  smtp_password: string | null
  plan_tier?: string
  subscription_status?: string | null
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const t = useTranslations('Settings')
  const [isPending, startTransition] = useTransition()
  const [businessSaved, setBusinessSaved] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleBusinessSubmit = (formData: FormData) => {
    setError(null)
    setBusinessSaved(false)
    startTransition(async () => {
      const result = await updateBusinessSettings(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setBusinessSaved(true)
        setTimeout(() => setBusinessSaved(false), 3000)
      }
    })
  }

  const handleEmailSubmit = (formData: FormData) => {
    setError(null)
    setEmailSaved(false)
    startTransition(async () => {
      const result = await updateEmailSettings(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setEmailSaved(true)
        setTimeout(() => setEmailSaved(false), 3000)
      }
    })
  }

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'placeholder' })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Checkout failed. Please try again.')
    }
  }

  return (
    <div className={styles.settingsGrid}>
      {error && (
        <div style={{ padding: '12px', background: 'rgba(245,87,108,0.1)', color: '#ff8a98', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid rgba(245,87,108,0.3)' }}>
          {error}
        </div>
      )}

      {/* Business Information */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.purple}`}>
            <Building2 size={18} />
          </div>
          <div>
            <div className={styles.cardTitle}>{t('businessInfo')}</div>
            <div className={styles.cardDesc}>{t('subtitle')}</div>
          </div>
        </div>

        <form action={handleBusinessSubmit}>
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="business_name">Business Name</label>
                <input type="text" id="business_name" name="business_name" className={styles.formInput} defaultValue={profile.business_name || ''} placeholder="Acme Studio" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="business_email">Business Email</label>
                <input type="email" id="business_email" name="business_email" className={styles.formInput} defaultValue={profile.business_email || ''} placeholder="hello@acme.com" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="business_phone">Phone</label>
                <input type="text" id="business_phone" name="business_phone" className={styles.formInput} defaultValue={profile.business_phone || ''} placeholder="+40 712 345 678" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="default_currency">Default Currency</label>
                <select 
                  id="default_currency" 
                  name="default_currency" 
                  className={styles.formSelect} 
                  key={profile.default_currency || 'USD'}
                  defaultValue={profile.default_currency || 'USD'}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="RON">RON (lei)</option>
                </select>
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="business_address">Business Address</label>
                <input type="text" id="business_address" name="business_address" className={styles.formInput} defaultValue={profile.business_address || ''} placeholder="123 Main Street, Bucharest, Romania" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="default_tax_rate">Default Tax Rate (%)</label>
                <input type="number" id="default_tax_rate" name="default_tax_rate" className={styles.formInput} min="0" max="100" step="0.1" defaultValue={profile.default_tax_rate || 0} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="payment_terms">Default Payment Terms</label>
                <input type="text" id="payment_terms" name="payment_terms" className={styles.formInput} defaultValue={profile.payment_terms || ''} placeholder="Net 14 days" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="default_language">{t('uiLanguage')}</label>
                <select 
                  id="default_language" 
                  name="default_language" 
                  className={styles.formSelect} 
                  key={profile.default_language || 'en'}
                  defaultValue={profile.default_language || 'en'}
                >
                  <option value="en">English</option>
                  <option value="ro">Romanian</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="it">Italian</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            {businessSaved && (
              <span className={styles.successBanner} style={{ margin: 0, marginRight: 'auto' }}>
                <Check size={16} /> Settings saved!
              </span>
            )}
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Email Configuration */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.green}`}>
            <Mail size={18} />
          </div>
          <div>
            <div className={styles.cardTitle}>{t('emailSending')}</div>
            <div className={styles.cardDesc}>Configure which email address sends your follow-ups</div>
          </div>
        </div>

        <form action={handleEmailSubmit}>
          <div className={styles.cardBody}>
            <div style={{ padding: '12px 16px', background: 'rgba(102, 126, 234, 0.06)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>How it works:</strong> Enter your Gmail address and an App Password. Follow-up emails will be sent directly from your email address.
              <br/>
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                Generate App Password <ExternalLink size={12} />
              </a>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="smtp_email">Gmail Address</label>
                <input type="email" id="smtp_email" name="smtp_email" className={styles.formInput} defaultValue={profile.smtp_email || ''} placeholder="you@gmail.com" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="smtp_password">App Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="smtp_password" 
                    name="smtp_password" 
                    className={styles.formInput} 
                    placeholder={profile.smtp_password ? '••••••••••••••••' : 'xxxx xxxx xxxx xxxx'}
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <span className={styles.formHint}>Leave blank to keep current password</span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            {emailSaved && (
              <span className={styles.successBanner} style={{ margin: 0, marginRight: 'auto' }}>
                <Check size={16} /> Email settings saved!
              </span>
            )}
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Email Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Subscription Management */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.purple}`}>
            <DollarSign size={18} />
          </div>
          <div>
            <div className={styles.cardTitle}>Subscription & Billing</div>
            <div className={styles.cardDesc}>Manage your current plan and limits</div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px', textTransform: 'capitalize' }}>
                {profile.plan_tier === 'pro' ? 'Professional Plan' : 'Free Starter Plan'}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {profile.plan_tier === 'pro' 
                  ? `Status: ${profile.subscription_status || 'Active'}` 
                  : 'Limited to 5 invoices/mo and no AI automation.'}
              </div>
            </div>
            
            {profile.plan_tier === 'free' ? (
              <button onClick={handleCheckout} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Upgrade to Pro
              </button>
            ) : (
              <span style={{ padding: '6px 12px', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--accent-green)', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600 }}>
                ✓ Active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
