import { useState } from 'react'
import StarRating from './StarRating'

const MAX_REVIEW_LENGTH = 500

// Valores con los que arranca el formulario cuando es un registro nuevo
const EMPTY_ENTRY = { rating: 0, review: '', listened: true, favorite: false }

// Formulario del diario. Lo uso para registrar una canción nueva y para editar.
// initialValues: los datos con los que arranca (vacío al crear, el registro al editar)
// onSubmit: la función que guarda en Firebase
// onCancel: cierra el formulario
function DiaryForm({ songTitle, initialValues = EMPTY_ENTRY, submitLabel, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialValues.rating)
  const [review, setReview] = useState(initialValues.review)
  const [listened, setListened] = useState(initialValues.listened)
  const [favorite, setFavorite] = useState(initialValues.favorite)

  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault() // evita que la página se recargue

    // Validaciones básicas
    // Solo pido estrellas si ya la escuchó (una pendiente no se puede puntuar)
    if (listened && (rating < 1 || rating > 5)) {
      setError('Elegí una puntuación de 1 a 5 estrellas.')
      return
    }
    if (review.length > MAX_REVIEW_LENGTH) {
      setError(`La reseña no puede tener más de ${MAX_REVIEW_LENGTH} caracteres.`)
      return
    }

    setError('')
    setSaving(true)
    try {
      // Si es pendiente, se guarda con 0 estrellas y sin favorita
      const finalRating = listened ? rating : 0
      const finalFavorite = listened ? favorite : false
      await onSubmit({ rating: finalRating, review: review.trim(), listened, favorite: finalFavorite })
    } catch (err) {
      setError(err.message || 'No se pudo guardar. Probá de nuevo.')
    }
    setSaving(false)
  }

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <p className="diary-form-title">{songTitle}</p>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={listened}
          onChange={(event) => setListened(event.target.checked)}
        />
        La escuché
      </label>

      {/* Las estrellas solo aparecen si ya la escuchó */}
      {listened ? (
        <div className="form-field">
          <span className="form-label">Puntuación</span>
          <StarRating value={rating} onChange={setRating} />
        </div>
      ) : (
        <p className="form-hint">
          Se guarda como pendiente. Cuando la escuches, vas a poder puntuarla y marcarla como
          favorita.
        </p>
      )}

      <label>
        {listened ? 'Reseña (opcional)' : 'Nota (opcional)'}
        <textarea
          value={review}
          onChange={(event) => setReview(event.target.value)}
          rows={3}
          maxLength={MAX_REVIEW_LENGTH}
          placeholder={listened ? '¿Qué te provoca esta canción?' : '¿Por qué la querés escuchar?'}
        />
        <span className="char-count">
          {review.length}/{MAX_REVIEW_LENGTH}
        </span>
      </label>

      {/* Solo se puede marcar como favorita si ya la escuchó */}
      {listened && (
        <label className="checkbox">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(event) => setFavorite(event.target.checked)}
          />
          Favorita
        </label>
      )}

      {error && (
        <p className="status-message error" role="alert">
          {error}
        </p>
      )}

      <div className="form-buttons">
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Guardando…' : submitLabel}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default DiaryForm
