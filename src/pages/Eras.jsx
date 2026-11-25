import { Link } from 'react-router-dom'
import { useAlbums } from '../hooks/useAlbums'
import AlbumCover from '../components/AlbumCover'
import StatusMessage from '../components/StatusMessage'

// Muestra una tarjeta por álbum. La uso para las 6 eras y para la era especial.
function AlbumCard({ album }) {
  return (
    <li className="album-card">
      <Link to={`/eras/${album.id}`}>
        <AlbumCover album={album} />
        <span className="album-card-year">{album.year}</span>
        <span className="album-card-title">{album.title}</span>
        <span className="album-card-songs">{album.songs.length} canciones</span>
        <span className="album-card-cta">Ver canciones →</span>
      </Link>
    </li>
  )
}

function Eras() {
  // V4: las eras vienen de Firestore
  const { studioAlbums, specialAlbums, loading, error } = useAlbums()

  return (
    <section className="page">
      {/* Encabezado negro, igual en todas las secciones */}
      <header className="page-header">
        <p className="kicker">Discografía</p>
        <h1>Las eras</h1>
        <p>
          Los seis álbumes de estudio de Lali, en orden cronológico. Entrá a una era para ver sus
          canciones y agregarlas a tu diario.
        </p>
      </header>

      {loading && <p className="loading">Cargando las eras…</p>}
      <StatusMessage type="error" text={error} />

      <ul className="album-grid">
        {studioAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </ul>

      {/* Bloque invertido: fondo negro y letra blanca (solo si ya llegó la era especial) */}
      {specialAlbums.length > 0 && (
        <div className="special-section">
          <h2>Era especial</h2>
          <p>Colaboraciones y proyectos compartidos, fuera de los álbumes de estudio.</p>
          <ul className="album-grid">
            {specialAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default Eras
