import { Link } from 'react-router-dom'
import { studioAlbums, specialAlbums } from '../data/albums'

function Home() {
  return (
    <section className="page">
      <h1 className="home-title">Seis eras. Un ícono.</h1>
      <p className="home-intro">
        Un diario musical para fans de Lali. Recorré sus seis álbumes de estudio,
        registrá las canciones que escuchaste, puntualas y dejá tu reseña.
      </p>

      <Link to="/eras" className="button">
        Ver las eras
      </Link>

      <h2>Línea de tiempo</h2>
      <ol className="timeline">
        {studioAlbums.map((album) => (
          <li key={album.id}>
            <Link to={`/eras/${album.id}`}>
              <strong>{album.year}</strong> {album.title}
            </Link>
          </li>
        ))}
      </ol>

      {specialAlbums.map((album) => (
        <p key={album.id} className="home-special">
          Era especial: <Link to={`/eras/${album.id}`}>{album.title}</Link> ({album.artist},{' '}
          {album.year})
        </p>
      ))}
    </section>
  )
}

export default Home
