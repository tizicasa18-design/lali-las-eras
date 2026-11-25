// Mejora 3 (V4): consulta a una API externa con fetch.
// Uso la API de búsqueda de iTunes (Apple Music): es pública, gratis y no pide clave.
// Devuelve JSON con un fragmento de 30 segundos de cada canción y la tapa del disco.
// Documentación: https://performance-partners.apple.com/search-api

const SEARCH_URL = 'https://itunes.apple.com/search'

// Busca una canción de Lali y devuelve sus datos, o null si no la encuentra.
export async function searchSongPreview(songTitle) {
  // Saco "(feat. …)" o "(con …)" y los signos de pregunta para que la búsqueda sea más precisa.
  // Ejemplo: "Ladrón (con Cazzu)" → "Ladrón"
  const cleanTitle = songTitle.replace(/\s*\((feat\.|con)[^)]*\)/i, '').replace(/[¿?]/g, '')

  // URLSearchParams arma la parte de la URL con los parámetros (y convierte espacios y tildes)
  const params = new URLSearchParams({
    term: `Lali ${cleanTitle}`,
    media: 'music',
    entity: 'song',
    country: 'AR',
    limit: '10',
  })

  // fetch hace el pedido por internet. await espera la respuesta.
  const response = await fetch(`${SEARCH_URL}?${params}`)

  // Si el servidor respondió con un error (por ejemplo 500), lo aviso
  if (!response.ok) {
    throw new Error(`La API respondió con el código ${response.status}`)
  }

  // .json() convierte la respuesta (texto en formato JSON) en un objeto de JavaScript
  const data = await response.json()

  // Me quedo solo con resultados de Lali (o de BOM / Miranda!, para la era especial)
  // que tengan fragmento de audio. find devuelve el primero que cumple.
  const result = data.results.find(
    (item) => item.previewUrl && /lali|bom|miranda/i.test(item.artistName),
  )

  if (!result) {
    return null
  }

  // Devuelvo solo lo que uso, con nombres claros
  return {
    title: result.trackName,
    artist: result.artistName,
    album: result.collectionName,
    previewUrl: result.previewUrl,
    // La tapa viene en 100x100; pido una de 200x200 cambiando el tamaño en la URL
    artwork: result.artworkUrl100?.replace('100x100', '200x200'),
    appleMusicUrl: result.trackViewUrl,
  }
}
