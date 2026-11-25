# MEJORAS V4 — Brief de estudio para el final

**LALI: LAS ERAS** · Desarrollo Frontend II · Tiziana Casa

La consigna del final dice: *"Aclarar qué se mejoró o agregó a partir de la entrega regular del TP 2 es muy importante para la calificación"*. Este documento junta **todo lo que cambió después de la corrección**, explicado para poder defenderlo.

---

## 0. El punto de partida: la corrección del profe

Nota del TP2: **8** (7 + 1). El profe dejó 3 sugerencias "para trabajar a futuro". La V4 hace las tres, y suma una mejora de diseño:

| Sugerencia del profe | Qué hice en la V4 | Tema de la materia |
|---|---|---|
| Usuarios no anónimos (por ejemplo, con Google) | **Ingreso con Google** | React (estado, `useEffect`), Firebase Auth |
| Que la información de los temas esté en la base de datos y no en el código | **Catálogo de álbumes en Firestore** + página `/admin` | Persistencia, Firestore, reglas |
| Interacción con APIs externas (Spotify, YouTube) | **Fragmento de 30 s con la API de iTunes** | APIs, `fetch`, JSON, carga y errores |
| *(mía)* | **Filas de canciones alineadas** en compu y celular | HTML y CSS: Grid, diseño adaptable |

**Frase para abrir el oral:**
> "Después de la corrección hice una V4 con las tres sugerencias del profe: ingreso con Google, el catálogo en Firestore y una API externa. Además, mejoré cómo se ven las canciones en el celular."

---

## 1. Ingreso con Google

### Qué cambió
- **Antes (V1 a V3):** cada navegador entraba con un **usuario anónimo**. Si abrías la app en el celular, no veías el diario que tenías en la compu.
- **Ahora (V4):** cada persona entra con **su cuenta de Google**. El diario la sigue en cualquier dispositivo.
- Las eras se pueden ver **sin ingresar**. Para usar el diario hay que ingresar.

### Archivos
| Archivo | Qué hace |
|---|---|
| `src/firebase/auth.js` (nuevo) | `loginWithGoogle()` abre la ventanita de Google · `logout()` cierra la sesión · `isLoggedIn(user)` dice si alguien ingresó con Google |
| `src/hooks/useUser.js` (nuevo) | **Hook propio**: cualquier pantalla puede saber quién ingresó |
| `src/components/LoginPrompt.jsx` (nuevo) | El cartel "Ingresá para usar tu diario" con el botón |
| `src/components/Navbar.jsx` | Muestra "Ingresar con Google", o tu foto, tu nombre y "Salir" |
| `src/firebase/diary.js` | `getUserId()` ya no crea usuarios anónimos: si no ingresaste, da error |
| `src/pages/MyDiary.jsx` | Si no ingresaste, muestra el cartel en lugar del diario |
| `src/pages/EraDetail.jsx` | Si tocás "+ Agregar" sin haber ingresado, te pide ingresar |

### Cómo funciona, paso a paso
1. Tocás **"Ingresar con Google"** → `signInWithPopup(auth, new GoogleAuthProvider())` abre la ventanita de Google.
2. Elegís tu cuenta → Firebase te da un **`uid`** (tu id de usuario), que siempre es el mismo para tu cuenta.
3. El hook `useUser` está "escuchando" con **`onAuthStateChanged`**. Cuando alguien entra o sale, Firebase avisa y el hook guarda al usuario en el **estado** (`useState`).
4. Como cambió el estado, React vuelve a dibujar: el menú muestra tu foto y "Mi diario" carga tu diario (**renderizado condicional**).

```js
// src/hooks/useUser.js
const [user, setUser] = useState(null)
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(isLoggedIn(currentUser) ? currentUser : null)
    setChecking(false)
  })
  return unsubscribe // cuando el componente desaparece, dejo de escuchar
}, [])
```

### Conceptos para explicar
- **Hook propio:** una función que empieza con `use` y usa otros hooks. La armé para no repetir la misma lógica en el menú, el diario y las eras.
- **`useEffect` con `return`:** la función que se devuelve se ejecuta cuando el componente desaparece. Sirve para dejar de escuchar a Firebase.
- **`checking`:** mientras Firebase todavía no sabe si había una sesión abierta, muestro "Cargando…", así no aparece el botón de ingresar por un instante.
- **Las reglas de Firestore no cambiaron:** ya decían `request.auth.uid == userId`, y eso funciona igual con Google que con anónimo.

