// Muestra un mensaje de éxito o de error.
// type puede ser 'success' o 'error'.
function StatusMessage({ type, text }) {
  if (!text) {
    return null
  }

  return (
    <p className={`status-message ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {text}
    </p>
  )
}

export default StatusMessage
