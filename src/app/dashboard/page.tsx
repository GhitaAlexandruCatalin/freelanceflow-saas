import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { DollarSign, Clock, CheckCircle2, Users, Plus, FileText } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import styles from './page.module.css'

export default async function DashboardHome() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const t = await getTranslations({ locale, namespace: 'Dashboard' })
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch client count
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  // Fetch invoices for stats
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user?.id)

  const now = new Date()
  
  let outstanding = 0
  let overdue = 0
  let paidThisMonth = 0

  if (invoices) {
    invoices.forEach(inv => {
      if (inv.status === 'sent') {
        outstanding += inv.total
        if (new Date(inv.due_date) < now) {
          overdue += inv.total
        }
      } else if (inv.status === 'paid') {
        const paidDate = new Date(inv.paid_at || inv.created_at)
        if (paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()) {
          paidThisMonth += inv.total
        }
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.welcomeText}>{t('overview')}</h2>
        <p className={styles.subtitle}>Here is what is happening with your freelance business today.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.yellow}`}>
              <Clock size={18} />
            </div>
            {t('outstanding')}
          </div>
          <div className={styles.statValue}>{formatCurrency(outstanding)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.red}`}>
              <DollarSign size={18} />
            </div>
            {t('overdue')}
          </div>
          <div className={styles.statValue}>{formatCurrency(overdue)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <CheckCircle2 size={18} />
            </div>
            {t('totalRevenue')}
          </div>
          <div className={styles.statValue}>{formatCurrency(paidThisMonth)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <Users size={18} />
            </div>
            Total Clients
          </div>
          <div className={styles.statValue}>{clientCount || 0}</div>
        </div>
      </div>

      {clientCount === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Users size={32} />
          </div>
          <h3 className={styles.emptyTitle}>No clients yet</h3>
          <p className={styles.emptyDesc}>
            To start generating invoices and automating follow-ups, you first need to add a client to your database.
          </p>
          <Link href="/dashboard/clients" className="btn btn-primary">
            <Plus size={18} />
            Add Your First Client
          </Link>
        </div>
      ) : (!invoices || invoices.length === 0) ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={32} />
          </div>
          <h3 className={styles.emptyTitle}>No invoices yet</h3>
          <p className={styles.emptyDesc}>
            You have clients, but you haven&apos;t created any invoices. Let&apos;s get you paid!
          </p>
          <Link href="/dashboard/invoices/new" className="btn btn-primary">
            <Plus size={18} />
            Create First Invoice
          </Link>
        </div>
      ) : null}
    </>
  )
}
