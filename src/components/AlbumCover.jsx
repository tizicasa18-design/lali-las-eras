// Portada de cada era.
// Si el álbum tiene imagen (campo "cover"), la muestra.
// Si no tiene, muestra un cuadrado negro con el título.
function AlbumCover({ album }) {
  if (album.cover) {
    return (
      <div className="album-cover">
        <img src={album.cover} alt={`Portada de ${album.title}`} loading="lazy" />
      </div>
    )
  }

  return (
    <div className="album-cover" aria-hidden="true">
      <span>{album.title}</span>
    </div>
  )
}

export default AlbumCover
