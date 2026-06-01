'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI SDK
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

// Smart Template Fallback - generates professional emails without AI
function generateFromTemplate(details: {
  clientName: string
  invoiceNumber: string
  amount: string
  dueDate: string
  daysOverdue: number
  language: string
  senderName: string
}) {
  const isRo = details.language === 'ro'
  const firstName = details.clientName.split(' ')[0]
  const formattedDue = new Date(details.dueDate).toLocaleDateString()
  
  if (isRo) {
    if (details.daysOverdue <= 0) return { subject: `Factura ${details.invoiceNumber} - Scadență pe ${formattedDue}`, body: `Bună ziua,\n\nVă scriu pentru a vă reaminti respectuos că factura ${details.invoiceNumber} în valoare de ${details.amount} este scadentă pe data de ${formattedDue}.\n\nToate cele bune,\n${details.senderName}` }
    if (details.daysOverdue <= 7) return { subject: `Notificare: Factura ${details.invoiceNumber} a depășit termenul de plată`, body: `Bună ziua,\n\nVă contactez în legătură cu factura ${details.invoiceNumber} pentru suma de ${details.amount}, care a avut scadența pe data de ${formattedDue}.\n\nToate cele bune,\n${details.senderName}` }
    if (details.daysOverdue <= 14) return { subject: `A doua notificare: Factura ${details.invoiceNumber} - întârziere de ${details.daysOverdue} zile`, body: `Stimate partener,\n\nRevin în legătură cu factura ${details.invoiceNumber} în valoare de ${details.amount}, scadentă pe ${formattedDue}. Vă rog să procesați plata cât de curând posibil.\n\nCu respect,\n${details.senderName}` }
    return { subject: `URGENT: Factura ${details.invoiceNumber} - Necesită acțiune imediată`, body: `Stimate partener,\n\nAceasta este o notificare oficială și urgentă privind factura ${details.invoiceNumber} pentru suma de ${details.amount}, scadentă pe ${formattedDue}. Vă solicităm să procesați plata imediat.\n\nCu respect,\n${details.senderName}` }
  }

  if (details.language === 'es') {
    return { subject: `Factura ${details.invoiceNumber} - Vencimiento ${formattedDue}`, body: `Hola ${firstName},\n\nLe escribimos para recordarle sobre la factura ${details.invoiceNumber} por ${details.amount}, con fecha de vencimiento el ${formattedDue}.\n\nSaludos cordiales,\n${details.senderName}` }
  } else if (details.language === 'de') {
    return { subject: `Rechnung ${details.invoiceNumber} - Fällig am ${formattedDue}`, body: `Hallo ${firstName},\n\nWir möchten Sie an die Rechnung ${details.invoiceNumber} über ${details.amount} erinnern, die am ${formattedDue} fällig ist/war.\n\nMit freundlichen Grüßen,\n${details.senderName}` }
  } else if (details.language === 'fr') {
    return { subject: `Facture ${details.invoiceNumber} - Échéance le ${formattedDue}`, body: `Bonjour ${firstName},\n\nNous vous écrivons concernant la facture ${details.invoiceNumber} d'un montant de ${details.amount}, qui arrive/est arrivée à échéance le ${formattedDue}.\n\nCordialement,\n${details.senderName}` }
  } else if (details.language === 'it') {
    return { subject: `Fattura ${details.invoiceNumber} - Scadenza ${formattedDue}`, body: `Ciao ${firstName},\n\nTi scriviamo in merito alla fattura ${details.invoiceNumber} di ${details.amount}, in scadenza/scaduta il ${formattedDue}.\n\nCordiali saluti,\n${details.senderName}` }
  } else if (details.language === 'zh') {
    return { subject: `发票 ${details.invoiceNumber} - 到期日 ${formattedDue}`, body: `您好 ${firstName}，\n\n我们写信提醒您关于发票 ${details.invoiceNumber}（金额 ${details.amount}），其到期日为 ${formattedDue}。\n\n此致，\n${details.senderName}` }
  } else if (details.language === 'ja') {
    return { subject: `請求書 ${details.invoiceNumber} - 期日 ${formattedDue}`, body: `${firstName} 様,\n\n${formattedDue}が期日の請求書 ${details.invoiceNumber}（金額 ${details.amount}）についてご連絡いたします。\n\nよろしくお願いいたします。\n${details.senderName}` }
  }

  // Fallback to English
  if (details.daysOverdue <= 0) return { subject: `Upcoming Invoice ${details.invoiceNumber} - Due ${formattedDue}`, body: `Hi ${firstName},\n\nThis is a friendly heads-up that invoice ${details.invoiceNumber} for ${details.amount} is due on ${formattedDue}.\n\nBest regards,\n${details.senderName}` }
  if (details.daysOverdue <= 7) return { subject: `Friendly Reminder: Invoice ${details.invoiceNumber} is Past Due`, body: `Hi ${firstName},\n\nI wanted to follow up on invoice ${details.invoiceNumber} for ${details.amount}, which was due on ${formattedDue}.\n\nBest regards,\n${details.senderName}` }
  if (details.daysOverdue <= 14) return { subject: `Second Reminder: Invoice ${details.invoiceNumber} - ${details.daysOverdue} Days Overdue`, body: `Dear ${firstName},\n\nI'm writing to follow up regarding invoice ${details.invoiceNumber} for ${details.amount}, which was due on ${formattedDue}. Please arrange payment at your earliest convenience.\n\nBest regards,\n${details.senderName}` }
  
  return { subject: `URGENT: Invoice ${details.invoiceNumber} - Immediate Action Required`, body: `Dear ${firstName},\n\nThis is an urgent notice regarding invoice ${details.invoiceNumber} for ${details.amount}, which was due on ${formattedDue}. I kindly request that you process this payment immediately.\n\nRegards,\n${details.senderName}` }
}

