import { useEffect, useState } from 'react'
import { searchSongPreview } from '../api/itunes'

// Reproductor de un fragmento de 30 segundos (V4, mejora 3: API externa).
// Cuando aparece en pantalla, pide la canción a la API de iTunes con fetch
// y muestra "Buscando…", un error, o el reproductor con la tapa del disco.
// Lo uso en el detalle de cada era y en Mi diario: lo que cambia es la prop songTitle.
function SongPreview({ songTitle }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [song, setSong] = useState(null) // lo que devolvió la API

  // useEffect: después de dibujarse, el componente va a buscar los datos.
  // [songTitle] significa "volvé a buscar si cambia la canción".
  useEffect(() => {
    async function loadPreview() {
      try {
        const result = await searchSongPreview(songTitle)
        if (result) {
          setSong(result)
        } else {
          setError('No encontramos un fragmento de esta canción.')
        }
      } catch (fetchError) {
        // Por ejemplo, si no hay internet o la API no responde
        console.error(fetchError)
        setError('No se pudo cargar el fragmento. Revisá tu conexión.')
      }
      setLoading(false)
    }
    loadPreview()
  }, [songTitle])

  // Renderizado condicional: cargando, error o el reproductor
  return (
    <div className="song-preview">
      {loading && <p className="loading">Buscando la canción…</p>}
      {error && (
        <p className="status-message error" role="alert">
          {error}
        </p>
      )}
      {song && (
        <>
          {song.artwork && <img src={song.artwork} alt={`Tapa de ${song.album}`} />}
          <div className="song-preview-info">
            <p className="song-preview-title">{song.title}</p>
            <p className="song-preview-album">
              {song.artist} · {song.album}
            </p>
            {/* audio es una etiqueta de HTML: controls muestra play, pausa y volumen */}
            <audio controls autoPlay src={song.previewUrl}>
              Tu navegador no puede reproducir audio.
            </audio>
            <a href={song.appleMusicUrl} target="_blank" rel="noopener noreferrer">
              Escuchala completa en Apple Music ↗
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default SongPreview
