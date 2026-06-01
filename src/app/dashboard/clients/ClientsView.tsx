'use client'

import { useState, useTransition } from 'react'
import { Plus, X, Users, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { addClient, deleteClient } from './actions'
import styles from './clients.module.css'

type Client = {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
}

export default function ClientsView({ clients }: { clients: Client[] }) {
  const t = useTranslations('Clients')
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addClient(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowModal(false)
      }
    })
  }

  async function handleDelete(clientId: string) {
    if (!confirm(t('deleteConfirm'))) {
      return
    }
    startTransition(async () => {
      await deleteClient(clientId)
    })
  }

  return (
    <>
      <div className={styles.clientsHeader}>
        <div>
          <h2 className={styles.clientsTitle}>{t('title')}</h2>
          <p className={styles.clientCount}>{clients.length} total client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          {t('addClient')}
        </button>
      </div>

      {clients.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Users size={32} />
          </div>
          <h3 className={styles.emptyTitle}>No clients yet</h3>
          <p className={styles.emptyDesc}>
            Add your first client to start creating invoices and automating follow-ups.
          </p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add Your First Client
          </button>
        </div>
      ) : (
        <div className={styles.clientsTable}>
          <table>
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('phone')}</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className={styles.clientName}>{client.name}</div>
                    {client.company && (
                      <div className={styles.clientCompany}>{client.company}</div>
                    )}
                  </td>
                  <td>{client.email}</td>
                  <td>{client.phone || '—'}</td>
                  <td>{new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(client.id)}
                      aria-label="Delete client"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Client Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false)
        }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{t('addClientTitle')}</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form action={handleSubmit}>
              <div className={styles.modalBody}>
                {error && (
                  <div style={{ 
                    padding: '10px', 
                    background: 'rgba(245,87,108,0.1)', 
                    border: '1px solid rgba(245,87,108,0.3)', 
                    borderRadius: '8px', 
                    color: '#ff8a98', 
                    fontSize: '0.875rem',
                    marginBottom: '16px'
                  }}>
                    {error}
                  </div>
                )}

                <div className={styles.modalForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-name">{t('name')} <span className={styles.required}>*</span></label>
                      <input 
                        type="text" 
                        id="client-name" 
                        name="name" 
                        className={styles.formInput} 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-email">{t('email')} <span className={styles.required}>*</span></label>
                      <input 
                        type="email" 
                        id="client-email" 
                        name="email" 
                        className={styles.formInput} 
                        placeholder="john@company.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-company">{t('company')}</label>
                      <input 
                        type="text" 
                        id="client-company" 
                        name="company" 
                        className={styles.formInput} 
                        placeholder="Acme Corp" 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-phone">{t('phone')}</label>
                      <input 
                        type="text" 
                        id="client-phone" 
                        name="phone" 
                        className={styles.formInput} 
                        placeholder="+1 555 0123" 
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="client-address">{t('address')}</label>
                    <input 
                      type="text" 
                      id="client-address" 
                      name="address" 
                      className={styles.formInput} 
                      placeholder="123 Main Street, City, Country" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="client-notes">{t('notes')}</label>
                    <input 
                      type="text" 
                      id="client-notes" 
                      name="notes" 
                      className={styles.formInput} 
                      placeholder="Any extra details about this client..." 
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? t('adding') : t('addClient')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
