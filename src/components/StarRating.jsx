// Cinco estrellas. Si recibe onChange se pueden tocar para puntuar;
// si no, solo muestran la puntuación.
function StarRating({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5]

  // Solo lectura (por ejemplo, en la lista de Mi diario)
  if (!onChange) {
    return (
      <p className="stars stars-readonly" aria-label={`${value} de 5 estrellas`}>
        {stars.map((star) => (
          <span key={star} className={star <= value ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </p>
    )
  }

  // Interactivo (en el formulario)
  return (
    <div className="stars" role="group" aria-label="Puntuación">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'star filled' : 'star'}
          onClick={() => onChange(star)}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          aria-pressed={star === value}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating
