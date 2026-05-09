
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'nutricionistas' });
  
  if (error) {
    // If RPC doesn't exist, try a simple select
    const { data: selectData, error: selectError } = await supabase
      .from('nutricionistas')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('Error:', selectError.message);
    } else {
      console.log('Columns found:', selectData.length > 0 ? Object.keys(selectData[0]) : 'Table empty');
    }
  } else {
    console.log('Columns:', data);
  }
}

checkColumns()
