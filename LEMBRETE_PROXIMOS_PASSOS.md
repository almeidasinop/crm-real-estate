# Lembrete de Próximos Passos - CRM Imobiliário

Olá! Aqui está um resumo do que fizemos e um plano para continuarmos.

## O Que Concluímos Hoje

Construímos uma base de aplicação segura e robusta.
1.  **Sistema de Autenticação Completo:** Implementamos o fluxo de login, logout, contexto de autenticação (`AuthContext`) e rotas protegidas (`ProtectedRoute`).
2.  **Autorização por Papel (Role-Based Access Control):**
    *   Criamos uma Cloud Function (`setUserRole`) para definir papéis de 'admin' e 'corretor'.
    *   Configuramos o Firebase Admin SDK com uma conta de serviço para executar scripts de backend seguros.
    *   Promovemos com sucesso nosso primeiro usuário (`admin@exemplo.com`) ao papel de 'admin'.
    *   Criamos e protegemos uma página `/admin`, acessível apenas por administradores.

## Próximos Passos Lógicos

Agora que a base de usuários e permissões está pronta, o foco deve ser conectar o frontend aos dados reais do Firebase e refinar a experiência do usuário.

### 1. Conectar as Páginas de Propriedades ao Firebase

*   **Objetivo:** Substituir os dados estáticos (mock data) das páginas de propriedades pelos dados dinâmicos do Firebase.
*   **Páginas a Modificar:**
    *   `src/pages/PropriedadesPage.tsx`: Atualmente usa dados do `useProperties`, o que é bom, mas precisa ser revisado para garantir que a adição/edição de propriedades esteja funcionando e refletindo no Firebase.
    *   `src/pages/PropertyDisplayPage.tsx`: Esta página está usando dados completamente estáticos. Ela precisa buscar uma única propriedade do Firebase com base no `id` da URL.

### 2. Construir a Interface de Administração

*   **Objetivo:** Permitir que um administrador possa gerenciar os papéis de outros usuários através da interface.
*   **Local:** `src/pages/AdminPage.tsx`.
*   **Ação:** Criar um formulário onde o admin digita o email de um usuário e seleciona um papel ('admin' ou 'corretor') para atribuir. Este formulário chamará a nossa Cloud Function `setUserRole`.

### 3. Refinar a UI com Base no Papel do Usuário

*   **Objetivo:** Fazer com que a interface se adapte ao usuário logado.
*   **Ações:**
    *   No `Navbar`, exibir um link para a "Página de Administração" **apenas se** `role === 'admin'`.
    *   Adicionar o email e o papel do usuário logado em algum lugar visível, como perto do botão de logout.

### 4. Limpeza e Segurança (Opcional, mas recomendado)

*   **Objetivo:** Remover arquivos sensíveis que foram usados para a configuração inicial.
*   **Ação:** Considere remover o arquivo `scripts/serviceAccountKey.json`. Ele não é mais necessário para a operação diária do app e é um risco de segurança se for exposto acidentalmente.

Bom descanso e até amanhã!
