import { useState } from 'react'
import { loginWithGoogle } from '../firebase/auth'

// Se muestra cuando alguien quiere usar el diario sin haber ingresado.
function LoginPrompt() {
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    try {
      await loginWithGoogle()
    } catch (loginError) {
      // Si la persona cierra la ventanita de Google no es un error: no muestro nada
      if (loginError.code !== 'auth/popup-closed-by-user') {
        console.error(loginError)
        // Muestro el código del error para saber qué pasó (por ejemplo auth/popup-blocked)
        setError(`No se pudo ingresar. Probá de nuevo. (${loginError.code})`)
      }
    }
  }

  return (
    <div className="empty-state">
      <h2>Ingresá para usar tu diario</h2>
      <p>Con tu cuenta de Google tu diario te sigue en la compu y en el celular.</p>
      <button className="button" onClick={handleLogin}>
        Ingresar con Google
      </button>
      {error && (
        <p className="status-message error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default LoginPrompt
