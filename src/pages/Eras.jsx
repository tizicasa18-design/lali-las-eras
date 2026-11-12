import { Link } from 'react-router-dom'
import { studioAlbums, specialAlbums } from '../data/albums'
import AlbumCover from '../components/AlbumCover'

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
  return (
    <section className="page">
      <p className="kicker">Discografía</p>
      <h1>Las eras</h1>
      <p>
        Los seis álbumes de estudio de Lali, en orden cronológico. Entrá a una era para ver sus
        canciones y agregarlas a tu diario.
      </p>

      <ul className="album-grid">
        {studioAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </ul>

      <h2>Era especial</h2>
      <p>Colaboraciones y proyectos compartidos, fuera de los álbumes de estudio.</p>
      <ul className="album-grid">
        {specialAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </ul>
    </section>
  )
}

export default Eras
