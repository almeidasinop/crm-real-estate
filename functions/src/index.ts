
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Inicializa o Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// #region Interfaces
interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'corretor';
  cpf?: string;
  birthDate?: string;
  cellphone?: string;
  phone?: string;
  address?: string;
  creciNumber?: string;
  creciState?: string;
  creciValidity?: string;
  specializations?: string;
  bondStart?: string;
  bondType?: string;
  status?: string;
  team?: string;
  bankName?: string;
  agency?: string;
  account?: string;
  accountHolderName?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'corretor';
}
// #endregion


// #region Create User
export const createUser = functions.https.onCall(async (data: CreateUserData, context: functions.https.CallableContext) => {
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Apenas administradores podem criar novos usuários.");
  }
  const { email, password, name, role } = data;
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    await db.collection("users").doc(userRecord.uid).set({
        name, email, role, createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, uid: userRecord.uid };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new functions.https.HttpsError("internal", "Ocorreu um erro interno ao criar o usuário.");
  }
});
// #endregion


// #region List Users
export const listUsers = functions.https.onCall(async (data, context) => {
    if (context.auth?.token.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Apenas administradores podem listar usuários.');
    }
    try {
        const userRecords = await admin.auth().listUsers(1000);
        const users = await Promise.all(userRecords.users.map(async (user) => {
            const firestoreUser = await db.collection('users').doc(user.uid).get();
            const firestoreData = firestoreUser.data() || {};
            return {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                role: user.customClaims?.role || 'corretor',
                ...firestoreData,
            };
        }));
        return users;
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw new functions.https.HttpsError('internal', 'Ocorreu um erro ao buscar a lista de usuários.');
    }
});
// #endregion


// #region Update User
export const updateUser = functions.https.onCall(async (data: UserData, context) => {
    if (context.auth?.token.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Apenas administradores podem atualizar usuários.');
    }

    const { uid, ...userData } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'O UID do usuário é obrigatório.');
    }

    try {
        await admin.auth().updateUser(uid, {
            email: userData.email,
            displayName: userData.name,
        });

        await admin.auth().setCustomUserClaims(uid, { role: userData.role });

        const userRef = db.collection('users').doc(uid);
        await userRef.set({
            ...userData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return { success: true, message: 'Usuário atualizado com sucesso!' };

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw new functions.https.HttpsError('internal', 'Ocorreu um erro ao atualizar o usuário.');
    }
});
// #endregion
