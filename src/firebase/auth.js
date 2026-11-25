// Ingreso con Google (V4).
// Antes cada navegador entraba con un usuario anónimo. Ahora cada persona entra
// con su cuenta de Google, así su diario la sigue en cualquier dispositivo.
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './config'

// Abre la ventanita de Google para elegir la cuenta
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

// Cierra la sesión
export function logout() {
  return signOut(auth)
}

// Devuelve true si hay alguien que ingresó con Google.
// Si el navegador todavía tiene una sesión anónima vieja, no cuenta como ingresado.
export function isLoggedIn(user) {
  return Boolean(user) && !user.isAnonymous
}
