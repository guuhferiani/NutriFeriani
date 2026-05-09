
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Iniciando o seeding de dados...')

  const nutritionists = [
    { nome: 'Ana Oliveira', email: 'ana@nutri.com' },
    { nome: 'Carlos Santos', email: 'carlos@nutri.com' },
    { nome: 'Marina Silva', email: 'marina@nutri.com' },
    { nome: 'Ricardo Lima', email: 'ricardo@nutri.com' },
    { nome: 'Juliana Costa', email: 'juliana@nutri.com' }
  ]

  for (const nutri of nutritionists) {
    const nutriId = crypto.randomUUID()
    
    console.log(`Inserindo Nutricionista: ${nutri.nome}...`)
    const { error: nutriError } = await supabase
      .from('nutricionistas')
      .insert([{ id: nutriId, nome: nutri.nome, email: nutri.email }])

    if (nutriError) {
      console.error(`Erro ao inserir nutri ${nutri.nome}:`, nutriError.message)
      continue
    }

    const patients = [
      { nome: `Paciente 1 de ${nutri.nome}`, objetivo: 'Emagrecer', peso: 80, altura: 170 },
      { nome: `Paciente 2 de ${nutri.nome}`, objetivo: 'Ganhar massa', peso: 65, altura: 165 },
      { nome: `Paciente 3 de ${nutri.nome}`, objetivo: 'Saúde geral', peso: 70, altura: 160 },
      { nome: `Paciente 4 de ${nutri.nome}`, objetivo: 'Performance', peso: 90, altura: 185 },
      { nome: `Paciente 5 de ${nutri.nome}`, objetivo: 'Reeducação', peso: 75, altura: 175 }
    ]

    for (const p of patients) {
      console.log(`  Inserindo Paciente: ${p.nome}...`)
      const { error: pError } = await supabase
        .from('pacientes')
        .insert([{
          nome: p.nome,
          nutricionista_id: nutriId,
          email: p.nome.toLowerCase().replace(/ /g, '.') + '@exemplo.com',
          objetivos: [p.objetivo],
          peso_inicial: p.peso,
          altura: p.altura,
          sexo: Math.random() > 0.5 ? 'Masculino' : 'Feminino',
          nivel_atividade: 'Moderadamente ativo'
        }])

      if (pError) {
        console.error(`  Erro ao inserir paciente ${p.nome}:`, pError.message)
      }
    }
  }

  console.log('Seeding concluído!')
}

seed()
