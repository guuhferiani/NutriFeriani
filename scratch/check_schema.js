
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('nutricionistas')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching nutricionistas:', error)
  } else {
    console.log('Sample data from nutricionistas:', data)
  }
}

checkSchema()
