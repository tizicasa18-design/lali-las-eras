import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { uploadAlbums } from '../firebase/catalog'
import albumsSeed from '../data/albumsSeed'
import LoginPrompt from '../components/LoginPrompt'
import StatusMessage from '../components/StatusMessage'

// Página de administración (V4). No está en el menú: se entra escribiendo /admin.
// Sirve para subir el catálogo de álbumes a Firestore.
// Aunque cualquiera llegue a esta página, solo la administradora puede escribir:
// lo controlan las reglas de Firestore, no esta pantalla.
function Admin() {
  const { user, checking } = useUser()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleUpload() {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      await uploadAlbums(albumsSeed)
      setMessage({ type: 'success', text: `Se cargaron ${albumsSeed.length} eras en Firestore.` })
    } catch (error) {
      console.error(error)
      setMessage({
        type: 'error',
        text: `No se pudo cargar. Si no sos la administradora, las reglas de Firestore lo bloquean. (${error.code})`,
      })
    }
    setSaving(false)
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="kicker">Administración</p>
        <h1>Catálogo</h1>
        <p>Sube los álbumes de Lali a la base de datos (colección "albums").</p>
      </header>

      {checking && <p className="loading">Cargando…</p>}
      {!checking && !user && <LoginPrompt />}

      {user && (
        <div className="empty-state">
          <p>
            Tu id de usuario: <code>{user.uid}</code>
          </p>
          <p>Se van a cargar {albumsSeed.length} eras desde src/data/albumsSeed.js.</p>
          <button className="button" onClick={handleUpload} disabled={saving}>
            {saving ? 'Cargando…' : 'Cargar catálogo en Firestore'}
          </button>
          <StatusMessage type={message.type} text={message.text} />
        </div>
      )}
    </section>
  )
}

export default Admin
