import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from '../firebase/diary'
import DiaryForm from '../components/DiaryForm'
import StatusMessage from '../components/StatusMessage'

// Convierte la fecha que guarda Firebase en un texto como "12/11/2026"
function formatDate(timestamp) {
  if (!timestamp) {
    return ''
  }
  return timestamp.toDate().toLocaleDateString('es-AR')
}

function MyDiary() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null) // id del registro que se está editando
  const [message, setMessage] = useState({ type: '', text: '' })

  // READ: trae los registros desde Firebase
  // (loading arranca en true, y se pasa a false cuando llegan los datos)
  async function loadEntries() {
    try {
      const data = await getDiaryEntries()
      setEntries(data)
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cargar tu diario. Revisá tu conexión.' })
    }
    setLoading(false)
  }

  // Se ejecuta una sola vez, cuando se abre la pantalla
  useEffect(() => {
    loadEntries()
  }, [])

  // UPDATE: guarda los cambios de un registro
  async function handleUpdate(entry, values) {
    await updateDiaryEntry(entry.id, values)
    setEditingId(null)
    setMessage({ type: 'success', text: `Se actualizó "${entry.songTitle}".` })
    loadEntries()
  }

  // DELETE: borra un registro después de pedir confirmación
  async function handleDelete(entry) {
    const confirmed = window.confirm(`¿Borrar "${entry.songTitle}" de tu diario?`)
    if (!confirmed) {
      return
    }

    try {
      await deleteDiaryEntry(entry.id)
      setMessage({ type: 'success', text: `Se borró "${entry.songTitle}".` })
      loadEntries()
    } catch {
      setMessage({ type: 'error', text: 'No se pudo borrar. Probá de nuevo.' })
    }
  }

  return (
    <section className="page">
      <h1>Mi diario</h1>
      <p>Las canciones que registraste, con tus estrellas y reseñas.</p>

      <StatusMessage type={message.type} text={message.text} />

      {loading && <p className="loading">Cargando tu diario…</p>}

      {!loading && entries.length === 0 && (
        <p className="empty-state">
          Todavía no registraste ninguna canción. <Link to="/eras">Elegí una era</Link> para
          empezar.
        </p>
      )}

      <ul className="diary-list">
        {entries.map((entry) => (
          <li key={entry.id} className="diary-entry">
            {editingId === entry.id ? (
              <DiaryForm
                songTitle={entry.songTitle}
                initialValues={entry}
                submitLabel="Guardar cambios"
                onSubmit={(values) => handleUpdate(entry, values)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <p className="diary-entry-album">
                  <Link to={`/eras/${entry.albumId}`}>{entry.albumTitle}</Link> ·{' '}
                  {formatDate(entry.createdAt)}
                </p>
                <h2 className="diary-entry-title">{entry.songTitle}</h2>
                <p className="diary-entry-rating" aria-label={`${entry.rating} de 5 estrellas`}>
                  {'★'.repeat(entry.rating)}
                  {'☆'.repeat(5 - entry.rating)}
                </p>
                {entry.review && <p className="diary-entry-review">{entry.review}</p>}
                <p className="diary-entry-tags">
                  {entry.listened ? 'Escuchada' : 'Sin escuchar'}
                  {entry.favorite && ' · ♥ Favorita'}
                </p>

                <div className="form-buttons">
                  <button
                    className="button-secondary"
                    onClick={() => {
                      setEditingId(entry.id)
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    Editar
                  </button>
                  <button className="button-danger" onClick={() => handleDelete(entry)}>
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MyDiary
