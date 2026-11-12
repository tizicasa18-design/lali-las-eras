import { Link } from 'react-router-dom'
import { studioAlbums, specialAlbums } from '../data/albums'

// Los 3 pasos de "Cómo funciona". Los guardo en un array y los muestro con map.
const steps = [
  {
    number: '01',
    title: 'Escuchala',
    text: 'Entrá a una era y escuchá la canción. Dejá que te pase lo que te tenga que pasar.',
  },
  {
    number: '02',
    title: 'Ponelo en palabras',
    text: 'Puntuala y escribí qué sentiste. Si no sabés cómo empezar, te damos el comienzo de la frase.',
  },
  {
    number: '03',
    title: 'Mirá tu historia',
    text: 'Volvé a leer lo que escribiste, armá tu top de favoritas y descubrí cuál es tu era.',
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
            Un diario para poner en palabras lo que te pasa cuando escuchás a Lali. Canción por
            canción, era por era.
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

      {/* La idea del diario + cómo funciona */}
      <section className="page">
        <div className="home-idea">
          <p className="kicker">La idea</p>
          <p className="home-idea-text">
            Hay canciones que te acompañan en un momento, te recuerdan a alguien o te dicen lo que
            no sabías decir. Este diario es para eso: para que expreses cómo te sentís y lo que te
            genera un artista, y lo pongas en palabras.
          </p>
          <p>
            Cada canción que escuchás queda guardada con tus estrellas y lo que sentiste. Con el
            tiempo, tu diario te muestra tus favoritas y cuál es la era que más te representa.
          </p>
        </div>

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
        {/* Lista ordenada (ol) porque las eras van en orden cronológico.
            Cada era es un punto sobre la línea roja. */}
        <ol className="timeline">
          {studioAlbums.map((album) => (
            <li key={album.id}>
              <Link to={`/eras/${album.id}`} className="timeline-link">
                <span className="timeline-year">{album.year}</span>
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-title">{album.title}</span>
                <span className="timeline-songs">{album.songs.length} canciones</span>
              </Link>
            </li>
          ))}
        </ol>
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
