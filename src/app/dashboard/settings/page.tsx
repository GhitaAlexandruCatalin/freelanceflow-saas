import { createClient } from '@/utils/supabase/server'
import styles from './settings.module.css'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_name, business_email, business_phone, business_address, default_currency, default_tax_rate, payment_terms, default_language, smtp_email, smtp_password, plan_tier, subscription_status')
    .eq('id', user?.id)
    .single()

  return (
    <>
      <div className={styles.settingsHeader}>
        <h2 className={styles.settingsTitle}>Settings</h2>
        <p className={styles.settingsSubtitle}>Manage your business profile and email configuration</p>
      </div>

      <SettingsForm profile={profile || {
        full_name: null,
        business_name: null,
        business_email: null,
        business_phone: null,
        business_address: null,
        default_currency: 'USD',
        default_tax_rate: 0,
        payment_terms: null,
        default_language: 'en',
        smtp_email: null,
        smtp_password: null,
        plan_tier: 'free',
        subscription_status: null
      }} />
    </>
  )
}
