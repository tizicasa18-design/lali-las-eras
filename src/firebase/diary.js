// Todas las operaciones del diario con Firestore (CREATE, READ, UPDATE, DELETE).
// Cada usuario tiene su propio diario en: users/{uid}/diary/{songId}
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from './config'
import { isLoggedIn } from './auth'

// Devuelve el id de la persona que ingresó con Google.
// Primero espera a que Firebase "recuerde" si ya había una sesión abierta.
// (V4: antes acá se creaba un usuario anónimo; ahora hay que ingresar con Google.)
async function getUserId() {
  await auth.authStateReady()
  if (!isLoggedIn(auth.currentUser)) {
    throw new Error('Tenés que ingresar con Google para usar tu diario.')
  }
  return auth.currentUser.uid
}

// READ: trae todos los registros del diario, del más nuevo al más viejo
export async function getDiaryEntries() {
  const userId = await getUserId()
  const diaryRef = collection(db, 'users', userId, 'diary')
  const snapshot = await getDocs(query(diaryRef, orderBy('createdAt', 'desc')))

  // Convierto cada documento en un objeto común con su id
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

// CREATE: guarda una canción nueva en el diario.
// Uso el id de la canción como id del documento, así no se puede repetir.
export async function addDiaryEntry(songId, entry) {
  const userId = await getUserId()
  const entryRef = doc(db, 'users', userId, 'diary', songId)

  const existing = await getDoc(entryRef)
  if (existing.exists()) {
    throw new Error('Esta canción ya está en tu diario.')
  }

  await setDoc(entryRef, {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// UPDATE: modifica solo los campos que cambiaron
export async function updateDiaryEntry(songId, changes) {
  const userId = await getUserId()
  const entryRef = doc(db, 'users', userId, 'diary', songId)
  await updateDoc(entryRef, { ...changes, updatedAt: serverTimestamp() })
}

// DELETE: borra el registro
export async function deleteDiaryEntry(songId) {
  const userId = await getUserId()
  await deleteDoc(doc(db, 'users', userId, 'diary', songId))
}
