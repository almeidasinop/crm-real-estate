# CRM Imobiliário

Este é um aplicativo completo de CRM (Customer Relationship Management) para o setor imobiliário, construído com Vite, React, TypeScript e ShadCN UI. Ele oferece uma solução completa para imobiliárias gerenciarem propriedades, clientes, corretores e pipelines de vendas. A aplicação é integrada com o Firebase para armazenamento de dados em tempo real e autenticação.

## ✨ Funcionalidades

- **Dashboard:** Uma visão geral das principais métricas, incluindo desempenho de vendas, leads ativos, listagens de imóveis e taxas de conversão. Também exibe atividades recentes e tarefas futuras.
- **Gestão de Propriedades:** Um sistema completo para gerenciar os anúncios de imóveis. Você pode adicionar, editar e visualizar propriedades com informações detalhadas como preço, área, número de quartos e status (disponível, vendido, alugado).
- **Gestão de Clientes:** Uma seção dedicada para gerenciar as informações dos clientes, incluindo seus detalhes de contato e preferências.
- **Gestão de Corretores:** Um módulo para gerenciar os corretores de imóveis, acompanhar seu desempenho e atribuí-los a propriedades.
- **Pipeline de Vendas:** Um pipeline visual para acompanhar o status dos leads e negócios, desde o contato inicial até o fechamento.
- **Acompanhamento Financeiro:** Uma seção para monitorar o desempenho financeiro da agência, incluindo receitas, despesas e comissões.
- **Estatísticas e Relatórios:** Estatísticas e relatórios detalhados sobre vendas, desempenho de corretores e fontes de leads.
- **Integração com Firebase:** Sincronização de dados em tempo real e autenticação com a tecnologia do Firebase.
- **Design Responsivo:** A aplicação é totalmente responsiva e funciona em todos os dispositivos.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Roteamento:** [React Router](https://reactrouter.com/)
- **Gerenciamento de Estado:** [React Query](https://tanstack.com/query/latest)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase](https://firebase.google.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/)

## 🚀 Como Começar

Para começar a usar o projeto, siga estes passos:

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/nome-do-seu-repo.git
    cd nome-do-seu-repo
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o Firebase:**

    - Crie um novo projeto no [Console do Firebase](https://console.firebase.google.com/).
    - Adicione um aplicativo da web ao seu projeto e copie a configuração do Firebase.
    - Crie um arquivo `.env` na raiz do projeto e adicione sua configuração do Firebase:

    ```
    VITE_FIREBASE_API_KEY=sua-api-key
    VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
    VITE_FIREBASE_PROJECT_ID=seu-project-id
    VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
    VITE_FIREBASE_APP_ID=seu-app-id
    ```

4.  **Execute o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

5.  **Abra seu navegador e acesse `http://localhost:5173`**

## Scripts

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run lint`: Executa o linter no código.
-   `npm run preview`: Pré-visualiza a build de produção.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
