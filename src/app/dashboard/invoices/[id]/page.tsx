import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Clock, DollarSign, User, Calendar } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import styles from '../invoices.module.css'
import AiEmailGenerator from './AiEmailGenerator'

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const t = await getTranslations({ locale, namespace: 'Invoices' })
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the specific invoice and its line items
  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name, company, email ),
      invoice_items ( id, description, quantity, unit_price, total )
    `)
    .eq('id', resolvedParams.id)
    .eq('user_id', user?.id)
    .single()

  // Fetch user's profile for sender info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_name, business_email, default_language, plan_tier')
    .eq('id', user?.id)
    .single()

  const senderName = profile?.business_name || profile?.full_name || 'FreelanceFlow User'
  const senderEmail = profile?.business_email || user?.email || 'noreply@example.com'

  if (!invoice) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>Invoice Not Found</h3>
        <p className={styles.emptyDesc}>This invoice doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/dashboard/invoices" className="btn btn-primary">Back to Invoices</Link>
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/dashboard/invoices" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> {t('backToInvoices')}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className={styles.invoicesTitle}>Invoice {invoice.invoice_number}</h2>
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            background: invoice.status === 'paid' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.1)',
            color: invoice.status === 'paid' ? 'var(--accent-green)' : 'var(--text-secondary)',
            textTransform: 'capitalize'
          }}>
            {t(invoice.status) || invoice.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Invoice Document Left */}
        <div id="invoice-document" style={{ background: '#ffffff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>Billed To</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{invoice.clients?.name}</div>
              {invoice.clients?.company && <div style={{ color: '#4b5563' }}>{invoice.clients?.company}</div>}
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>{invoice.clients?.email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', marginBottom: '8px', justifyContent: 'flex-end' }}>
                <Calendar size={16} /> <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ textAlign: 'left', paddingBottom: '12px', fontWeight: 600 }}>{t('description')}</th>
                <th style={{ textAlign: 'right', paddingBottom: '12px', fontWeight: 600 }}>{t('qty')}</th>
                <th style={{ textAlign: 'right', paddingBottom: '12px', fontWeight: 600 }}>{t('price')}</th>
                <th style={{ textAlign: 'right', paddingBottom: '12px', fontWeight: 600 }}>{t('total')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoice_items?.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 0', color: '#111827' }}>{item.description}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: '#4b5563' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: '#4b5563' }}>{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{formatCurrency(item.total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4b5563', fontSize: '0.875rem' }}>
                <span>{t('subtotal')}</span>
                <span style={{ color: '#111827' }}>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4b5563', fontSize: '0.875rem' }}>
                <span>{t('tax')} ({invoice.tax_rate}%)</span>
                <span style={{ color: '#111827' }}>{formatCurrency(invoice.total - invoice.subtotal, invoice.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #e5e7eb', fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                <span>{t('total')}</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Action Panel Right */}
        <div>
          <AiEmailGenerator 
            invoiceId={invoice.id}
            clientName={invoice.clients?.name}
            clientEmail={invoice.clients?.email}
            invoiceNumber={invoice.invoice_number}
            amount={formatCurrency(invoice.total, invoice.currency)}
            dueDate={invoice.due_date}
            status={invoice.status}
            senderName={senderName}
            senderEmail={senderEmail}
            defaultLanguage={profile?.default_language || 'en'}
            planTier={profile?.plan_tier || 'free'}
          />
        </div>
      </div>
    </div>
  )
}
