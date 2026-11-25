// El catálogo de álbumes en Firestore (V4).
// Ruta: albums/{albumId}  →  por ejemplo albums/brava
// Cualquiera lo puede leer; solo la administradora lo puede modificar (ver firestore.rules).
import { collection, doc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore'
import { db } from './config'

// Guardo el pedido en curso para no pedir los álbumes otra vez en cada pantalla:
// la primera pantalla que los pide los trae, y las demás reusan esa misma respuesta.
let albumsRequest = null

// READ: trae todos los álbumes, en el orden en que tienen que aparecer
export function getAlbums() {
  if (!albumsRequest) {
    const albumsRef = collection(db, 'albums')
    albumsRequest = getDocs(query(albumsRef, orderBy('order')))
      .then((snapshot) => snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      .catch((error) => {
        albumsRequest = null // si falló, la próxima vez lo vuelvo a intentar
        throw error
      })
  }
  return albumsRequest
}

// CARGA INICIAL: sube todos los álbumes de una vez (solo lo usa la página /admin).
// writeBatch agrupa todas las escrituras: o se guardan todas, o ninguna.
export async function uploadAlbums(albums) {
  const batch = writeBatch(db)
  albums.forEach((album, index) => {
    const { id, ...data } = album // el id va como nombre del documento, no como campo
    batch.set(doc(db, 'albums', id), { ...data, special: Boolean(album.special), order: index })
  })
  await batch.commit()
  albumsRequest = null // la próxima lectura trae los datos nuevos
}
