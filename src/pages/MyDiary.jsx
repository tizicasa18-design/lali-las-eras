import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from '../firebase/diary'
import albums, { getListenUrl } from '../data/albums'
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

// Calcula "Tus números" a partir de las canciones que ya escuché.
// No guarda nada nuevo en Firebase: usa los registros que ya están cargados.
function getStats(entries) {
  const listenedEntries = entries.filter((entry) => entry.listened)

  // Top 5: ordeno por estrellas (de mayor a menor). Si empatan, primero las favoritas.
  // Uso [...lista] para no modificar la lista original al ordenar.
  const topSongs = [...listenedEntries]
    .sort((a, b) => b.rating - a.rating || Number(b.favorite) - Number(a.favorite))
    .slice(0, 5)

  // Era favorita: el álbum con el mejor promedio de estrellas
  let favoriteEra = null
  albums.forEach((album) => {
    const albumEntries = listenedEntries.filter((entry) => entry.albumId === album.id)
    if (albumEntries.length === 0) {
      return
    }
    const total = albumEntries.reduce((sum, entry) => sum + entry.rating, 0)
    const average = total / albumEntries.length
    // Si empatan en promedio, gana la que tiene más canciones escuchadas
    if (
      !favoriteEra ||
      average > favoriteEra.average ||
      (average === favoriteEra.average && albumEntries.length > favoriteEra.count)
    ) {
      favoriteEra = { title: album.title, average, count: albumEntries.length }
    }
  })

  const reviewCount = entries.filter((entry) => entry.review).length

  return { topSongs, favoriteEra, reviewCount }
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

  // Una pendiente pasa a escuchada: primero tiene que puntuarla,
  // así que abro el formulario con "La escuché" ya marcado
  function markAsListened(entry) {
    startEditing(entry, { ...entry, listened: true })
    setMessage({ type: 'success', text: 'Puntuala para marcarla como escuchada.' })
  }

  // UPDATE rápido: marca o desmarca favorita con un solo toque
  async function handleToggleFavorite(entry) {
    setUpdatingId(entry.id)
    try {
      await updateDiaryEntry(entry.id, { favorite: !entry.favorite })
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
  const stats = getStats(entries)

  return (
    <section className="page">
      {/* Encabezado negro, igual en todas las secciones */}
      <header className="page-header">
        <p className="kicker">Tu espacio personal</p>
        <h1>Mi diario</h1>
        <p>Lo que sentiste con cada canción, tus puntuaciones y las que tenés pendientes.</p>

        {!loading && entries.length > 0 && (
          <p className="diary-counter">
            <strong>{entries.length}</strong> {entries.length === 1 ? 'canción registrada' : 'canciones registradas'} ·{' '}
            <strong>{favoriteCount}</strong> {favoriteCount === 1 ? 'favorita' : 'favoritas'} ·{' '}
            <strong>{pendingCount}</strong> {pendingCount === 1 ? 'pendiente' : 'pendientes'}
          </p>
        )}
      </header>

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

      {/* Tus números: solo aparece si ya escuchó al menos una canción */}
      {stats.topSongs.length > 0 && (
        <section className="diary-stats" aria-label="Tus números">
          <div className="stat-card">
            <p className="stat-label">Tu era</p>
            <p className="stat-big">{stats.favoriteEra.title}</p>
            <p className="stat-detail">
              {stats.favoriteEra.average.toFixed(1)} ★ de promedio en {stats.favoriteEra.count}{' '}
              {stats.favoriteEra.count === 1 ? 'canción' : 'canciones'}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Lo pusiste en palabras</p>
            <p className="stat-big">{stats.reviewCount}</p>
            <p className="stat-detail">{stats.reviewCount === 1 ? 'reseña escrita' : 'reseñas escritas'}</p>
          </div>

          <div className="stat-card stat-card-top">
            <p className="stat-label">Tu top {stats.topSongs.length}</p>
            <ol className="stat-top">
              {stats.topSongs.map((entry) => (
                <li key={entry.id}>
                  <span>{entry.songTitle}</span>
                  <span className="stat-top-rating">
                    {entry.favorite && '♥ '}
                    {entry.rating} ★
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
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
          <li key={entry.id} className="diary-entry">
            {editingId === entry.id ? (
              <DiaryForm
                songTitle={entry.songTitle}
                initialValues={editingValues}
                alreadyListened={entry.listened}
                submitLabel="Guardar cambios"
                onSubmit={(values) => handleUpdate(entry, values)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                {/* Arriba: datos de la canción a la izquierda y "Escuchar" a la derecha,
                    separado de los botones de abajo que cambian el registro */}
                <div className="diary-entry-top">
                  <div>
                    <p className="diary-entry-album">
                      <Link to={`/eras/${entry.albumId}`}>{entry.albumTitle}</Link> ·{' '}
                      {formatDate(entry.createdAt)}
                    </p>
                    <h2 className="diary-entry-title">{entry.songTitle}</h2>
                  </div>
                  <a
                    className="button button-small"
                    href={getListenUrl(entry.songTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Escuchar ${entry.songTitle} en YouTube (se abre en otra pestaña)`}
                  >
                    ▶ Escuchar
                  </a>
                </div>
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
                      onClick={() => handleToggleFavorite(entry)}
                      disabled={updatingId === entry.id}
                      aria-pressed={entry.favorite}
                    >
                      ♥ Favorita
                    </button>
                  )}
                  {/* Escuchar no se puede deshacer: si ya está escuchada es una etiqueta fija,
                      y solo las pendientes tienen el botón para marcarlas */}
                  {entry.listened ? (
                    <span className="listened-badge">✓ Escuchada</span>
                  ) : (
                    <button className="toggle" onClick={() => markAsListened(entry)}>
                      Marcar como escuchada
                    </button>
                  )}
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
