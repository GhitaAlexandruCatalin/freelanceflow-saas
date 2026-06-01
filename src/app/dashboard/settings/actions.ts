'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateBusinessSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const settings = {
    business_name: formData.get('business_name') as string || null,
    business_email: formData.get('business_email') as string || null,
    business_phone: formData.get('business_phone') as string || null,
    business_address: formData.get('business_address') as string || null,
    default_currency: formData.get('default_currency') as string || 'USD',
    default_tax_rate: parseFloat(formData.get('default_tax_rate') as string) || 0,
    payment_terms: formData.get('payment_terms') as string || null,
    default_language: formData.get('default_language') as string || 'en',
  }

  const { error } = await supabase
    .from('profiles')
    .update(settings)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateEmailSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const smtpEmail = formData.get('smtp_email') as string
  const smtpPassword = formData.get('smtp_password') as string

  // Only update password if a new one was provided
  const updates: Record<string, string> = { smtp_email: smtpEmail }
  if (smtpPassword && smtpPassword.trim() !== '') {
    updates.smtp_password = smtpPassword.replace(/\s/g, '') // Remove spaces from app password
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
