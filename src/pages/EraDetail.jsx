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

  // Era anterior y siguiente (solo entre las 6 de estudio)
  const position = studioAlbums.findIndex((item) => item.id === album.id)
  const previousAlbum = position > 0 ? studioAlbums[position - 1] : null
  const nextAlbum = position >= 0 && position < studioAlbums.length - 1 ? studioAlbums[position + 1] : null

  return (
    <section className="page">
      <Link to="/eras" className="back-link">
        ← Todas las eras
      </Link>

      <div className="era-header">
        <AlbumCover album={album} />
        <div>
          <p className="era-year">{album.special ? `Era especial · ${album.year}` : album.year}</p>
          <h1>{album.title}</h1>
          {album.artist && <p className="era-artist">{album.artist}</p>}
          <p>{album.description}</p>
        </div>
      </div>

      <h2>Canciones</h2>
      <StatusMessage type={message.type} text={message.text} />
      {loading && <p className="loading">Cargando tu diario…</p>}

      <ol className="song-list">
        {album.songs.map((song, index) => {
          const isRegistered = registeredIds.includes(getSongId(album.id, index))

          return (
            <li key={song}>
              <div className="song-row">
                <span>{song}</span>
                {isRegistered && <span className="song-registered">✓ En tu diario</span>}
                {!isRegistered && !loading && selectedIndex !== index && (
                  <button
                    className="button-secondary"
                    aria-label={`Registrar ${song}`}
                    onClick={() => {
                      setSelectedIndex(index)
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    Registrar
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
            ← {previousAlbum.title}
          </Link>
        )}
        {nextAlbum && (
          <Link to={`/eras/${nextAlbum.id}`} className="era-nav-next" onClick={resetForNewAlbum}>
            {nextAlbum.title} →
          </Link>
        )}
      </nav>
    </section>
  )
}

export default EraDetail
