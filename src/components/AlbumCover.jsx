// Portada provisoria: un cuadrado con el color de la era y el título.
// Más adelante se puede reemplazar por la imagen real del álbum.
function AlbumCover({ album }) {
  return (
    <div
      className="album-cover"
      style={{ backgroundColor: album.colors.accent }}
      aria-hidden="true"
    >
      <span>{album.title}</span>
    </div>
  )
}

export default AlbumCover