### Cómo lo digo en el oral
> "Antes cada navegador entraba con un usuario anónimo, y si abrías la app en otro dispositivo no veías tu diario. Siguiendo la corrección, agregué el ingreso con Google con `signInWithPopup`. Armé un hook propio, `useUser`, que con `useEffect` se suscribe a `onAuthStateChanged` y guarda el usuario en el estado. Con renderizado condicional, si no ingresaste te muestro el botón, y si ingresaste, tu diario. Las reglas no cambiaron, porque ya validaban el `uid`."

### Qué cambia en mis apuntes viejos
- Donde decía "usuario anónimo", ahora es **usuario de Google**.
- El problema de StrictMode y `signInInProgress` (V2) **sigue siendo una buena historia para contar**, pero ese código ya no está: con Google, el ingreso lo dispara la persona con un clic, no la app sola.
- Los diarios anónimos viejos quedaron en la base, pero ya no se usan.

---

## 2. Catálogo de álbumes en Firestore

### Qué cambió
- **Antes:** los álbumes estaban escritos en `src/data/albums.js`. Para corregir una canción había que cambiar el código y volver a publicar.
- **Ahora:** están en Firestore, en la colección **`albums`** (un documento por era: `albums/brava`, `albums/soy`…). La app los **lee de la base**.
- Hay una página **`/admin`** (no está en el menú) con un botón que sube el catálogo a la base.

### Cómo queda la base de datos
```
albums/                        ← NUEVO: el catálogo (lo lee cualquiera)
  a-bailar   { title, year, cover, description, songs: [...], special, order }
  brava      { ... }
  ...
users/{uid}/diary/{songId}     ← igual que antes: el diario de cada persona
```
- **`order`**: guarda la posición de cada era, así la línea de tiempo sale en orden (`orderBy('order')`).
- **`songs`**: es un **array** dentro del documento.

### Archivos
| Archivo | Qué hace |
|---|---|
| `src/firebase/catalog.js` (nuevo) | `getAlbums()` lee la colección con `getDocs` · `uploadAlbums()` la carga con `writeBatch` |
| `src/hooks/useAlbums.js` (nuevo) | Hook propio: trae los álbumes y devuelve `albums`, `studioAlbums`, `specialAlbums`, `getAlbumById`, `loading` y `error` |
| `src/pages/Admin.jsx` (nuevo) | Página de administración: muestra tu `uid` y el botón "Cargar catálogo en Firestore" |
| `src/data/albumsSeed.js` (antes `albums.js`) | Ahora es solo la **carga inicial**: se usa una vez desde `/admin`, y queda como copia de respaldo |
| `src/utils/songs.js` (nuevo) | `getSongId` y `getListenUrl`: no son datos sino cálculos, por eso quedaron en el código |
| `Home.jsx`, `Eras.jsx`, `EraDetail.jsx`, `MyDiary.jsx` | Usan `useAlbums()` en lugar de importar el archivo. Muestran "Cargando las eras…" o un error |
| `firestore.rules` | Reglas nuevas para `albums` |

### Las reglas nuevas
```
match /albums/{albumId} {
  allow read: if true;        // cualquiera puede ver el catálogo (también sin ingresar)
  allow write: if isAdmin();  // solo la administradora lo puede modificar
}
function isAdmin() {
  return request.auth != null && request.auth.uid == 'egJhMogvEvMyJB4g1hZ10cABFyU2';
}
```
- **¿Por qué el `uid` y no mi mail?** El archivo de reglas está en un repositorio **público** de GitHub. El `uid` no revela nada mío; el mail quedaría a la vista de cualquiera.
- **¿Y si alguien entra a `/admin`?** Ve la página, pero al tocar el botón **Firestore lo rechaza** (`permission-denied`). La seguridad está en las reglas, no en la pantalla. Lo comprobé: con mi usuario anónimo viejo, la carga fue rechazada.

### Detalles técnicos que me pueden preguntar
- **`writeBatch`**: agrupa las 7 escrituras en una sola operación: **o se guardan todas, o ninguna**.
- **Caché en `getAlbums()`**: guardo el pedido en curso en una variable (`albumsRequest`). Así, si varias pantallas piden los álbumes, se hace **un solo pedido** a Firestore. Si falla, la borro para poder reintentar.
- **Separar `studioAlbums` y `specialAlbums`**: igual que antes, con `filter` y `special: true`. Lo que cambió es de dónde vienen los datos, no cómo se procesan.

