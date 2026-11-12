import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAlbumById, getSongId, studioAlbums } from '../data/albums'
import { getDiaryEntries, addDiaryEntry } from '../firebase/diary'
import AlbumCover from '../components/AlbumCover'
import DiaryForm from '../components/DiaryForm'
import StatusMessage from '../components/StatusMessage'

// Una sola pantalla que sirve para todos los álbumes.
// Lee el id de la URL (por ejemplo /eras/brava) y busca ese álbum.
function EraDetail() {
  const { albumId } = useParams()
  const album = getAlbumById(albumId)

  // ids de las canciones que ya están en el diario (por ejemplo 'brava-3')
  const [registeredIds, setRegisteredIds] = useState([])
  const [loading, setLoading] = useState(true)
  // posición de la canción que se está registrando (null = ningún formulario abierto)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  // READ: pregunta a Firebase qué canciones ya registré
  async function loadRegisteredSongs() {
    try {
      const entries = await getDiaryEntries()
      setRegisteredIds(entries.map((entry) => entry.id))
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cargar tu diario. Revisá tu conexión.' })
    }
    setLoading(false)
  }

  // Se ejecuta al abrir la pantalla y cada vez que cambio de álbum
  useEffect(() => {
    loadRegisteredSongs()
  }, [albumId])

  // Al pasar a otra era, cierro el formulario y borro el mensaje anterior
  function resetForNewAlbum() {
    setSelectedIndex(null)
    setMessage({ type: '', text: '' })
    setLoading(true)
  }

  // Si alguien escribe una URL que no existe
  if (!album) {
    return (
      <section className="page">
        <h1>Era no encontrada</h1>
        <p>No existe un álbum con esa dirección.</p>
        <Link to="/eras">Volver a Las eras</Link>
      </section>
    )
  }

  // CREATE: guarda la canción en Firebase
  async function handleAddEntry(songIndex, values) {
    const songId = getSongId(album.id, songIndex)
    await addDiaryEntry(songId, {
      ...values,
      songTitle: album.songs[songIndex],
      albumId: album.id,
      albumTitle: album.title,
    })
    setSelectedIndex(null)
    setMessage({ type: 'success', text: `"${album.songs[songIndex]}" se guardó en tu diario.` })
    loadRegisteredSongs() // vuelvo a leer de Firebase para mostrar lo que realmente se guardó
  }

  // Cuántas canciones de este álbum ya están en el diario
  const registeredCount = album.songs.filter((song, index) =>
    registeredIds.includes(getSongId(album.id, index)),
  ).length

  // Era anterior y siguiente (solo entre las 6 de estudio)
  const position = studioAlbums.findIndex((item) => item.id === album.id)
  const previousAlbum = position > 0 ? studioAlbums[position - 1] : null
  const nextAlbum = position >= 0 && position < studioAlbums.length - 1 ? studioAlbums[position + 1] : null

  // Porcentaje de canciones registradas, para la barra de progreso
  const progress = Math.round((registeredCount / album.songs.length) * 100)

  return (
    <section className="page">
      {/* Miga de pan: muestra dónde estoy y permite volver */}
      <nav className="breadcrumb" aria-label="Ubicación">
        <Link to="/eras">Las eras</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{album.title}</span>
      </nav>

      <div className="era-header">
        <AlbumCover album={album} />
        <div>
          <p className="kicker">{album.special ? 'Era especial' : 'Álbum de estudio'}</p>
          <h1>{album.title}</h1>
          {album.artist && <p className="era-artist">{album.artist}</p>}
          <p>{album.description}</p>

          {/* Ficha del álbum */}
          <dl className="era-facts">
            <div>
              <dt>Año</dt>
              <dd>{album.year}</dd>
            </div>
            <div>
              <dt>Canciones</dt>
              <dd>{album.songs.length}</dd>
            </div>
            <div>
              <dt>En tu diario</dt>
              <dd>{loading ? '…' : registeredCount}</dd>
            </div>
          </dl>

          {!loading && (
            <div className="progress" aria-hidden="true">
              <div
                className="progress-bar"
                style={{ width: `${progress}%`, backgroundColor: album.colors.accent }}
              />
            </div>
          )}
        </div>
      </div>

      <h2>Canciones</h2>
      <p className="form-hint">
        Agregá a tu diario las que escuchaste, o guardalas como pendientes para escucharlas después.
      </p>
      <StatusMessage type={message.type} text={message.text} />
      {loading && <p className="loading">Cargando tu diario…</p>}

      <ol className="song-list">
        {album.songs.map((song, index) => {
          const isRegistered = registeredIds.includes(getSongId(album.id, index))

          return (
            <li key={song}>
              <div className="song-row">
                <span>{song}</span>
                {isRegistered && (
                  <Link to="/diario" className="song-registered">
                    ✓ En tu diario · Ver
                  </Link>
                )}
                {!isRegistered && !loading && selectedIndex !== index && (
                  <button
                    className="button-secondary"
                    aria-label={`Agregar ${song} a mi diario`}
                    onClick={() => {
                      setSelectedIndex(index)
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    + Agregar a mi diario
                  </button>
                )}
              </div>

              {selectedIndex === index && (
                <DiaryForm
                  songTitle={song}
                  submitLabel="Guardar en mi diario"
                  onSubmit={(values) => handleAddEntry(index, values)}
                  onCancel={() => setSelectedIndex(null)}
                />
              )}
            </li>
          )
        })}
      </ol>

      <nav className="era-nav" aria-label="Navegación entre eras">
        {previousAlbum && (
          <Link to={`/eras/${previousAlbum.id}`} onClick={resetForNewAlbum}>
            <span className="era-nav-label">← Era anterior</span>
            {previousAlbum.title}
          </Link>
        )}
        {nextAlbum && (
          <Link to={`/eras/${nextAlbum.id}`} className="era-nav-next" onClick={resetForNewAlbum}>
            <span className="era-nav-label">Era siguiente →</span>
            {nextAlbum.title}
          </Link>
        )}
      </nav>
    </section>
  )
}

export default EraDetail
