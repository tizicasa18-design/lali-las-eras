import { Link } from 'react-router-dom'
import { studioAlbums, specialAlbums } from '../data/albums'

// Los 3 pasos de "Cómo funciona". Los guardo en un array y los muestro con map.
const steps = [
  {
    number: '01',
    title: 'Elegí una era',
    text: 'Recorré los seis álbumes de estudio de Lali y entrá al que quieras.',
  },
  {
    number: '02',
    title: 'Registrá canciones',
    text: 'Agregá a tu diario las que escuchaste, con estrellas y reseña, o guardalas como pendientes.',
  },
  {
    number: '03',
    title: 'Armá tu diario',
    text: 'Volvé cuando quieras: editá, marcá favoritas y filtrá tus registros.',
  },
]

function Home() {
  return (
    <>
      {/* Presentación */}
      <section className="hero">
        <div className="page">
          <p className="kicker">Diario musical · Proyecto de fans</p>
          <h1 className="home-title">Seis eras. Un ícono.</h1>
          <p className="home-intro">
            Un diario musical para fans de Lali. Recorré sus seis álbumes de estudio, registrá las
            canciones que escuchaste, puntualas y dejá tu reseña.
          </p>
          <div className="form-buttons">
            <Link to="/eras" className="button">
              Explorar las eras
            </Link>
            <Link to="/diario" className="button-secondary">
              Ir a mi diario
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="page">
        <h2>Cómo funciona</h2>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Línea de tiempo */}
      <section className="page">
        <h2>Línea de tiempo</h2>
        <ul className="timeline-cards">
          {studioAlbums.map((album) => (
            <li key={album.id}>
              <Link
                to={`/eras/${album.id}`}
                className="timeline-card"
                style={{ borderTopColor: album.colors.accent }}
              >
                <span className="timeline-year">{album.year}</span>
                <span className="timeline-title">{album.title}</span>
                <span className="timeline-songs">{album.songs.length} canciones</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Era especial */}
      {specialAlbums.map((album) => (
        <section key={album.id} className="page">
          <div className="special-block">
            <p className="kicker">Era especial · {album.year}</p>
            <h2>{album.title}</h2>
            <p className="special-artist">{album.artist}</p>
            <p>{album.description}</p>
            <Link to={`/eras/${album.id}`} className="button">
              Ver la era especial
            </Link>
          </div>
        </section>
      ))}
    </>
  )
}

export default Home
