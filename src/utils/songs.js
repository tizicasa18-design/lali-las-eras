// Funciones de ayuda para las canciones.
// (Antes estaban en src/data/albums.js. En la V4 los álbumes pasaron a Firestore,
// y estas funciones quedaron acá porque no son datos: son cálculos.)

// Arma el id de una canción juntando el álbum y el número de tema.
// Ejemplo: 'brava-3' es "Besarte Mucho".
// Este id es el que se guarda en el diario de Firebase.
export function getSongId(albumId, songIndex) {
  return `${albumId}-${songIndex + 1}`
}

// Arma el link de búsqueda de YouTube para escuchar una canción.
// Uso una búsqueda (y no un video fijo) para que el link nunca quede roto.
// encodeURIComponent convierte espacios y tildes en texto válido para una URL.
export function getListenUrl(songTitle) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`Lali ${songTitle}`)}`
}
