// Conexión con Firebase.
// Los datos se leen del archivo .env (que no se sube a GitHub) con import.meta.env.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Inicia la app de Firebase con mis datos
const app = initializeApp(firebaseConfig)

// db: la base de datos Firestore (donde se guarda el diario)
export const db = getFirestore(app)

// auth: el inicio de sesión anónimo (para saber de quién es cada diario)
export const auth = getAuth(app)
