
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsert() {
  const dummyId = crypto.randomUUID()
  const { error } = await supabase
    .from('pacientes')
    .insert([{ nome: 'Teste RLS', nutricionista_id: dummyId }])
  
  if (error) {
    console.log('Erro na inserção de pacientes:', error.message)
  } else {
    console.log('Inserção de pacientes permitida!')
  }
}

testInsert()
