// Datos fijos de los 6 álbumes de estudio de Lali + 1 era especial (BOM).
// No van a Firebase porque no cambian: son siempre los mismos.
// Fuente de los tracklists: edición estándar de cada álbum.

const albums = [
  {
    id: 'a-bailar',
    title: 'A Bailar',
    year: 2014,
    description: 'Primer álbum de estudio. Pop bailable y el comienzo de su carrera solista.',
    colors: { accent: '#D8AD60', secondary: '#171313' },
    songs: [
      'Asesina',
      'Histeria',
      'Del Otro Lado',
      'A Bailar',
      'No Estoy Sola',
      'Te Siento',
      'Cielo Salvador',
      'Being',
      'Desamor',
      'Mil Años Luz',
    ],
  },
  {
    id: 'soy',
    title: 'Soy',
    year: 2016,
    description: 'Segundo álbum de estudio.',
    colors: { accent: '#F35088', secondary: '#E73633' },
    songs: [
      'Soy',
      'Único',
      'Tu Revolución',
      'Cree en Mí',
      'Irresistible',
      'Ego',
      'Boomerang',
      'Mi Religión',
      'Lejos de Mí',
      'Amor Es Presente',
      'Ring Na Na',
      'Bomba',
      'Reina',
    ],
  },
  {
    id: 'brava',
    title: 'Brava',
    year: 2018,
    description: 'Tercer álbum de estudio.',
    colors: { accent: '#A92229', secondary: '#CFA36B' },
    songs: [
      'OMG!',
      'Tu Novia',
      'Besarte Mucho',
      'Somos Amantes',
      'Salvaje (feat. Abraham Mateo)',
      '100 Grados (feat. A.Chal)',
      'Caliente (feat. Pabllo Vittar)',
      'Una Na',
      'Vuelve a Mí',
      'Sin Querer Queriendo (feat. Mau y Ricky)',
      'Mi Última Canción (feat. Reik)',
      'Tu Sonrisa',
    ],
  },
  {
    id: 'libra',
    title: 'Libra',
    year: 2020,
    description: 'Cuarto álbum de estudio.',
    colors: { accent: '#D7914C', secondary: '#E9D6B4' },
    songs: [
      'Eclipse',
      'Ladrón (con Cazzu)',
      'Fascinada',
      'Bailo Pa Mí',
      'Enredaos',
      'No Puedo Olvidarte (con Mau y Ricky)',
      'Laligera',
      'Lo Que Tengo Yo',
      'Pa Que Me Quieras (con Noriel)',
      'Como Así (feat. CNCO)',
      'Una Esquina en Madrid',
    ],
  },
  {
    id: 'lali',
    title: 'LALI',
    year: 2023,
    description: 'Quinto álbum de estudio.',
    colors: { accent: '#C2C6CD', secondary: '#F2EEE6' },
    songs: [
      'Obsesión',
      'Disciplina',
      'Cómprame un Brishito',
      'KO',
      '2 Son 3',
      'Incondicional',
      'Quiénes Son?',
      'Diva',
      'N5',
      'Ahora',
      'Motiveishon',
      'Como Tú',
      'Sola',
    ],
  },
  {
    id: 'no-vayas-a-atender',
    title: 'No vayas a atender cuando el demonio llama',
    year: 2025,
    description: 'Sexto álbum de estudio.',
    colors: { accent: '#9F1F1F', secondary: '#88817E' },
    songs: [
      'Popstar',
      'Lokura',
      'No Me Importa',
      'Plástico (con Duki)',
      'Tu Novia II',
      'Morir de Amor',
      'Mejor Que Vos (con Miranda!)',
      'No Hay Héroes',
      'Sensacional Éxito',
      'Sexy',
      'Fanático',
      'Perdedor',
      '33 (con Dillom)',
      'Pendeja',
      'Fin de Transmisión',
    ],
  },
  // Era especial: no es un álbum solista de Lali, es un proyecto en conjunto con Miranda!.
  // Por eso tiene special: true y se muestra aparte de las 6 eras.
  {
    id: 'bom-bailar-o-morir',
    title: 'Bailar o morir',
    year: 2026,
    special: true,
    artist: 'BOM (Lali + Miranda!)',
    description: 'Primer disco de BOM, el proyecto en conjunto de Lali con Ale Sergi y Juliana Gattas.',
    colors: { accent: '#E54138', secondary: '#171313' },
    songs: [
      'Bailar o morir',
      'Señora',
      'En Italia',
      'Migajas',
      'Adonde',
      'Hiperlove',
      'Ganar',
      'Piel',
      'Helecho',
      'Vivo del Pop',
    ],
  },
]

// Solo las 6 eras de estudio (sin la era especial)
export const studioAlbums = albums.filter((album) => !album.special)

// Solo las eras especiales / colaboraciones
export const specialAlbums = albums.filter((album) => album.special)

// Busca un álbum por su id (por ejemplo 'brava').
// Si no lo encuentra devuelve undefined.
export function getAlbumById(id) {
  return albums.find((album) => album.id === id)
}

// Arma el id de una canción juntando el álbum y el número de tema.
// Ejemplo: 'brava-3' es "Besarte Mucho".
// Este id es el que se va a guardar en Firebase.
export function getSongId(albumId, songIndex) {
  return `${albumId}-${songIndex + 1}`
}

export default albums
