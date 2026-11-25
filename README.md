# LALI: LAS ERAS

Diario musical para fans de Lali: se pueden recorrer sus álbumes, escuchar un fragmento de cada canción, registrarlas, puntuarlas, escribir lo que sentiste y marcar favoritas. Proyecto no oficial de fans.

Trabajo Práctico 2 — Desarrollo Frontend II (UADE, 2026)
Tiziana Casa

- App publicada: https://lali-las-eras.vercel.app
- Repositorio: https://github.com/tizicasa18-design/lali-las-eras
- Versiones: tags `v1`, `v2`, `v3` (entrega del TP2) y `v4` (mejoras para el final, ver [MEJORAS-V4.md](MEJORAS-V4.md))

## Tecnologías

React + Vite, React Router, Firebase (Cloud Firestore y Authentication con Google), API de búsqueda de iTunes y Vercel.

## Cómo ejecutar el proyecto

1. Instalar las dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz (junto a `package.json`) a partir de `.env.example`, con los datos del proyecto de Firebase:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Si se modifica el `.env`, hay que reiniciar `npm run dev`.

## Configuración de Firebase

1. Crear un proyecto en Firebase Console y registrar una app web (`</>`).
2. Authentication → Método de acceso → habilitar **Google**.
3. Authentication → Settings → Authorized domains → agregar el dominio de Vercel.
4. Crear una base de **Cloud Firestore** (Standard, `(default)`, región `southamerica-east1`) en modo producción.
5. En Firestore → Reglas, publicar el contenido del archivo `firestore.rules`, con el `uid` de la cuenta administradora en `isAdmin()`.
6. Ingresar con esa cuenta, entrar a `/admin` y tocar **Cargar catálogo en Firestore** (sube los álbumes de `src/data/albumsSeed.js`).

### Datos en Firestore

- `albums/{albumId}`: el catálogo de eras. Lo puede leer cualquiera; solo la administradora lo modifica.
- `users/{uid}/diary/{idCanción}`: el diario de cada persona. Solo su dueña o dueño lo puede leer y modificar.

## Publicación en Vercel

1. Importar el repositorio desde Vercel.
2. Framework **Vite**, comando de build `npm run build`, directorio de salida `dist`.
3. Cargar las cuatro variables `VITE_FIREBASE_...` en Settings → Environment Variables (Production).
4. Desplegar. Cada push a `main` vuelve a publicar automáticamente.

`vercel.json` redirige todas las direcciones a `index.html`, para que las rutas de React Router (por ejemplo `/eras/brava`) funcionen al recargar.
