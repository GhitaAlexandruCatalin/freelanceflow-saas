'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createInvoice(formData: FormData) {
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
    // Get first day of current month
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', firstDay)
      
    if (count !== null && count >= 5) {
      return { error: 'Free plan is limited to 5 invoices per month. Please upgrade to Pro to create more invoices.' }
    }
  }

  const clientId = formData.get('client_id') as string
  const dueDate = formData.get('due_date') as string
  const taxRate = parseFloat(formData.get('tax_rate') as string) || 0
  const currency = formData.get('currency') as string || 'EUR'
  const notes = formData.get('notes') as string || null

  // Parse line items from JSON
  const itemsJson = formData.get('items') as string
  let items: { description: string; quantity: number; unit_price: number }[] = []
  
  try {
    items = JSON.parse(itemsJson)
  } catch {
    return { error: 'Invalid line items' }
  }

  if (items.length === 0) {
    return { error: 'At least one line item is required' }
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const total = subtotal + (subtotal * taxRate / 100)

  // Generate invoice number
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`

  // Insert invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([{
      user_id: user.id,
      client_id: clientId,
      invoice_number: invoiceNumber,
      status: 'sent',
      due_date: dueDate,
      subtotal: subtotal.toFixed(2),
      tax_rate: taxRate,
      total: total.toFixed(2),
      currency,
      notes,
    }])
    .select()
    .single()

  if (invoiceError) {
    return { error: invoiceError.message }
  }

  // Insert line items
  const lineItems = items.map(item => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total: (item.quantity * item.unit_price).toFixed(2),
  }))

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(lineItems)

  if (itemsError) {
    return { error: itemsError.message }
  }

  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard')
  redirect('/dashboard/invoices')
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: Record<string, unknown> = { status }
  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard')
  return { success: true }
}
