// Datos fijos de los 6 álbumes de estudio de Lali + 1 era especial (BOM).
// No van a Firebase porque no cambian: son siempre los mismos.
// Fuente de los tracklists: edición estándar de cada álbum.

const albums = [
  {
    id: 'a-bailar',
    cover: '/images/a-bailar.jpg',
    title: 'A Bailar',
    year: 2014,
    description: 'El comienzo de todo. Lali da sus primeros pasos como solista con un álbum lleno de energía, pop y ganas de bailar. Una era fresca, juvenil y colorida que marca el inicio de su identidad musical.',
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
    cover: '/images/soy.jpg',
    title: 'Soy',
    year: 2016,
    description: 'Una Lali más segura, que empieza a encontrar su propio estilo y a mostrar quién es. Con sonidos pop y letras más personales, esta era representa crecimiento, confianza y autenticidad.',
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
    cover: '/images/brava.jpg',
    title: 'Brava',
    year: 2018,
    description: 'Lali muestra su lado más atrevido y poderoso. Mezclando pop con ritmos urbanos y latinos, Brava es una era de actitud, sensualidad y libertad, donde se anima a experimentar con nuevos sonidos.',
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
    cover: '/images/libra.jpg',
    title: 'Libra',
    year: 2020,
    description: 'Una etapa de cambios, exploración y búsqueda de equilibrio. Lali combina diferentes estilos musicales y muestra una faceta más madura, jugando entre lo romántico, lo urbano y lo experimental.',
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
    cover: '/images/lali.jpg',
    title: 'LALI',
    year: 2023,
    description: 'El regreso de la diva pop en su máxima expresión. Con mucho baile, estética dosmilera y una actitud provocadora, Lali celebra su libertad, su identidad y el poder de ser ella misma sin pedir permiso.',
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
    cover: '/images/no-vayas-a-atender.jpg',
    title: 'No vayas a atender cuando el demonio llama',
    year: 2025,
    description: 'La era más rockera y rebelde de Lali. Con guitarras, letras provocadoras y una estética más oscura, rompe con lo esperado y muestra su versión más desafiante, auténtica y sin filtros.',
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
    cover: '/images/bom-bailar-o-morir.jpg',
    title: 'Bailar o morir',
    year: 2026,
    special: true,
    artist: 'BOM (Lali + Miranda!)',
    description: 'Lali y Miranda! unen sus universos para crear BOM, una nueva era llena de pop, electrónica y energía. Con una estética futurista y retro, este proyecto celebra la libertad, el baile y las ganas de vivir la música sin límites. Una explosión de creatividad que lleva el pop argentino a otro nivel.',
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

// Arma el link de búsqueda de YouTube para escuchar una canción.
// Uso una búsqueda (y no un video fijo) para que el link nunca quede roto.
// encodeURIComponent convierte espacios y tildes en texto válido para una URL.
export function getListenUrl(songTitle) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`Lali ${songTitle}`)}`
}

export default albums
