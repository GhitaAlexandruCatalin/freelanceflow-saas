import { createClient } from '@/utils/supabase/server'
import NewInvoiceForm from './NewInvoiceForm'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company')
    .eq('user_id', user?.id)
    .order('name', { ascending: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('default_currency')
    .eq('id', user?.id)
    .single()

  return <NewInvoiceForm clients={clients || []} defaultCurrency={profile?.default_currency || 'USD'} />
}
