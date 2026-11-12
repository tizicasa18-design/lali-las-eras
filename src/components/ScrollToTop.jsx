import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Cada vez que cambia la página (la dirección), vuelve arriba de todo.
// Sin esto, React Router cambia el contenido pero deja el scroll donde estaba,
// y la página nueva se abría por la mitad.
// No muestra nada en pantalla: por eso devuelve null.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
