import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from '../firebase/diary'
import albums, { getAlbumById } from '../data/albums'
import DiaryForm from '../components/DiaryForm'
import StarRating from '../components/StarRating'
import StatusMessage from '../components/StatusMessage'

// Convierte la fecha que guarda Firebase en un texto como "12/11/2026"
function formatDate(timestamp) {
  if (!timestamp) {
    return ''
  }
  return timestamp.toDate().toLocaleDateString('es-AR')
}

// Color de la era de cada registro (para el borde de la entrada)
function getAlbumColor(albumId) {
  const album = getAlbumById(albumId)
  return album ? album.colors.accent : '#171313'
}

function MyDiary() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null) // id del registro que se está editando
  const [editingValues, setEditingValues] = useState(null) // datos con los que arranca el formulario
  const [updatingId, setUpdatingId] = useState(null) // id del registro que se está guardando
  const [message, setMessage] = useState({ type: '', text: '' })

  // Filtros
  const [albumFilter, setAlbumFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')

  // READ: trae los registros desde Firebase
  // (loading arranca en true, y se pasa a false cuando llegan los datos)
  async function loadEntries() {
    try {
      const data = await getDiaryEntries()
      setEntries(data)
    } catch (error) {
      console.error(error) // deja el detalle del error en la consola del navegador
      setMessage({ type: 'error', text: 'No se pudo cargar tu diario. Revisá tu conexión.' })
    }
    setLoading(false)
  }

  // Se ejecuta una sola vez, cuando se abre la pantalla
  useEffect(() => {
    loadEntries()
  }, [])

  // UPDATE: guarda los cambios del formulario de edición
  async function handleUpdate(entry, values) {
    await updateDiaryEntry(entry.id, values)
    setEditingId(null)
    setMessage({ type: 'success', text: `Se actualizó "${entry.songTitle}".` })
    loadEntries()
  }

  // Abre el formulario de edición de un registro
  function startEditing(entry, values) {
    setEditingId(entry.id)
    setEditingValues(values)
    setMessage({ type: '', text: '' })
  }

  // UPDATE rápido: cambia favorita o escuchada con un solo toque
  async function handleToggle(entry, field) {
    // Si una pendiente pasa a escuchada, primero tiene que puntuarla:
    // abro el formulario con "La escuché" ya marcado
    if (field === 'listened' && !entry.listened) {
      startEditing(entry, { ...entry, listened: true })
      setMessage({ type: 'success', text: 'Puntuala para marcarla como escuchada.' })
      return
    }

    // Si vuelve a pendiente, se le borran las estrellas y deja de ser favorita
    const changes =
      field === 'listened'
        ? { listened: false, rating: 0, favorite: false }
        : { favorite: !entry.favorite }

    setUpdatingId(entry.id)
    try {
      await updateDiaryEntry(entry.id, changes)
      await loadEntries()
    } catch {
      setMessage({ type: 'error', text: 'No se pudo guardar el cambio. Probá de nuevo.' })
    }
    setUpdatingId(null)
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

  function clearFilters() {
    setAlbumFilter('todos')
    setStatusFilter('todos')
  }

  // Aplico los filtros a la lista (no cambia lo que hay en Firebase, solo lo que se muestra)
  const filteredEntries = entries.filter((entry) => {
    if (albumFilter !== 'todos' && entry.albumId !== albumFilter) {
      return false
    }
    if (statusFilter === 'favoritas' && !entry.favorite) {
      return false
    }
    if (statusFilter === 'escuchadas' && !entry.listened) {
      return false
    }
    if (statusFilter === 'sin-escuchar' && entry.listened) {
      return false
    }
    return true
  })

  const favoriteCount = entries.filter((entry) => entry.favorite).length
  const pendingCount = entries.filter((entry) => !entry.listened).length

  return (
    <section className="page">
      <p className="kicker">Tu espacio personal</p>
      <h1>Mi diario</h1>
      <p>Las canciones que escuchaste, tus puntuaciones y reseñas, y las que tenés pendientes.</p>

      {!loading && entries.length > 0 && (
        <p className="diary-counter">
          <strong>{entries.length}</strong> {entries.length === 1 ? 'canción registrada' : 'canciones registradas'} ·{' '}
          <strong>{favoriteCount}</strong> {favoriteCount === 1 ? 'favorita' : 'favoritas'} ·{' '}
          <strong>{pendingCount}</strong> {pendingCount === 1 ? 'pendiente' : 'pendientes'}
        </p>
      )}

      <StatusMessage type={message.type} text={message.text} />

      {loading && <p className="loading">Cargando tu diario…</p>}

      {/* El estado vacío solo se muestra si la carga salió bien (si hubo error, se ve el error) */}
      {!loading && entries.length === 0 && message.type !== 'error' && (
        <div className="empty-state">
          <h2>Tu diario está vacío</h2>
          <p>Así empezás:</p>
          <ol>
            <li>Entrá a una era.</li>
            <li>Tocá "+ Agregar a mi diario" en una canción.</li>
            <li>Puntuala, escribí tu reseña o guardala como pendiente.</li>
          </ol>
          <Link to="/eras" className="button">
            Explorar las eras
          </Link>
        </div>
      )}

      {entries.length > 0 && (
        <div className="diary-filters">
          <label>
            Era
            <select value={albumFilter} onChange={(event) => setAlbumFilter(event.target.value)}>
              <option value="todos">Todas</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mostrar
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="todos">Todas</option>
              <option value="favoritas">Solo favoritas</option>
              <option value="escuchadas">Escuchadas</option>
              <option value="sin-escuchar">Pendientes</option>
            </select>
          </label>
        </div>
      )}

      {entries.length > 0 && filteredEntries.length === 0 && (
        <div className="empty-state">
          <p>Ninguna canción coincide con estos filtros.</p>
          <button className="button-secondary" onClick={clearFilters}>
            Ver todas
          </button>
        </div>
      )}

      <ul className="diary-list">
        {filteredEntries.map((entry) => (
          <li
            key={entry.id}
            className="diary-entry"
            style={{ borderLeftColor: getAlbumColor(entry.albumId) }}
          >
            {editingId === entry.id ? (
              <DiaryForm
                songTitle={entry.songTitle}
                initialValues={editingValues}
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
                {entry.listened ? (
                  <StarRating value={entry.rating} />
                ) : (
                  <p className="pending-badge">Pendiente de escuchar</p>
                )}
                {entry.review && <blockquote className="diary-entry-review">{entry.review}</blockquote>}

                <div className="diary-entry-toggles">
                  {/* El botón de favorita solo aparece en las que ya escuchó */}
                  {entry.listened && (
                    <button
                      className={entry.favorite ? 'toggle active' : 'toggle'}
                      onClick={() => handleToggle(entry, 'favorite')}
                      disabled={updatingId === entry.id}
                      aria-pressed={entry.favorite}
                    >
                      ♥ Favorita
                    </button>
                  )}
                  <button
                    className={entry.listened ? 'toggle active' : 'toggle'}
                    onClick={() => handleToggle(entry, 'listened')}
                    disabled={updatingId === entry.id}
                    aria-pressed={entry.listened}
                  >
                    {entry.listened ? '✓ Escuchada' : 'Marcar como escuchada'}
                  </button>
                </div>

                <div className="form-buttons">
                  <button
                    className="button-secondary"
                    onClick={() => startEditing(entry, entry)}
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
