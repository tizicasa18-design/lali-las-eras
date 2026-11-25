// Hook propio: cualquier pantalla puede saber quién ingresó.
// Uso useState para guardar el usuario y useEffect para "escuchar" a Firebase:
// cada vez que alguien entra o sale, Firebase avisa y actualizo el estado.
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { isLoggedIn } from '../firebase/auth'

export function useUser() {
  const [user, setUser] = useState(null)
  // checking = true mientras Firebase todavía no sabe si había una sesión abierta
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // onAuthStateChanged se ejecuta al abrir la página y cada vez que alguien entra o sale
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(isLoggedIn(currentUser) ? currentUser : null)
      setChecking(false)
    })
    // Cuando el componente desaparece, dejo de escuchar
    return unsubscribe
  }, [])

  return { user, checking }
}
