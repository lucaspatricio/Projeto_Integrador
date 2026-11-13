# GestãoFit

O GestãoFit é uma aplicação web para apoiar a rotina de uma academia. O projeto está sendo desenvolvido como front-end em React: reúne em um único painel informações e ferramentas para administradores, professores e alunos, com áreas e menus específicos para cada perfil.

## Sobre o projeto

A proposta é tornar mais simples o acompanhamento das atividades da academia:

- **Administrador:** visão geral da academia, alunos, financeiro, frequência, equipamentos e configurações.
- **Professor:** visão geral, aulas, alunos, frequência, agenda e preferências profissionais.
- **Aluno:** painel pessoal, treino, frequência, plano, agenda e preferências da conta.

Cada perfil tem uma navegação e um conteúdo próprios. A interface é responsiva para diferentes tamanhos de tela e está em português.

### Estado atual

O projeto está na etapa de desenvolvimento do front-end. As telas usam conteúdo de demonstração local para permitir navegar e avaliar os fluxos sem depender de um servidor. O acesso também é demonstrativo: na tela de login, é possível entrar diretamente como administrador, professor ou aluno.

Ainda não há autenticação real, persistência de dados ou conexão ativa com um banco de dados. A estrutura prevê serviços separados por funcionalidade para facilitar a futura ligação com um back-end.

## Tecnologias

- React 18 para componentes e interface.
- TypeScript para tipagem gradual dos serviços, autenticação e novas funcionalidades.
- Vite para desenvolvimento local e geração do build.
- Tailwind CSS 4 para estilos responsivos.
- Lucide React para ícones.

## Requisitos

- Node.js versão 18 ou superior.
- npm, instalado junto com o Node.js.

Para conferir as versões instaladas:

```bash
node --version
npm --version
```

## Instalar e iniciar

1. Abra um terminal na pasta do projeto.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor local de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra no navegador o endereço mostrado pelo Vite no terminal, normalmente `http://localhost:5173`.
5. Na tela inicial, escolha um perfil pelos atalhos de demonstração para explorar a respectiva área.

O servidor atualiza a página automaticamente quando arquivos do projeto são alterados. Para interrompê-lo, use `Ctrl+C` no terminal em que ele está rodando.

## Comandos disponíveis

```bash
npm run dev      # inicia o servidor local de desenvolvimento
npm run typecheck # verifica os arquivos TypeScript
npm run build    # verifica os tipos e gera o build otimizado na pasta dist
npm run preview  # serve localmente o build de produção
```

Para conferir localmente o resultado de produção:

```bash
npm run build
npm run preview
```

## Organização do código

```text
src/
├── App.tsx                         # entrada da aplicação e estado de sessão
├── components/                     # componentes visuais compartilhados
├── data/
│   └── roles.js                    # perfis, menus e dados gerais demonstrativos
├── lib/
│   └── api/                        # cliente HTTP e seleção do modo de dados
└── features/
    ├── admin/
    │   ├── overview/               # painel administrativo
    │   ├── students/               # consulta e cadastro demonstrativo de alunos
    │   ├── finance/                # área financeira
    │   ├── attendance/             # frequência
    │   ├── equipment/              # equipamentos e manutenção
    │   ├── settings/               # configurações
    │   └── admin.service.ts        # operações previstas para a API administrativa
    ├── professor/
    │   ├── data/                   # conteúdo demonstrativo do professor
    │   ├── ProfessorOverview.jsx   # painel do professor
    │   ├── ProfessorFeature.jsx    # seleção das telas do perfil
    │   └── professor.service.ts    # operações previstas para a API do professor
    ├── aluno/
    │   ├── data/                   # conteúdo demonstrativo do aluno
    │   ├── StudentOverview.jsx     # painel do aluno
    │   ├── StudentFeature.jsx      # seleção das telas do perfil
    │   └── student.service.ts      # operações previstas para a API do aluno
    ├── auth/                       # tela de acesso e serviço de autenticação
    │   ├── Login.tsx
    │   └── auth.service.ts
    ├── dashboard/                  # estrutura compartilhada do painel e navegação
    └── shared/                     # telas reutilizáveis entre perfis
```

As telas e os dados específicos ficam junto da feature correspondente. O layout do painel, os componentes visuais compartilhados e a comunicação HTTP ficam em áreas comuns. Assim, é possível desenvolver cada perfil sem concentrar toda a aplicação em um único arquivo.

O TypeScript foi introduzido de forma gradual: os pontos centrais de autenticação, sessão, serviços HTTP e formatação de data do painel já usam tipos, enquanto as telas existentes em JavaScript podem ser migradas conforme forem evoluídas. A configuração permite essa convivência durante a transição.

## Integração futura

Já existe uma base de serviços por perfil e um cliente HTTP para organizar a futura comunicação com uma API. Esses serviços definem pontos de integração, mas as telas ainda apresentam dados locais demonstrativos. A autenticação e a persistência reais serão implementadas junto com o back-end, de acordo com os fluxos e contratos que forem definidos para ele.
