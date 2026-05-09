# 🍏 NutriFeriani — Sistema de Gestão para Nutricionistas

O **NutriFeriani** é uma plataforma moderna e intuitiva desenvolvida para auxiliar nutricionistas no gerenciamento de pacientes, acompanhamento de consultas e geração de planos alimentares inteligentes.

---

## 🚀 Funcionalidades Principais

- **Dashboard Inteligente**: Visão geral dos pacientes, próximas consultas e alertas de retorno.
- **Gestão de Pacientes**: Cadastro completo com dados pessoais, clínicos e de hábitos alimentares.
- **Acompanhamento de Consultas**: Registro de medidas antropométricas (peso, cintura, quadril, % de gordura) e observações clínicas.
- **Gráficos de Evolução**: Visualização dinâmica da evolução do peso do paciente ao longo do tempo através de gráficos interativos.
- **Geração de Planos Alimentares**: Ferramenta para estruturação de dietas personalizadas (com integração futura de IA).
- **Autenticação Segura**: Sistema de login e cadastro protegido para garantir a privacidade dos dados.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as melhores tecnologias do ecossistema Web atual:

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Linguagem**: JavaScript (ES6+)
- **Estilização**: CSS Nativo (Vanilla CSS) com variáveis para um design consistente e premium.
- **Banco de Dados & Autenticação**: [Supabase](https://supabase.com/) (PostgreSQL + RLS para segurança de dados).
- **Gráficos**: [Recharts](https://recharts.org/) para visualização de dados.
- **Roteamento**: [React Router 7](https://reactrouter.com/).

---

## 💻 Desenvolvimento do Projeto

O desenvolvimento seguiu uma metodologia ágil e focada em UX (User Experience):

1.  **Arquitetura de Dados**: Estruturação de tabelas relacionais no Supabase com políticas de segurança (Row Level Security) para garantir que cada nutricionista acesse apenas seus próprios dados.
2.  **Design System**: Criação de um sistema de cores baseado no tom **Emerald Green**, transmitindo saúde, profissionalismo e modernidade.
3.  **Componentização**: Desenvolvimento de componentes reutilizáveis como `Sidebar`, `AuthLayout` e modais dinâmicos para manter a consistência visual.
4.  **Integração em Tempo Real**: Uso do SDK do Supabase para operações de leitura e escrita instantâneas.
5.  **Otimização para Produção**: Configuração de roteamento SPA com `vercel.json` para evitar erros de 404 e garantir uma navegação fluida.

---

## 📦 Como rodar o projeto localmente

1.  **Clonar o repositório**:
    ```bash
    git clone https://github.com/guuhferiani/NutriFeriani.git
    ```

2.  **Instalar dependências**:
    ```bash
    npm install
    ```

3.  **Configurar variáveis de ambiente**:
    Crie um arquivo `.env.local` na raiz com as chaves do Supabase:
    ```env
    VITE_SUPABASE_URL=seu_url_aqui
    VITE_SUPABASE_ANON_KEY=sua_chave_aqui
    ```

4.  **Iniciar o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

---

## 📄 Licença

Este projeto é de uso privado e confidencial.

---

*Desenvolvido com ❤️ para facilitar a vida dos profissionais da saúde.*
