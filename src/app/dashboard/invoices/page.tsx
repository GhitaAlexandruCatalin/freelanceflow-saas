import Link from 'next/link'
import { Plus, FileText, MoreHorizontal } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import styles from './invoices.module.css'
import { updateInvoiceStatus, deleteInvoice } from './actions'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const t = await getTranslations({ locale, namespace: 'Invoices' })
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name, company )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span className={`${styles.statusBadge} ${styles.statusDraft}`}><span className={styles.statusDot}></span>Draft</span>
      case 'sent': return <span className={`${styles.statusBadge} ${styles.statusSent}`}><span className={styles.statusDot}></span>Sent</span>
      case 'paid': return <span className={`${styles.statusBadge} ${styles.statusPaid}`}><span className={styles.statusDot}></span>{t('paid')}</span>
      case 'overdue': return <span className={`${styles.statusBadge} ${styles.statusOverdue}`}><span className={styles.statusDot}></span>{t('overdue')}</span>
      case 'disputed': return <span className={`${styles.statusBadge} ${styles.statusDisputed}`}><span className={styles.statusDot}></span>Disputed</span>
      default: return null
    }
  }

  return (
    <>
      <div className={styles.invoicesHeader}>
        <h2 className={styles.invoicesTitle}>{t('title')}</h2>
        <Link href="/dashboard/invoices/new" className="btn btn-primary">
          <Plus size={18} />
          {t('createInvoice')}
        </Link>
      </div>

      {!invoices || invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} style={{ marginBottom: '20px' }}>
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No invoices yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
            Create your first invoice to start billing your clients and automating follow-ups.
          </p>
          <Link href="/dashboard/invoices/new" className="btn btn-primary">
            <Plus size={18} />
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className={styles.invoicesTable}>
          <table>
            <thead>
              <tr>
                <th>{t('invoiceNumber')}</th>
                <th>{t('client')}</th>
                <th>{t('amount')}</th>
                <th>{t('status')}</th>
                <th>{t('dueDate')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className={styles.invoiceNumber}>
                    <Link href={`/dashboard/invoices/${inv.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {inv.invoice_number}
                    </Link>
                  </td>
                  <td>
                    <div className={styles.clientName}>{inv.clients?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.clients?.company}</div>
                  </td>
                  <td className={styles.amount}>{formatCurrency(inv.total, inv.currency)}</td>
                  <td>{getStatusBadge(inv.status)}</td>
                  <td>{new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ textAlign: 'right' }}>
                    {/* Basic Server Actions for testing */}
                    <form style={{ display: 'inline-flex', gap: '8px' }}>
                      <input type="hidden" name="id" value={inv.id} />
                      {inv.status !== 'paid' && (
                        <button 
                          formAction={async (formData) => {
                            'use server'
                            await updateInvoiceStatus(formData.get('id') as string, 'paid')
                          }}
                          className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          Mark Paid
                        </button>
                      )}
                      {inv.status !== 'paid' && inv.status !== 'disputed' && (
                        <button 
                          formAction={async (formData) => {
                            'use server'
                            await updateInvoiceStatus(formData.get('id') as string, 'disputed')
                          }}
                          className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f59e0b' }}
                        >
                          Disputed
                        </button>
                      )}
                      <button 
                        formAction={async (formData) => {
                          'use server'
                          await deleteInvoice(formData.get('id') as string)
                        }}
                        className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--accent-red)' }}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