export async function generateFollowUpEmail(invoiceDetails: {
  clientName: string
  invoiceNumber: string
  amount: string
  dueDate: string
  daysOverdue: number
  language: string
  tonePreference?: string
  additionalInstructions?: string
  senderName: string
}) {
  // Try Gemini AI first
  if (genAI) {
    try {
      // Try multiple model names for compatibility
      const modelNames = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']
      let lastError = null

      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })

          let toneInstruction = ''
          
          if (invoiceDetails.tonePreference === 'friendly') {
            toneInstruction = 'Friendly, casual, warm, and polite. (Use "tu" if Romanian).'
          } else if (invoiceDetails.tonePreference === 'strict') {
            toneInstruction = 'Extremely strict, firm, direct, and uncompromising. Demand payment immediately. (Must remain formal).'
          } else {
            // Default Professional/B2B logic based on days overdue
            if (invoiceDetails.daysOverdue <= 0) {
              toneInstruction = 'Professional B2B, polite but firm, just a gentle heads up before the due date.'
            } else if (invoiceDetails.daysOverdue <= 7) {
              toneInstruction = 'Professional B2B, polite but firm, reminding them that the invoice is now past due.'
            } else if (invoiceDetails.daysOverdue <= 14) {
              toneInstruction = 'Professional B2B, very firm, highlighting that the payment is significantly overdue and requesting immediate action.'
            } else {
              toneInstruction = 'Professional B2B, strict, urgent, and warning about potential suspension of services or late fees due to extreme delay.'
            }
          }

          const langMap: Record<string, string> = {
            en: 'English', ro: 'Romanian (Română)', es: 'Spanish (Español)',
            de: 'German (Deutsch)', fr: 'French (Français)', it: 'Italian (Italiano)',
            zh: 'Chinese (中文)', ja: 'Japanese (日本語)'
          }
          const promptLang = langMap[invoiceDetails.language] || 'English'

          const prompt = `You are an intelligent invoicing assistant working for a professional freelancer in a B2B context.
Your task is to draft a follow-up email to a client regarding an invoice. NEVER include small talk or casual greetings. Go straight to the point in a professional B2B manner.

Language to write in: ${promptLang}

Client Name: ${invoiceDetails.clientName}
Invoice Number: ${invoiceDetails.invoiceNumber}
Amount Due: ${invoiceDetails.amount}
Due Date: ${invoiceDetails.dueDate}
Days Overdue: ${invoiceDetails.daysOverdue} (if negative, it's before the due date)
${invoiceDetails.additionalInstructions ? `\nUSER CUSTOM INSTRUCTIONS FOR TONE AND CONTEXT:\n"${invoiceDetails.additionalInstructions}"\n` : ''}
Instructions:
1. Write a professional B2B email to the client in ${promptLang}.
2. CRITICAL RULE FOR PRONOUNS: If language is Romanian, Spanish, French, Italian or German, and tone is NOT friendly/casual, you MUST use polite, formal pronouns (e.g. "Dumneavoastră", "Usted", "Vous", "Lei", "Sie"). If tone IS friendly/casual, you may use informal pronouns. For Japanese, use polite business Keigo.
3. The tone MUST be: ${toneInstruction}
4. Be concise and strictly follow the tone. Don't write fluff. No casual well-wishes unless the tone is friendly.
5. Always include the invoice number, amount, and due date in the body.
6. ALWAYS sign off the email with the sender's name: ${invoiceDetails.senderName}
7. Provide the output EXACTLY in this JSON format, with no extra markdown or text outside the JSON:
{
  "subject": "Email Subject Line Here",
  "body": "The full email body here (use \\n for line breaks)"
}`

          const result = await model.generateContent(prompt)
          const responseText = result.response.text()

          const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim()
          const parsed = JSON.parse(jsonStr)

          return {
            success: true,
            subject: parsed.subject,
            body: parsed.body,
            source: 'gemini'
          }
        } catch (modelError: any) {
          lastError = modelError
          // If it's a 404 (model not found), try the next model name
          if (modelError.message?.includes('404') || modelError.message?.includes('not found')) {
            continue
          }
          // For other errors, break out
          break
        }
      }

      console.error('All Gemini models failed, falling back to templates:', lastError?.message)
    } catch (error: any) {
      console.error('Gemini API Error, falling back to templates:', error.message)
    }
  }

  // Fallback: Smart Template Engine
  const template = generateFromTemplate(invoiceDetails)
  return {
    success: true,
    subject: template.subject,
    body: template.body,
    source: 'template'
  }
}
