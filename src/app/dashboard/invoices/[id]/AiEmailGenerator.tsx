'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Mail, Send, Check, ExternalLink, Paperclip, Languages, RefreshCw, AlertCircle } from 'lucide-react'
import { generateFollowUpEmail } from '../ai-actions'
import { sendFollowUpEmail } from '../email-actions'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

type AiEmailGeneratorProps = {
  invoiceId: string
  clientName: string
  clientEmail: string
  invoiceNumber: string
  amount: string
  dueDate: string
  status: string
  senderName: string
  senderEmail: string
  defaultLanguage: string
  planTier: string
}

export default function AiEmailGenerator({
  invoiceId,
  clientName,
  clientEmail,
  invoiceNumber,
  amount,
  dueDate,
  status,
  senderName,
  senderEmail,
  defaultLanguage,
  planTier
}: AiEmailGeneratorProps) {
  const [isPending, startTransition] = useTransition()
  const [isSending, setIsSending] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const [language, setLanguage] = useState(defaultLanguage)
  const [includePdf, setIncludePdf] = useState(true)
  const [customInstructions, setCustomInstructions] = useState('')
  const [selectedTone, setSelectedTone] = useState('professional')

  const TONES = [
    { id: 'professional', label: 'Formal / B2B' },
    { id: 'friendly', label: 'Casual / Friendly' },
    { id: 'strict', label: 'Strict / Firm' }
  ]

  // Calculate days overdue
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = today.getTime() - due.getTime()
  const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const handleGenerate = () => {
    if (status === 'paid') return
    
    setError(null)
    setEmailSubject('')
    setEmailBody('')
    setIsSent(false)
    
    startTransition(async () => {
      const result = await generateFollowUpEmail({
        clientName,
        invoiceNumber,
        amount,
        dueDate,
        daysOverdue,
        language,
        tonePreference: selectedTone,
        additionalInstructions: customInstructions,
        senderName
      })

      if (result.error) {
        setError(result.error)
      } else if (result.success && result.subject && result.body) {
        setEmailSubject(result.subject)
        setEmailBody(result.body)
      } else {
        setError('Unexpected response format.')
      }
    })
  }

  const handleSend = async () => {
    setError(null)
    setIsSending(true)

    let pdfBase64 = undefined

    if (includePdf) {
      const element = document.getElementById('invoice-document')
      if (element) {
        try {
          const canvas = await html2canvas(element, { 
            scale: 2,
            backgroundColor: '#ffffff' // white background for standard invoice look
          })
          const imgData = canvas.toDataURL('image/png')
          
          // A4 size in px at 72 dpi is approx 595 x 842
          // We'll scale the image to fit A4 width
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
          })
          
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
          const dataUri = pdf.output('datauristring')
          pdfBase64 = dataUri.split(',')[1]
        } catch (err) {
          console.error("Failed to generate PDF", err)
        }
      }
    }

    const result = await sendFollowUpEmail({
      to: clientEmail,
      subject: emailSubject,
      body: emailBody,
      fromName: senderName,
      pdfAttachment: pdfBase64,
      invoiceNumber
    })

    setIsSending(false)

    if (result.error) {
      setError(result.error)
    } else {
      setIsSent(true)
    }
  }

  if (status === 'paid') {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Invoice Paid</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No follow-up needed.</p>
      </div>
    )
  }

  if (planTier === 'free') {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '20px', boxShadow: 'var(--shadow-glow)' }}>
          <Sparkles size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>Unlock AI Automation</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '32px', maxWidth: '280px', lineHeight: 1.6 }}>
          Upgrade to the Professional plan to let AI automatically draft the perfect follow-up email based on how overdue this invoice is.
        </p>
        <a href="/dashboard/settings" className="btn btn-primary" style={{ width: '100%', maxWidth: '250px', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
          Upgrade to Pro
        </a>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 'var(--shadow-glow)' }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>AI Assistant</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {daysOverdue > 0 ? `${daysOverdue} days overdue` : `${Math.abs(daysOverdue)} days until due`}
          </p>
        </div>
      </div>

      {/* Sender Info & Options */}
      <div style={{ padding: '14px', background: 'rgba(102, 126, 234, 0.06)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>From:</strong> {senderName} &lt;{senderEmail}&gt;<br/>
          <strong style={{ color: 'var(--text-secondary)' }}>To:</strong> {clientName} &lt;{clientEmail}&gt;
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Languages size={14} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isPending || isSending}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              <option value="en" style={{ background: '#1e1e2e' }}>English</option>
              <option value="ro" style={{ background: '#1e1e2e' }}>Română</option>
              <option value="es" style={{ background: '#1e1e2e' }}>Español</option>
              <option value="de" style={{ background: '#1e1e2e' }}>Deutsch</option>
              <option value="fr" style={{ background: '#1e1e2e' }}>Français</option>
              <option value="it" style={{ background: '#1e1e2e' }}>Italiano</option>
              <option value="zh" style={{ background: '#1e1e2e' }}>中文</option>
              <option value="ja" style={{ background: '#1e1e2e' }}>日本語</option>
            </select>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={includePdf}
              onChange={(e) => setIncludePdf(e.target.checked)}
              disabled={isPending || isSending}
            />
            <Paperclip size={14} /> Attach PDF Invoice
          </label>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500, color: 'var(--text-primary)' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            AI Tone & Persona
          </label>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {TONES.map(tone => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                disabled={isPending || isSending}
                style={{
                  background: selectedTone === tone.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  color: selectedTone === tone.id ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedTone === tone.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tone.label}
              </button>
            ))}
          </div>

          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Additional instructions... (e.g. 'Mention the 10% late fee' or 'Remind them about our meeting next week')"
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '10px 12px', 
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              resize: 'vertical',
              minHeight: '70px'
            }}
            disabled={isPending || isSending}
          />
        </div>
      </div>

      {/* Generate Button (initial state) */}
      {!emailBody && !isPending && !isSent && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Generate a personalized follow-up email. The tone adjusts automatically based on how overdue the invoice is.
          </p>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={16} />
            Generate Smart Email
          </button>
        </div>
      )}

      {/* Loading State */}
      {isPending && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border-default)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Crafting the perfect message...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px', background: 'rgba(245,87,108,0.1)', color: '#ff8a98', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid rgba(245,87,108,0.3)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Sent Success State */}
      {isSent && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Check size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Email Sent!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
            Follow-up sent to <strong>{clientName}</strong> at {clientEmail}
          </p>
          <button onClick={() => { setIsSent(false); setEmailBody(''); setEmailSubject(''); }} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={14} />
            Send Another Follow-up
          </button>
        </div>
      )}

      {/* Email Editor */}
      {emailBody && !isPending && !isSent && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Subject</label>
            <input 
              type="text" 
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            />
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Message Body</label>
            <textarea 
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              style={{ width: '100%', flex: 1, minHeight: '200px', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleGenerate} className="btn btn-secondary" style={{ flex: 1 }}>
              <RefreshCw size={14} />
              Regenerate
            </button>
            <button 
              onClick={handleSend} 
              className="btn btn-primary" 
              style={{ flex: 2 }}
              disabled={isSending}
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <><Send size={16} /> Send Email Now</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