### Estado local vs. datos persistentes (tema de la materia)
- **Persistente (Firestore):** el catálogo y el diario. Siguen ahí si recargo, cambio de dispositivo o cierro el navegador.
- **Local (`useState`):** lo que estoy viendo ahora: si el menú está abierto, qué filtro elegí, si el reproductor está abierto, el texto que estoy escribiendo. Se pierde al recargar, y está bien que así sea.

### Cómo lo digo en el oral
> "El profe me sugirió que el catálogo estuviera en la base y no en el código. Ahora los álbumes están en una colección `albums` de Firestore. Cada pantalla los trae con un hook propio, `useAlbums`, que con `useEffect` los pide y maneja la carga y los errores. Las reglas dicen que cualquiera puede leer el catálogo, pero solo la administradora, identificada por su `uid`, lo puede escribir. Para la carga inicial hice una página `/admin` que sube todo con `writeBatch`. Así puedo corregir una canción o agregar un disco sin tocar el código."

### Qué cambia en mis apuntes viejos
- La guía decía *"los álbumes no están en Firebase porque no cambian"*. **Eso cambió en la V4.** Lo cuento como una decisión que revisé después de la corrección: tenerlos en la base permite actualizarlos sin volver a publicar.

---

## 3. API externa: fragmento de 30 segundos (iTunes)

### Qué cambió
- En cada canción hay un botón nuevo, **"♫ Fragmento"**. Al tocarlo se abre un reproductor con la **tapa del disco** y **30 segundos** de la canción, **sin salir de la página**.
- Está en el detalle de cada era y en "Mi diario". Es el mismo componente reutilizado.
- "▶ Escuchar" (la búsqueda de YouTube en otra pestaña) se mantiene, para escucharla completa.

### ¿Por qué iTunes y no Spotify o YouTube?
- **Spotify** pide una **clave secreta**. Una clave secreta no puede estar en el navegador (cualquiera la vería), así que necesitaría un servidor intermedio.
- **YouTube** pide una **clave de API** (de Google Cloud) con un límite de búsquedas por día.
- **iTunes Search API** es **pública, gratis y no pide clave**, y responde **JSON** con el fragmento de audio y la tapa. Para un proyecto 100 % frontend es la opción más simple y segura.

### Archivos
| Archivo | Qué hace |
|---|---|
| `src/api/itunes.js` (nuevo) | `searchSongPreview(songTitle)`: hace el `fetch` y devuelve los datos de la canción |
| `src/components/SongPreview.jsx` (nuevo) | El reproductor: hace el pedido al abrirse y muestra "Buscando…", un error, o el audio |

### El `fetch`, paso a paso
```js
const params = new URLSearchParams({ term: `Lali ${cleanTitle}`, media: 'music', entity: 'song', country: 'AR' })
const response = await fetch(`https://itunes.apple.com/search?${params}`)  // 1. pido por internet
if (!response.ok) throw new Error(...)                                     // 2. ¿respondió bien?
const data = await response.json()                                         // 3. JSON → objeto de JS
const result = data.results.find((item) => item.previewUrl && /lali|bom|miranda/i.test(item.artistName))  // 4. elijo
```
1. **`URLSearchParams`** arma los parámetros de la URL y convierte espacios y tildes.
2. **`response.ok`**: `fetch` **no** da error si el servidor responde 404 o 500. Por eso lo reviso a mano.
3. **`.json()`** convierte el texto JSON en un objeto de JavaScript.
4. **`find`** devuelve el primer resultado que tenga audio y sea de Lali (o de BOM o Miranda!, para la era especial).
- **Limpieza del título:** saco "(feat. …)" y "(con …)", porque así la búsqueda es más precisa. Por ejemplo, "Ladrón (con Cazzu)" → "Ladrón".

### Los 3 estados (carga y errores, tema de la materia)
```jsx
{loading && <p>Buscando la canción…</p>}
{error && <p className="status-message error">{error}</p>}
{song && <audio controls autoPlay src={song.previewUrl} />}
```
- El pedido se hace en un **`useEffect`** que depende de `[songTitle]`: se hace al abrir el reproductor.
- **`try / catch`**: si no hay internet o la API no responde → "No se pudo cargar el fragmento. Revisá tu conexión."
- Si la API responde pero no está la canción → "No encontramos un fragmento de esta canción." (pasa con "Quiénes Son?", que no está en iTunes).
- **`<audio controls>`** es una etiqueta de HTML: el navegador ya trae el play, la pausa y el volumen.

### Cómo lo digo en el oral
> "El profe me sugirió conectar una API externa. Uso la API de iTunes, porque no necesita clave: Spotify pide una clave secreta que no puede estar en el navegador. Con `fetch` pido la canción, reviso `response.ok`, convierto la respuesta con `.json()` y con `find` elijo el primer resultado de Lali que tenga audio. El componente `SongPreview` hace el pedido en un `useEffect` y, con renderizado condicional, muestra tres estados: cargando, error o el reproductor."

### Cómo lo probé
- "Besarte Mucho" → se ve la tapa y suena el fragmento.
- Recorrí todo el catálogo: encuentra casi todas. Al hacer más de 80 pedidos seguidos, Apple cortó algunos (tiene un límite de pedidos por minuto). Eso me sirvió para comprobar que el mensaje de error funciona. Una persona toca de a una canción, así que en el uso normal no pasa.

---

## 4. Diseño: filas de canciones alineadas (CSS Grid)

### El problema
Con `flex-wrap`, si el título era largo, los botones bajaban de renglón. Además, cada botón tenía su propio ancho ("✓ En tu diario" no mide lo mismo que "+ Agregar"). Resultado: **cada fila quedaba distinta** y se veía desproporcionado, sobre todo en el celular.

### La solución
```css
.song-row     { display: grid; grid-template-columns: minmax(0, 1fr) auto; }
.song-actions { display: grid; grid-template-columns: 7.5rem 7rem 12rem; }
.song-action  { height: 2.3rem; display: inline-flex; align-items: center; justify-content: center; }
.song-title   { -webkit-line-clamp: 2; }  /* máximo 2 renglones */

