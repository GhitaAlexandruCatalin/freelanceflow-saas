import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://bthvgifmmsnftpcmtnva.supabase.co', 'sb_publishable_r8K9DcZPZ3ZP9AaSQxTVOw_7W46BIbz')
async function run() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  console.log('Error:', error)
  console.log('Data:', data)
}
run()
