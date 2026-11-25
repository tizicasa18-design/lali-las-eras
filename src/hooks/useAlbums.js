// Hook propio: trae los álbumes desde Firestore y avisa si está cargando o si hubo un error.
// Lo usan todas las pantallas que muestran eras (Inicio, Las eras, Detalle y Mi diario).
import { useEffect, useState } from 'react'
import { getAlbums } from '../firebase/catalog'

export function useAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Se ejecuta una sola vez, al abrir la pantalla
  useEffect(() => {
    async function loadAlbums() {
      try {
        setAlbums(await getAlbums())
      } catch (loadError) {
        console.error(loadError)
        setError('No se pudieron cargar las eras. Revisá tu conexión.')
      }
      setLoading(false)
    }
    loadAlbums()
  }, [])

  // Igual que antes: separo las 6 eras de estudio de la era especial con filter
  const studioAlbums = albums.filter((album) => !album.special)
  const specialAlbums = albums.filter((album) => album.special)

  // Busca un álbum por su id (por ejemplo 'brava') con find
  function getAlbumById(id) {
    return albums.find((album) => album.id === id)
  }

  return { albums, studioAlbums, specialAlbums, getAlbumById, loading, error }
}
