import { createClient } from '@/utils/supabase/server'
import ClientsView from './ClientsView'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return <ClientsView clients={clients || []} />
}
