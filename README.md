# LALI: LAS ERAS

Diario musical para fans de Lali: se pueden recorrer sus álbumes, registrar canciones, puntuarlas, escribir reseñas y marcar favoritas. Proyecto no oficial de fans.

Trabajo Práctico 2 — Desarrollo Frontend II (UADE, 2026)
Tiziana Casa

- App publicada: https://lali-las-eras.vercel.app
- Repositorio: https://github.com/tizicasa18-design/lali-las-eras

## Tecnologías

React + Vite, React Router, Firebase (Cloud Firestore y Authentication anónima) y Vercel.

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
2. Authentication → Método de acceso → habilitar **Anónimo**.
3. Crear una base de **Cloud Firestore** (Standard, `(default)`, región `southamerica-east1`) en modo producción.
4. En Firestore → Reglas, publicar el contenido del archivo `firestore.rules`.

Cada usuario guarda su diario en `users/{uid}/diary/{idCanción}`, y las reglas solo le permiten leer y modificar sus propios registros.

## Publicación en Vercel

1. Importar el repositorio desde Vercel.
2. Framework **Vite**, comando de build `npm run build`, directorio de salida `dist`.
3. Cargar las cuatro variables `VITE_FIREBASE_...` en Settings → Environment Variables (Production).
4. Desplegar.