@media (max-width: 760px) {
  .song-actions { grid-template-columns: repeat(3, 2.5rem); }
  .action-label { display: none; }  /* en pantallas chicas: solo los íconos ♫ ▶ + */
}
```
- **`minmax(0, 1fr)`**: la columna del título ocupa lo que sobra y **puede achicarse**, así el título baja de renglón en lugar de empujar los botones.
- **3 columnas de ancho fijo**: cada botón cae **en el mismo lugar en todas las filas**, aunque falte alguno.
- **Misma altura** en los 3 botones, con el contenido centrado con Flexbox.
- **En pantallas de 760 px o menos**: escondo el texto con `display: none` y dejo el ícono. El nombre completo sigue en el **`aria-label`**, para que lo lean los lectores de pantalla.
- Lo probé en compu (1280 px), tablet (768 px), 700 px y celular (375 px).

### Cómo lo digo en el oral
> "Las filas se deformaban cuando un título era largo. Las armé con CSS Grid: una columna flexible para el título, que baja a un segundo renglón, y tres columnas fijas para los botones, así quedan alineados en todas las canciones. Con un media query, en el celular muestro solo los íconos y el texto queda en el `aria-label`."

---

## 5. Problemas que aparecieron y cómo los resolví

| Problema | Causa | Solución |
|---|---|---|
| Al tocar "Ingresar con Google" salía `auth/operation-not-allowed` | El proveedor Google **no estaba activado** en Firebase | Firebase → Authentication → Sign-in method → **habilitar Google** |
| No sabía qué error era | El mensaje decía solo "No se pudo ingresar" | Hice que el mensaje muestre el **código del error** (`error.code`). Así lo diagnostiqué |
| La carga del catálogo daba `permission-denied` | En las reglas había puesto el `uid` de mi **usuario anónimo viejo**, no el de mi cuenta de Google | Ingresé con Google, copié el `uid` nuevo de `/admin`, lo puse en las reglas y las publiqué |
| Las reglas del archivo no hacían efecto | El archivo `firestore.rules` del repo **no se publica solo** (Vercel no lo sube) | Hay que pegarlo en la consola: Firestore → Reglas → **Publicar** |
| Muchos pedidos seguidos a iTunes fallaban | La API tiene un **límite de pedidos por minuto** | En el uso normal no pasa, y si pasa, la app muestra el mensaje de error |
| En Vercel, el ingreso con Google no iba a funcionar | Google solo permite el ingreso desde **dominios autorizados** | Firebase → Authentication → Settings → Authorized domains → agregué `lali-las-eras.vercel.app` |

**Para el oral, el mejor ejemplo es el de los permisos:**
> "Cuando cargué el catálogo, Firestore lo rechazó con `permission-denied`. Era porque en las reglas tenía el id de mi usuario anónimo viejo, y no el de mi cuenta de Google. Eso me demostró que las reglas funcionan: aunque la página `/admin` esté abierta, si no sos la administradora, la base no te deja escribir."

---

## 6. Publicación de la V4

1. Trabajé en una **rama aparte**, `v4-mejoras-final`, para no romper la versión publicada mientras probaba.
2. Un **commit por mejora**:
   - `V4: ingreso con Google en lugar de usuario anonimo`
   - `V4: catalogo de albumes en Firestore, pagina admin y reglas de administradora`
   - `V4: fragmento de 30 segundos con fetch a la API de iTunes`
   - `V4: fila de cada cancion con grid, botones alineados y solo iconos en celular`
3. Pasé la rama a **`main`** y la subí a GitHub (`git push`).
4. **Vercel publica solo** cada vez que hay un push a `main`: hace `npm run build` y sube la carpeta `dist`.
5. Le puse el tag **`v4`** (como `v1`, `v2` y `v3`).
6. **No hizo falta** agregar variables nuevas en Vercel: la API de iTunes no pide clave.

**Cómo lo digo:**
> "Vercel está conectado a mi repositorio de GitHub. Cada vez que hago push a `main`, Vercel corre `npm run build` y publica la carpeta `dist`. Es serverless: no administro ningún servidor; los datos están en Firebase y la página en Vercel."

---

## 7. Preguntas probables del profe

**¿Qué mejoraste después de la corrección?** Las tres sugerencias: ingreso con Google, el catálogo en Firestore y una API externa. Además, el diseño de las filas de canciones.

**¿Por qué Google y no email y contraseña?** Porque nadie tiene que crear ni recordar otra contraseña, y Google se encarga de la seguridad. El diario te sigue en cualquier dispositivo.

**¿Qué es `onAuthStateChanged`?** Una función de Firebase que avisa cada vez que alguien entra o sale. La uso en un `useEffect` para guardar el usuario en el estado.

**¿Qué pasa si alguien que no sos vos entra a `/admin`?** Ve la página, pero Firestore rechaza la escritura por las reglas (`isAdmin`). La seguridad está en la base, no en la pantalla.

**¿Por qué el catálogo lo puede leer cualquiera?** Porque es información pública (los discos de Lali) y tiene que verse sin ingresar. Lo privado es el diario de cada persona.

**¿Qué diferencia hay entre `getDocs`, `setDoc` y `writeBatch`?** `getDocs` lee varios documentos; `setDoc` escribe uno; `writeBatch` agrupa varias escrituras para que se guarden todas juntas o ninguna.

**¿Qué hace `fetch`? ¿Qué devuelve?** Hace un pedido por internet y devuelve una **promesa** con la respuesta. Con `await` espero la respuesta, reviso `response.ok` y con `.json()` la convierto en un objeto.

**¿Qué es JSON?** Un formato de texto para intercambiar datos, con la misma forma que los objetos y arrays de JavaScript.

**¿Cómo manejás la carga y los errores?** Con tres estados (`loading`, `error` y los datos) y renderizado condicional. El pedido va dentro de un `try / catch`.

**¿Por qué no usaste Spotify?** Porque pide una clave secreta, y una clave secreta en el navegador la puede ver cualquiera. iTunes es pública y no pide clave.

**¿Qué diferencia hay entre estado local y datos persistentes?** El estado local (`useState`) vive mientras la página está abierta: el menú, los filtros, el reproductor. Los datos persistentes (Firestore) quedan guardados aunque recargue o cambie de dispositivo: el catálogo y el diario.

**¿Qué es `minmax(0, 1fr)`?** Una columna de Grid que ocupa el espacio que sobra y se puede achicar hasta 0, así el texto baja de renglón en lugar de empujar lo demás.

**¿Cómo verificaste que funciona?** En el navegador: ingresé con Google, cargué el catálogo, agregué "Besarte Mucho" con 4 estrellas, recargué, la marqué favorita, recargué de nuevo y seguía. Escuché el fragmento. Probé las filas en 4 tamaños de pantalla. Antes de cada commit, `npm run build` y `npm run lint`.

**¿Cómo usaste la IA en la V4?** Claude Code escribió y probó el código por etapas. Yo decidí qué mejorar (a partir de la corrección), elegí iTunes en lugar de crear una clave, pedí el cambio de diseño de las filas y probé el ingreso con mi cuenta. Cada cambio quedó en un commit separado.
