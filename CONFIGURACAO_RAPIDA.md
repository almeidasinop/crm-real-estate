# 🚀 Configuração Rápida do Firebase

## ⚡ Passos para Configurar o Firebase

### 1. **Criar Projeto no Firebase Console**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome: `crm-imobiliario` (ou outro nome)
4. Siga os passos de configuração (pode desabilitar Google Analytics por enquanto)

### 2. **Habilitar Serviços**

No seu projeto Firebase, habilite:

- ✅ **Firestore Database** (clique em "Criar banco de dados")
- ✅ **Authentication** (clique em "Começar")
- ✅ **Storage** (clique em "Começar")

### 3. **Configurar Firestore**

1. Vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha uma localização (ex: `us-central1`)

### 4. **Obter Credenciais**

1. Vá em "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" → "Web"
4. Digite um nome: `crm-imobiliario-web`
5. **Copie o objeto `firebaseConfig`**

### 5. **Configurar Variáveis de Ambiente**

1. Na raiz do projeto, crie um arquivo `.env.local`
2. Cole o conteúdo abaixo e substitua pelos seus valores:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 6. **Testar a Configuração**

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse: `http://localhost:5173/teste-firebase`
3. Clique em "Testar Firebase"
4. Se tudo estiver OK, clique em "Criar Dados de Exemplo"

## 🔧 Exemplo de Configuração

Seu arquivo `.env.local` deve ficar assim:

```env
VITE_FIREBASE_API_KEY=AIzaSyC_1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=crm-imobiliario.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=crm-imobiliario
VITE_FIREBASE_STORAGE_BUCKET=crm-imobiliario.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🎯 Próximos Passos

Após configurar:

1. ✅ Teste a conexão na página `/teste-firebase`
2. ✅ Crie dados de exemplo
3. ✅ Teste os componentes existentes
4. ✅ Comece a desenvolver novas funcionalidades

## 🆘 Solução de Problemas

### Erro: "Variáveis de ambiente não configuradas"

- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Reinicie o servidor após criar o arquivo
- Verifique se os nomes das variáveis estão corretos

### Erro: "Firebase não inicializado"

- Verifique se todas as variáveis estão preenchidas
- Verifique se o projeto Firebase existe
- Verifique se os serviços estão habilitados

### Erro: "Permissão negada"

- No Firestore, vá em "Regras"
- Temporariamente, use regras de teste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📞 Suporte

Se ainda tiver problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs no Firebase Console
3. Teste na página `/teste-firebase` para diagnóstico

---

**🎉 Pronto!** Após seguir estes passos, o Firebase estará configurado e funcionando!
