# TaskFlow - Aplicativo Moderno de Lista de Tarefas

> Aplicativo web de alta produtividade para gerenciamento de tarefas, com design limpo, categorização visual, priorização, métricas em tempo real e visualização em calendário.

---

## 🚀 Funcionalidades Principais

- **CRUD Completo de Tarefas**:
  - Criar tarefas com título em destaque, descrição opcional, categoria, prioridade e data de conclusão.
  - Editar tarefas existentes com preenchimento automático.
  - Marcar tarefas como concluídas com transição visual suave, texto tachado e opacidade reduzida.
  - Excluir tarefas com diálogo de confirmação seguro.
- **Categorização Colorida**:
  - Tags estilizadas para **Trabalho**, **Pessoal**, **Estudos** e **Outros** com cores harmoniosas e de alto contraste.
- **Sistema de Priorização**:
  - Níveis de prioridade **Alta**, **Média** e **Baixa** com badges visuais distintas.
- **Data de Vencimento e Prazos**:
  - Exibição de data com ícone de calendário.
  - Indicação clara para tarefas vencendo "Hoje" e alerta visual para tarefas atrasadas.
- **Filtros e Busca Instantânea**:
  - Filtros rápidos por estado: `Todas`, `Pendentes` e `Concluídas`.
  - Filtro por categorias via chips clicáveis.
  - Busca textual em tempo real por título ou descrição.
- **Cabeçalho (Navbar) com 3 Módulos**:
  - **Tarefas**: Painel principal da lista com contador de tarefas pendentes.
  - **Análises**: Painel de métricas com taxa de conclusão, KPIs de desempenho e gráficos de distribuição por categoria e urgência.
  - **Calendário**: Grade mensal interativa que agrupa as tarefas por dia de vencimento com atalhos para criação rápida.
  - **Botão Sair**: Encerramento de sessão com confirmação.
- **Persistência de Dados em Nuvem (Supabase)**:
  - Persistência direta no **Supabase** (projeto `lista-tarefas`).
  - Sincronização em tempo real (**Supabase Realtime**) entre dispositivos e abas.
  - Segurança ativada via Row Level Security (**RLS**).
  - Fallback gracioso com redundância em cache local.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**: Biblioteca moderna e performática para interfaces reativas.
- **TypeScript**: Tipagem estática rigorosa para confiabilidade do código.
- **Supabase**: Backend serverless PostgreSQL com API REST e Realtime.
- **Vite**: Ferramenta de build ultrarrápida com Hot Module Replacement (HMR).
- **Tailwind CSS**: Estilização baseada em utilitários modernos e paleta de cores claras.
- **Lucide React**: Conjunto de ícones leves e consistentes.

---

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior instalada).
- Gerenciador de pacotes **npm**, **yarn** ou **pnpm**.

---

## ⚙️ Instalação e Execução Local

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/rafaelsilvaassistente-ctrl/09-Listas-de-tarefas.git
   cd "09 Listas de tarefas"
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Copie o arquivo de exemplo e configure suas chaves do Supabase:
   ```bash
   cp .env.example .env
   ```
   Defina as variáveis no arquivo `.env`:
   - `VITE_SUPABASE_URL`: URL da sua instância Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima (anon key) do seu projeto.

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a URL exibida no terminal (normalmente `http://localhost:5173`).

---

## 🔍 Qualidade de Código (Lint)

Para verificar padrões e qualidade do código:
```bash
npm run lint
```

---

## 📦 Build e Execução em Produção

1. **Gerar a build otimizada**:
   ```bash
   npm run build
   ```
   Os arquivos compilados serão gerados no diretório `dist/`.

2. **Visualizar localmente a versão de produção**:
   ```bash
   npm run preview
   ```

---

## 📁 Estrutura do Projeto

```text
09 Listas de tarefas/
├── index.html                   # Ponto de entrada HTML com SEO e fontes
├── package.json                 # Metadados e dependências
├── tsconfig.json                # Configurações TypeScript
├── vite.config.ts               # Configuração do Vite e Tailwind CSS
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── src/
│   ├── main.tsx                 # Inicialização do React
│   ├── App.tsx                  # Componente raiz com navegação e modais
│   ├── index.css                # Importação Tailwind CSS e estilos base
│   ├── types/
│   │   └── task.ts              # Tipos TypeScript (Task, Category, Priority, Filter)
│   ├── services/
│   │   ├── taskRepository.ts      # Interface desacoplada de repositório
│   │   ├── supabaseClient.ts      # Instância do cliente Supabase
│   │   ├── supabaseService.ts     # Repositório conectado ao Supabase
│   │   └── localStorageService.ts # Fallback e cache local
│   ├── hooks/
│   │   └── useTasks.ts            # Hook com estado, sincronização Realtime e métricas
│   ├── utils/
│   │   └── constants.ts         # Configurações visuais e dados iniciais
│   └── components/
│       ├── Navbar.tsx           # Navegação superior e contador
│       ├── TaskItem.tsx         # Item individual com checkbox e ações
│       ├── TaskList.tsx         # Lista com filtros e busca
│       ├── TaskFormModal.tsx    # Modal de criação e edição
│       ├── AnalyticsView.tsx    # Métricas e gráficos de distribuição
│       ├── CalendarView.tsx     # Grade mensal de tarefas por data
│       └── ConfirmModal.tsx     # Diálogos de confirmação
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para obter mais detalhes.
