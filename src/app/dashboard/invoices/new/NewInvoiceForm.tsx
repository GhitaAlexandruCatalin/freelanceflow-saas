'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createInvoice } from '../actions'
import styles from '../invoices.module.css'

type Client = {
  id: string
  name: string
  company: string | null
}

export default function NewInvoiceForm({ clients, defaultCurrency = 'USD' }: { clients: Client[], defaultCurrency?: string }) {
  const t = useTranslations('Invoices')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, unit_price: 0 }])
  const [taxRate, setTaxRate] = useState(0)

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unit_price: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const handleSubmit = (formData: FormData) => {
    setError(null)
    formData.append('items', JSON.stringify(items))
    
    startTransition(async () => {
      const result = await createInvoice(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (clients.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.lineItemsTitle}>No Clients Found</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>You need to add a client before creating an invoice.</p>
        <Link href="/dashboard/clients" className="btn btn-primary">Go to Clients</Link>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/dashboard/invoices" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> {t('backToInvoices')}
        </Link>
        <h2 className={styles.invoicesTitle}>{t('createInvoice')}</h2>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(245,87,108,0.1)', color: '#ff8a98', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(245,87,108,0.3)' }}>
          {error}
        </div>
      )}

      <form action={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="client_id">{t('client')}</label>
            <select id="client_id" name="client_id" className={styles.formSelect} required>
              <option value="">Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="currency">{t('currency')}</label>
            <select id="currency" name="currency" className={styles.formSelect} defaultValue={defaultCurrency}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="RON">RON (lei)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CHF">CHF (CHF)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="INR">INR (₹)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="SGD">SGD ($)</option>
              <option value="HKD">HKD ($)</option>
              <option value="NZD">NZD ($)</option>
              <option value="SEK">SEK (kr)</option>
              <option value="KRW">KRW (₩)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="due_date">{t('dueDate')}</label>
            <input 
              type="date" 
              id="due_date" 
              name="due_date" 
              className={styles.formInput} 
              required
              defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Default: 14 days from now
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tax_rate">{t('taxRate')}</label>
            <input 
              type="number" 
              id="tax_rate" 
              name="tax_rate" 
              className={styles.formInput} 
              min="0" 
              max="100" 
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className={styles.lineItems}>
          <h3 className={styles.lineItemsTitle}>{t('lineItems')}</h3>
          
          <div className={styles.lineItemHeader}>
            <div>{t('description')}</div>
            <div>{t('qty')}</div>
            <div>{t('price')}</div>
            <div style={{ width: '32px' }}></div>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className={styles.lineItemRow}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Service description"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                required
              />
              <input
                type="number"
                className={styles.formInput}
                min="0.1"
                step="0.1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                required
              />
              <input
                type="number"
                className={styles.formInput}
                min="0"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                required
              />
              <button
                type="button"
                className={styles.deleteItemBtn}
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
                style={{ opacity: items.length === 1 ? 0.3 : 1 }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button type="button" className={styles.addItemBtn} onClick={addItem}>
            <Plus size={16} /> {t('addAnotherItem')}
          </button>
        </div>

        <div className={styles.formGroup} style={{ marginTop: '30px' }}>
          <label htmlFor="notes">{t('notesPayment')}</label>
          <textarea 
            id="notes" 
            name="notes" 
            className={styles.formInput} 
            rows={3}
            placeholder="Thank you for your business. Payment is due within 14 days."
          ></textarea>
        </div>

        <div className={styles.totalsBox}>
          <div className={styles.totalRow}>
            <span>{t('subtotal')}</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>{t('tax')} ({taxRate}%)</span>
            <span>{taxAmount.toFixed(2)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>{t('total')}</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/dashboard/invoices" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? t('saving') : t('saveCreateInvoice')}
          </button>
        </div>
      </form>
    </div>
  )
}
