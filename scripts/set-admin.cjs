// Importa o SDK Admin do Firebase e a chave da conta de serviço
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// --- Configuração ---
// O email do usuário que você quer promover a administrador
const USER_EMAIL = 'admin@exemplo.com';
const ROLE_TO_SET = 'admin';
// --------------------

// Inicializa a aplicação Admin com as credenciais da conta de serviço
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Função principal assíncrona para fazer o trabalho
async function setAdminRole() {
  console.log(`Iniciando processo para definir o papel de '${ROLE_TO_SET}' para o usuário ${USER_EMAIL}...`);

  try {
    // 1. Encontra o usuário pelo email
    const user = await admin.auth().getUserByEmail(USER_EMAIL);
    console.log(`Usuário encontrado: ${user.uid}`);

    // 2. Define o Custom Claim (o papel) para o usuário encontrado
    // O segundo parâmetro de setCustomUserClaims SUBSTITUI todos os claims existentes.
    await admin.auth().setCustomUserClaims(user.uid, { role: ROLE_TO_SET });

    // 3. Confirmação
    console.log('----------------------------------------------------');
    console.log('✅ SUCESSO!');
    console.log(`O papel de '${ROLE_TO_SET}' foi atribuído a ${USER_EMAIL}.`);
    console.log('O usuário agora precisa fazer login novamente para que a mudança tenha efeito.');
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('❌ ERRO AO ATRIBUIR O PAPEL:');
    if (error.code === 'auth/user-not-found') {
      console.error(`O usuário com o email "${USER_EMAIL}" não foi encontrado no Firebase Authentication.`);
      console.error('Por favor, verifique se o usuário foi criado corretamente.');
    } else {
      console.error(error);
    }
  }
}

// Executa a função
setAdminRole();
