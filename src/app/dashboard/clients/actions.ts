'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addClient(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check plan tier and limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier')
    .eq('id', user.id)
    .single()
    
  if (profile?.plan_tier === 'free') {
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      
    if (count !== null && count >= 3) {
      return { error: 'Free plan is limited to 3 clients. Please upgrade to Pro to add more clients.' }
    }
  }

  const clientData = {
    user_id: user.id,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: formData.get('company') as string || null,
    phone: formData.get('phone') as string || null,
    address: formData.get('address') as string || null,
    notes: formData.get('notes') as string || null,
  }

  const { error } = await supabase
    .from('clients')
    .insert([clientData])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteClient(clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard')
  return { success: true }
}
