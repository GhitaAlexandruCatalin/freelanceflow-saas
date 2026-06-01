'use server'

import nodemailer from 'nodemailer'
import { createClient } from '@/utils/supabase/server'

export async function sendFollowUpEmail(data: {
  to: string
  subject: string
  body: string
  fromName: string
  pdfAttachment?: string
  invoiceNumber?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get SMTP credentials from user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('smtp_email, smtp_password, business_name, full_name')
    .eq('id', user.id)
    .single()

  // Fall back to env variables if profile doesn't have SMTP configured
  const smtpEmail = profile?.smtp_email || process.env.GMAIL_USER
  const smtpPassword = profile?.smtp_password || process.env.GMAIL_APP_PASSWORD
  const senderName = data.fromName || profile?.business_name || profile?.full_name || 'FreelanceFlow'

  if (!smtpEmail || !smtpPassword) {
    return { error: 'Email is not configured. Go to Settings → Email Sending to set up your Gmail and App Password.' }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    })

    // Convert plain text line breaks to HTML
    const htmlBody = data.body
      .split('\n\n')
      .map(para => `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #333;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('')

    const mailOptions: any = {
      from: `"${senderName}" <${smtpEmail}>`,
      to: data.to,
      subject: data.subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${htmlBody}
        </div>
      `,
    }

    if (data.pdfAttachment) {
      mailOptions.attachments = [
        {
          filename: `Invoice_${data.invoiceNumber || 'Document'}.pdf`,
          content: data.pdfAttachment,
          encoding: 'base64'
        }
      ]
    }

    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (err: any) {
    console.error('Email send error:', err)
    if (err.message?.includes('Invalid login')) {
      return { error: 'Invalid email credentials. Please check your Gmail address and App Password in Settings.' }
    }
    return { error: err.message || 'Failed to send email.' }
  }
}
